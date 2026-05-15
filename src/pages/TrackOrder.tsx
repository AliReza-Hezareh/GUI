import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp, type Order } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  HelpCircle,
  History,
} from "lucide-react";

const STAGES: { key: Order["status"]; label: string; icon: typeof Package; description: string }[] = [
  { key: "confirmed", label: "Bekräftad", icon: CheckCircle, description: "Vi har tagit emot din beställning" },
  { key: "processing", label: "Behandlas", icon: Clock, description: "Vi packar dina varor" },
  { key: "shipped", label: "Skickad", icon: Truck, description: "Paketet är på väg" },
  { key: "delivered", label: "Levererad", icon: Package, description: "Paketet har anlänt" },
];

const FAQ = [
  {
    q: "Var hittar jag mitt ordernummer?",
    a: "Ordernumret står i orderbekräftelsen som visas direkt efter köp och i din orderhistorik om du är inloggad. Det består av fyra siffror, t.ex. 1001.",
  },
  {
    q: "Hur lång tid tar leveransen?",
    a: "Standardleverans tar normalt 2–4 vardagar inom Sverige. Express tar 1–2 vardagar. När paketet skickas uppdateras statusen här automatiskt.",
  },
  {
    q: "Min status uppdateras inte – vad gör jag?",
    a: "Statusen uppdateras när lagret behandlar ordern och när transportören scannar paketet. Vänta gärna ett dygn innan du kontaktar oss om inget händer.",
  },
  {
    q: "Kan jag ändra leveransadressen efter beställning?",
    a: "Så länge ordern har status Bekräftad eller Behandlas kan vi i regel ändra adress. Kontakta kundservice så snart som möjligt.",
  },
  {
    q: "Vad gör jag om paketet är skadat eller saknas?",
    a: "Anmäl en reklamation via vår reklamationssida så hjälper vi dig vidare. Du kan även mejla support@brewscape.se.",
  },
];

export default function TrackOrder() {
  const { orders, announce } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get("id") ?? "";
  const [query, setQuery] = useState(initialId);
  const [submitted, setSubmitted] = useState(initialId);
  const [error, setError] = useState("");

  const order = useMemo(
    () => (submitted ? orders.find((o) => o.id === submitted.trim()) : undefined),
    [orders, submitted]
  );

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  useEffect(() => {
    if (initialId && !order && submitted) {
      setError(`Vi hittade ingen beställning med ID #${submitted}.`);
    }
  }, [initialId, order, submitted]);

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Ange ett ordernummer för att spåra.");
      announce("Ange ett ordernummer.");
      return;
    }
    setSubmitted(trimmed);
    setSearchParams({ id: trimmed });
    const found = orders.find((o) => o.id === trimmed);
    if (found) {
      setError("");
      announce(`Beställning ${trimmed} hittad. Status: ${found.status}.`);
    } else {
      setError(`Vi hittade ingen beställning med ID #${trimmed}.`);
      announce("Beställning hittades inte.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const currentStageIndex = order ? STAGES.findIndex((s) => s.key === order.status) : -1;

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-secondary/40 to-background">
        <div className="container py-12 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            <Truck className="h-3.5 w-3.5" aria-hidden="true" />
            Orderspårning
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Spåra din beställning</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Allt du behöver för att följa ditt paket från bekräftelse till dörren – på ett ställe.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 mx-auto max-w-xl rounded-lg border bg-card p-5 text-left shadow-sm"
          >
            <label htmlFor="track-order-id" className="block text-sm font-medium mb-2">
              Ordernummer
            </label>
            <div className="flex gap-2">
              <Input
                id="track-order-id"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (error) setError("");
                }}
                placeholder="t.ex. 1001"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "track-error" : "track-hint"}
                autoComplete="off"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Spåra
              </Button>
            </div>
            <p id="track-hint" className="mt-2 text-xs text-muted-foreground">
              Hittas i orderbekräftelsen eller under{" "}
              <Link to="/orders" className="underline hover:text-foreground">
                orderhistorik
              </Link>
              .
            </p>
            {error && (
              <p
                id="track-error"
                role="alert"
                className="mt-2 flex items-start gap-1.5 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
          </form>

          {recentOrders.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <History className="h-3.5 w-3.5" aria-hidden="true" />
                Senaste beställningar:
              </span>
              {recentOrders.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setQuery(o.id);
                    runSearch(o.id);
                  }}
                  className="rounded-full border bg-card px-3 py-1 font-mono text-xs hover:bg-secondary transition-colors"
                >
                  #{o.id}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container py-10 max-w-4xl space-y-10">
        {/* Order details */}
        {order && (
          <article aria-labelledby="track-order-heading" className="rounded-lg border bg-card p-6">
            <header className="flex flex-wrap items-start justify-between gap-3 mb-6 pb-4 border-b">
              <div>
                <p className="text-sm text-muted-foreground">Beställning</p>
                <h2 id="track-order-heading" className="text-xl font-bold font-mono">
                  #{order.id}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Lagd {order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Totalt</p>
                <p className="text-xl font-bold tabular-nums">{order.total.toFixed(0)} kr</p>
              </div>
            </header>

            <ol className="relative space-y-6 mb-6" aria-label="Leveransstatus">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isComplete = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <li key={stage.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          isComplete
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted bg-card text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      {idx < STAGES.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-1 min-h-6 ${isComplete ? "bg-primary" : "bg-border"}`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className={`font-medium ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                        {stage.label}
                        {isCurrent && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Aktuell
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="rounded-md bg-muted/50 p-4 mb-6">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Leveransadress</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingName}, {order.shippingCity}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Artiklar i beställningen</h3>
              <ul className="divide-y">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-secondary overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.imageAlt || ""}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Antal: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium tabular-nums">
                      {(item.product.price * item.quantity).toFixed(0)} kr
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        )}

        {submitted && !order && !error && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" aria-hidden="true" />
            <p className="text-muted-foreground">Söker efter beställning #{submitted}…</p>
          </div>
        )}

        {/* Status legend */}
        <section aria-labelledby="legend-heading">
          <h2 id="legend-heading" className="text-xl font-semibold mb-4">
            Så fungerar leveransstegen
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <li key={stage.key} className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">Steg {idx + 1}</span>
                  </div>
                  <p className="font-medium">{stage.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <h2 id="faq-heading" className="text-xl font-semibold">
              Vanliga frågor
            </h2>
          </div>
          <Accordion type="single" collapsible className="rounded-lg border bg-card divide-y">
            {FAQ.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="px-4 border-0">
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact / help */}
        <section aria-labelledby="help-heading" className="rounded-lg border bg-card p-6">
          <h2 id="help-heading" className="text-xl font-semibold mb-1">
            Behöver du fortfarande hjälp?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Vår kundservice svarar vardagar kl 9–17.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <a
              href="mailto:support@brewscape.se"
              className="flex items-center gap-3 rounded-md border p-3 hover:bg-secondary transition-colors"
            >
              <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">E-post</p>
                <p className="text-sm font-medium">support@brewscape.se</p>
              </div>
            </a>
            <a
              href="tel:+46101234567"
              className="flex items-center gap-3 rounded-md border p-3 hover:bg-secondary transition-colors"
            >
              <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Telefon</p>
                <p className="text-sm font-medium">010-123 45 67</p>
              </div>
            </a>
            <Link
              to="/reclamation"
              className="flex items-center gap-3 rounded-md border p-3 hover:bg-secondary transition-colors"
            >
              <AlertCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Problem med paket?</p>
                <p className="text-sm font-medium">Skapa reklamation</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
