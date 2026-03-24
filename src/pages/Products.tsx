import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { products, CATEGORIES, type Product } from "@/data/products";
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

// Suggested products when search yields no results
const SUGGESTIONS = ["Pour-Over", "French Press", "Grinder", "Ethiopian"];

export default function Products() {
  const { releaseMode, preferences } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  // Sync category when URL changes (e.g. footer links)
  const prevCategoryRef = useState(categoryFromUrl)[0];
  if (categoryFromUrl !== prevCategoryRef && categoryFromUrl !== selectedCategory) {
    setSelectedCategory(categoryFromUrl);
  }
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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

  const clearAll = () => {
    setSearch("");
    setSelectedCategory("");
    setSort("featured");
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = !!search.trim() || !!selectedCategory || sort !== "featured";

  const handleSuggestionClick = (term: string) => {
    setSearch(term);
    setSelectedCategory("");
    setSort("featured");
    setPage(1);
  };

  // Highlight search matches in text
  const highlightMatch = useCallback(
    (text: string) => {
      if (!search.trim()) return text;
      const q = search.trim();
      const idx = text.toLowerCase().indexOf(q.toLowerCase());
      if (idx === -1) return text;
      return (
        <>
          {text.slice(0, idx)}
          <mark className="bg-accent/30 text-foreground rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>
          {text.slice(idx + q.length)}
        </>
      );
    },
    [search]
  );

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
        <div className="mb-4 flex flex-wrap items-start gap-6">
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

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {search.trim() && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-secondary/60 px-3 py-1 text-sm">
                Search: "{search}"
                <button
                  onClick={() => { setSearch(""); setPage(1); }}
                  className="ml-1 rounded-full hover:bg-muted p-0.5 focus-ring"
                  aria-label={`Remove search filter: ${search}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-secondary/60 px-3 py-1 text-sm">
                {selectedCategory}
                <button
                  onClick={() => handleCategoryClick("")}
                  className="ml-1 rounded-full hover:bg-muted p-0.5 focus-ring"
                  aria-label={`Remove category filter: ${selectedCategory}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            )}
            {sort !== "featured" && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-secondary/60 px-3 py-1 text-sm">
                Sort: {SORT_LABELS[sort]}
                <button
                  onClick={() => { setSort("featured"); setPage(1); }}
                  className="ml-1 rounded-full hover:bg-muted p-0.5 focus-ring"
                  aria-label={`Remove sort: ${SORT_LABELS[sort]}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            )}
            <button
              onClick={clearAll}
              className="text-sm text-primary hover:text-primary/80 underline underline-offset-2 focus-ring rounded-sm"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          </div>
        )}

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
                <ProductCard
                  key={product.id}
                  product={product}
                  highlightMatch={search.trim() ? highlightMatch : undefined}
                  onQuickView={() => setQuickViewProduct(product)}
                />
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
            {search.trim() && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className="rounded-full border px-3 py-1.5 text-sm text-primary hover:bg-secondary transition-colors focus-ring"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Button variant="outline" onClick={clearAll}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </Layout>
  );
}
