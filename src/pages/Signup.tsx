import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function Signup() {
  const { signup, isLoggedIn } = useAuth();
  const { releaseMode, announce } = useApp();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoggedIn) {
    navigate("/account");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Ange din e-postadress.");
      return;
    }
    if (!password) {
      setError("Ange ett lösenord.");
      return;
    }
    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken.");
      return;
    }

    // RELEASE DEFECT: confirmation mismatch check is skipped
    if (!releaseMode && password !== confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    const result = signup(email, password, displayName);
    if (result.success) {
      announce("Kontot har skapats.");
      navigate("/account");
    } else {
      setError(result.error || "Registreringen misslyckades.");
    }
  };

  return (
    <Layout>
      <div className="container py-12 max-w-md">
        <div className="rounded-lg border bg-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="h-6 w-6 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold">Skapa konto</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium mb-1">
                Visningsnamn
              </label>
              <input
                id="signup-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ditt namn"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium mb-1">
                E-post <span className="text-destructive">*</span>
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="du@exempel.se"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium mb-1">
                Lösenord <span className="text-destructive">*</span>
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minst 6 tecken"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-confirm" className="block text-sm font-medium mb-1">
                Bekräfta lösenord <span className="text-destructive">*</span>
              </label>
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ange lösenord igen"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div
                className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Skapa konto
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Har du redan ett konto?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline focus-ring rounded-sm">
              Logga in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
