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
      announce(`${product.name} tillagd i kundvagnen`);
    }
  };

  const attributes = [
    { label: "Pris", render: (p: typeof products[0]) => `${p.price.toFixed(0)} kr` },
    { label: "Kategori", render: (p: typeof products[0]) => p.category },
    { label: "Betyg", render: (p: typeof products[0]) => `${p.rating} / 5` },
    { label: "Recensioner", render: (p: typeof products[0]) => `${p.reviewCount}` },
    { label: "I lager", render: (p: typeof products[0]) => p.inStock ? "Ja" : "Nej" },
    ...Array.from({ length: 4 }, (_, i) => ({
      label: `Egenskap ${i + 1}`,
      render: (p: typeof products[0]) => p.features[i] || "—",
    })),
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Jämför produkter</h1>
          {compared.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCompare}>
              Rensa alla
            </Button>
          )}
        </div>

        {compared.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" aria-label="Produktjämförelse">
              <thead>
                <tr>
                  <th
                    className="text-left text-sm font-medium text-muted-foreground p-3 border-b min-w-[120px]"
                    {...(releaseMode ? {} : { scope: "col" })}
                  >
                    Egenskap
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
                          aria-label={`Ta bort ${product.name} från jämförelse`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b text-sm font-medium text-muted-foreground">Produkt</td>
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
                        {attr.label === "Betyg" ? (
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                            {attr.render(product)}
                          </span>
                        ) : attr.label === "I lager" ? (
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

                <tr>
                  <td className="p-3 text-sm font-medium text-muted-foreground">Åtgärd</td>
                  {compared.map((product) => (
                    <td key={product.id} className="p-3">
                      <Button
                        size="sm"
                        onClick={() => handleAdd(product)}
                        disabled={!product.inStock}
                      >
                        {product.inStock
                          ? releaseMode ? "Lägg i korgen" : "Lägg i kundvagn"
                          : "Slut i lager"}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-lg font-medium mb-2">Inga produkter att jämföra</p>
            <p className="text-sm text-muted-foreground mb-4">
              Välj upp till 3 produkter att jämföra genom att klicka på jämförelseikonen på produktkorten.
            </p>
            <Button asChild variant="outline">
              <Link to="/products">
                Utforska produkter
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
