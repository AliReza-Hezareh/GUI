import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Coffee, Heart, ArrowLeftRight, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { to: "/", label: "Hem" },
  { to: "/products", label: "Produkter" },
  { to: "/contact", label: "Kontakt" },
  { to: "/account", label: "Konto" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { cartCount, releaseMode, wishlist, compareList } = useApp();
  const { user, isLoggedIn, logout } = useAuth();
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
          links: [
            { label: "Hjälpcenter", to: "/contact" },
            { label: "Returer", to: "/reclamation" },
            { label: "Fraktinfo", to: "/contact" },
          ],
        },
        {
          title: "Butik",
          links: [
            { label: "Bryggare", to: "/products?category=Bryggare" },
            { label: "Kvarnar", to: "/products?category=Kvarnar" },
            { label: "Tillbehör", to: "/products?category=Tillbeh%C3%B6r" },
            { label: "Kaffebönor", to: "/products?category=Kaffeb%C3%B6nor" },
          ],
        },
        {
          title: "Företag",
          links: [
            { label: "Om oss", to: "/contact" },
            { label: "Blogg", to: "/contact" },
            { label: "Karriär", to: "/contact" },
          ],
        },
      ]
    : [
        {
          title: "Butik",
          links: [
            { label: "Bryggare", to: "/products?category=Bryggare" },
            { label: "Kvarnar", to: "/products?category=Kvarnar" },
            { label: "Tillbehör", to: "/products?category=Tillbeh%C3%B6r" },
            { label: "Kaffebönor", to: "/products?category=Kaffeb%C3%B6nor" },
          ],
        },
        {
          title: "Företag",
          links: [
            { label: "Om oss", to: "/contact" },
            { label: "Blogg", to: "/contact" },
            { label: "Karriär", to: "/contact" },
          ],
        },
        {
          title: "Support",
          links: [
            { label: "Hjälpcenter", to: "/contact" },
            { label: "Returer", to: "/reclamation" },
            { label: "Fraktinfo", to: "/contact" },
          ],
        },
      ];

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Hoppa till huvudinnehåll
      </a>

      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-primary focus-ring rounded-sm"
            aria-label="Brewscape hem"
          >
            <Coffee className="h-6 w-6" aria-hidden="true" />
            <span>Brewscape</span>
          </Link>

          <nav aria-label="Huvudnavigering" className="hidden md:block">
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
            {/* Auth status */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/account"
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors focus-ring"
                  aria-label={`Konto: ${user?.displayName || user?.email}`}
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="max-w-[120px] truncate">{user?.displayName || user?.email}</span>
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center rounded-md p-2 text-muted-foreground hover:bg-secondary transition-colors focus-ring"
                  aria-label="Logga ut"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors focus-ring"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Logga in
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative inline-flex items-center rounded-md p-2 text-foreground hover:bg-secondary transition-colors focus-ring"
              aria-label={`Önskelista, ${wishlist.length} ${wishlist.length === 1 ? "artikel" : "artiklar"}`}
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
                aria-label={`Jämför ${compareList.length} produkter`}
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
              aria-label={`Kundvagn, ${cartCount} ${cartCount === 1 ? "artikel" : "artiklar"}`}
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
              aria-label={mobileMenuOpen ? "Stäng meny" : "Öppna meny"}
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
            aria-label="Mobilnavigering"
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
                  Önskelista
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-ring text-muted-foreground"
                >
                  Orderhistorik
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li className="border-t mt-1 pt-2">
                    <span className="block px-3 py-1 text-xs text-muted-foreground">
                      Inloggad som {user?.displayName || user?.email}
                    </span>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="block w-full text-left rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-ring text-muted-foreground"
                    >
                      Logga ut
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="border-t mt-1 pt-2">
                    <Link
                      to="/login"
                      className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-ring text-muted-foreground"
                    >
                      Logga in
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-ring text-muted-foreground"
                    >
                      Skapa konto
                    </Link>
                  </li>
                </>
              )}
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
                Premiumkaffeutrustning för kräsna bryggare.
              </p>
            </div>
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-3 text-sm font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map(({ label, to }) => (
                    <li key={label}>
                      <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© 2026 Brewscape. Övningsapplikation — inte en riktig butik.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
