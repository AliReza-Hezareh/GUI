import Layout from "@/components/Layout";

export default function ReadmePage() {
  return (
    <Layout>
      <div className="container py-8 max-w-3xl prose prose-slate">
        <h1>Brewscape — Training App Guide</h1>

        <p>
          Brewscape is a realistic coffee equipment e-commerce app built for teaching
          usability testing, accessibility auditing, and Playwright test automation.
        </p>

        <h2>Main User Journeys</h2>
        <ol>
          <li><strong>Browse & Search:</strong> Visit Products → use search, filter by category, sort by price/rating → click into product details.</li>
          <li><strong>Add to Cart & Checkout:</strong> Add items to cart → go to Checkout → fill shipping form → place order → see confirmation.</li>
          <li><strong>Contact:</strong> Visit Contact page → submit inquiry form → see success message.</li>
          <li><strong>Preferences:</strong> Visit Account → change display name, notification setting, items per page → save (persisted to localStorage).</li>
        </ol>

        <h2>Usability Review Targets</h2>
        <ul>
          <li>Form validation and error messaging (Checkout, Contact)</li>
          <li>Search and filter discoverability (Products page)</li>
          <li>Cart management (quantity controls, remove items)</li>
          <li>Confirmation messaging clarity</li>
          <li>Empty state messaging</li>
          <li>Mobile navigation and responsive layout</li>
        </ul>

        <h2>Accessibility Review Targets</h2>
        <ul>
          <li>Skip link and landmark structure</li>
          <li>Heading hierarchy across all pages</li>
          <li>Form label associations and aria-describedby on errors</li>
          <li>Keyboard navigation: nav links, filters, cart controls, forms</li>
          <li>Focus management after checkout submission</li>
          <li>Color contrast of interactive elements and text</li>
          <li>Screen reader announcements for cart additions and form errors</li>
          <li>ARIA attributes: aria-expanded, aria-pressed, aria-live, aria-invalid</li>
        </ul>

        <h2>Playwright Test Targets</h2>
        <ul>
          <li><strong>Navigation:</strong> Verify all routes render correct headings and content.</li>
          <li><strong>Search:</strong> Type a query → verify filtered results. Clear → verify reset.</li>
          <li><strong>Category Filter:</strong> Click a category → verify only matching products shown.</li>
          <li><strong>Sort:</strong> Select "Price: Low to High" → verify first product is cheapest.</li>
          <li><strong>Add to Cart:</strong> Click add → verify cart count updates → verify aria announcement.</li>
          <li><strong>Checkout Form:</strong> Submit empty → verify all errors. Fill valid data → submit → verify confirmation.</li>
          <li><strong>Preferences:</strong> Change a setting → reload → verify it persists.</li>
          <li><strong>Load More:</strong> Verify pagination loads additional products.</li>
        </ul>

        <h2>Release Mode</h2>
        <p>
          Toggle "Simulate New Release" in the <a href="/teacher">Teacher Panel</a> to
          activate a mix of harmless UI changes and real regressions. This lets students
          practice writing resilient tests that survive refactors but catch genuine bugs.
        </p>

        <h2>How to Reset</h2>
        <p>
          Visit the <a href="/teacher">Teacher Panel</a> and click "Reset All App State"
          to clear cart, preferences, and return to baseline mode. This ensures repeatable
          test runs.
        </p>
      </div>
    </Layout>
  );
}
