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

  const existingReviews = getProductReviews(product.id);
  const wishlisted = isWishlisted(product.id);
  const compared = isCompared(product.id);

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart(product);
    if (!releaseMode) {
      announce(`${product.name} added to cart`);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    if (reviewRating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }
    if (!reviewTitle.trim()) {
      setReviewError("Please enter a review title.");
      return;
    }
    if (!reviewBody.trim()) {
      setReviewError("Please write your review.");
      return;
    }
    setReviewSubmitted(true);
    announce("Review submitted successfully!");
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
              <StarRatingDisplay rating={product.rating} size="md" />
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

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                size="lg"
                onClick={handleAdd}
                disabled={!product.inStock}
                aria-label={`${buttonText}, ${product.name}`}
              >
                {product.inStock ? buttonText : "Out of Stock"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  toggleWishlist(product.id);
                  if (!releaseMode) {
                    announce(wishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`);
                  }
                }}
                aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                aria-pressed={wishlisted}
              >
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`} aria-hidden="true" />
                {wishlisted ? "Wishlisted" : "Wishlist"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (!compared && compareList.length >= 3) {
                    announce("You can compare up to 3 products.");
                    return;
                  }
                  toggleCompare(product.id);
                  if (!releaseMode) {
                    announce(compared ? `${product.name} removed from comparison` : `${product.name} added to comparison`);
                  }
                }}
                aria-label={compared ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
                aria-pressed={compared}
              >
                <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                {compared ? "Comparing" : "Compare"}
              </Button>

              {!product.inStock && (
                <p className="text-sm text-muted-foreground">
                  This item is currently unavailable.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="text-xl font-bold mb-6">
            Customer Reviews ({existingReviews.length})
          </h2>

          {/* Review Form */}
          <div className="rounded-lg border bg-card p-6 mb-8">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            {reviewSubmitted ? (
              <div className="text-center py-4">
                <p className="text-success font-medium" role="status">
                  Thank you! Your review has been submitted.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" id="rating-label">
                    Your Rating
                  </label>
                  <StarRatingInput
                    value={reviewRating}
                    onChange={setReviewRating}
                    id="review-rating"
                  />
                </div>

                <div>
                  <label htmlFor="review-title" className="block text-sm font-medium mb-1">
                    Review Title
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="h-10 w-full rounded-md border bg-card px-3 text-sm focus-ring"
                  />
                </div>

                <div>
                  <label htmlFor="review-body" className="block text-sm font-medium mb-1">
                    Your Review
                  </label>
                  <textarea
                    id="review-body"
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="What did you like or dislike?"
                    rows={4}
                    className="w-full rounded-md border bg-card px-3 py-2 text-sm focus-ring resize-y"
                  />
                </div>

                {reviewError && (
                  <p className="text-sm text-destructive" role="alert">
                    {reviewError}
                  </p>
                )}

                <Button type="submit">Submit Review</Button>
              </form>
            )}
          </div>

          {/* Existing Reviews */}
          <div className="space-y-4">
            {existingReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border bg-card p-5"
                aria-label={`Review by ${review.author}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRatingDisplay rating={review.rating} />
                      <span className="font-semibold text-sm">{review.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      By {review.author} on {review.date}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {review.body}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                  {review.helpful} found this helpful
                </div>
              </article>
            ))}
          </div>
        </section>

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
