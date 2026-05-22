# Buggrapport - Brewscape

## SEC-001 - Dependency audit visar high-risk vulnerabilities

Severity: High  
Priority: High  
Status: Open

### Steg för att återskapa

1. Öppna projektmappen.
2. Kör `npm.cmd install --package-lock=false` om dependencies saknas.
3. Kör `npm.cmd audit --audit-level=low`.

### Expected behavior

Projektet ska inte ha kända high-risk vulnerabilities i dependencies.

### Actual behavior

`npm.cmd audit --audit-level=low` rapporterade 16 vulnerabilities 2026-05-22:

- 9 high
- 7 moderate

Exempel från audit:

- `react-router-dom` / `@remix-run/router`: XSS via open redirects.
- `esbuild` / `vite`: dev-server kan exponera svar till andra webbplatser.
- `flatted`: DoS och prototype pollution.
- `glob`: command injection via CLI-flagga.
- `ajv`, `js-yaml`, `yaml`: ReDoS/prototype pollution/stack overflow-risker.
- `lodash`: prototype pollution och code injection-risker.
- `rollup`: arbitrary file write via path traversal.
- `picomatch`, `minimatch`, `brace-expansion`: ReDoS-risker.
- `postcss`: XSS-risk i CSS stringify output.

### Påverkan

Detta är en säkerhetsrisk i dependency-kedjan. Risknivån beror på om sårbara paket används i produktion eller bara dev/build, men high findings ska inte ignoreras.

### Logs/errors

Audit-kommandot returnerade exit code 1 och listade 16 vulnerabilities.

### Möjlig root cause

Dependencies är inte uppdaterade och `package.json` och `package-lock.json` är inte i sync.

---

## OBS-001 - Klonad källkod innehåller trasiga svenska tecken

Severity: Medium  
Priority: Medium  
Status: Observation

### Steg för att återskapa

1. Öppna källkod i det klonade repot.
2. Kontrollera filer som `Products.tsx`, `ProductCard.tsx`, `Layout.tsx` och `Checkout.tsx`.
3. Sök efter `Ã`, `Â` eller `â`.

### Expected behavior

Källkod och UI-text ska innehålla korrekta svenska tecken: ÅÄÖ.

### Actual behavior

Källkoden innehåller strängar som `SÃ¶k`, `LÃ¤gg`, `Ã–nskelista` och liknande.

### Påverkan

Om dessa strängar når UI:t blir texten svår att läsa och sidan ser trasig ut. I senaste Playwright-körningen mot live-sidan hittades inte detta i synlig body-text.

### Logs/errors

Statisk granskning med `rg`/filinspektion visar mojibake i flera React-filer.

### Möjlig root cause

Fel teckenkodning vid sparning eller import av svenska texter.

---

## OBS-002 - Kassa visar många valideringsfel samtidigt

Severity: Low  
Priority: Medium  
Status: Observation

### Steg för att återskapa

1. Lägg en produkt i kundvagnen.
2. Gå till kassan.
3. Klicka på `Lägg beställning (demo)` utan att fylla i fält.

### Expected behavior

Fel ska vara tydliga och kopplade till rätt fält.

### Actual behavior

Flera fel visas samtidigt. Playwright verifierade att felen finns och är synliga.

### Påverkan

En ovan användare kan behöva läsa många fel på en gång.

### Möjlig root cause

Formuläret validerar alla fält samtidigt.
