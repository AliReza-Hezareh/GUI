# Brewscape - QA-inlämning (GUI och användbarhetstest)

## 1) Projektöversikt (30 sekunder)
Detta repo innehåller:
- testkod (Playwright)
- testresultat och buggrapport
- skriftlig rapport (max 3 sidor) + bilagor
- enkätbilaga och AI-redovisning

Målet är att visa hur Brewscape har testats enligt Del 1-4 i hemtentamen.

## 2) Snabb körning (copy-paste PowerShell)

```powershell
cd "C:\Users\Ali Reza\Documents\studier\frans_schratau\GUI\GUI och användbarhetstest-Sharepoint\Hemtentamen\brewscape-qa\mt-brewscape"
npm install --package-lock=false
npx.cmd playwright install chromium
powershell -ExecutionPolicy Bypass -File qa\run-tests.ps1
```

`qa\run-tests.ps1` gör tre saker:
1. Kör Playwright-tester.
2. Genererar visuell QA-sida (`qa\index.html`).
3. Öppnar `qa\index.html` automatiskt.

## 3) Så rättar du detta snabbt
1. Kör `qa\run-tests.ps1`.
2. Öppna och läs `qa\index.html`.
3. Kontrollera `rapport\hemtentamen-rapport.md` och bilagorna i `rapport\bilagor\`.

## 4) Var resultat syns efter körning
- Visuell sammanställning: `qa\index.html`
- Testresultat (detaljer): `qa\testresultat.md`
- Buggrapport: `qa\buggrapport.md`
- Playwright HTML-rapport: `qa\playwright-html-report\index.html`

## 5) Katalogkarta för lärare

| Plats | Innehåll | När den används |
|---|---|---|
| `rapport\hemtentamen-rapport.md` | Huvudrapport | Bedömning av analys/reflektion |
| `rapport\bilagor.md` | Översikt av bilagor | Kontroll av bevismaterial |
| `rapport\bilagor\` | PNG/GIF-bilagor | Visuell verifiering av observationer |
| `qa\testresultat.md` | Testutfall per testfall | Detaljerad testexekvering |
| `qa\buggrapport.md` | Identifierade fel/risker | Kvalitets- och riskbedömning |
| `qa\index.html` | Samlad QA-vy | Snabb överblick |
| `tests\brewscape.spec.ts` | Playwright testkod (TC-001..TC-012) | Kodgranskning av tester |
| `qa\Ankät\GUI Förmulär.pdf` | Enkätbilaga (forms) | Del 1-bilaga |
| `rapport\ai-redovisning.md` | Kort AI-redovisning | Inlämningskrav |

## 6) Testomfattning (TC-001 till TC-012)

Navigation och grundflöde:
- TC-001 startsida och huvudnavigation
- TC-002 navigation till produkter och detaljsida

Sök/filter och robusthet:
- TC-003 sök/filter och rensning
- TC-007 specialtecken i sökfält (stabilitet)

Kundvagn och checkout:
- TC-004 valideringsfel vid tom submit
- TC-009 badge-increment vid tre snabba klick
- TC-011 ogiltiga format i checkout blockeras
- TC-012 robust locatorstrategi (test-id med fallback)

Mobil och tillgänglighet:
- TC-005 mobilvy utan horisontell overflow
- TC-006 tangentbordsfokus till viktiga länkar
- TC-008 synliga kontroller har tillgängliga namn
- TC-010 keyboard-only tab-sekvens till topnav/CTA

## 7) Begränsningar och kvarstående risker
- Testerna validerar främst UI-lager mot live-sida, inte isolerad backend/API.
- Vissa tester använder textbaserade selectors och kan bli sköra vid copy-ändringar.
- Dependency audit visar säkerhetsrisker (`npm audit`: 9 high, 7 moderate) som är dokumenterade i buggrapporten.

## 8) Vanliga kommandon

Kör bara desktop:
```powershell
npx.cmd playwright test --project=desktop-chromium
```

Kör bara mobil:
```powershell
npx.cmd playwright test --project=mobile-chromium
```

Öppna Playwright HTML-rapport:
```powershell
npx.cmd playwright show-report qa\playwright-html-report
```

Regenerera QA-sidan manuellt:
```powershell
node qa\generate-report.mjs
```
