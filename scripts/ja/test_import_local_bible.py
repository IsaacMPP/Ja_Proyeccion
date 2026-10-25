"""Pruebas con datos sintéticos: no contienen traducciones protegidas."""
import json
import tempfile
import unittest
from pathlib import Path
from importlib.util import spec_from_file_location, module_from_spec

FILE=Path(__file__).with_name("import_local_bible.py")
spec=spec_from_file_location("ja_local_bible",FILE)
mod=module_from_spec(spec)
spec.loader.exec_module(mod)

class LocalBibleTests(unittest.TestCase):
    def test_jose_chapter_arrays(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)
            (p/"genesis.js").write_text("export default [['Texto uno','Texto dos'],['Texto tres']]",encoding="utf8")
            data=mod.from_jose(p)
            self.assertEqual(data[0][0]["verses"][1],{"number":2,"text":"Texto dos"})
            self.assertEqual(len(data[0]),2)
    def test_snapshot_books(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/"test.json"
            p.write_text(json.dumps({"books":[{"usfm":"GEN","chapters":[{"number":1,"verses":[{"number":1,"text":"Ejemplo"}]}]}]}),encoding="utf8")
            data=mod.from_snapshot(p)
            self.assertEqual(data[0][0]["verses"][0]["text"],"Ejemplo")
    def test_reject_incomplete(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)
            (p/"genesis.js").write_text("export default [['Texto uno']]",encoding="utf8")
            with self.assertRaisesRegex(ValueError,"66 libros"):
                mod.convert("jose",p,"Prueba",p/"x.fsb")
            self.assertFalse((p/"x.fsb").exists())
if __name__=="__main__":
    unittest.main()
