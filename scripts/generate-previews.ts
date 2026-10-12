import { mkdir, writeFile } from "node:fs/promises";
import { projects } from "../data/profile.ts";
const escape = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
await mkdir("public/previews", { recursive: true });
for (const project of projects) {
  for (let shot = 0; shot < 3; shot++) {
    const labels =
      shot === 0
        ? project.stack
        : shot === 1
          ? ["request", "orchestrate", "process", "respond"]
          : ["contracts", "application", "infrastructure", "delivery"];
    let graphic = "";
    if (project.visual === "voice" || project.visual === "inference") {
      for (let line = 0; line < 28; line++) {
        const points = Array.from({ length: 170 }, (_, i) => {
          const x = 45 + i * 3.3,
            y =
              140 +
              line * 7 -
              Math.sin(i * 0.09 + line * 0.18) *
                Math.exp(-(((i - 85) / 42) ** 2)) *
                (45 + shot * 16);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(" ");
        graphic += `<polyline points="${points}" fill="none" stroke="#d8d4b4" stroke-width=".6" opacity="${0.2 + line / 70}"/>`;
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const x = 65 + (i % 2) * 270,
          y = 140 + Math.floor(i / 2) * 140;
        graphic += `<rect x="${x}" y="${y}" width="215" height="88" fill="#111411" stroke="#474a3c"/><text x="${x + 14}" y="${y + 24}" fill="#689e80">0${i + 1} / ${escape(labels[i % labels.length])}</text>`;
        for (let j = 0; j < 4; j++)
          graphic += `<path d="M${x + 14} ${y + 38 + j * 10}h${70 + ((j * 43 + i * 13) % 112)}" stroke="#d8d4b4" opacity=".22"/>`;
      }
      graphic +=
        '<path d="M280 184h55m-27-5 8 5-8 5M172 228v52m-5-28 5 8 5-8M442 228v52m-5-28 5 8 5-8M335 324h-55" stroke="#689e80" fill="none"/>';
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="560" viewBox="0 0 920 560"><defs><pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0v26" fill="none" stroke="#d8d4b4" opacity=".045"/></pattern></defs><rect width="920" height="560" fill="#0c0c0c"/><rect x="16" y="16" width="888" height="528" fill="url(#grid)" stroke="#565644"/><g font-family="monospace" font-size="12" fill="#d8d4b4"><text x="36" y="43" fill="#a8a385">AT / ${escape(project.organization)} / ${["SYSTEM STUDY", "WORKFLOW STUDY", "ENGINEERING STUDY"][shot]}</text><text x="36" y="83" font-size="24">${escape(project.name)}</text><path d="M36 100h848M635 115v320M36 435h848" stroke="#565644" stroke-width=".7"/>${graphic}<text x="659" y="140" fill="#689e80">${shot === 0 ? "technology / context" : shot === 1 ? "flow / responsibilities" : "boundaries / delivery"}</text>${labels.map((label, i) => `<text x="659" y="${180 + i * 31}" font-size="11">${escape(label)}</text><path d="M659 ${188 + i * 31}h200" stroke="#565644" opacity=".5"/>`).join("")}<text x="659" y="398" fill="#a8a385">${project.kind === "public" ? "public repository" : "professional work"}</text><text x="36" y="465" fill="#689e80">aziztoba@dev ~</text><text x="36" y="486">❯ ${["inspect system", "trace workflow", "review boundaries"][shot]}</text><text x="36" y="524" font-size="10" fill="#a8a385">ORIGINAL TECHNICAL ILLUSTRATION · NO PRIVATE SOURCE, RECORDS OR BENCHMARK VALUES</text><text x="838" y="524" fill="#a8a385">${shot + 1}/3</text></g></svg>`;
    await writeFile(`public/previews/${project.id}-${shot}.svg`, svg);
  }
}
await writeFile(
  "public/favicon.svg",
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 44"><rect width="50" height="44" fill="#0c0c0c"/><path fill="#d8d4b4" d="M2 38 16 5h9l14 33H28l-3-8H14l-3 8ZM17 22h6l-3-9ZM27 5h22v8h-7v25h-8V13h-7Z"/></svg>',
);
await writeFile(
  "public/social.svg",
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0c0c0c"/><g font-family="monospace" fill="#d8d4b4"><text x="90" y="240" font-size="30" fill="#689e80">aziztoba@dev ~</text><text x="90" y="310" font-size="54">❯ Abdulaziz Toba</text><text x="90" y="375" font-size="28">AI Engineer / Systems. Agents. Inference.</text><text x="90" y="520" font-size="20">aziztoba.github.io</text></g></svg>',
);
console.log(`Generated ${projects.length * 3} original SVG previews.`);
