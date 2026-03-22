import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useApp } from "@/context/AppContext";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist } = useApp();

  const wishlisted = products.filter((p) => wishlist.includes(p.id));

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-6 w-6 text-destructive" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <span className="text-muted-foreground text-sm">
            ({wishlisted.length} {wishlisted.length === 1 ? "item" : "items"})
          </span>
        </div>

        {wishlisted.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlisted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" aria-hidden="true" />
            <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mb-4">
              Save products you love by clicking the heart icon.
            </p>
            <Button asChild variant="outline">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
