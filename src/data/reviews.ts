export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  helpful: number;
}

export const reviews: Review[] = [
  // Pour-Over Karaff-set
  { id: "r-001", productId: "brew-001", author: "Marina K.", rating: 5, title: "Vacker och funktionell", body: "Glaset är vackert tillverkat och stålfiltret ger en anmärkningsvärt ren kopp. Jag har ersatt alla mina pappersfilter.", date: "2025-12-14", helpful: 23 },
  { id: "r-002", productId: "brew-001", author: "Tom H.", rating: 4, title: "Bra karaff, litet filterproblem", body: "Älskar karaffen i sig. Filtret kan vara lite långsamt om man maler för fint, men när jag justerade malningsgraden fungerar det perfekt.", date: "2025-11-28", helpful: 11 },
  { id: "r-003", productId: "brew-001", author: "Priya S.", rating: 5, title: "Min morgonritual", body: "Det här har helt förändrat hur jag gör kaffe. Bambukragen förblir sval och hela setet ser fantastiskt ut på min bänk.", date: "2025-10-05", helpful: 8 },

  // French Press Pro
  { id: "r-004", productId: "brew-002", author: "Daniel W.", rating: 5, title: "Håller kaffet varmt i timmar", body: "Den dubbelväggiga isoleringen är på riktigt. Kaffet håller sig kokvarmt mycket längre än min gamla French press i glas. Filtreringen är utmärkt.", date: "2025-12-01", helpful: 15 },
  { id: "r-005", productId: "brew-002", author: "Lydia M.", rating: 4, title: "Tung men värd det", body: "Den är tyngre än förväntat på grund av rostfritt stål-konstruktionen, men kvaliteten är obestridlig. Nästan noll sump i varje kopp.", date: "2025-11-15", helpful: 7 },

  // AeroPress Resekit
  { id: "r-006", productId: "brew-003", author: "Jakob R.", rating: 5, title: "Perfekt reskompanjon", body: "Tog med den på camping och det blev det bästa kaffet jag druckit utomhus. Reseväskan rymmer allt perfekt.", date: "2025-12-20", helpful: 31 },
  { id: "r-007", productId: "brew-003", author: "Sonia L.", rating: 5, title: "Kontorsrevolution", body: "Jag har den vid mitt skrivbord och brygger färska koppar under dagen. Rengöring tar 30 sekunder. Kollegorna är avundsjuka.", date: "2025-11-22", helpful: 19 },
  { id: "r-008", productId: "brew-003", author: "Chris B.", rating: 4, title: "Bra men önskar den var större", body: "Gör en fantastisk kopp men enportionskapaciteten innebär att jag brygger två gånger när min partner också vill ha.", date: "2025-10-18", helpful: 6 },

  // Konisk kvarn
  { id: "r-009", productId: "grind-001", author: "Anika P.", rating: 5, title: "Konsistens är kung", body: "Malningens jämnhet över alla inställningar är imponerande. Jag har testat den med pour-over, French press och espresso — utmärkta resultat varje gång.", date: "2025-12-08", helpful: 22 },
  { id: "r-010", productId: "grind-001", author: "Marcus J.", rating: 4, title: "Solid mellanklass-kvarn", body: "Gör allt jag behöver. Den lågvarviga motorn är märkbart tystare än min gamla bladkvarn. Lite statisk elektricitet på finare inställningar.", date: "2025-11-03", helpful: 9 },

  // Handkvarn Keramik
  { id: "r-011", productId: "grind-002", author: "Yuki T.", rating: 5, title: "Vacker och meditativ", body: "Att mala för hand har blivit en del av min morgonmeditation. Valnötsdetaljerna är underbara och de keramiska skären ger en fantastisk malning.", date: "2025-12-12", helpful: 14 },
  { id: "r-012", productId: "grind-002", author: "Rachel G.", rating: 3, title: "Armträning på köpet", body: "Malningskvaliteten är utmärkt men att mala 30 g ljusrostade bönor kräver verklig ansträngning. Bra för enstaka bruk, tröttsamt dagligen.", date: "2025-10-29", helpful: 18 },

  // Elektrisk Flatkvarn Elite
  { id: "r-013", productId: "grind-003", author: "Vincent C.", rating: 5, title: "Professionell kvalitet hemma", body: "De digitala profilerna är en game changer. Jag har en inställd för espresso, en för pour-over och byter direkt. Malningskvaliteten matchar caféutrustning.", date: "2025-12-18", helpful: 27 },

  // Svanhals vattenkokare
  { id: "r-014", productId: "acc-001", author: "Emma D.", rating: 5, title: "Precisionshällning i perfektion", body: "Temperaturkontrollen är pricksäker och pipen ger mig full kontroll över flödeshastigheten. Min pour-over-teknik har förbättrats dramatiskt.", date: "2025-12-22", helpful: 20 },
  { id: "r-015", productId: "acc-001", author: "Raj N.", rating: 5, title: "Värd varenda krona", body: "Jag vägde mellan denna och billigare alternativ. Så glad att jag valde premium — hållläget ensamt är värt det när jag blir distraherad på morgonen.", date: "2025-11-30", helpful: 16 },
  { id: "r-016", productId: "acc-001", author: "Lisa F.", rating: 4, title: "Nästan perfekt", body: "Vacker vattenkokare med bra temperaturnoggrannhet. Önskar bara att den hade lite större kapacitet när jag gör kaffe åt gäster.", date: "2025-10-14", helpful: 5 },

  // Precisionsvåg
  { id: "r-017", productId: "acc-002", author: "Omar S.", rating: 4, title: "Oumbärligt bryggverktyg", body: "Den inbyggda timern är otroligt praktisk. 0,1 g noggrannheten är perfekt för att finjustera recept. Batteritiden stämmer med angivet.", date: "2025-12-05", helpful: 12 },
  { id: "r-018", productId: "acc-002", author: "Helen W.", rating: 5, title: "Kompakt och noggrann", body: "Passar perfekt under min V60-dripper. Auto-tara-funktionen sparar så mycket tid. USB-C-laddning är en trevlig modern detalj.", date: "2025-11-18", helpful: 10 },

  // Dubbelväggiga provkoppar
  { id: "r-019", productId: "acc-003", author: "Ben A.", rating: 5, title: "Elegant och praktisk", body: "Dessa koppar är fantastiska. Den svävande dryckeffekten imponerar på alla gäster. De håller espresson varm mycket längre än vanliga koppar.", date: "2025-12-10", helpful: 13 },
  { id: "r-020", productId: "acc-003", author: "Carla M.", rating: 4, title: "Vackra men ömtåliga", body: "Vackra koppar som förhöjer dryckesupplevelsen. Var försiktig vid diskning — det dubbelväggiga glaset är känsligt.", date: "2025-11-07", helpful: 8 },

  // Etiopisk Yirgacheffe
  { id: "r-021", productId: "bean-001", author: "Nadia Z.", rating: 5, title: "Extraordinär komplexitet", body: "Blomnoterna är olikt allt jag smakat. Bryggd som pour-over är blåbärsavslutningen helt verklig och fantastisk.", date: "2025-12-19", helpful: 25 },
  { id: "r-022", productId: "bean-001", author: "James P.", rating: 5, title: "Kaffeuppenbarelse", body: "Om du tror att allt kaffe smakar likadant, prova detta. Jasmin-aromen ensam är värd priset. Bästa ljusrosten jag haft.", date: "2025-11-25", helpful: 21 },
  { id: "r-023", productId: "bean-001", author: "Mei L.", rating: 4, title: "Exceptionell men specifik", body: "Otroligt i pour-over men lyser inte lika mycket i French press. Känn till din bryggmetod innan du köper.", date: "2025-10-22", helpful: 14 },

  // Colombiansk Supremo
  { id: "r-024", productId: "bean-002", author: "Alex K.", rating: 5, title: "Vardaglig perfektion", body: "Detta är min vardagsböna. Choklad- och karamellnoter kommer fram i alla metoder. Bra valuta för specialkaffe.", date: "2025-12-15", helpful: 17 },
  { id: "r-025", productId: "bean-002", author: "Sarah T.", rating: 4, title: "Pålitlig och bra", body: "Inte det mest spännande kaffet men otroligt konsekvent och omtyckt. Alla på kontoret älskar det.", date: "2025-11-09", helpful: 9 },

  // Espresso Signaturblend
  { id: "r-026", productId: "bean-003", author: "Franco R.", rating: 5, title: "Crema i dagar", body: "Denna blandning producerar den vackraste creman jag sett från hemmaespresso. Mörk chokladnoter är rika utan att vara bittra.", date: "2025-12-11", helpful: 19 },
  { id: "r-027", productId: "bean-003", author: "Tina H.", rating: 4, title: "Perfekt i latte", body: "Den kraftiga smaken skär igenom mjölken perfekt. Mina flat whites har aldrig smakat bättre. Lite intensivt för svartkaffe.", date: "2025-11-20", helpful: 11 },
];

export function getProductReviews(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}
