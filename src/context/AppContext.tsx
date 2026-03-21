import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Preferences {
  displayName: string;
  emailNotifications: boolean;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: Preferences = {
  displayName: "",
  emailNotifications: true,
  itemsPerPage: 6,
};

interface AppContextType {
  releaseMode: boolean;
  setReleaseMode: (v: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
  resetAll: () => void;
  announcement: string;
  announce: (msg: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [releaseMode, setReleaseModeState] = useState(() => {
    return localStorage.getItem("brewscape-release") === "true";
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [preferences, setPreferencesState] = useState<Preferences>(() => {
    const stored = localStorage.getItem("brewscape-prefs");
    return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
  });
  const [announcement, setAnnouncement] = useState("");

  const announce = useCallback((msg: string) => {
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(msg));
  }, []);

  const setReleaseMode = useCallback((v: boolean) => {
    setReleaseModeState(v);
    localStorage.setItem("brewscape-release", String(v));
  }, []);

  const setPreferences = useCallback((p: Preferences) => {
    setPreferencesState(p);
    localStorage.setItem("brewscape-prefs", JSON.stringify(p));
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const resetAll = useCallback(() => {
    setReleaseModeState(false);
    localStorage.removeItem("brewscape-release");
    setCart([]);
    setPreferencesState(DEFAULT_PREFERENCES);
    localStorage.removeItem("brewscape-prefs");
  }, []);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "brewscape-release") {
        setReleaseModeState(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <AppContext.Provider
      value={{
        releaseMode,
        setReleaseMode,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        preferences,
        setPreferences,
        resetAll,
        announcement,
        announce,
      }}
    >
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </AppContext.Provider>
  );
}
