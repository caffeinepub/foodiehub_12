import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  LayoutDashboard,
  Loader2,
  LogOut,
  ShieldOff,
  Truck,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Order } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllOrders,
  useIsAdmin,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

const STATUS_STYLES: Record<
  string,
  { badge: string; column: string; label: string }
> = {
  pending: {
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    column: "border-yellow-500/30 bg-yellow-500/5",
    label: "Pending",
  },
  confirmed: {
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    column: "border-blue-500/30 bg-blue-500/5",
    label: "Confirmed",
  },
  out_for_delivery: {
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    column: "border-orange-500/30 bg-orange-500/5",
    label: "Out for Delivery",
  },
  delivered: {
    badge: "bg-green-500/20 text-green-400 border-green-500/30",
    column: "border-green-500/30 bg-green-500/5",
    label: "Delivered",
  },
  cancelled: {
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    column: "border-red-500/30 bg-red-500/5",
    label: "Cancelled",
  },
};

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

function parseItems(itemsJson: string): string {
  try {
    const items = JSON.parse(itemsJson);
    if (Array.isArray(items)) {
      return items
        .map((i: { name?: string; quantity?: number }) =>
          i.name ? `${i.name}${i.quantity ? ` x${i.quantity}` : ""}` : "",
        )
        .filter(Boolean)
        .join(", ");
    }
    return itemsJson;
  } catch {
    return itemsJson;
  }
}

function OrderCard({
  order,
  onStatusChange,
  isPending,
}: {
  order: Order;
  onStatusChange: (id: bigint, status: string) => void;
  isPending: boolean;
}) {
  const time = new Date(
    Number(order.createdAt) / 1_000_000,
  ).toLocaleTimeString();
  const itemsSummary = parseItems(order.items);

  return (
    <div
      className="glass-card rounded-xl p-4 space-y-3"
      data-ocid={`delivery.item.${Number(order.id)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            #{order.id.toString()}
          </p>
          <p className="font-semibold text-sm">{order.customerName}</p>
        </div>
        <Badge
          className={`text-xs ${STATUS_STYLES[order.status]?.badge ?? "bg-muted text-muted-foreground"}`}
        >
          {STATUS_STYLES[order.status]?.label ?? order.status}
        </Badge>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p>📞 {order.phone}</p>
        <p>📍 {order.address}</p>
        {itemsSummary && <p className="line-clamp-2">🍽 {itemsSummary}</p>}
        <p>⏰ {time}</p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="font-bold text-sm text-primary">
          ₹{order.totalAmount}
        </span>
        <div className="flex gap-2">
          {order.status === "pending" && (
            <Button
              size="sm"
              className="h-7 text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
              onClick={() => onStatusChange(order.id, "confirmed")}
              disabled={isPending}
              data-ocid="delivery.confirm_button"
            >
              {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          )}
          {order.status === "confirmed" && (
            <Button
              size="sm"
              className="h-7 text-xs bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30"
              onClick={() => onStatusChange(order.id, "out_for_delivery")}
              disabled={isPending}
              data-ocid="delivery.secondary_button"
            >
              {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Send Out"
              )}
            </Button>
          )}
          {order.status === "out_for_delivery" && (
            <Button
              size="sm"
              className="h-7 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
              onClick={() => onStatusChange(order.id, "delivered")}
              disabled={isPending}
              data-ocid="delivery.confirm_button"
            >
              {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Mark Delivered"
              )}
            </Button>
          )}
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onStatusChange(order.id, "cancelled")}
              disabled={isPending}
              data-ocid="delivery.delete_button"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DeliveryPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleStatusChange = async (id: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isInitializing || adminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="delivery.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
        <div className="glass-card rounded-2xl p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Truck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-2">
            Delivery Manager
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to manage deliveries
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12"
            data-ocid="delivery.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4"
        data-ocid="delivery.error_state"
      >
        <ShieldOff className="w-16 h-16 text-destructive opacity-60" />
        <h2 className="font-display font-bold text-xl">Access Denied</h2>
        <p className="text-muted-foreground text-sm">
          You don't have admin permissions.
        </p>
        <Button
          variant="outline"
          onClick={() => clear()}
          className="rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  const grouped = STATUS_ORDER.reduce<Record<string, Order[]>>((acc, s) => {
    acc[s] = (orders ?? []).filter((o) => o.status === s);
    return acc;
  }, {});

  const total = orders?.length ?? 0;
  const pending = grouped.pending.length;
  const outForDelivery = grouped.out_for_delivery.length;
  const delivered = grouped.delivered.length;

  const stats = [
    {
      label: "Total Orders",
      value: total,
      icon: <UtensilsCrossed className="w-4 h-4" />,
      color: "text-primary",
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock className="w-4 h-4" />,
      color: "text-yellow-400",
    },
    {
      label: "Out for Delivery",
      value: outForDelivery,
      icon: <Truck className="w-4 h-4" />,
      color: "text-orange-400",
    },
    {
      label: "Delivered",
      value: delivered,
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-green-400",
    },
    {
      label: "Cancelled",
      value: grouped.cancelled.length,
      icon: <XCircle className="w-4 h-4" />,
      color: "text-destructive",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Truck className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">
              FoodieHub <span className="text-primary">Delivery</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/manage">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="delivery.link"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Hub
              </Button>
            </Link>
            <Link to="/admin">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="delivery.link"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => clear()}
              className="rounded-xl text-muted-foreground"
              data-ocid="delivery.secondary_button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Bar */}
        <div
          className="grid grid-cols-2 sm:grid-cols-5 gap-3"
          data-ocid="delivery.panel"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-xl p-4 text-center"
            >
              <div
                className={`flex items-center justify-center gap-1.5 ${s.color} mb-1`}
              >
                {s.icon}
                <span className="font-bold text-xl">{s.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Kanban Columns */}
        {ordersLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            data-ocid="delivery.loading_state"
          >
            {STATUS_ORDER.map((s) => (
              <div key={s} className="space-y-3">
                <Skeleton className="h-8 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {STATUS_ORDER.map((status) => {
              const style = STATUS_STYLES[status];
              const columnOrders = grouped[status];
              return (
                <div
                  key={status}
                  className={`rounded-2xl border p-4 space-y-3 ${style.column}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{style.label}</h3>
                    <Badge className={`text-xs ${style.badge}`}>
                      {columnOrders.length}
                    </Badge>
                  </div>
                  {columnOrders.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground text-xs"
                      data-ocid="delivery.empty_state"
                    >
                      No orders
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <OrderCard
                        key={order.id.toString()}
                        order={order}
                        onStatusChange={handleStatusChange}
                        isPending={updateStatus.isPending}
                      />
                    ))
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
