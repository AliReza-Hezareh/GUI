import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

const DEFECTS_CHECKLIST = [
  "E-postfältets etikett tappar htmlFor-koppling i kassan",
  "Kategorifilterknappar blir icke-tangentbordsåtkomliga divs",
  "Pris: Lägst först sorterar faktiskt högst-till-lägst",
  "Bekräftelserubrik efter kassan får inte fokus",
  "Telefonvalidering avvisar giltiga 10-siffriga nummer (kräver 11)",
  "Obligatoriska fältindikatorer (*) får mycket låg kontrast",
  "Framgångsmeddelande blir tvetydigt ('under granskning' istället för bekräftat)",
  "Kundvagnens lägg-till-meddelande skickas inte (skärmläsaren tyst)",
  "Önskelistehjärtknappen på produktkort tappar tillgängligt namn",
  "Stjärnbetygsinmatning för recensioner blir icke-tangentbordsåtkomlig",
  "Orderhistorikens statusetiketter är ombyttta (bekräftad ↔ behandlas)",
  "Jämförelsetabellens rubrikceller tappar scope-attribut",
  "Snabbvy-modalen flyttar inte fokus in i dialogen vid öppning",
  "Kassans kupongrabatt appliceras men totalen visar fortfarande pris utan rabatt",
  "Rensa-alla-filter-knapp i tomt tillstånd tappar sin synliga etikett",
  "Inloggningens lösenordsfält ändrar typ från 'password' till 'text'",
  "Registreringens lösenordsbekräftelsekontroll hoppas över",
];

export default function TeacherPanelPage() {
  const { releaseMode, setReleaseMode, resetAll } = useApp();
  const { resetAuth } = useAuth();
  const [showChecklist, setShowChecklist] = useState(false);

  return (
    <Layout>
      <div className="container py-8 max-w-xl">
        <h1 className="text-2xl font-bold mb-2">Lärarpanel</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Instruktörskontroller för hantering av övningsscenarier. Denna sida är inte synlig för studenter som standard.
        </p>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Aktuell version</p>
            <p className="text-lg font-bold">
              {releaseMode ? "🟡 Ny release" : "🟢 Stabil release"}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Simulera ny release</p>
              <p className="text-sm text-muted-foreground">
                Introducerar säkra UI-ändringar och riktiga defekter för testövningar.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                checked={releaseMode}
                onChange={(e) => setReleaseMode(e.target.checked)}
                className="peer sr-only"
                role="switch"
                aria-label="Simulera ny release"
              />
              <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:duration-200 peer-checked:after:translate-x-5" />
            </label>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              resetAll();
              resetAuth();
              window.location.reload();
            }}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Återställ allt
          </Button>

          <div className="rounded-lg border bg-card">
            <button
              onClick={() => setShowChecklist(!showChecklist)}
              className="w-full flex items-center justify-between p-4 text-left font-medium focus-ring rounded-lg"
              aria-expanded={showChecklist}
            >
              <span>Instruktörens defektlista ({DEFECTS_CHECKLIST.length} defekter)</span>
              {showChecklist ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            {showChecklist && (
              <div className="border-t px-4 pb-4">
                <p className="text-xs text-muted-foreground mt-3 mb-3">
                  Dessa defekter är aktiva när "Simulera ny release" är PÅ:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {DEFECTS_CHECKLIST.map((defect, i) => (
                    <li key={i} className="text-muted-foreground">{defect}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
