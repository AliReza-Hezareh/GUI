import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, releaseMode, announce } = useApp();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    // Focus the close button on open
    if (!releaseMode) {
      closeRef.current?.focus();
    }
    // RELEASE DEFECT: focus not moved into dialog in release mode

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, releaseMode]);

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart(product);
    announce(`${product.name} added to cart`);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[90vw] max-w-lg rounded-lg border bg-card p-0 shadow-lg backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-label={`Quick view: ${product.name}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold pr-4">{product.name}</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-secondary transition-colors focus-ring shrink-0"
            aria-label="Close quick view"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Product image area */}
        <div className="flex items-center justify-center rounded-lg bg-secondary/50 py-8 mb-4">
          <span className="text-6xl" aria-hidden="true">{product.icon}</span>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{product.category}</span>
            <span className="text-muted-foreground">·</span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.longDescription.slice(0, 200)}…
          </p>

          <ul className="flex flex-wrap gap-2" aria-label="Features">
            {product.features.map((f) => (
              <li key={f} className="text-xs rounded-full border px-2.5 py-1 text-muted-foreground">
                {f}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-2xl font-bold tabular-nums">${product.price.toFixed(2)}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/products/${product.id}`} onClick={onClose}>
                  Full Details
                </Link>
              </Button>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
