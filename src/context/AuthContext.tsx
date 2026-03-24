import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface UserAccount {
  email: string;
  displayName: string;
  createdAt: string;
}

interface StoredAccount {
  email: string;
  password: string;
  displayName: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserAccount | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (email: string, password: string, displayName: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<Pick<UserAccount, "displayName">>) => void;
  resetAuth: () => void;
}

const ACCOUNTS_KEY = "brewscape-accounts";
const SESSION_KEY = "brewscape-session";

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function getAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

function saveSession(email: string) {
  localStorage.setItem(SESSION_KEY, email);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(() => {
    const sessionEmail = getSession();
    if (!sessionEmail) return null;
    const accounts = getAccounts();
    const account = accounts.find((a) => a.email === sessionEmail);
    if (!account) return null;
    return { email: account.email, displayName: account.displayName, createdAt: account.createdAt };
  });

  const isLoggedIn = user !== null;

  const login = useCallback((email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const accounts = getAccounts();
    const account = accounts.find((a) => a.email === trimmedEmail);
    if (!account) {
      return { success: false, error: "No account found with that email." };
    }
    if (account.password !== password) {
      return { success: false, error: "Incorrect password." };
    }
    saveSession(trimmedEmail);
    setUser({ email: account.email, displayName: account.displayName, createdAt: account.createdAt });
    return { success: true };
  }, []);

  const signup = useCallback((email: string, password: string, displayName: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const accounts = getAccounts();
    if (accounts.find((a) => a.email === trimmedEmail)) {
      return { success: false, error: "An account with that email already exists." };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }
    const newAccount: StoredAccount = {
      email: trimmedEmail,
      password,
      displayName: displayName.trim() || trimmedEmail,
      createdAt: new Date().toISOString(),
    };
    const updated = [...accounts, newAccount];
    saveAccounts(updated);
    saveSession(trimmedEmail);
    setUser({ email: newAccount.email, displayName: newAccount.displayName, createdAt: newAccount.createdAt });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<UserAccount, "displayName">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const accounts = getAccounts();
      const idx = accounts.findIndex((a) => a.email === prev.email);
      if (idx !== -1 && updates.displayName) {
        accounts[idx].displayName = updates.displayName;
        saveAccounts(accounts);
      }
      return { ...prev, ...updates };
    });
  }, []);

  const resetAuth = useCallback(() => {
    localStorage.removeItem(ACCOUNTS_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) {
        if (!e.newValue) {
          setUser(null);
        } else {
          const accounts = getAccounts();
          const account = accounts.find((a) => a.email === e.newValue);
          if (account) {
            setUser({ email: account.email, displayName: account.displayName, createdAt: account.createdAt });
          }
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout, updateProfile, resetAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
