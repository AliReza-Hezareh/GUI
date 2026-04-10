import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { products } from "@/data/products";
import { getProductReviews } from "@/data/reviews";
import { useApp } from "@/context/AppContext";
import { Star, ArrowLeft, Check, Heart, ArrowLeftRight, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRatingDisplay, StarRatingInput } from "@/components/StarRating";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, releaseMode, announce, toggleWishlist, isWishlisted, toggleCompare, isCompared, compareList } = useApp();
  const product = products.find((p) => p.id === id);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Produkten hittades inte</h1>
          <p className="text-muted-foreground mb-6">
            Produkten du letar efter finns inte eller har tagits bort.
          </p>
          <Button asChild variant="outline">
            <Link to="/products">Tillbaka till produkter</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const existingReviews = getProductReviews(product.id);
  const wishlisted = isWishlisted(product.id);
  const compared = isCompared(product.id);

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart(product);
    if (!releaseMode) {
      announce(`${product.name} tillagd i kundvagnen`);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    if (reviewRating === 0) {
      setReviewError("Välj ett stjärnbetyg.");
      return;
    }
    if (!reviewTitle.trim()) {
      setReviewError("Ange en recensionstitel.");
      return;
    }
    if (!reviewBody.trim()) {
      setReviewError("Skriv din recension.");
      return;
    }
    setReviewSubmitted(true);
    announce("Recension skickad!");
  };

  const buttonText = releaseMode ? "Lägg i korgen" : "Lägg i kundvagn";

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
          Tillbaka till produkter
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border bg-secondary/30 overflow-hidden">
            <img
              src={product.image}
              alt={product.imageAlt || ""}
              width={512}
              height={512}
              className="w-full h-auto object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <StarRatingDisplay rating={product.rating} size="md" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">
                ({product.reviewCount} recensioner)
              </span>
            </div>

            <p className="text-2xl font-bold mb-6 tabular-nums">
              {product.price.toFixed(0)} kr
            </p>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.longDescription}
            </p>

            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3">Viktiga egenskaper</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                size="lg"
                onClick={handleAdd}
                disabled={!product.inStock}
                aria-label={`${buttonText}, ${product.name}`}
              >
                {product.inStock ? buttonText : "Slut i lager"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  toggleWishlist(product.id);
                  if (!releaseMode) {
                    announce(wishlisted ? `${product.name} borttagen från önskelistan` : `${product.name} tillagd i önskelistan`);
                  }
                }}
                aria-label={wishlisted ? `Ta bort ${product.name} från önskelistan` : `Lägg till ${product.name} i önskelistan`}
                aria-pressed={wishlisted}
              >
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`} aria-hidden="true" />
                {wishlisted ? "I önskelistan" : "Önskelista"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (!compared && compareList.length >= 3) {
                    announce("Du kan jämföra upp till 3 produkter.");
                    return;
                  }
                  toggleCompare(product.id);
                  if (!releaseMode) {
                    announce(compared ? `${product.name} borttagen från jämförelsen` : `${product.name} tillagd i jämförelsen`);
                  }
                }}
                aria-label={compared ? `Ta bort ${product.name} från jämförelse` : `Lägg till ${product.name} i jämförelse`}
                aria-pressed={compared}
              >
                <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                {compared ? "Jämförs" : "Jämför"}
              </Button>

              {!product.inStock && (
                <p className="text-sm text-muted-foreground">
                  Denna artikel är för närvarande inte tillgänglig.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="text-xl font-bold mb-6">
            Kundrecensioner ({existingReviews.length})
          </h2>

          <div className="rounded-lg border bg-card p-6 mb-8">
            <h3 className="font-semibold mb-4">Skriv en recension</h3>
            {reviewSubmitted ? (
              <div className="text-center py-4">
                <p className="text-success font-medium" role="status">
                  Tack! Din recension har skickats.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" id="rating-label">
                    Ditt betyg
                  </label>
                  <StarRatingInput
                    value={reviewRating}
                    onChange={setReviewRating}
                    id="review-rating"
                  />
                </div>

                <div>
                  <label htmlFor="review-title" className="block text-sm font-medium mb-1">
                    Recensionstitel
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Sammanfatta din upplevelse"
                    className="h-10 w-full rounded-md border bg-card px-3 text-sm focus-ring"
                  />
                </div>

                <div>
                  <label htmlFor="review-body" className="block text-sm font-medium mb-1">
                    Din recension
                  </label>
                  <textarea
                    id="review-body"
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Vad gillade eller ogillade du?"
                    rows={4}
                    className="w-full rounded-md border bg-card px-3 py-2 text-sm focus-ring resize-y"
                  />
                </div>

                {reviewError && (
                  <p className="text-sm text-destructive" role="alert">
                    {reviewError}
                  </p>
                )}

                <Button type="submit">Skicka recension</Button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            {existingReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border bg-card p-5"
                aria-label={`Recension av ${review.author}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRatingDisplay rating={review.rating} />
                      <span className="font-semibold text-sm">{review.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Av {review.author} den {review.date}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {review.body}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                  {review.helpful} tyckte detta var hjälpsamt
                </div>
              </article>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold mb-6">
              Du kanske också gillar
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group flex gap-4 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md focus-ring"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-secondary overflow-hidden">
                    <img src={p.image} alt={p.imageAlt || ""} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {p.price.toFixed(0)} kr
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
