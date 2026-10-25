import type { Bible } from "../../types/Bible"

const codes = "GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split(" ")
const names = "Génesis|Éxodo|Levítico|Números|Deuteronomio|Josué|Jueces|Rut|1 Samuel|2 Samuel|1 Reyes|2 Reyes|1 Crónicas|2 Crónicas|Esdras|Nehemías|Ester|Job|Salmos|Proverbios|Eclesiastés|Cantar de los Cantares|Isaías|Jeremías|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Abdías|Jonás|Miqueas|Nahúm|Habacuc|Sofonías|Hageo|Zacarías|Malaquías|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|1 Corintios|2 Corintios|Gálatas|Efesios|Filipenses|Colosenses|1 Tesalonicenses|2 Tesalonicenses|1 Timoteo|2 Timoteo|Tito|Filemón|Hebreos|Santiago|1 Pedro|2 Pedro|1 Juan|2 Juan|3 Juan|Judas|Apocalipsis".split("|")
const slugs = "genesis exodo levitico numeros deuteronomio josue jueces rut 1_samuel 2_samuel 1_reyes 2_reyes 1_cronicas 2_cronicas esdras nehemias ester job salmos proverbios eclesiastes cantares isaias jeremias lamentaciones ezequiel daniel oseas joel amos abdias jonas miqueas nahum habacuc sofonias hageo zacarias malaquias mateo marcos lucas juan hechos romanos 1_corintios 2_corintios galatas efesios filipenses colosenses 1_tesalonicenses 2_tesalonicenses 1_timoteo 2_timoteo tito filemon hebreos santiago 1_pedro 2_pedro 1_juan 2_juan 3_juan judas apocalipsis".split(" ")
const key = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9]/g,"").toUpperCase()
const codeIndex = new Map<string,number>()
codes.forEach((code,i) => {codeIndex.set(key(code),i);codeIndex.set(key(names[i]),i);codeIndex.set(key(slugs[i]),i)})

function textValue(v: any): string {
    if (typeof v === "string") return v.trim()
    if (v && typeof v === "object") return textValue(v.text ?? v.value ?? v.content ?? "")
    return ""
}
function parseSnapshotItems(items: any[]) {
    const grouped=new Map<number,string[]>()
    for (const item of items) {
        if(item?.type!=="verse" || !Array.isArray(item.verse_numbers)) continue
        const text=Array.isArray(item.lines) ? item.lines.filter((line:any)=>typeof line==="string").join(" ").trim() : ""
        if (!text) continue
        for(const candidate of item.verse_numbers) {
            const number=Number(candidate)
            if(!Number.isInteger(number)||number<1) continue
            grouped.set(number,[...(grouped.get(number)||[]),text])
        }
    }
    return Array.from(grouped,([number,parts])=>({number,text:parts.join(" ")})).sort((a,b)=>a.number-b.number)
}
function parseVerses(raw: any) {
    if(Array.isArray(raw?.items)) return parseSnapshotItems(raw.items)
    const data=raw?.verses ?? raw?.versiculos ?? raw
    if (!data || typeof data !== "object") return []
    return Object.entries(data).map(([k,v],i) => ({number:Number((v as any)?.number ?? (v as any)?.verse ?? (Array.isArray(data)?i+1:k)),text:textValue(v)})).filter(v=>Number.isInteger(v.number)&&v.number>0&&v.text).sort((a,b)=>a.number-b.number)
}
function parseChapters(raw: any) {
    const data=raw?.chapters ?? raw?.capitulos ?? raw
    if (!data || typeof data !== "object") return []
    return Object.entries(data).map(([k,v],i)=>({number:Number((v as any)?.number ?? (v as any)?.chapter ?? (/^\\d+$/.test(String((v as any)?.human ?? "")) ? (v as any).human : undefined) ?? (Array.isArray(data)?i+1:k)),verses:parseVerses(v)})).filter(c=>Number.isInteger(c.number)&&c.number>0&&c.verses.length).sort((a,b)=>a.number-b.number)
}
function parseBookIndex(book: any, fallback: string): number | undefined {
    for (const candidate of [book?.usfm,book?.abbreviation,book?.abbr,book?.code,book?.name,book?.human,book?.book,book?.title,fallback]) {
        const idx=codeIndex.get(key(String(candidate ?? "")))
        if (idx!==undefined) return idx
    }
    const number=Number(book?.number ?? book?.book_number)
    if (Number.isInteger(number)&&number>=1&&number<=66) return number-1
    return undefined
}
function parseSnapshot(input: any): Map<number,any[]> {
    let data=Array.isArray(input)&&input.length===2&&input[1]?.books?input[1]:input
    data=data?.books ?? data?.data?.books ?? data?.bible?.books ?? data?.data ?? data
    const output=new Map<number,any[]>()
    if (!data || typeof data!=="object") return output
    for (const [k,book] of Object.entries(data)) {
        const index=parseBookIndex(book,k)
        const chapters=parseChapters(book)
        if (index!==undefined&&chapters.length) output.set(index,chapters)
    }
    return output
}
// Extract ONLY array and string literals from chapter-based JS modules; never eval or execute source.
function jsArrayLiteral(source: string): any {
    const marker=source.search(/export\s+default|module\.exports\s*=/)
    if(marker<0) throw Error("El archivo JS no exporta un arreglo reconocible.")
    let i=source.indexOf("[",marker)
    if(i<0) throw Error("Falta arreglo de capítulos.")
    const start=i
    let quote="",escaped=false,depth=0
    for(;i<source.length;i++){
        const ch=source[i]
        if(quote){if(escaped){escaped=false;continue}if(ch==="\\"){escaped=true;continue}if(ch===quote)quote="";continue}
        if(ch==="'"||ch==='"'||ch==="`"){if(ch==="`")throw Error("Plantilla JS no compatible.");quote=ch;continue}
        if(ch==="[")depth++
        if(ch==="]"&&--depth===0){i++;break}
        if(ch==="]"&&depth<0)throw Error("Formato inválido.")
    }
    if(depth!==0)throw Error("Arreglo JS incompleto.")
    const literal=source.slice(start,i)
    // Convert single-quoted JS strings to JSON strings without evaluating code.
    let converted="",q="",buffer="",escape=false
    const flush=()=>{converted+=JSON.stringify(buffer);buffer=""}
    for(const c of literal){
        if(q){
            if(escape){buffer+=c==="n"?"\n":c==="t"?"\t":c==="r"?"\r":c;escape=false;continue}
            if(c==="\\"){escape=true;continue}
            if(c===q){flush();q="";continue}
            buffer+=c;continue
        }
        if(c==="'"||c==='"'){q=c;continue}
        if(!/[\[\],\s]/.test(c))throw Error("El JS contiene instrucciones incompatibles: solamente se permiten arreglos de texto.")
        converted+=c
    }
    if(q)throw Error("Cadena JS incompleta.")
    return JSON.parse(converted.replace(/,\s*([\]])/g,"$1"))
}
function makeBible(name:string,books:Map<number,any[]>):Bible {
    if(books.size!==66)throw Error("Biblia incompleta: "+books.size+"/66 libros. Selecciona los 66 archivos JS o un JSON completo.")
    const result: Bible={name,metadata:{language:"spa",source:"Archivo local importado por el usuario",copyright:"Revisar los permisos de la traducción original"},books:[]}
    for(let i=0;i<66;i++){
        const chapters=books.get(i)
        if(!chapters?.length)throw Error("Falta "+names[i])
        result.books.push({number:i+1,name:names[i],abbreviation:codes[i],chapters})
    }
    const verses=result.books.reduce((total,b)=>total+b.chapters.reduce((n,c)=>n+c.verses.length,0),0)
    if(verses<29000)throw Error("La Biblia parece incompleta ("+verses+" versículos).")
    return result
}
export async function convertLocalBibleFiles(files:File[]):Promise<Bible> {
    if(!files.length)throw Error("Selecciona archivos de Biblia.")
    if(files.length===1&&files[0].name.toLowerCase().endsWith(".json")){
        const parsed=JSON.parse(await files[0].text())
        const books=parseSnapshot(parsed)
        const name=String(parsed?.local_title ?? parsed?.name ?? parsed?.translation?.name ?? files[0].name.replace(/\.json$/i,""))
        return makeBible(name,books)
    }
    const books=new Map<number,any[]>()
    for(const file of files){
        if(!file.name.toLowerCase().endsWith(".js"))continue
        const index=codeIndex.get(key(file.name.replace(/\.js$/i,"")))
        if(index===undefined)continue
        const chapters=parseChapters(jsArrayLiteral(await file.text()))
        if(chapters.length)books.set(index,chapters)
    }
    return makeBible("Biblia local importada ("+files.length+" archivos)",books)
}
