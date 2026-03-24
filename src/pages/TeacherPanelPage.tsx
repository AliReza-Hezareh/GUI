import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

const DEFECTS_CHECKLIST = [
  "Email field label loses htmlFor association on checkout",
  "Category filter buttons become non-keyboard-accessible divs",
  "Price: Low to High sort actually sorts high-to-low",
  "Post-checkout confirmation heading does not receive focus",
  "Phone validation rejects valid 10-digit numbers (requires 11)",
  "Required field indicators (*) become very low contrast",
  "Success message becomes ambiguous ('under review' instead of confirmed)",
  "Cart add-to-cart announcement is not fired (screen reader silent)",
  "Wishlist heart button on product cards loses accessible name",
  "Star rating input for reviews becomes non-keyboard-accessible",
  "Order history status labels are swapped (confirmed ↔ processing)",
  "Compare table header cells lose scope attribute",
  "Quick-view modal does not move focus into dialog on open",
  "Checkout coupon discount is applied but total still shows pre-discount price",
  "Clear-all-filters button in empty state loses its visible label (icon-only, no aria-label)",
  "Login password field type changes from 'password' to 'text' (security regression)",
  "Signup password confirmation mismatch check is skipped",
];

export default function TeacherPanelPage() {
  const { releaseMode, setReleaseMode, resetAll } = useApp();
  const [showChecklist, setShowChecklist] = useState(false);

  return (
    <Layout>
      <div className="container py-8 max-w-xl">
        <h1 className="text-2xl font-bold mb-2">Teacher Panel</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Instructor controls for managing training scenarios. This page is not visible to students by default.
        </p>

        <div className="space-y-6">
          {/* Version label */}
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Current version</p>
            <p className="text-lg font-bold">
              {releaseMode ? "🟡 New Release" : "🟢 Stable Release"}
            </p>
          </div>

          {/* Release toggle */}
          <div className="rounded-lg border bg-card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Simulate New Release</p>
              <p className="text-sm text-muted-foreground">
                Introduces safe UI changes and real defects for testing exercises.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                checked={releaseMode}
                onChange={(e) => setReleaseMode(e.target.checked)}
                className="peer sr-only"
                role="switch"
                aria-label="Simulate new release"
              />
              <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:duration-200 peer-checked:after:translate-x-5" />
            </label>
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            onClick={() => {
              resetAll();
              window.location.reload();
            }}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Reset All App State
          </Button>

          {/* Defects checklist (instructor only) */}
          <div className="rounded-lg border bg-card">
            <button
              onClick={() => setShowChecklist(!showChecklist)}
              className="w-full flex items-center justify-between p-4 text-left font-medium focus-ring rounded-lg"
              aria-expanded={showChecklist}
            >
              <span>Instructor Defect Checklist ({DEFECTS_CHECKLIST.length} defects)</span>
              {showChecklist ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            {showChecklist && (
              <div className="border-t px-4 pb-4">
                <p className="text-xs text-muted-foreground mt-3 mb-3">
                  These defects are active when "Simulate New Release" is ON:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {DEFECTS_CHECKLIST.map((defect, i) => (
                    <li key={i} className="text-muted-foreground">{defect}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
