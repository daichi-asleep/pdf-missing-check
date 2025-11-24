import express from "express";
import multer from "multer";
import fs from "fs";
import { exec } from "child_process";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/upload", upload.single("pdfcsv"), (req, res) => {
    const file = req.file;
    if (!file) return res.send("ファイルがありません");

    const csvData = fs.readFileSync(file.path, "utf-8").split("\n").slice(1);
    const titles_dict = {};
    csvData.forEach(f => {
        const m = f.match(/(.+?)\s*(\d+)巻/);
        if (m) {
            const series = m[1].trim();
            const vol = parseInt(m[2]);
            if (!titles_dict[series]) titles_dict[series] = [];
            titles_dict[series].push(vol);
        }
    });

    for (const s in titles_dict) {
        titles_dict[s] = Array.from(new Set(titles_dict[s])).sort((a,b)=>a-b);
    }

    fs.writeFileSync("titles_dict.json", JSON.stringify(titles_dict, null, 2), "utf-8");

    exec("node scrape_missing.js", (err, stdout, stderr) => {
        if (err) return res.send("スクリプト実行エラー:\n" + stderr);
        res.send("<pre>" + stdout + "</pre>");
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
