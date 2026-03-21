import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { products, CATEGORIES } from "@/data/products";
import { useApp } from "@/context/AppContext";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Highest Rated",
};

export default function Products() {
  const { releaseMode, preferences } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  const perPage = preferences.itemsPerPage;

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    switch (sort) {
      case "price-asc":
        // RELEASE DEFECT: sorts descending instead of ascending
        if (releaseMode) {
          result.sort((a, b) => b.price - a.price);
        } else {
          result.sort((a, b) => a.price - b.price);
        }
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [search, selectedCategory, sort, releaseMode]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(0, page * perPage);
  const hasMore = paginated.length < filtered.length;

  const handleCategoryClick = (cat: string) => {
    const next = selectedCategory === cat ? "" : cat;
    setSelectedCategory(next);
    setPage(1);
    if (next) {
      setSearchParams({ category: next });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="product-search"
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-md border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-ring"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-ring rounded-sm"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Filter & Sort row */}
        <div className="mb-6 flex flex-wrap items-start gap-6">
          {/* Category filter */}
          <fieldset>
            <legend className="text-sm font-medium mb-2">Category</legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;

                // RELEASE DEFECT: category buttons become divs without keyboard access
                if (releaseMode) {
                  return (
                    <div
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`cursor-pointer select-none rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-secondary"
                      }`}
                    >
                      {cat}
                    </div>
                  );
                }

                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-ring ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:bg-secondary"
                    }`}
                    aria-pressed={isActive}
                  >
                    {cat}
                  </button>
                );
              })}
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryClick("")}
                  className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring"
                  aria-label="Clear category filter"
                >
                  Clear
                </button>
              )}
            </div>
          </fieldset>

          {/* Sort */}
          <div>
            <label htmlFor="sort-select" className="text-sm font-medium mb-2 block">
              Sort by
            </label>
            {releaseMode ? (
              // SAFE CHANGE: still a native select, just different styling wrapper
              <div className="inline-block">
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
                  className="h-10 rounded-md border bg-card px-3 text-sm focus-ring"
                >
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
                className="h-10 rounded-md border bg-card px-3 text-sm focus-ring"
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length === 0
            ? "No products found"
            : `Showing ${paginated.length} of ${filtered.length} products`}
        </p>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSearch(""); setSelectedCategory(""); setPage(1); setSearchParams({}); }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
