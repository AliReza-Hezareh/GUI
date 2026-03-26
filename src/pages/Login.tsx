import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const { releaseMode, announce } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setError("Ange ditt lösenord.");
      return;
    }

    const result = login(email, password);
    if (result.success) {
      announce("Inloggad.");
      navigate("/account");
    } else {
      setError(result.error || "Inloggningen misslyckades.");
    }
  };

  return (
    <Layout>
      <div className="container py-12 max-w-md">
        <div className="rounded-lg border bg-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <LogIn className="h-6 w-6 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold">Logga in</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium mb-1">
                E-post
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="du@exempel.se"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor={releaseMode ? undefined : "login-password"}
                className="block text-sm font-medium mb-1"
              >
                Lösenord
              </label>
              <input
                id="login-password"
                type={releaseMode ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="current-password"
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
              Logga in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Har du inget konto?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline focus-ring rounded-sm">
              Skapa konto
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
