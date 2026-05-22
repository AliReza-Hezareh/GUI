# Testresultat - Brewscape

Datum: 2026-05-22  
Miljö: Windows, Chromium via Playwright  
Version/build: Live-sida `https://mt-brewscape.lovable.app` och klonat repo `mt-brewscape`  
Testkommando: `npx.cmd playwright test`  
Status: Godkänd Playwright-körning. Säkerhetsaudit har high-risk findings som måste dokumenteras.

## Detaljerade testresultat

| Test Case ID | Titel | Status | Faktiskt resultat | Expected vs Actual | Bug ID | Kommentar |
|---|---|---|---|---|---|---|
| TC-001 | Startsidan laddas utan crash | Pass | Startsidan laddades på desktop och mobil. Main-content och navigation/meny syntes. | Expected: sidan laddar och visar navigation. Actual: pass. | - | 2/2 pass. |
| TC-002 | Navigation till produkter och detaljsida | Pass | Produktsidan och första produkts detaljsida kunde öppnas. | Expected: användaren kan nå produkt och detaljsida. Actual: pass. | - | Mobiltest öppnar mobilmeny först. |
| TC-003 | Sök/filter ger återkoppling | Pass | Sökning på `kvarn` visade aktivt filter och gick att rensa. | Expected: sökning visar resultat eller tomt läge. Actual: pass. | - | 2/2 pass. |
| TC-004 | Kundvagn och kassa visar valideringsfel | Pass | Tom submit visade fel för namn, e-post och kortnummer. | Expected: tomma fält ger tydliga fel. Actual: pass. | - | 2/2 pass. |
| TC-005 | Mobilvy saknar horisontell overflow | Pass | 375px viewport hade ingen horisontell overflow och mobilmeny öppnades. | Expected: mobilvy fungerar utan sidscroll. Actual: pass. | - | 2/2 pass. |
| TC-006 | Tangentbord når viktiga länkar | Pass | Fokus syntes och nådde viktig navigation/länk inom 8 Tab-tryck. | Expected: fokus syns och når viktig navigation. Actual: pass. | - | 2/2 pass. |
| TC-007 | Specialtecken i sökfält kraschar inte appen | Pass | Sökning med script-tag, emoji och SQL-liknande text kraschade inte appen. | Expected: appen är stabil. Actual: pass. | - | 2/2 pass. |
| TC-008 | Synliga kontroller har tillgängliga namn | Pass | Inga synliga kontroller utan tillgängligt namn hittades i kassaflödet. | Expected: inputs/knappar har namn. Actual: pass. | - | 2/2 pass. |

## Sammanfattning

| Mätpunkt | Värde |
|---|---:|
| Totalt antal körda tester | 16 |
| Unika testfall | 8 |
| Browser-projekt | desktop-chromium, mobile-chromium |
| Pass | 16 |
| Fail | 0 |
| Blocked | 0 |
| Ej körda | 0 |
| Pass rate | 100% |
| Fail rate | 0% |

## Identifierade problem

- SEC-001: `npm.cmd audit --audit-level=low` hittade 16 vulnerabilities: 9 high och 7 moderate.
- OBS-001: Klonad källkod innehåller flera mojibake-strängar, men live-sidan som testades visade inte detta i Playwright-körningen.

## Körningsnotering

Första försök med `npx playwright test` stoppades av PowerShell execution policy. Rätt kommando på Windows är `npx.cmd playwright test`.
