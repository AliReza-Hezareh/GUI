import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Trash2, Plus, Minus, CheckCircle, Tag, CreditCard, Lock, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  zip: "",
};

// Valid coupon codes
const COUPONS: Record<string, { type: "percent" | "fixed"; value: number; label: string }> = {
  BREW10: { type: "percent", value: 10, label: "10% rabatt" },
  COFFEE20: { type: "fixed", value: 200, label: "200 kr rabatt" },
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

    if (!form.name.trim()) errs.name = "Fullständigt namn krävs.";
    else if (form.name.trim().length < 2) errs.name = "Namnet måste vara minst 2 tecken.";

    if (!form.email.trim()) errs.email = "E-postadress krävs.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Ange en giltig e-postadress.";

    if (!form.phone.trim()) {
      errs.phone = "Telefonnummer krävs.";
    } else {
      const digits = form.phone.replace(/\D/g, "");
      if (releaseMode) {
        // RELEASE DEFECT: requires exactly 11 digits but error says 10
        if (digits.length !== 11) errs.phone = "Ange ett giltigt telefonnummer (t.ex. 0701234567).";
      } else {
        if (digits.length < 10 || digits.length > 13)
          errs.phone = "Ange ett giltigt telefonnummer (t.ex. 0701234567).";
      }
    }

    if (!form.address.trim()) errs.address = "Gatuadress krävs.";
    if (!form.city.trim()) errs.city = "Ort krävs.";
    if (!form.zip.trim()) errs.zip = "Postnummer krävs.";
    else if (!/^\d{3}\s?\d{2}$/.test(form.zip.trim()))
      errs.zip = "Ange ett giltigt postnummer (t.ex. 114 55).";

    return errs;
  };

  const validatePayment = (): FormErrors => {
    const errs: FormErrors = {};
    if (!payment.cardName.trim()) errs.cardName = "Namn på kort krävs.";
    const digits = payment.cardNumber.replace(/\s/g, "");
    if (!digits) errs.cardNumber = "Kortnummer krävs.";
    else if (!/^\d{16}$/.test(digits)) errs.cardNumber = "Ange ett giltigt 16-siffrigt kortnummer.";
    if (!payment.expiry.trim()) errs.expiry = "Utgångsdatum krävs.";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry.trim())) errs.expiry = "Använd formatet MM/ÅÅ.";
    if (!payment.cvv.trim()) errs.cvv = "CVV krävs.";
    else if (!/^\d{3,4}$/.test(payment.cvv.trim())) errs.cvv = "Ange en giltig 3- eller 4-siffrig CVV.";
    return errs;
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Ange en rabattkod.");
      return;
    }
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
      announce(`Rabattkod tillämpad: ${COUPONS[code].label}`);
    } else {
      setCouponError("Ogiltig rabattkod. Testa BREW10 eller COFFEE20.");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    announce("Rabattkod borttagen.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    const pErrs = validatePayment();
    setPaymentErrors(pErrs);
    if (Object.keys(errs).length > 0 || Object.keys(pErrs).length > 0) {
      announce("Formuläret har fel. Vänligen granska och rätta dem.");
      return;
    }

    // Save order to history
    const orderId = String(++orderIdCounter);
    addOrder({
      id: orderId,
      items: cart.map((item) => ({ product: item.product, quantity: item.quantity })),
      total: finalTotal,
      date: new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" }),
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
      announce("Beställningen har lagts!");
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

  const handleCloseConfirmation = () => {
    setSubmitted(false);
    setForm(INITIAL_FORM);
    setPayment(INITIAL_PAYMENT);
  };

  const confirmationModal = (
    <Dialog open={submitted} onOpenChange={(open) => { if (!open) handleCloseConfirmation(); }}>
      <DialogContent className="sm:max-w-md" aria-labelledby="order-confirm-title">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
          </div>
          <DialogTitle
            id="order-confirm-title"
            ref={confirmRef}
            tabIndex={-1}
            className="text-center text-2xl outline-none"
          >
            {releaseMode ? "Beställning mottagen" : "Beställning bekräftad!"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {releaseMode
              ? "Din beställning granskas och kan ta 3–5 arbetsdagar att behandla."
              : "Tack för ditt köp! En bekräftelse skickas till din e-post inom kort."}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Order-ID</p>
          <p className="text-2xl font-mono font-bold tracking-wide">#{placedOrderId}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Spara detta nummer för att spåra din beställning
          </p>
        </div>

        <DialogFooter className="sm:flex-col sm:space-x-0 gap-2">
          <Button asChild className="w-full">
            <Link to={`/track?id=${placedOrderId}`}>
              <Truck className="h-4 w-4 mr-2" aria-hidden="true" />
              Spåra beställning
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/orders">
                <Package className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Mina beställningar
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/products">Fortsätt handla</Link>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (cart.length === 0 && !submitted) {
    return (
      <Layout>
        {confirmationModal}
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-3">Din kundvagn är tom</h1>
          <p className="text-muted-foreground mb-6">
            Lägg till produkter för att komma igång.
          </p>
          <Button asChild>
            <Link to="/products">Bläddra bland produkter</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {confirmationModal}
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Kassa</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend className="text-lg font-semibold mb-4">
                  Leveransinformation
                </legend>

                <div className="grid gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="checkout-name" className="block text-sm font-medium mb-1">
                      Fullständigt namn {reqIndicator}
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
                        E-postadress {reqIndicator}
                      </label>
                    ) : (
                      <label htmlFor="checkout-email" className="block text-sm font-medium mb-1">
                        E-postadress {reqIndicator}
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
                      Telefonnummer {reqIndicator}
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
                      placeholder="070 123 45 67"
                    />
                    <p id="phone-hint" className="mt-1 text-xs text-muted-foreground">
                      Format: 0701234567 eller +46701234567
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
                      Gatuadress {reqIndicator}
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

                  {/* Postnummer / Ort */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="checkout-zip" className="block text-sm font-medium mb-1">
                        Postnummer {reqIndicator}
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
                        placeholder="114 55"
                      />
                      {errors.zip && (
                        <p id="zip-error" className="mt-1 text-sm text-destructive" role="alert">
                          {errors.zip}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="checkout-city" className="block text-sm font-medium mb-1">
                        Ort {reqIndicator}
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
                        placeholder="Stockholm"
                      />
                      {errors.city && (
                        <p id="city-error" className="mt-1 text-sm text-destructive" role="alert">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Mock Payment Form */}
              <fieldset className="mt-8">
                <legend className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                  Betalningsinformation
                </legend>
                <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span><strong>ENBART DEMO</strong> — Detta är ett simulerat betalningsformulär. Inga riktiga transaktioner genomförs och inga kortuppgifter lagras eller skickas.</span>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label htmlFor="checkout-cardname" className="block text-sm font-medium mb-1">
                      Namn på kort {reqIndicator}
                    </label>
                    <input
                      id="checkout-cardname"
                      type="text"
                      value={payment.cardName}
                      onChange={(e) => handlePaymentChange("cardName", e.target.value)}
                      className={`h-10 w-full rounded-md border px-3 text-sm focus-ring ${paymentErrors.cardName ? "border-destructive" : "bg-card"}`}
                      aria-required="true"
                      aria-invalid={!!paymentErrors.cardName}
                      aria-describedby={paymentErrors.cardName ? "cardname-error" : undefined}
                      autoComplete="cc-name"
                      placeholder="Anna Andersson"
                    />
                    {paymentErrors.cardName && (
                      <p id="cardname-error" className="mt-1 text-sm text-destructive" role="alert">{paymentErrors.cardName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="checkout-cardnumber" className="block text-sm font-medium mb-1">
                      Kortnummer {reqIndicator}
                    </label>
                    <input
                      id="checkout-cardnumber"
                      type="text"
                      inputMode="numeric"
                      value={payment.cardNumber}
                      onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                      className={`h-10 w-full rounded-md border px-3 text-sm focus-ring font-mono ${paymentErrors.cardNumber ? "border-destructive" : "bg-card"}`}
                      aria-required="true"
                      aria-invalid={!!paymentErrors.cardNumber}
                      aria-describedby={paymentErrors.cardNumber ? "cardnumber-error" : undefined}
                      autoComplete="cc-number"
                      placeholder="4242 4242 4242 4242"
                    />
                    {paymentErrors.cardNumber && (
                      <p id="cardnumber-error" className="mt-1 text-sm text-destructive" role="alert">{paymentErrors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="checkout-expiry" className="block text-sm font-medium mb-1">
                        Utgångsdatum {reqIndicator}
                      </label>
                      <input
                        id="checkout-expiry"
                        type="text"
                        inputMode="numeric"
                        value={payment.expiry}
                        onChange={(e) => handlePaymentChange("expiry", e.target.value)}
                        className={`h-10 w-full rounded-md border px-3 text-sm focus-ring font-mono ${paymentErrors.expiry ? "border-destructive" : "bg-card"}`}
                        aria-required="true"
                        aria-invalid={!!paymentErrors.expiry}
                        aria-describedby={paymentErrors.expiry ? "expiry-error" : undefined}
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                      />
                      {paymentErrors.expiry && (
                        <p id="expiry-error" className="mt-1 text-sm text-destructive" role="alert">{paymentErrors.expiry}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="checkout-cvv" className="block text-sm font-medium mb-1">
                        CVV {reqIndicator}
                      </label>
                      <input
                        id="checkout-cvv"
                        type="text"
                        inputMode="numeric"
                        value={payment.cvv}
                        onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                        className={`h-10 w-full rounded-md border px-3 text-sm focus-ring font-mono ${paymentErrors.cvv ? "border-destructive" : "bg-card"}`}
                        aria-required="true"
                        aria-invalid={!!paymentErrors.cvv}
                        aria-describedby={paymentErrors.cvv ? "cvv-error" : undefined}
                        autoComplete="cc-csc"
                        placeholder="123"
                      />
                      {paymentErrors.cvv && (
                        <p id="cvv-error" className="mt-1 text-sm text-destructive" role="alert">{paymentErrors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="mt-8">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  <Lock className="h-4 w-4 mr-2" aria-hidden="true" />
                  Lägg beställning (demo)
                </Button>
              </div>
            </form>
          </div>

          {/* Cart Summary */}
          <aside aria-label="Ordersammanfattning">
            <div className="rounded-lg border bg-card p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Ordersammanfattning</h2>

              <ul className="divide-y">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex gap-3 py-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-secondary overflow-hidden">
                      <img src={item.product.image} alt={item.product.imageAlt || ""} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        {item.product.price} kr
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-6 w-6 inline-flex items-center justify-center rounded border text-xs hover:bg-secondary focus-ring"
                          aria-label={`Minska antal ${item.product.name}`}
                        >
                          <Minus className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums" aria-label={`Antal: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-6 w-6 inline-flex items-center justify-center rounded border text-xs hover:bg-secondary focus-ring"
                          aria-label={`Öka antal ${item.product.name}`}
                        >
                          <Plus className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto h-6 w-6 inline-flex items-center justify-center rounded text-muted-foreground hover:text-destructive focus-ring"
                          aria-label={`Ta bort ${item.product.name} från kundvagnen`}
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
                  Rabattkod
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/5 px-3 py-2">
                    <span className="text-sm font-medium text-success">
                      {appliedCoupon} — {COUPONS[appliedCoupon].label}
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm text-muted-foreground hover:text-foreground focus-ring rounded-sm underline"
                      aria-label="Ta bort rabattkod"
                    >
                      Ta bort
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
                        Använd
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
                  <span>Delsumma</span>
                  <span className="tabular-nums">{cartTotal} kr</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Rabatt</span>
                    <span className="tabular-nums">−{discount} kr</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-1 border-t">
                  <span>Totalt</span>
                  <span className="tabular-nums">{finalTotal} kr</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
