# Brewscape - App + QA (Hemtentamen GUI och användbarhetstest)

Det här repot innehåller hela appen och QA-delen: tester, rapporter, buggrapport, testresultat och bilagor.

## Snabbstart (PowerShell)

```powershell
cd "C:\Users\Ali Reza\Documents\studier\frans_schratau\GUI\GUI och användbarhetstest-Sharepoint\Hemtentamen\brewscape-qa\mt-brewscape"
npm install --package-lock=false
npx.cmd playwright install chromium
powershell -ExecutionPolicy Bypass -File qa\run-tests.ps1
```

Detta kör testsviten och uppdaterar QA-rapporten automatiskt.

## Testflöde

1. Kör alla tester med `qa\run-tests.ps1`.
2. Öppna visuell testrapport i `qa\index.html` (uppdateras efter varje testkörning).
3. Kontrollera detaljer i `qa\testresultat.md`.
4. Kontrollera buggar i `qa\buggrapport.md`.
5. Uppdatera skriftlig rapport i `rapport\hemtentamen-rapport.md` vid nya fynd.

## Fler testkommandon

Kör bara desktop:

```powershell
npx.cmd playwright test --project=desktop-chromium
```

Kör bara mobil:

```powershell
npx.cmd playwright test --project=mobile-chromium
```

Öppna Playwrights HTML-rapport:

```powershell
npx.cmd playwright show-report qa\playwright-html-report
```

Skapa/uppdatera QA-webbsidan manuellt:

```powershell
node qa\generate-report.mjs
```

## Var dokumentation och planering finns

- Huvudrapport: `rapport\hemtentamen-rapport.md`
- Bilageöversikt: `rapport\bilagor.md`
- Enkätunderlag: `rapport\bilaga-enkät.md`
- AI-redovisning: `rapport\ai-redovisning.md`
- Bilagor (bilder/GIF): `rapport\bilagor\`
- Frågeformulär (PDF): `GUI Förmulär.pdf`

## Vad som testas

- Startsida och navigation
- Produktsida, sök/filter och detaljvy
- Kundvagn och kassa
- Validering av obligatoriska fält
- Mobilvy (375px)
- Tangentbordsfokus och enkel tillgänglighetskontroll

## Testmiljö

- OS: Windows
- Browser: Chromium via Playwright
- Testad app: https://mt-brewscape.lovable.app
- Testverktyg: Playwright
