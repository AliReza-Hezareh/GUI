import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function Account() {
  const { preferences, setPreferences, announce } = useApp();
  const { user, isLoggedIn, updateProfile } = useAuth();
  const [form, setForm] = useState(preferences);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPreferences(form);
    if (isLoggedIn && displayName.trim()) {
      updateProfile({ displayName: displayName.trim() });
    }
    setSaved(true);
    announce("Inställningar sparade.");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-xl">
        <h1 className="text-3xl font-bold mb-6">Kontoinställningar</h1>

        {!isLoggedIn && (
          <div className="rounded-lg border bg-card p-6 mb-6 text-center">
            <User className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" aria-hidden="true" />
            <p className="text-sm text-muted-foreground mb-3">
              Logga in för att spara dina inställningar till ditt konto.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Logga in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Skapa konto</Link>
              </Button>
            </div>
          </div>
        )}

        {isLoggedIn && user && (
          <div className="rounded-lg border bg-card p-4 mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
              {(user.displayName || user.email).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {isLoggedIn && (
            <div>
              <label htmlFor="pref-name" className="block text-sm font-medium mb-1">
                Visningsnamn
              </label>
              <input
                id="pref-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ange ditt namn"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="name"
              />
            </div>
          )}

          <div className="flex items-center justify-between rounded-md border bg-card p-4">
            <div>
              <p className="text-sm font-medium">E-postnotiser</p>
              <p className="text-xs text-muted-foreground">
                Ta emot uppdateringar om beställningar och nya produkter.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailNotifications}
                onChange={(e) => setForm((p) => ({ ...p, emailNotifications: e.target.checked }))}
                className="peer sr-only"
                role="switch"
                aria-label="E-postnotiser"
              />
              <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:duration-200 peer-checked:after:translate-x-5" />
            </label>
          </div>

          <div>
            <label htmlFor="pref-per-page" className="block text-sm font-medium mb-1">
              Produkter per sida
            </label>
            <select
              id="pref-per-page"
              value={form.itemsPerPage}
              onChange={(e) => setForm((p) => ({ ...p, itemsPerPage: Number(e.target.value) }))}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit">Spara inställningar</Button>
            {saved && (
              <span className="text-sm text-success font-medium" role="status">
                Sparat!
              </span>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
