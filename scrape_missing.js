import fs from "fs";

const data = JSON.parse(fs.readFileSync("titles_dict.json", "utf-8"));

for (const series in data) {
    const vols = data[series];
    const maxVol = Math.max(...vols); // 仮に総巻数 = 最大巻数
    const missing = [];
    for (let i = 1; i <= maxVol; i++) {
        if (!vols.includes(i)) missing.push(i);
    }
    console.log(`${series}: 欠け巻 -> ${missing.join(", ")}`);
}

fs.writeFileSync("missing_vols.json", JSON.stringify(data, null, 2), "utf-8");
