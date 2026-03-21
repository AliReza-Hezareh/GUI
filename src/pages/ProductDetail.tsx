import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { products } from "@/data/products";
import { useApp } from "@/context/AppContext";
import { Star, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, releaseMode, announce } = useApp();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild variant="outline">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart(product);
    if (!releaseMode) {
      announce(`${product.name} added to cart`);
    }
  };

  const buttonText = releaseMode ? "Add to Basket" : "Add to Cart";

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 2);

  return (
    <Layout>
      <div className="container py-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 focus-ring rounded-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="rounded-lg border bg-secondary/30 product-image-placeholder text-7xl">
            <span aria-hidden="true">{product.icon}</span>
          </div>

          {/* Details */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 fill-accent text-accent" aria-hidden="true" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <p className="text-2xl font-bold mb-6 tabular-nums">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.longDescription}
            </p>

            {/* Features */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3">Key Features</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="lg"
                onClick={handleAdd}
                disabled={!product.inStock}
                aria-label={`${buttonText}, ${product.name}`}
              >
                {product.inStock ? buttonText : "Out of Stock"}
              </Button>
              {!product.inStock && (
                <p className="text-sm text-muted-foreground">
                  This item is currently unavailable.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold mb-6">
              You Might Also Like
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group flex gap-4 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md focus-ring"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-secondary text-2xl">
                    <span aria-hidden="true">{p.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ${p.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
