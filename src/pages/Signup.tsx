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
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // RELEASE DEFECT: confirmation mismatch check is skipped
    if (!releaseMode && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = signup(email, password, displayName);
    if (result.success) {
      announce("Account created successfully.");
      navigate("/account");
    } else {
      setError(result.error || "Signup failed.");
    }
  };

  return (
    <Layout>
      <div className="container py-12 max-w-md">
        <div className="rounded-lg border bg-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="h-6 w-6 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium mb-1">
                Display Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium mb-1">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium mb-1">
                Password <span className="text-destructive">*</span>
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-confirm" className="block text-sm font-medium mb-1">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline focus-ring rounded-sm">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
