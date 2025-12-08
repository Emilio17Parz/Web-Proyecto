import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function getFile(structure) {
  return path.join(DATA_DIR, structure + ".json");
}

app.get("/api/:s", (req, res) => {
  const f=getFile(req.params.s);
  if (!fs.existsSync(f)) return res.json([]);
  res.json(JSON.parse(fs.readFileSync(f,"utf8")));
});

app.post("/api/:s", (req, res) => {
  fs.writeFileSync(getFile(req.params.s), JSON.stringify(req.body,null,2));
  res.json({ok:true});
});

app.listen(PORT,()=>console.log("Backend http://localhost:"+PORT));
