import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const qaDir = path.join(root, "qa");
const files = [
  { title: "Testresultat", file: "qa/testresultat.md" },
  { title: "Buggrapport", file: "qa/buggrapport.md" },
  { title: "Rapport", file: "rapport/hemtentamen-rapport.md" },
  { title: "Enkätbilaga", file: "rapport/bilaga-enkät.md" },
  { title: "AI-redovisning", file: "rapport/ai-redovisning.md" },
  { title: "README", file: "README.md" },
];

function esc(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function markdownToHtml(md) {
  return esc(md)
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^\|(.+)\|$/gm, (row) => `<pre class="table">${row}</pre>`)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
}

const sections = files.map(({ title, file }) => {
  const absolute = path.join(root, file);
  const exists = fs.existsSync(absolute);
  const content = exists ? fs.readFileSync(absolute, "utf8") : "Saknas.";
  return `<section><div class="section-head"><h2>${esc(title)}</h2><a href="../${esc(file)}">Öppna Markdown</a></div><p>${markdownToHtml(content)}</p></section>`;
}).join("\n");

const html = `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Brewscape QA-rapport</title>
  <style>
    :root { --bg:#f7f1e8; --ink:#2a1b12; --card:#fffaf2; --accent:#7a3e16; --muted:#6f5a4b; --bad:#9f1d1d; --ok:#256c3b; }
    body { margin:0; font-family: Georgia, 'Times New Roman', serif; background:linear-gradient(135deg,#f7f1e8,#ead7bd); color:var(--ink); }
    header { padding:32px; border-bottom:4px solid var(--accent); background:var(--card); }
    h1 { margin:0 0 8px; font-size:clamp(28px,5vw,52px); }
    .commands { display:grid; gap:8px; margin-top:20px; }
    code, pre { background:#24160f; color:#ffe9c7; border-radius:8px; padding:8px 10px; overflow:auto; }
    main { width:min(1120px, calc(100% - 32px)); margin:24px auto 56px; display:grid; gap:18px; }
    section { background:rgba(255,250,242,.9); border:1px solid rgba(122,62,22,.25); border-radius:18px; padding:22px; box-shadow:0 12px 34px rgba(42,27,18,.08); }
    .section-head { display:flex; align-items:center; justify-content:space-between; gap:16px; border-bottom:1px solid rgba(122,62,22,.25); margin-bottom:12px; }
    .section-head h2 { margin:0 0 10px; }
    a { color:var(--accent); font-weight:700; }
    .table { white-space:pre-wrap; margin:3px 0; }
    .meta { color:var(--muted); }
  </style>
</head>
<body>
  <header>
    <h1>Brewscape QA-rapport</h1>
    <p class="meta">Genererad från Markdown-filer. Kör generate-report efter test för att uppdatera sidan.</p>
    <div class="commands">
      <code>cd "C:\\Users\\Ali Reza\\Documents\\studier\\frans_schratau\\GUI\\GUI och användbarhetstest-Sharepoint\\Hemtentamen\\brewscape-qa\\mt-brewscape"</code>
      <code>npm install</code>
      <code>npx.cmd playwright install chromium</code>
      <code>powershell -ExecutionPolicy Bypass -File qa\\run-tests.ps1</code>
      <code>npm.cmd audit --audit-level=low</code>
      <code>node qa\\generate-report.mjs; Start-Process qa\\index.html</code>
    </div>
  </header>
  <main>${sections}</main>
</body>
</html>`;

fs.writeFileSync(path.join(qaDir, "index.html"), html, "utf8");
console.log("QA-rapport skapad: qa/index.html");


