import { Link } from "react-router-dom";
import { Star, Heart, ArrowLeftRight, Eye } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";

const CATEGORY_COLORS: Record<string, string> = {
  "Bryggare": "bg-primary/10 text-primary",
  Kvarnar: "bg-accent/15 text-accent-foreground",
  "Tillbehör": "bg-secondary text-secondary-foreground",
  "Kaffebönor": "bg-primary/5 text-primary",
};

interface ProductCardProps {
  product: Product;
  highlightMatch?: (text: string) => React.ReactNode;
  onQuickView?: () => void;
}

export default function ProductCard({ product, highlightMatch, onQuickView }: ProductCardProps) {
  const { addToCart, releaseMode, announce, toggleWishlist, isWishlisted, toggleCompare, isCompared, compareList } = useApp();
  const wishlisted = isWishlisted(product.id);
  const compared = isCompared(product.id);

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart(product);
    if (!releaseMode) {
      announce(`${product.name} tillagd i kundvagnen`);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!releaseMode) {
      announce(wishlisted ? `${product.name} borttagen från önskelistan` : `${product.name} tillagd i önskelistan`);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!compared && compareList.length >= 3) {
      announce("Du kan jämföra upp till 3 produkter. Ta bort en först.");
      return;
    }
    toggleCompare(product.id);
    if (!releaseMode) {
      announce(compared ? `${product.name} borttagen från jämförelse` : `${product.name} tillagd i jämförelse`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.();
  };

  const buttonText = releaseMode ? "Lägg i korgen" : "Lägg i kundvagn";
  const productName = highlightMatch ? highlightMatch(product.name) : product.name;
  const productDesc = highlightMatch ? highlightMatch(product.description) : product.description;

  const cardContent = (
    <>
      <div
        className={`relative aspect-square overflow-hidden rounded-t-lg ${CATEGORY_COLORS[product.category] || "bg-muted"}`}
      >
        <img
          src={product.image}
          alt={product.imageAlt || ""}
          loading="lazy"
          width={512}
          height={512}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {releaseMode ? (
            <button
              onClick={handleWishlist}
              className={`h-8 w-8 inline-flex items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card ${
                wishlisted ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} aria-hidden="true" />
            </button>
          ) : (
            <button
              onClick={handleWishlist}
              className={`h-8 w-8 inline-flex items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card focus-ring ${
                wishlisted ? "text-destructive" : "text-muted-foreground"
              }`}
              aria-label={wishlisted ? `Ta bort ${product.name} från önskelistan` : `Lägg till ${product.name} i önskelistan`}
              aria-pressed={wishlisted}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} aria-hidden="true" />
            </button>
          )}
          <button
            onClick={handleCompare}
            className={`h-8 w-8 inline-flex items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card focus-ring ${
              compared ? "text-primary" : "text-muted-foreground"
            }`}
            aria-label={compared ? `Ta bort ${product.name} från jämförelse` : `Lägg till ${product.name} i jämförelse`}
            aria-pressed={compared}
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {onQuickView && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleQuickView}
              className="inline-flex items-center gap-1.5 rounded-full bg-card/95 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-card transition-colors focus-ring"
              aria-label={`Snabbvy ${product.name}`}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Snabbvy
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {product.category}
          </span>
        </div>

        <h3 className="mb-1 font-semibold leading-snug">
          <Link
            to={`/products/${product.id}`}
            className="hover:text-primary transition-colors focus-ring rounded-sm"
          >
            {productName}
          </Link>
        </h3>

        <p className="mb-3 flex-1 text-sm text-muted-foreground line-clamp-2">
          {productDesc}
        </p>

        <div className="mb-3 flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold tabular-nums">
            {product.price.toFixed(0)} kr
          </span>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            disabled={!product.inStock}
            aria-label={`${buttonText}, ${product.name}`}
          >
            {product.inStock ? buttonText : "Slut i lager"}
          </Button>
        </div>
      </div>
    </>
  );

  if (releaseMode) {
    return (
      <article className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
        <div className="release-card-wrapper">{cardContent}</div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      {cardContent}
    </article>
  );
}
