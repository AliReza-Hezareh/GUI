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

### Prioritering och risknivå

| Område | Metod | Risknivå | Motivering |
|---|---|---|---|
| Köpflöde (produkt -> kundvagn -> kassa) | Playwright + manuell kontroll | Hög | Direkt påverkan på om användaren kan slutföra ett köp. |
| Navigation och länkar | Playwright | Hög | Brutna flöden stoppar användarens väg till rätt sida. |
| Validering i formulär | Playwright + manuell kontroll | Hög | Fel validering kan ge fel data och blockerade beställningar. |
| Mobil layout och meny | Playwright + manuell kontroll | Medel | Vanligt användarscenario, risk för dålig användbarhet på små skärmar. |
| Textkvalitet och tydlighet (ÅÄÖ, labels, begriplighet) | Manuell kontroll | Medel | Påverkar förtroende och förståelse, svårare att bedöma helt automatiskt. |
| Tangentbordsfokus och a11y-basnivå | Playwright + manuell kontroll | Medel | Viktigt för tillgänglighet och lagkravsnära beteende. |
| Dependency-sårbarheter | Audit + manuell analys | Hög | Säkerhetsrisker kan påverka både drift och förtroende. |

## 2. Iakttagelser från gränssnittstestning

### OBS-001 (Medium) - Kontaktknapp med svag synlighet

**Observation:** Knappen `Kontakta oss` i hero-sektionen har så låg kontrast i normal-läge att texten i praktiken ser osynlig ut tills användaren hovrar med musen.  
**Påverkan:** Användaren kan missa att det är en klickbar CTA och tappar ett tydligt nästa steg, särskilt på mobil där hover inte finns.  
**Förbättring:** Höj kontrasten i default-läget och använd samma visuella tydlighet som primärknappen, inklusive tydlig textfärg och synlig knappkant.
**Bilaga:** Se `rapport/bilagor/bilaga-01-kontakta-oss-synlighet.gif`.

### OBS-002 (Low) - Många felmeddelanden samtidigt i kassan

**Observation:** Vid tom submit i kassan visas flera valideringsfel samtidigt utan tydlig prioritering av första fel att lösa.  
**Påverkan:** En ny användare kan känna att formuläret är rörigt och osäkert på vilket fält som ska rättas först.  
**Förbättring:** Sätt fokus på första felaktiga fältet och visa en tydlig sammanfattning högst upp som guidar användaren steg för steg.

### OBS-003 (Medium) - Otydlig ikonbaserad toppnavigation

**Observation:** Toppnavigeringen använder flera ikoner utan synlig textetikett, vilket gör funktionerna mindre självförklarande vid snabb skanning.  
**Påverkan:** Användaren kan behöva testa sig fram för att förstå ikonernas betydelse, vilket ökar friktionen i viktiga flöden som konto och kundvagn.  
**Förbättring:** Lägg till synliga etiketter eller tydligare tooltip/fokusnamn för ikonknappar, särskilt för konto, inloggning och kundvagn.

### OBS-004 (Medium) - Otydlig success feedback i kundvagnsflöde

**Observation:** Vid `Lägg i kundvagn` syns uppdatering i kundvagnsbadge, men återkopplingen är svag när användaren klickar flera gånger snabbt och det blir inte tydligt om varje klick registrerats som förväntat.  
**Påverkan:** Användaren kan bli osäker på om produkten lagts till korrekt och riskerar att klicka igen i onödan, vilket kan ge fler artiklar än tänkt i kundvagnen.  
**Förbättring:** Visa tydligare och konsekvent success feedback efter varje klick, till exempel en mer framträdande toast med produktnamn och aktuellt antal i kundvagnen samt kort spärr mot dubbelsnabba klick.
**Bilaga:** Se `rapport/bilagor/bilaga-04-kundvagn-feedback-fore-klick.png`, `rapport/bilagor/bilaga-05-kundvagn-feedback-efter-klick-1.png`, `rapport/bilagor/bilaga-06-kundvagn-feedback-efter-klick-2.png` och `rapport/bilagor/bilaga-07-kundvagn-feedback-spam-klick.png`.

## 3. Praktisk testning med verktyg

Jag använder Playwright eftersom verktyget kör riktiga browserflöden och verifierar det användaren faktiskt ser i GUI.
För de valda flödena passar det bra eftersom samma test kan köras upprepat efter varje ändring och snabbt fånga regressioner.
Det är också lämpligt här eftersom vi kör både desktop och mobil i samma testsvit och får jämförbara resultat mellan vyerna.

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
