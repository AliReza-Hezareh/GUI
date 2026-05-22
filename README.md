# Brewscape QA - Hemtentamen GUI och användbarhetstest

Det här är min QA-inlämning för Brewscape. Jag testar webbappen som en ny användare som vill hitta kaffeutrustning, förstå sidan och kunna gå vidare till kundvagn/kassa.

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

Öppna Playwrights HTML-rapport:

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

## Uppdatera repo efter QA-ändring

Kör detta när bara QA/test-filer ska upp:

```powershell
cd "C:\Users\Ali Reza\Documents\studier\frans_schratau\GUI\GUI och användbarhetstest-Sharepoint\Hemtentamen\brewscape-qa\mt-brewscape"
git -c safe.directory="C:/Users/Ali Reza/Documents/studier/frans_schratau/GUI/GUI och användbarhetstest-Sharepoint/Hemtentamen/brewscape-qa/mt-brewscape" pull --rebase
git -c safe.directory="C:/Users/Ali Reza/Documents/studier/frans_schratau/GUI/GUI och användbarhetstest-Sharepoint/Hemtentamen/brewscape-qa/mt-brewscape" status --short
git -c safe.directory="C:/Users/Ali Reza/Documents/studier/frans_schratau/GUI/GUI och användbarhetstest-Sharepoint/Hemtentamen/brewscape-qa/mt-brewscape" add README.md tests qa rapport "GUI Förmulär.pdf" playwright.config.ts .gitignore
git -c safe.directory="C:/Users/Ali Reza/Documents/studier/frans_schratau/GUI/GUI och användbarhetstest-Sharepoint/Hemtentamen/brewscape-qa/mt-brewscape" commit -m "Uppdatera QA-dokumentation och testresultat"
git -c safe.directory="C:/Users/Ali Reza/Documents/studier/frans_schratau/GUI/GUI och användbarhetstest-Sharepoint/Hemtentamen/brewscape-qa/mt-brewscape" push
```

## AI-redovisning

AI användes för att skapa första version av teststruktur, rapportmallar och Playwright-tester. Jag granskar själv vad testerna gör, kör dem lokalt och använder resultatet i rapporten.


