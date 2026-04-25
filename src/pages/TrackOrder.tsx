import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp, type Order } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Clock, Truck, CheckCircle, AlertCircle, MapPin } from "lucide-react";

const STAGES: { key: Order["status"]; label: string; icon: typeof Package; description: string }[] = [
  { key: "confirmed", label: "Bekräftad", icon: CheckCircle, description: "Vi har tagit emot din beställning" },
  { key: "processing", label: "Behandlas", icon: Clock, description: "Vi packar dina varor" },
  { key: "shipped", label: "Skickad", icon: Truck, description: "Paketet är på väg" },
  { key: "delivered", label: "Levererad", icon: Package, description: "Paketet har anlänt" },
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

  useEffect(() => {
    if (initialId && !order && submitted) {
      setError(`Vi hittade ingen beställning med ID #${submitted}.`);
    }
  }, [initialId, order, submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
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

  const currentStageIndex = order ? STAGES.findIndex((s) => s.key === order.status) : -1;

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-2">
          <Truck className="h-6 w-6" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Spåra beställning</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Ange ditt ordernummer för att se aktuell status och leveransinformation.
        </p>

        <form onSubmit={handleSubmit} noValidate className="rounded-lg border bg-card p-5 mb-6">
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
            Du hittar ditt ordernummer i orderbekräftelsen eller under{" "}
            <Link to="/orders" className="underline hover:text-foreground">orderhistorik</Link>.
          </p>
          {error && (
            <p id="track-error" role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
        </form>

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

            {/* Status timeline */}
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

            {/* Shipping address */}
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

            {/* Items */}
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
      </div>
    </Layout>
  );
}
