import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { products, CATEGORIES } from "@/data/products";
import { useApp } from "@/context/AppContext";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { releaseMode } = useApp();
  const featured = products.filter((p) => p.inStock).slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 md:py-28">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">
              {releaseMode
                ? "Discover Your Perfect Cup"
                : "Craft Your Perfect Brew"}
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 md:text-xl max-w-lg">
              Premium coffee equipment, freshly roasted beans, and everything
              you need for an exceptional cup — every morning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link to="/products">
                  Browse Products
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-2xl font-bold mb-8">
          Shop by Category
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="group rounded-lg border bg-card p-6 text-center transition-all hover:shadow-md hover:border-primary/30 focus-ring"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-3xl block mb-3" aria-hidden="true">
                {["☕", "⚙️", "🫗", "🫘"][i]}
              </span>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {cat}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container pb-16" aria-labelledby="featured-heading">
        <div className="flex items-center justify-between mb-8">
          <h2 id="featured-heading" className="text-2xl font-bold">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-sm font-medium text-primary hover:underline focus-ring rounded-sm"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
