#!/usr/bin/env python3
"""Conversor local de biblias a FreeShow/JA Proyección .fsb.
No descarga contenidos ni los incorpora al instalador. Python 3.12, sin dependencias.
"""
import argparse
import ast
import json
import re
import unicodedata
from pathlib import Path

CODES = "GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split()
NAMES = "Génesis|Éxodo|Levítico|Números|Deuteronomio|Josué|Jueces|Rut|1 Samuel|2 Samuel|1 Reyes|2 Reyes|1 Crónicas|2 Crónicas|Esdras|Nehemías|Ester|Job|Salmos|Proverbios|Eclesiastés|Cantar de los Cantares|Isaías|Jeremías|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Abdías|Jonás|Miqueas|Nahúm|Habacuc|Sofonías|Hageo|Zacarías|Malaquías|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|1 Corintios|2 Corintios|Gálatas|Efesios|Filipenses|Colosenses|1 Tesalonicenses|2 Tesalonicenses|1 Timoteo|2 Timoteo|Tito|Filemón|Hebreos|Santiago|1 Pedro|2 Pedro|1 Juan|2 Juan|3 Juan|Judas|Apocalipsis".split("|")
SLUGS = "genesis exodo levitico numeros deuteronomio josue jueces rut 1_samuel 2_samuel 1_reyes 2_reyes 1_cronicas 2_cronicas esdras nehemias ester job salmos proverbios eclesiastes cantares isaias jeremias lamentaciones ezequiel daniel oseas joel amos abdias jonas miqueas nahum habacuc sofonias hageo zacarias malaquias mateo marcos lucas juan hechos romanos 1_corintios 2_corintios galatas efesios filipenses colosenses 1_tesalonicenses 2_tesalonicenses 1_timoteo 2_timoteo tito filemon hebreos santiago 1_pedro 2_pedro 1_juan 2_juan 3_juan judas apocalipsis".split()
def norm(s):
    s = unicodedata.normalize("NFKD",str(s)).casefold()
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if not unicodedata.combining(c)))
INDEX = {norm(s):i for i,s in enumerate(CODES)}
INDEX.update({norm(s):i for i,s in enumerate(NAMES)})
INDEX.update({norm(s):i for i,s in enumerate(SLUGS)})
INDEX.update({"jhn":43,"psa":18,"rev":65})
def book_index(obj, fallback=None):
    if isinstance(obj,dict):
        for k in ("usfm","abbreviation","abbr","id","code","name","book","title"):
            if k in obj and norm(obj[k]) in INDEX:
                return INDEX[norm(obj[k])]
        for k in ("number","order","book_number"):
            try:
                n=int(obj[k])
                if 1<=n<=66: return n-1
            except (ValueError,TypeError): pass
    return INDEX.get(norm(fallback)) if fallback is not None else None
def chapter_data(value):
    if isinstance(value,dict):
        value=value.get("verses",value.get("versiculos",value.get("versículos",value)))
    if isinstance(value,dict):
        items=sorted(value.items(),key=lambda x:int(x[0]) if str(x[0]).isdigit() else 9999)
        return [{"number":int(k),"text":str(v.get("text",v.get("value","")) if isinstance(v,dict) else v).strip()} for k,v in items if str(k).isdigit()]
    if isinstance(value,list):
        output=[]
        for i,v in enumerate(value,1):
            num=v.get("number",v.get("verse",v.get("id",i))) if isinstance(v,dict) else i
            val=v.get("text",v.get("value",v.get("content",""))) if isinstance(v,dict) else v
            if isinstance(val,dict): val=val.get("text","")
            try: num=int(num)
            except (ValueError,TypeError): continue
            if isinstance(val,str) and val.strip(): output.append({"number":num,"text":val.strip()})
        return output
    return []
def chapters(value):
    if isinstance(value,dict):
        value=value.get("chapters",value.get("capitulos",value.get("capítulos",value)))
    if isinstance(value,dict):
        seq=[(int(k),v) for k,v in value.items() if str(k).isdigit()]
    elif isinstance(value,list):
        seq=[(int(v.get("number",v.get("chapter",i))) if isinstance(v,dict) else i,v) for i,v in enumerate(value,1)]
    else: return []
    result=[]
    for n,v in sorted(seq):
        verses=chapter_data(v)
        if verses: result.append({"number":n,"verses":verses})
    return result
def from_jose(folder):
    files=folder/"procesados" if (folder/"procesados").is_dir() else folder
    output={}
    for i,slug in enumerate(SLUGS):
        path=files/(slug+".js")
        if not path.is_file(): continue
        raw=path.read_text(encoding="utf-8-sig").strip()
        raw=re.sub(r"^\s*(?:export\s+default|module\.exports\s*=)\s*", "",raw)
        raw=raw.rstrip("; \r\n")
        # Solo literales de matrices/cadenas: nunca ejecutar JavaScript descargado.
        try: data=ast.literal_eval(raw)
        except (ValueError,SyntaxError) as e: raise ValueError(f"No se pudo leer {path.name}: {e}") from e
        output[i]=chapters(data)
    return output
def from_snapshot(path):
    data=json.loads(path.read_text(encoding="utf-8-sig"))
    if isinstance(data,list) and len(data)==2 and isinstance(data[1],dict) and "books" in data[1]: data=data[1]
    root=data.get("books",data.get("data",data.get("bible",data))) if isinstance(data,dict) else data
    if isinstance(root,dict) and "books" in root: root=root["books"]
    if isinstance(root,dict): iterable=list(root.items())
    elif isinstance(root,list): iterable=list(enumerate(root))
    else: raise ValueError("Estructura JSON no reconocida: se esperan libros o books.")
    output={}
    for key,entry in iterable:
        index=book_index(entry,key)
        if index is None: continue
        parsed=chapters(entry)
        if parsed: output[index]=parsed
    return output
def convert(source,path,name,output,allow_partial=False):
    books=from_jose(path) if source=="jose" else from_snapshot(path)
    if not books: raise ValueError("No se encontraron libros y versículos reconocibles.")
    if len(books)!=66 and not allow_partial:
        missing=[NAMES[i] for i in range(66) if i not in books]
        raise ValueError(f"Se encontraron {len(books)}/66 libros. Faltantes: {', '.join(missing)}. No se genera una Biblia incompleta.")
    payload={"name":name,"metadata":{"language":"spa","source":"Importación local del usuario","copyright":"Verificar derechos del texto original antes de utilizarlo o compartirlo"},"books":[]}
    for i in range(66):
        if i not in books: continue
        cs=books[i]
        payload["books"].append({"number":i+1,"name":NAMES[i],"abbreviation":CODES[i],"chapters":cs})
    count=sum(len(c["verses"]) for b in payload["books"] for c in b["chapters"])
    if count<100 and not allow_partial: raise ValueError("El archivo contiene muy pocos versículos.")
    result=["ja-local-"+re.sub(r"[^a-z0-9-]","-",norm(name)),payload]
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(result,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    print(f"Archivo creado: {output} | {len(books)} libros, {count} versículos.")
def main():
    p=argparse.ArgumentParser(description="Convertir datos bíblicos propios a .fsb para JA Proyección")
    p.add_argument("--source",required=True,choices=["jose","snapshot"],help="jose=carpeta bible-json; snapshot=archivo JSON de bible-data-es-spa")
    p.add_argument("--input",required=True,type=Path,help="Carpeta descomprimida o archivo JSON")
    p.add_argument("--output",required=True,type=Path,help="Destino .fsb FUERA del repositorio")
    p.add_argument("--name",required=True,help="Nombre visible de la traducción")
    p.add_argument("--allow-partial",action="store_true",help="Solo para diagnóstico de archivos parciales")
    a=p.parse_args()
    try: convert(a.source,a.input,a.name,a.output,a.allow_partial)
    except (ValueError,OSError,UnicodeError,KeyError) as e: p.error(str(e))
if __name__=="__main__": main()
