import Layout from "@/components/Layout";

export default function ReadmePage() {
  return (
    <Layout>
      <div className="container py-8 max-w-3xl prose prose-slate">
        <h1>Brewscape — Guide för övningsappen</h1>

        <p>
          Brewscape är en realistisk e-handelsapp för kaffeutrustning, byggd för att lära ut
          användbarhetstestning, tillgänglighetsrevision och Playwright-testautomatisering.
        </p>

        <h2>Huvudsakliga användarflöden</h2>
        <ol>
          <li><strong>Bläddra & Sök:</strong> Besök Produkter → använd sök, filtrera efter kategori, sortera efter pris/betyg → klicka in på produktdetaljer.</li>
          <li><strong>Lägg i kundvagn & Kassa:</strong> Lägg artiklar i kundvagnen → gå till Kassan → fyll i leveransinformation → lägg beställning → se bekräftelse.</li>
          <li><strong>Kontakt:</strong> Besök Kontakt-sidan → skicka förfrågan → se bekräftelsemeddelande.</li>
          <li><strong>Inställningar:</strong> Besök Konto → ändra visningsnamn, notisval, artiklar per sida → spara (lagras i localStorage).</li>
        </ol>

        <h2>Mål för användbarhetsrecension</h2>
        <ul>
          <li>Formulärvalidering och felmeddelanden (Kassa, Kontakt)</li>
          <li>Sök- och filterupptäckbarhet (Produktsida)</li>
          <li>Kundvagnshantering (antal-kontroller, ta bort artiklar)</li>
          <li>Tydlighet i bekräftelsemeddelanden</li>
          <li>Tomt-tillståndsmeddelanden</li>
          <li>Mobilnavigering och responsiv layout</li>
        </ul>

        <h2>Mål för tillgänglighetsrecension</h2>
        <ul>
          <li>Skip-länk och landmärkesstruktur</li>
          <li>Rubrikhierarki på alla sidor</li>
          <li>Formuläretikett-kopplingar och aria-describedby på fel</li>
          <li>Tangentbordsnavigering: navlänkar, filter, kundvagnskontroller, formulär</li>
          <li>Fokushantering efter kassabeställning</li>
          <li>Färgkontrast för interaktiva element och text</li>
          <li>Skärmläsar-meddelanden för kundvagnstillägg och formulärfel</li>
          <li>ARIA-attribut: aria-expanded, aria-pressed, aria-live, aria-invalid</li>
        </ul>

        <h2>Mål för Playwright-tester</h2>
        <ul>
          <li><strong>Navigering:</strong> Verifiera att alla routes renderar korrekta rubriker och innehåll.</li>
          <li><strong>Sök:</strong> Skriv en fråga → verifiera filtrerade resultat. Rensa → verifiera återställning.</li>
          <li><strong>Kategorifilter:</strong> Klicka en kategori → verifiera att bara matchande produkter visas.</li>
          <li><strong>Sortering:</strong> Välj "Pris: Lägst först" → verifiera att billigaste produkten visas först.</li>
          <li><strong>Lägg i kundvagn:</strong> Klicka lägg till → verifiera att kundvagnsräknaren uppdateras → verifiera aria-meddelande.</li>
          <li><strong>Kassaformulär:</strong> Skicka tomt → verifiera alla fel. Fyll i giltig data → skicka → verifiera bekräftelse.</li>
          <li><strong>Inställningar:</strong> Ändra en inställning → ladda om → verifiera att den sparats.</li>
          <li><strong>Ladda fler:</strong> Verifiera att paginering laddar ytterligare produkter.</li>
        </ul>

        <h2>Releaseläge</h2>
        <p>
          Aktivera "Simulera ny release" i <a href="/teacher">Lärarpanelen</a> för att
          aktivera en blandning av ofarliga UI-ändringar och riktiga regressioner. Detta låter studenter
          öva på att skriva motståndskraftiga tester som klarar omstruktureringar men fångar riktiga buggar.
        </p>

        <h2>Så här återställer du</h2>
        <p>
          Besök <a href="/teacher">Lärarpanelen</a> och klicka "Återställ allt" för att
          rensa kundvagn, inställningar och återgå till basläge. Detta säkerställer repeterbara
          testkörningar.
        </p>
      </div>
    </Layout>
  );
}
