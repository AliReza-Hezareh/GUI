import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export default function Account() {
  const { preferences, setPreferences, announce } = useApp();
  const [form, setForm] = useState(preferences);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPreferences(form);
    setSaved(true);
    announce("Preferences saved.");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-xl">
        <h1 className="text-3xl font-bold mb-6">Account Preferences</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="pref-name" className="block text-sm font-medium mb-1">
              Display Name
            </label>
            <input
              id="pref-name"
              type="text"
              value={form.displayName}
              onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
              placeholder="Enter your name"
              className="h-10 w-full rounded-md border bg-card px-3 text-sm focus-ring"
              autoComplete="name"
            />
          </div>

          <div className="flex items-center justify-between rounded-md border bg-card p-4">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive updates about orders and new products.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailNotifications}
                onChange={(e) => setForm((p) => ({ ...p, emailNotifications: e.target.checked }))}
                className="peer sr-only"
                role="switch"
                aria-label="Email notifications"
              />
              <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:duration-200 peer-checked:after:translate-x-5" />
            </label>
          </div>

          <div>
            <label htmlFor="pref-per-page" className="block text-sm font-medium mb-1">
              Products Per Page
            </label>
            <select
              id="pref-per-page"
              value={form.itemsPerPage}
              onChange={(e) => setForm((p) => ({ ...p, itemsPerPage: Number(e.target.value) }))}
              className="h-10 w-full rounded-md border bg-card px-3 text-sm focus-ring"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit">Save Preferences</Button>
            {saved && (
              <span className="text-sm text-success font-medium" role="status">
                Saved!
              </span>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
