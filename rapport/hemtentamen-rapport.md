# Hemtentamen rapport - Brewscape GUI och användbarhetstest

QA ansvarig: Ali Reza Hezareh  
Datum: 2026-05-22  
Status: Playwright-tester godkända. Säkerhetsaudit har kvarstående fynd.

## 1. Användare och testdesign

Jag testar Brewscape som en ny användare som vill köpa kaffeutrustning online. Användaren vill snabbt förstå vad sidan säljer, hitta produkter, jämföra val och gå vidare till kundvagn/kassa utan att fastna.

### Användaruppgifter

1. Hitta en produkt via navigationen och öppna en relevant produktsida.
2. Använd sök/filter eller annan GUI-interaktion och kontrollera att sidan ger tydlig återkoppling.

### Vad jag testar manuellt

- Om sidan känns tydlig för en ny användare.
- Om svenska texter visas korrekt med ÅÄÖ.
- Om navigation och knappar är begripliga.
- Om mobilvyn fungerar utan trasig layout.
- Om fokus syns vid tangentbordsnavigation.
- Om dependencies har kända säkerhetsrisker.

### Vad jag testar med Playwright

- Startsidan laddas.
- Navigation till produkter och detaljsida fungerar.
- Sökning ger synlig återkoppling.
- Kundvagn och kassa visar valideringsfel.
- Mobilvy saknar horisontell overflow.
- Tangentbord når viktiga länkar.
- Specialtecken i sökfält kraschar inte appen.
- Synliga kontroller har tillgängliga namn.

## 2. Iakttagelser från gränssnittstestning

| ID | Severity | Observation | Påverkan på användaren | Expected | Actual |
|---|---|---|---|---|---|
| SEC-001 | High | `npm audit` visar 16 vulnerabilities, varav 9 high och 7 moderate. | Kända sårbarheter kan påverka säkerhet och stabilitet om de ligger i använd kod eller byggkedja. | Projektet ska inte ha high-risk dependencies. | Audit failar med high/moderate findings. |
| OBS-001 | Medium | Klonad källkod innehåller trasiga svenska tecken som `SÃ¶k` och `LÃ¤gg`. | Om detta visas i UI blir text svårare att läsa och ser oprofessionell ut. | ÅÄÖ ska vara korrekta i kod och UI. | Live-testet passerade, men källkoden innehåller mojibake. |
| OBS-002 | Low | Kassa visar många valideringsfel samtidigt vid tom submit. | En ny användare kan behöva läsa många fel på en gång. | Fel ska vara tydliga och kopplade till rätt fält. | Playwright verifierar att felen visas korrekt. |
| OBS-003 | Low | Mobilnavigation är separat från desktopnavigation. | Test kan bli skört om man inte testar mobilmenyn på rätt sätt. | Mobilmenyn ska öppnas och navigation ska fungera. | Playwright verifierar mobilmeny och ingen horisontell overflow. |

## 3. Praktisk testning med verktyg

Jag använder Playwright eftersom verktyget kan köra riktiga browserflöden, klicka på knappar, fylla i inputfält och kontrollera vad användaren faktiskt ser. Det passar bra för GUI-testning eftersom testet körs i Chromium och kan upprepas efter ändringar.

### Valda flöden

| Flöde | Testfall | Vad verifieras |
|---|---|---|
| Navigation | TC-001, TC-002 | Startsida, huvudnavigation, produktsida och detaljsida. |
| Sök/filter | TC-003, TC-007 | Sökfält, aktivt filter, rensning och specialtecken. |
| Kundvagn/kassa | TC-004, TC-008 | Lägg i kundvagn, kassa, valideringsfel och tillgängliga namn. |
| Mobil/a11y | TC-005, TC-006 | Mobilvy, meny, overflow och tangentbordsfokus. |

## 4. Exekvering och reflektion

Testningen kördes 2026-05-22 med `npx.cmd playwright test` mot live-sidan `https://mt-brewscape.lovable.app`.

Resultat:

| Mätpunkt | Värde |
|---|---:|
| Totalt körda tester | 16 |
| Unika testfall | 8 |
| Desktop Chromium | 8 pass, 0 fail |
| Mobile Chromium | 8 pass, 0 fail |
| Totalt | 16 pass, 0 fail |

Det som fungerade bra var navigation, produktsökning, kundvagn/kassa, mobilmeny och enkel accessibility-kontroll. Det som var svårt var att skriva tester som fungerar både desktop och mobil utan falska fel. Ett exempel på skörhet är selectors som bygger på synlig text. De är bra för användbarhetstest, men de kan faila om texten ändras.

Största kvarstående risken är dependency-audit. Playwright-flödena passerar, men `npm.cmd audit --audit-level=low` hittar fortfarande 16 sårbarheter: 9 high och 7 moderate.
