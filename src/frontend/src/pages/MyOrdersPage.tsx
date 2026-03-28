import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  LogOut,
  Package,
  PackageOpen,
  Phone,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Order } from "../backend.d";
import { useAllOrders } from "../hooks/useQueries";

const SESSION_KEY = "foodiehub_customer_session";

const STATUS_STYLES: Record<
  string,
  { badge: string; label: string; icon: React.ReactNode }
> = {
  pending: {
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    label: "Pending",
    icon: <Clock className="w-4 h-4" />,
  },
  confirmed: {
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    label: "Confirmed",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  out_for_delivery: {
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    label: "Out for Delivery",
    icon: <Truck className="w-4 h-4" />,
  },
  delivered: {
    badge: "bg-green-500/20 text-green-400 border-green-500/30",
    label: "Delivered",
    icon: <Package className="w-4 h-4" />,
  },
  cancelled: {
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    label: "Cancelled",
    icon: <Package className="w-4 h-4" />,
  },
};

const STEPS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const STEP_INDEX: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  out_for_delivery: 2,
  delivered: 3,
  cancelled: -1,
};

function parseItems(
  itemsJson: string,
): { name: string; quantity: number; price?: number }[] {
  try {
    const items = JSON.parse(itemsJson);
    if (Array.isArray(items)) return items;
    return [];
  } catch {
    return [];
  }
}

function StatusStepper({ status }: { status: string }) {
  const currentIdx = STEP_INDEX[status] ?? 0;
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-3 py-1">
          Order Cancelled
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 mt-3 overflow-x-auto pb-1">
      {STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  done
                    ? active
                      ? "bg-primary border-primary text-primary-foreground shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                      : "bg-primary/30 border-primary/60 text-primary"
                    : "bg-muted/30 border-border/40 text-muted-foreground"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-[10px] mt-1 text-center max-w-[56px] leading-tight ${
                  done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 rounded-full transition-colors ${
                  idx < currentIdx ? "bg-primary/60" : "bg-border/40"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const items = parseItems(order.items);
  const date = new Date(Number(order.createdAt) / 1_000_000);
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const statusInfo = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card rounded-2xl overflow-hidden"
      data-ocid={`myorders.item.${index + 1}`}
    >
      {/* Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground">
                #{order.id.toString()}
              </span>
              <Badge className={`text-xs ${statusInfo.badge}`}>
                <span className="flex items-center gap-1">
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dateStr} · {timeStr}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-primary text-lg">
              ₹{order.totalAmount}
            </p>
            <p className="text-xs text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <StatusStepper status={order.status} />

        {/* Toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid={`myorders.toggle.${index + 1}`}
        >
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          {expanded ? "Hide details" : "Show details"}
        </button>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 pt-0 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Items Ordered
                </p>
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li
                      key={`${item.name}-${i}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        {item.name}
                        {(item.quantity ??
                          (item as { qty?: number }).qty ??
                          1) > 1 && (
                          <span className="text-xs text-muted-foreground">
                            ×{item.quantity ?? (item as { qty?: number }).qty}
                          </span>
                        )}
                      </span>
                      {item.price != null && (
                        <span className="text-xs text-muted-foreground">
                          ₹
                          {item.price *
                            (item.quantity ??
                              (item as { qty?: number }).qty ??
                              1)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 space-y-2 text-sm">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Delivery Info
                </p>
                <p>
                  <span className="text-muted-foreground">Name: </span>
                  {order.customerName}
                </p>
                <p>
                  <span className="text-muted-foreground">Address: </span>
                  {order.address}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone: </span>
                  {order.phone}
                </p>
                <p>
                  <span className="text-muted-foreground">Total: </span>
                  <span className="text-primary font-bold">
                    ₹{order.totalAmount}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LoginForm({ onLogin }: { onLogin: (phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { data: orders } = useAllOrders();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 4) {
      setError("Please enter a valid phone number.");
      return;
    }

    const expectedPassword = digits.slice(-4);
    if (password !== expectedPassword) {
      setError(
        "Incorrect password. Your password is the last 4 digits of your phone number.",
      );
      return;
    }

    // Check if phone exists in any order
    const allOrders = orders ?? [];
    const hasOrders = allOrders.some(
      (o) => o.phone.replace(/\D/g, "") === digits,
    );
    if (!hasOrders) {
      setError(
        "No orders found for this phone number. Please check and try again.",
      );
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ phone: digits }));
    onLogin(digits);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-8 w-full max-w-sm"
      >
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-1">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            Track your delivery history
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9 bg-card/50 border-border/40 rounded-xl h-11"
                required
                data-ocid="myorders.input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="4-digit password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-card/50 border-border/40 rounded-xl h-11"
              maxLength={4}
              required
              data-ocid="myorders.input"
            />
            <p className="text-xs text-muted-foreground">
              💡 Your password is the last 4 digits of your phone number
            </p>
          </div>

          {error && (
            <div
              className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2"
              data-ocid="myorders.error_state"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground rounded-xl h-11 btn-green-glow"
            data-ocid="myorders.submit_button"
          >
            View My Orders
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default function MyOrdersPage() {
  const storedSession = localStorage.getItem(SESSION_KEY);
  const parsed = storedSession ? JSON.parse(storedSession) : null;
  const [loggedPhone, setLoggedPhone] = useState<string | null>(
    parsed?.phone ?? null,
  );

  const { data: allOrders, isLoading } = useAllOrders();

  const handleLogin = (phone: string) => setLoggedPhone(phone);
  const handleSignOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setLoggedPhone(null);
  };

  if (!loggedPhone) {
    return (
      <>
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">
                Foodie<span className="text-primary">Hub</span>
              </span>
            </Link>
          </div>
        </header>
        <LoginForm onLogin={handleLogin} />
      </>
    );
  }

  const myOrders = (allOrders ?? [])
    .filter((o) => o.phone.replace(/\D/g, "") === loggedPhone)
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link
            to="/"
            className="flex items-center gap-2"
            data-ocid="myorders.link"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">
              Foodie<span className="text-primary">Hub</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="rounded-xl text-muted-foreground text-sm h-9"
            data-ocid="myorders.secondary_button"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl">My Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Showing orders for{" "}
            <span className="text-foreground font-medium">{loggedPhone}</span>
          </p>
        </div>

        {isLoading ? (
          <div
            className="glass-card rounded-2xl py-16 flex items-center justify-center"
            data-ocid="myorders.loading_state"
          >
            <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : myOrders.length === 0 ? (
          <div
            className="glass-card rounded-2xl py-16 text-center text-muted-foreground"
            data-ocid="myorders.empty_state"
          >
            <PackageOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No orders found for this number</p>
            <p className="text-sm mt-1">Place an order to see it here.</p>
            <Link to="/">
              <Button className="mt-4 bg-primary text-primary-foreground rounded-xl btn-green-glow">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order, idx) => (
              <OrderCard key={order.id.toString()} order={order} index={idx} />
            ))}
          </div>
        )}

        <footer className="text-center text-xs text-muted-foreground py-8 border-t border-border/40 mt-8">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="underline hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </footer>
      </main>
    </div>
  );
}
