import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Package, Clock, Truck, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  confirmed: { label: "Bekräftad", icon: CheckCircle, color: "text-success" },
  processing: { label: "Behandlas", icon: Clock, color: "text-accent" },
  shipped: { label: "Skickad", icon: Truck, color: "text-primary" },
  delivered: { label: "Levererad", icon: Package, color: "text-success" },
};

export default function OrderHistory() {
  const { orders, releaseMode } = useApp();

  const getStatusDisplay = (status: string) => {
    if (releaseMode) {
      const swapped: Record<string, string> = {
        confirmed: "processing",
        processing: "confirmed",
        shipped: "shipped",
        delivered: "delivered",
      };
      const mapped = swapped[status] || status;
      return STATUS_CONFIG[mapped as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.confirmed;
    }
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.confirmed;
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-6 w-6" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Orderhistorik</h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusDisplay = getStatusDisplay(order.status);
              const StatusIcon = statusDisplay.icon;

              return (
                <article
                  key={order.id}
                  className="rounded-lg border bg-card p-5"
                  aria-label={`Order ${order.id}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusDisplay.color}`}>
                      <StatusIcon className="h-4 w-4" aria-hidden="true" />
                      {statusDisplay.label}
                    </div>
                  </div>

                  <ul className="divide-y">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 py-2">
                        <span className="text-xl" aria-hidden="true">{item.product.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Antal: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium tabular-nums">
                          {(item.product.price * item.quantity).toFixed(0)} kr
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 pt-3 border-t flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Leverans till: {order.shippingName}, {order.shippingCity}
                    </span>
                    <span className="font-bold tabular-nums">{order.total.toFixed(0)} kr</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" aria-hidden="true" />
            <p className="text-lg font-medium mb-2">Inga beställningar ännu</p>
            <p className="text-sm text-muted-foreground mb-4">
              Din orderhistorik visas här efter ditt första köp.
            </p>
            <Button asChild variant="outline">
              <Link to="/products">
                Börja handla
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
