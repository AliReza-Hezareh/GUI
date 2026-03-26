import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Trash2, Plus, Minus, CheckCircle, Tag, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

const INITIAL_PAYMENT: PaymentData = {
  cardNumber: "",
  expiry: "",
  cvv: "",
  cardName: "",
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
};

// Valid coupon codes
const COUPONS: Record<string, { type: "percent" | "fixed"; value: number; label: string }> = {
  BREW10: { type: "percent", value: 10, label: "10% off" },
  COFFEE20: { type: "fixed", value: 20, label: "$20 off" },
};

let orderIdCounter = 1000;

export default function Checkout() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart, releaseMode, announce, addOrder } = useApp();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const confirmRef = useRef<HTMLHeadingElement>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const [payment, setPayment] = useState<PaymentData>(INITIAL_PAYMENT);
  const [paymentErrors, setPaymentErrors] = useState<FormErrors>({});
  const [placedOrderId, setPlacedOrderId] = useState<string>("");

  const discount = appliedCoupon && COUPONS[appliedCoupon]
    ? COUPONS[appliedCoupon].type === "percent"
      ? cartTotal * (COUPONS[appliedCoupon].value / 100)
      : Math.min(COUPONS[appliedCoupon].value, cartTotal)
    : 0;

  // RELEASE DEFECT: discount not subtracted from displayed total
  const finalTotal = releaseMode ? cartTotal : cartTotal - discount;

  useEffect(() => {
    if (submitted && !releaseMode && confirmRef.current) {
      confirmRef.current.focus();
    }
    // RELEASE DEFECT: focus not moved to confirmation heading in release mode
  }, [submitted, releaseMode]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    if (!form.name.trim()) errs.name = "Full name is required.";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";

    if (!form.email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Enter a valid email address.";

    if (!form.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else {
      const digits = form.phone.replace(/\D/g, "");
      if (releaseMode) {
        // RELEASE DEFECT: requires exactly 11 digits but error says 10
        if (digits.length !== 11) errs.phone = "Enter a valid 10-digit phone number.";
      } else {
        if (digits.length < 10 || digits.length > 11)
          errs.phone = "Enter a valid 10-digit phone number.";
      }
    }

    if (!form.address.trim()) errs.address = "Street address is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.state.trim()) errs.state = "State is required.";
    if (!form.zip.trim()) errs.zip = "ZIP code is required.";
    else if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim()))
      errs.zip = "Enter a valid ZIP code (e.g., 12345).";

    return errs;
  };

  const validatePayment = (): FormErrors => {
    const errs: FormErrors = {};
    if (!payment.cardName.trim()) errs.cardName = "Name on card is required.";
    const digits = payment.cardNumber.replace(/\s/g, "");
    if (!digits) errs.cardNumber = "Card number is required.";
    else if (!/^\d{16}$/.test(digits)) errs.cardNumber = "Enter a valid 16-digit card number.";
    if (!payment.expiry.trim()) errs.expiry = "Expiry date is required.";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry.trim())) errs.expiry = "Use MM/YY format.";
    if (!payment.cvv.trim()) errs.cvv = "CVV is required.";
    else if (!/^\d{3,4}$/.test(payment.cvv.trim())) errs.cvv = "Enter a valid 3 or 4 digit CVV.";
    return errs;
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
      announce(`Coupon applied: ${COUPONS[code].label}`);
    } else {
      setCouponError("Invalid coupon code. Try BREW10 or COFFEE20.");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    announce("Coupon removed.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    const pErrs = validatePayment();
    setPaymentErrors(pErrs);
    if (Object.keys(errs).length > 0 || Object.keys(pErrs).length > 0) {
      announce("Form has errors. Please review and correct them.");
      return;
    }

    // Save order to history
    const orderId = String(++orderIdCounter);
    addOrder({
      id: orderId,
      items: cart.map((item) => ({ product: item.product, quantity: item.quantity })),
      total: finalTotal,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "confirmed",
      shippingName: form.name.trim(),
      shippingCity: form.city.trim(),
    });

    setPlacedOrderId(orderId);
    setSubmitted(true);
    clearCart();
    setAppliedCoupon(null);
    setCouponCode("");
    if (!releaseMode) {
      announce("Order placed successfully!");
    }
  };

  const handlePaymentChange = (field: keyof PaymentData, value: string) => {
    // Auto-format card number with spaces
    if (field === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    // Auto-format expiry
    if (field === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (field === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }
    setPayment((prev) => ({ ...prev, [field]: value }));
    if (paymentErrors[field]) {
      setPaymentErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const reqIndicator = releaseMode ? (
    <span className="required-indicator-broken" aria-hidden="true">*</span>
  ) : (
    <span className="required-indicator" aria-hidden="true">*</span>
  );

  if (submitted) {
    return (
      <Layout>
        <div className="container py-16 max-w-lg text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-success mb-4" aria-hidden="true" />
          <h1
            ref={confirmRef}
            tabIndex={-1}
            className="text-2xl font-bold mb-3 outline-none"
          >
            {releaseMode ? "Order Received" : "Order Confirmed!"}
          </h1>
          <div className="rounded-lg border bg-card p-4 mb-6 inline-block">
            <p className="text-sm text-muted-foreground mb-1">Order ID</p>
            <p className="text-xl font-mono font-bold tracking-wide">#{placedOrderId}</p>
          </div>
          <p className="text-muted-foreground mb-6">
            {releaseMode
              ? "Your order is under review and may take 3–5 business days to process. We'll reach out if there are any issues."
              : "Thank you for your purchase! Your order has been placed and you'll receive a confirmation email shortly."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some products to get started.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend className="text-lg font-semibold mb-4">
                  Shipping Information
                </legend>

                <div className="grid gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="checkout-name" className="block text-sm font-medium mb-1">
                      Full Name {reqIndicator}
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`h-10 w-full rounded-md border px-3 text-sm focus-ring ${errors.name ? "border-destructive" : "bg-card"}`}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-destructive" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    {releaseMode ? (
                      <label className="block text-sm font-medium mb-1">
                        Email Address {reqIndicator}
                      </label>
                    ) : (
                      <label htmlFor="checkout-email" className="block text-sm font-medium mb-1">
                        Email Address {reqIndicator}
                      </label>
                    )}
                    <input
                      id="checkout-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`h-10 w-full rounded-md border px-3 text-sm focus-ring ${errors.email ? "border-destructive" : "bg-card"}`}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-destructive" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="checkout-phone" className="block text-sm font-medium mb-1">
                      Phone Number {reqIndicator}
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`h-10 w-full rounded-md border px-3 text-sm focus-ring ${errors.phone ? "border-destructive" : "bg-card"}`}
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby="phone-hint phone-error"
                      autoComplete="tel"
                    />
                    <p id="phone-hint" className="mt-1 text-xs text-muted-foreground">
                      Format: (555) 123-4567 or 5551234567
                    </p>
                    {errors.phone && (
                      <p id="phone-error" className="mt-1 text-sm text-destructive" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="checkout-address" className="block text-sm font-medium mb-1">
                      Street Address {reqIndicator}
                    </label>
                    <input
                      id="checkout-address"
                      type="text"
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className={`h-10 w-full rounded-md border px-3 text-sm focus-ring ${errors.address ? "border-destructive" : "bg-card"}`}
                      aria-required="true"
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? "address-error" : undefined}
                      autoComplete="street-address"
                    />
                    {errors.address && (
                      <p id="address-error" className="mt-1 text-sm text-destructive" role="alert">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City / State / ZIP */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="checkout-city" className="block text-sm font-medium mb-1">
                        City {reqIndicator}
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        value={form.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className={`h-10 w-full rounded-md border px-3 text-sm focus-ring ${errors.city ? "border-destructive" : "bg-card"}`}
                        aria-required="true"
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? "city-error" : undefined}
                        autoComplete="address-level2"
                      />
                      {errors.city && (
                        <p id="city-error" className="mt-1 text-sm text-destructive" role="alert">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="checkout-state" className="block text-sm font-medium mb-1">
                        State {reqIndicator}
                      </label>
                      <input
                        id="checkout-state"
                        type="text"
                        value={form.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        className={`h-10 w-full rounded-md border px-3 text-sm focus-ring ${errors.state ? "border-destructive" : "bg-card"}`}
                        aria-required="true"
                        aria-invalid={!!errors.state}
                        aria-describedby={errors.state ? "state-error" : undefined}
                        autoComplete="address-level1"
                      />
                      {errors.state && (
                        <p id="state-error" className="mt-1 text-sm text-destructive" role="alert">
                          {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="checkout-zip" className="block text-sm font-medium mb-1">
                        ZIP Code {reqIndicator}
                      </label>
                      <input
                        id="checkout-zip"
                        type="text"
                        value={form.zip}
                        onChange={(e) => handleChange("zip", e.target.value)}
                        className={`h-10 w-full rounded-md border px-3 text-sm focus-ring ${errors.zip ? "border-destructive" : "bg-card"}`}
                        aria-required="true"
                        aria-invalid={!!errors.zip}
                        aria-describedby={errors.zip ? "zip-error" : undefined}
                        autoComplete="postal-code"
                      />
                      {errors.zip && (
                        <p id="zip-error" className="mt-1 text-sm text-destructive" role="alert">
                          {errors.zip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="mt-8">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Place Order
                </Button>
              </div>
            </form>
          </div>

          {/* Cart Summary */}
          <aside aria-label="Order summary">
            <div className="rounded-lg border bg-card p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <ul className="divide-y">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex gap-3 py-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-secondary text-xl">
                      <span aria-hidden="true">{item.product.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-6 w-6 inline-flex items-center justify-center rounded border text-xs hover:bg-secondary focus-ring"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          <Minus className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums" aria-label={`Quantity: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-6 w-6 inline-flex items-center justify-center rounded border text-xs hover:bg-secondary focus-ring"
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          <Plus className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto h-6 w-6 inline-flex items-center justify-center rounded text-muted-foreground hover:text-destructive focus-ring"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Coupon Code */}
              <div className="mt-4 border-t pt-4">
                <label htmlFor="coupon-code" className="block text-sm font-medium mb-1">
                  <Tag className="inline h-3.5 w-3.5 mr-1" aria-hidden="true" />
                  Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/5 px-3 py-2">
                    <span className="text-sm font-medium text-success">
                      {appliedCoupon} — {COUPONS[appliedCoupon].label}
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm text-muted-foreground hover:text-foreground focus-ring rounded-sm underline"
                      aria-label="Remove coupon"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        id="coupon-code"
                        type="text"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                        placeholder="e.g. BREW10"
                        className={`h-9 flex-1 rounded-md border px-3 text-sm focus-ring ${couponError ? "border-destructive" : "bg-card"}`}
                        aria-invalid={!!couponError}
                        aria-describedby={couponError ? "coupon-error" : undefined}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleApplyCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                    {couponError && (
                      <p id="coupon-error" className="mt-1 text-sm text-destructive" role="alert">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="mt-4 border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${cartTotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount</span>
                    <span className="tabular-nums">−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-1 border-t">
                  <span>Total</span>
                  <span className="tabular-nums">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
