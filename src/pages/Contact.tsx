import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  const { announce } = useApp();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Namn krävs.";
    if (!form.email.trim()) errs.email = "E-postadress krävs.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Ange en giltig e-postadress.";
    if (!form.subject.trim()) errs.subject = "Ämne krävs.";
    if (!form.message.trim()) errs.message = "Meddelande krävs.";
    else if (form.message.trim().length < 10)
      errs.message = "Meddelandet måste vara minst 10 tecken.";
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
    setSent(true);
    announce("Meddelande skickat.");
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const renderField = (
    id: string,
    label: string,
    field: keyof typeof form,
    type = "text",
    isTextarea = false
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label} <span className="required-indicator" aria-hidden="true">*</span>
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          rows={5}
          value={form[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          className={`w-full rounded-md border px-3 py-2 text-sm focus-ring ${errors[field] ? "border-destructive" : "bg-card"}`}
          aria-required="true"
          aria-invalid={!!errors[field]}
          aria-describedby={errors[field] ? `${field}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={form[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          className={`h-10 w-full rounded-md border px-3 text-sm focus-ring ${errors[field] ? "border-destructive" : "bg-card"}`}
          aria-required="true"
          aria-invalid={!!errors[field]}
          aria-describedby={errors[field] ? `${field}-error` : undefined}
        />
      )}
      {errors[field] && (
        <p id={`${field}-error`} className="mt-1 text-sm text-destructive" role="alert">
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Kontakta oss</h1>
        <p className="text-muted-foreground mb-8">
          Har du en fråga om våra produkter eller din beställning? Vi vill gärna höra från dig.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {sent ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <h2 className="text-xl font-bold mb-2 text-success">Meddelande skickat!</h2>
                <p className="text-muted-foreground mb-4">
                  Tack för att du hör av dig. Vi återkommer inom 1–2 arbetsdagar.
                </p>
                <Button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                  Skicka nytt meddelande
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {renderField("contact-name", "Ditt namn", "name")}
                {renderField("contact-email", "E-postadress", "email", "email")}
                {renderField("contact-subject", "Ämne", "subject")}
                {renderField("contact-message", "Meddelande", "message", "text", true)}
                <Button type="submit" size="lg">
                  Skicka meddelande
                </Button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-semibold mb-4">Kontaktuppgifter</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">E-post</p>
                    <p className="text-muted-foreground">support@brewscape.se</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-muted-foreground">08-123 456 78</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Adress</p>
                    <p className="text-muted-foreground">
                      Kaffevägen 42<br />
                      111 22 Stockholm
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
