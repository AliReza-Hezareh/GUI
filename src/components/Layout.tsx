import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Coffee, Heart, ArrowLeftRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
  { to: "/account", label: "Account" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { cartCount, releaseMode, wishlist, compareList } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen && menuButtonRef.current) {
      // restore focus when menu closes
    }
  }, [mobileMenuOpen]);

  const footerSections = releaseMode
    ? [
        {
          title: "Support",
          links: ["Help Center", "Returns", "Shipping Info"],
        },
        {
          title: "Shop",
          links: ["Brewing Equipment", "Grinders", "Accessories", "Beans"],
        },
        {
          title: "Company",
          links: ["About", "Blog", "Careers"],
        },
      ]
    : [
        {
          title: "Shop",
          links: ["Brewing Equipment", "Grinders", "Accessories", "Beans"],
        },
        {
          title: "Company",
          links: ["About", "Blog", "Careers"],
        },
        {
          title: "Support",
          links: ["Help Center", "Returns", "Shipping Info"],
        },
      ];

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-primary focus-ring rounded-sm"
            aria-label="Brewscape home"
          >
            <Coffee className="h-6 w-6" aria-hidden="true" />
            <span>Brewscape</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-ring ${
                      location.pathname === link.to
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative inline-flex items-center rounded-md p-2 text-foreground hover:bg-secondary transition-colors focus-ring"
              aria-label={`Wishlist, ${wishlist.length} ${wishlist.length === 1 ? "item" : "items"}`}
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              {wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-destructive-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Compare */}
            {compareList.length > 0 && (
              <Link
                to="/compare"
                className="relative inline-flex items-center rounded-md p-2 text-foreground hover:bg-secondary transition-colors focus-ring"
                aria-label={`Compare ${compareList.length} products`}
              >
                <ArrowLeftRight className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {compareList.length}
                </span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/checkout"
              className="relative inline-flex items-center rounded-md p-2 text-foreground hover:bg-secondary transition-colors focus-ring"
              aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              ref={menuButtonRef}
              className="inline-flex items-center rounded-md p-2 text-foreground hover:bg-secondary transition-colors focus-ring md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            className="border-t md:hidden"
          >
            <ul className="container flex flex-col gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-ring ${
                      location.pathname === link.to
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/wishlist"
                  className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-ring text-muted-foreground"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-ring text-muted-foreground"
                >
                  Order History
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-card mt-16">
        <div className="container py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary mb-3">
                <Coffee className="h-5 w-5" aria-hidden="true" />
                Brewscape
              </Link>
              <p className="text-sm text-muted-foreground">
                Premium coffee equipment for discerning brewers.
              </p>
            </div>
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-3 text-sm font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© 2026 Brewscape. Training application — not a real store.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
