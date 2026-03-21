import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";

const CATEGORY_COLORS: Record<string, string> = {
  "Brewing Equipment": "bg-primary/10 text-primary",
  Grinders: "bg-accent/15 text-accent-foreground",
  Accessories: "bg-secondary text-secondary-foreground",
  "Coffee Beans": "bg-primary/5 text-primary",
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, releaseMode, announce } = useApp();

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart(product);
    if (!releaseMode) {
      announce(`${product.name} added to cart`);
    }
    // RELEASE DEFECT: status announcement is skipped in release mode
  };

  const buttonText = releaseMode ? "Add to Basket" : "Add to Cart";

  const cardContent = (
    <>
      <div
        className={`product-image-placeholder rounded-t-lg ${CATEGORY_COLORS[product.category] || "bg-muted"}`}
      >
        <span className="text-5xl" aria-hidden="true">{product.icon}</span>
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
            {product.name}
          </Link>
        </h3>

        <p className="mb-3 flex-1 text-sm text-muted-foreground line-clamp-2">
          {product.description}
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
            ${product.price.toFixed(2)}
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
            {product.inStock ? buttonText : "Out of Stock"}
          </Button>
        </div>
      </div>
    </>
  );

  // SAFE CHANGE: extra wrapper div in release mode
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
