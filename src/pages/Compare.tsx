import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X, ArrowRight, Star } from "lucide-react";

export default function Compare() {
  const { compareList, toggleCompare, clearCompare, releaseMode, addToCart, announce } = useApp();

  const compared = compareList
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const handleAdd = (product: typeof products[0]) => {
    if (!product.inStock) return;
    addToCart(product);
    if (!releaseMode) {
      announce(`${product.name} added to cart`);
    }
  };

  const attributes = [
    { label: "Price", render: (p: typeof products[0]) => `$${p.price.toFixed(2)}` },
    { label: "Category", render: (p: typeof products[0]) => p.category },
    { label: "Rating", render: (p: typeof products[0]) => `${p.rating} / 5` },
    { label: "Reviews", render: (p: typeof products[0]) => `${p.reviewCount}` },
    { label: "In Stock", render: (p: typeof products[0]) => p.inStock ? "Yes" : "No" },
    ...Array.from({ length: 4 }, (_, i) => ({
      label: `Feature ${i + 1}`,
      render: (p: typeof products[0]) => p.features[i] || "—",
    })),
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Compare Products</h1>
          {compared.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCompare}>
              Clear All
            </Button>
          )}
        </div>

        {compared.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" aria-label="Product comparison">
              <thead>
                <tr>
                  {/* RELEASE DEFECT: th scope removed in release mode */}
                  <th
                    className="text-left text-sm font-medium text-muted-foreground p-3 border-b min-w-[120px]"
                    {...(releaseMode ? {} : { scope: "col" })}
                  >
                    Attribute
                  </th>
                  {compared.map((product) => (
                    <th
                      key={product.id}
                      className="text-left p-3 border-b min-w-[200px]"
                      {...(releaseMode ? {} : { scope: "col" })}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/products/${product.id}`}
                            className="font-semibold hover:text-primary transition-colors focus-ring rounded-sm"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                        </div>
                        <button
                          onClick={() => toggleCompare(product.id)}
                          className="shrink-0 p-1 rounded hover:bg-secondary transition-colors focus-ring"
                          aria-label={`Remove ${product.name} from comparison`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Product icon row */}
                <tr>
                  <td className="p-3 border-b text-sm font-medium text-muted-foreground">Product</td>
                  {compared.map((product) => (
                    <td key={product.id} className="p-3 border-b">
                      <div className="flex h-20 w-20 items-center justify-center rounded-md bg-secondary text-3xl">
                        <span aria-hidden="true">{product.icon}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {attributes.map((attr) => (
                  <tr key={attr.label}>
                    <td
                      className="p-3 border-b text-sm font-medium text-muted-foreground"
                      {...(releaseMode ? {} : { scope: "row" } as any)}
                    >
                      {attr.label}
                    </td>
                    {compared.map((product) => (
                      <td key={product.id} className="p-3 border-b text-sm">
                        {attr.label === "Rating" ? (
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                            {attr.render(product)}
                          </span>
                        ) : attr.label === "In Stock" ? (
                          <span className={product.inStock ? "text-success font-medium" : "text-destructive font-medium"}>
                            {attr.render(product)}
                          </span>
                        ) : (
                          attr.render(product)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Add to cart row */}
                <tr>
                  <td className="p-3 text-sm font-medium text-muted-foreground">Action</td>
                  {compared.map((product) => (
                    <td key={product.id} className="p-3">
                      <Button
                        size="sm"
                        onClick={() => handleAdd(product)}
                        disabled={!product.inStock}
                      >
                        {product.inStock
                          ? releaseMode ? "Add to Basket" : "Add to Cart"
                          : "Out of Stock"}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-lg font-medium mb-2">No products to compare</p>
            <p className="text-sm text-muted-foreground mb-4">
              Select up to 3 products to compare by clicking the compare icon on product cards.
            </p>
            <Button asChild variant="outline">
              <Link to="/products">
                Browse Products
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
