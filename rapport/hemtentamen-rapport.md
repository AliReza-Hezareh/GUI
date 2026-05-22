# Hemtentamen rapport - Brewscape GUI och användbarhetstest

QA ansvarig: Ali Reza Hezareh  
Datum: 2026-05-22  
Status: Playwright-tester godkända. Kvarstående säkerhetsrisker i dependency-audit.

## 1. Användare och testdesign

Målgrupp i testet: ny användare som vill hitta rätt kaffeprodukt och genomföra köp utan att fastna.

Användaruppgifter:
1. Navigera till produkter och öppna en relevant detaljsida.
2. Söka/filtrera samt genomföra användarinteraktion med tydlig återkoppling.

Manuell testning:
- tydlighet i texter, CTA och navigation
- mobil layout och visuell läsbarhet
- fokusindikator vid tangentbordsnavigering

Playwright-testning:
- startsida, navigation, sök/filter
- kundvagn/kassa och validering
- mobilvy, overflow och grundläggande a11y-kontroller

Riskprioritering:

| Område | Metod | Risk |
|---|---|---|
| Köpflöde (produkt -> kundvagn -> kassa) | Playwright + manuellt | Hög |
| Navigation/länkar | Playwright | Hög |
| Formulärvalidering | Playwright + manuellt | Hög |
| Mobil layout/meny | Playwright + manuellt | Medel |
| Fokus/a11y-basnivå | Playwright + manuellt | Medel |

## 2. Iakttagelser från gränssnittstestning

### OBS-001 (Medium) - Kontaktknapp med svag synlighet
**Observation:** `Kontakta oss` i hero har låg kontrast i default-läge och texten blir tydligare först vid hover.  
**Påverkan:** CTA kan missas, särskilt på mobil där hover saknas.  
**Förbättring:** Höj kontrast i default-läge och använd tydligare text/fokusram.  
**Bilaga:** `bilaga-01` till `bilaga-03`.

### OBS-002 (Low) - Många felmeddelanden samtidigt i kassan
**Observation:** Tom submit i kassan visar flera fel på en gång utan tydlig prioritering.  
**Påverkan:** Användaren blir osäker på var den ska börja rätta.  
**Förbättring:** Fokusera första felaktiga fältet och visa kort sammanfattning överst.

### OBS-003 (Medium) - Svag fokusindikator i toppnav och CTA
**Observation:** Fokus syns på flera element men är svag/osynlig på `Kontakta oss` mot mörkgrön bakgrund.  
**Påverkan:** Tangentbordsanvändare kan tappa orientering och missa viktiga steg.  
**Förbättring:** Använd konsekvent, högkontrast fokusstil för toppnav, ikoner och CTA.  
**Bilaga:** `bilaga-08` till `bilaga-13`.

### OBS-004 (Medium) - Otydlig success feedback i kundvagnsflöde
**Observation:** Badge uppdateras vid `Lägg i kundvagn`, men vid snabba upprepade klick blir återkopplingen svag.  
**Påverkan:** Användaren kan öka antal i kundvagnen oavsiktligt.  
**Förbättring:** Tydligare toast med produkt + antal och kort spärr mot dubbelsnabba klick.  
**Bilaga:** `bilaga-04` till `bilaga-07`.

## 3. Praktisk testning med verktyg

Playwright valdes för att köra reproducerbara GUI-flöden i riktig browser och snabbt fånga regressioner.  
Testsviten körs på både desktop och mobil, vilket gör det möjligt att jämföra beteende mellan vyer med samma testfall.

Valda flöden:
- Navigation (TC-001, TC-002)
- Sök/filter (TC-003, TC-007)
- Kundvagn/kassa (TC-004, TC-008)
- Mobil/a11y (TC-005, TC-006)

Begränsning/risk i testupplägget:
Flera tester använder textbaserade selectors och roll-namn. Det gör testerna tydliga ur användarperspektiv, men de kan bli sköra vid copy-ändringar även när funktionaliteten är oförändrad.

Konkret förbättring nästa iteration:
Inför stabila `data-testid` på kritiska element (till exempel CTA-knappar, kundvagnsikon och checkout-submit) och använd dem i nyckeltester för mer stabil regressionstestning.

## 4. Exekvering och reflektion

Körning: `npx.cmd playwright test` mot `https://mt-brewscape.lovable.app`.

Resultat:

| Mätpunkt | Värde |
|---|---:|
| Totalt körda tester | 16 |
| Unika testfall | 8 |
| Pass | 16 |
| Fail | 0 |

Slutsats: funktionella huvudflöden passerar i nuvarande testomfång.  
Kvarstående risker: dependency-säkerhet (`npm audit`: 16 sårbarheter, varav 9 high och 7 moderate) samt UI-tydlighet/fokus i kritiska interaktioner.

Testkörningen fungerade smidigt för regression eftersom samma Playwright-svit kunde köras snabbt i både desktop- och mobilvy. Det som tog mest tid var att verifiera visuella UI-problem (kontrast, fokus och återkoppling), eftersom de kräver manuell granskning och bilagor utöver automatiska testresultat.
Ett konkret exempel på skörhet är tester som klickar på knappen via texten `Lägg i kundvagn`: om texten ändras till `Lägg i varukorg` kan testet falla även om funktionen fortfarande fungerar.
