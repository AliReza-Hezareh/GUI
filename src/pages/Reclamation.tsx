import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, CheckCircle, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

const REASONS = [
  "Skadad produkt",
  "Fel artikel mottagen",
  "Artikeln stämmer inte med beskrivningen",
  "Saknade delar/tillbehör",
  "Defekt produkt",
  "Annat",
];

export default function Reclamation() {
  const { orders, announce } = useApp();
  const { isLoggedIn } = useAuth();

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: { file: File; preview: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
        setErrors((prev) => ({ ...prev, images: "Endast .jpg-filer accepteras." }));
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, images: "Varje fil måste vara under 5 MB." }));
        continue;
      }
      newImages.push({ file, preview: URL.createObjectURL(file) });
    }

    if (newImages.length > 0) {
      setImages((prev) => {
        const combined = [...prev, ...newImages].slice(0, 3);
        return combined;
      });
      setErrors((prev) => {
        const next = { ...prev };
        delete next.images;
        return next;
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedOrderId) errs.order = "Välj en order.";
    if (!reason) errs.reason = "Välj en anledning.";
    if (!description.trim()) errs.description = "Beskriv problemet.";
    else if (description.trim().length < 20)
      errs.description = "Beskrivningen måste vara minst 20 tecken.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      announce("Formuläret har fel. Vänligen granska.");
      return;
    }

    const reclamation = {
      id: `REC-${Date.now()}`,
      orderId: selectedOrderId,
      reason,
      description: description.trim(),
      imageCount: images.length,
      date: new Date().toISOString(),
      status: "pending",
    };
    const existing = JSON.parse(localStorage.getItem("brewscape-reclamations") || "[]");
    existing.unshift(reclamation);
    localStorage.setItem("brewscape-reclamations", JSON.stringify(existing));

    setSubmitted(true);
    announce("Retur-/återbetalningsbegäran skickad.");
  };

  const clearField = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container py-16 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Retur / Återbetalning</h1>
          <p className="text-muted-foreground mb-6">
            Logga in för att skicka en retur- eller återbetalningsbegäran.
          </p>
          <Button asChild>
            <Link to="/login">Logga in</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="container py-16 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Begäran skickad</h1>
          <p className="text-muted-foreground mb-6">
            Din retur-/återbetalningsbegäran har mottagits. Vi granskar den och återkommer inom 2–3 arbetsdagar.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setSelectedOrderId("");
                setReason("");
                setDescription("");
                setImages([]);
              }}
            >
              Skicka en till
            </Button>
            <Button asChild>
              <Link to="/orders">Visa ordrar</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Retur / Återbetalning</h1>
        <p className="text-muted-foreground mb-6">
          Fyll i formuläret nedan för att begära en retur eller återbetalning. Bifoga foton av problemet för att snabba på hanteringen.
        </p>

        {orders.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Du har inga ordrar ännu. Gör en beställning först för att kunna skicka en returbegäran.
            </p>
            <Button asChild>
              <Link to="/products">Utforska produkter</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <Label htmlFor="order-select" className="mb-1.5 block">
                Välj order <span className="text-destructive" aria-hidden="true">*</span>
              </Label>
              <select
                id="order-select"
                value={selectedOrderId}
                onChange={(e) => {
                  setSelectedOrderId(e.target.value);
                  clearField("order");
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-required="true"
                aria-invalid={!!errors.order}
                aria-describedby={errors.order ? "order-error" : undefined}
              >
                <option value="">-- Välj en order --</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    Order #{order.id} — {order.date} — {order.total.toFixed(0)} kr
                  </option>
                ))}
              </select>
              {errors.order && (
                <p id="order-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.order}
                </p>
              )}
              {selectedOrder && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Artiklar: {selectedOrder.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="reason-select" className="mb-1.5 block">
                Anledning <span className="text-destructive" aria-hidden="true">*</span>
              </Label>
              <select
                id="reason-select"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  clearField("reason");
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-required="true"
                aria-invalid={!!errors.reason}
                aria-describedby={errors.reason ? "reason-error" : undefined}
              >
                <option value="">-- Välj en anledning --</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <p id="reason-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.reason}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="reclamation-desc" className="mb-1.5 block">
                Beskrivning <span className="text-destructive" aria-hidden="true">*</span>
              </Label>
              <textarea
                id="reclamation-desc"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  clearField("description");
                }}
                placeholder="Beskriv problemet i detalj…"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-required="true"
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "desc-error" : undefined}
              />
              {errors.description && (
                <p id="desc-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1.5 block">
                Bifoga foton <span className="text-xs text-muted-foreground">(valfritt, .jpg, max 3)</span>
              </Label>
              <div
                className="rounded-lg border-2 border-dashed border-input bg-muted/30 p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                aria-label="Ladda upp foto"
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Klicka för att ladda upp eller dra & släpp
                </p>
                <p className="text-xs text-muted-foreground mt-1">Endast .jpg-filer, max 5 MB styck</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg"
                multiple
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
              />
              {errors.images && (
                <p className="mt-1 text-sm text-destructive" role="alert">
                  {errors.images}
                </p>
              )}
              {images.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Uppladdning ${i + 1}`}
                        className="h-20 w-20 rounded-md object-cover border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Ta bort bild ${i + 1}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full">
              Skicka begäran
            </Button>
          </form>
        )}
      </div>
    </Layout>
  );
}
