# Brewscape - App + QA (Hemtentamen GUI och användbarhetstest)

Det här repot innehåller hela appen samt QA-del: tester, testrapporter, buggrapport och bilagor.

## Viktiga kommandon

```powershell
cd "C:\Users\Ali Reza\Documents\studier\frans_schratau\GUI\GUI och användbarhetstest-Sharepoint\Hemtentamen\brewscape-qa\mt-brewscape"
npm install --package-lock=false
npx.cmd playwright install chromium
powershell -ExecutionPolicy Bypass -File qa\run-tests.ps1
```

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

## Vad som testas

- Startsida och navigation
- Produktsida och produktsökning
- Produktdetalj
- Kundvagn och kassa
- Tomma obligatoriska fält
- Mobilvy 375px
- Tangentbordsfokus
- Enkel accessibility-kontroll
- Svenska tecken, så ÅÄÖ inte visas som trasiga tecken

## Frågeformulär

Frågeformuläret finns som PDF i projektmappen och heter `GUI Förmulär.pdf`.

## Testmiljö

- OS: Windows
- Browser: Chromium via Playwright
- Testad app: https://mt-brewscape.lovable.app
- Testverktyg: Playwright
- Senaste testkörning: 2026-05-22, 16/16 Playwright-tester passade

## AI-redovisning

AI användes för första version av teststruktur, rapportmallar och Playwright-tester. Jag granskar själv vad testerna gör, kör dem lokalt och använder resultatet i rapporten.
