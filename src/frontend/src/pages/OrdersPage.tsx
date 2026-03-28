import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  LayoutDashboard,
  Loader2,
  LogOut,
  PackageOpen,
  Search,
  ShieldOff,
  Truck,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllOrders,
  useIsAdmin,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

const STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  pending: {
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    label: "Pending",
  },
  confirmed: {
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    label: "Confirmed",
  },
  out_for_delivery: {
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    label: "Out for Delivery",
  },
  delivered: {
    badge: "bg-green-500/20 text-green-400 border-green-500/30",
    label: "Delivered",
  },
  cancelled: {
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    label: "Cancelled",
  },
};

const NEXT_STATUS: Record<string, string | null> = {
  pending: "confirmed",
  confirmed: "out_for_delivery",
  out_for_delivery: "delivered",
  delivered: null,
  cancelled: null,
};

const NEXT_LABEL: Record<string, string> = {
  pending: "Confirm",
  confirmed: "Send Out",
  out_for_delivery: "Mark Delivered",
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

function OrderDetailRow({
  order,
  onStatusChange,
  isPending,
}: {
  order: Order;
  onStatusChange: (id: bigint, status: string) => void;
  isPending: boolean;
}) {
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
  const nextStatus = NEXT_STATUS[order.status];

  return (
    <>
      <TableRow
        className="border-border/40 hover:bg-card/30 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
        data-ocid={`orders.item.${Number(order.id)}`}
      >
        <TableCell className="font-mono text-xs text-muted-foreground">
          #{order.id.toString()}
        </TableCell>
        <TableCell>
          <div>
            <p className="font-medium text-sm">{order.customerName}</p>
            <p className="text-xs text-muted-foreground">{order.phone}</p>
          </div>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">
          {order.address}
        </TableCell>
        <TableCell className="font-bold text-primary">
          ₹{order.totalAmount}
        </TableCell>
        <TableCell>
          <Badge
            className={`text-xs ${STATUS_STYLES[order.status]?.badge ?? "bg-muted text-muted-foreground"}`}
          >
            {STATUS_STYLES[order.status]?.label ?? order.status}
          </Badge>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          <div>{dateStr}</div>
          <div>{timeStr}</div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {nextStatus && (
              <Button
                size="sm"
                className="h-7 text-xs bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(order.id, nextStatus);
                }}
                disabled={isPending}
                data-ocid="orders.advance_button"
              >
                {isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  NEXT_LABEL[order.status]
                )}
              </Button>
            )}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(order.id, "cancelled");
                }}
                disabled={isPending}
                data-ocid="orders.cancel_button"
              >
                Cancel
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
            >
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="border-border/20 bg-card/20">
          <TableCell colSpan={7} className="py-3 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Order Items
                </p>
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground">{order.items}</p>
                ) : (
                  <ul className="space-y-1">
                    {items.map((item, i) => (
                      <li
                        key={`${item.name}-${i}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          {item.name}
                          {item.quantity > 1 && (
                            <span className="text-xs text-muted-foreground">
                              ×{item.quantity}
                            </span>
                          )}
                        </span>
                        {item.price != null && (
                          <span className="text-xs text-muted-foreground">
                            ₹{item.price * item.quantity}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Delivery Info
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
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

type SortKey = "id" | "totalAmount" | "createdAt";
type SortDir = "asc" | "desc";

export default function OrdersPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleStatusChange = async (id: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Order updated");
    } catch {
      toast.error("Failed to update order");
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? (
        <ChevronUp className="w-3 h-3 inline ml-1" />
      ) : (
        <ChevronDown className="w-3 h-3 inline ml-1" />
      )
    ) : (
      <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-40" />
    );

  if (isInitializing || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
        <div className="glass-card rounded-2xl p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <PackageOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-2">
            Order Manager
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to manage all orders
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12"
            data-ocid="orders.primary_button"
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
        data-ocid="orders.error_state"
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

  // Stats
  const allOrders = orders ?? [];
  const totalRevenue = allOrders.reduce((s, o) => s + o.totalAmount, 0);
  const pending = allOrders.filter((o) => o.status === "pending").length;
  const outForDelivery = allOrders.filter(
    (o) => o.status === "out_for_delivery",
  ).length;
  const delivered = allOrders.filter((o) => o.status === "delivered").length;
  const cancelled = allOrders.filter((o) => o.status === "cancelled").length;

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue}`,
      icon: <span className="text-xl">💰</span>,
      color: "text-primary",
    },
    {
      label: "Total Orders",
      value: allOrders.length,
      icon: <PackageOpen className="w-5 h-5" />,
      color: "text-blue-400",
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock className="w-5 h-5" />,
      color: "text-yellow-400",
    },
    {
      label: "Out for Delivery",
      value: outForDelivery,
      icon: <Truck className="w-5 h-5" />,
      color: "text-orange-400",
    },
    {
      label: "Delivered",
      value: delivered,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-400",
    },
    {
      label: "Cancelled",
      value: cancelled,
      icon: <XCircle className="w-5 h-5" />,
      color: "text-destructive",
    },
  ];

  // Filter + sort
  const filtered = allOrders
    .filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.address.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let av: number;
      let bv: number;
      if (sortKey === "id") {
        av = Number(a.id);
        bv = Number(b.id);
      } else if (sortKey === "totalAmount") {
        av = a.totalAmount;
        bv = b.totalAmount;
      } else {
        av = Number(a.createdAt);
        bv = Number(b.createdAt);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <PackageOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">
              FoodieHub <span className="text-primary">Orders</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/manage">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="orders.link"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Hub
              </Button>
            </Link>
            <Link to="/delivery">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="orders.link"
              >
                <Truck className="w-4 h-4 mr-2" />
                Kanban
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => clear()}
              className="rounded-xl text-muted-foreground"
              data-ocid="orders.secondary_button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          data-ocid="orders.panel"
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
                <span className="font-bold text-lg">{s.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card/50 border-border/40 rounded-xl h-10"
              data-ocid="orders.search_input"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-full sm:w-48 bg-card/50 border-border/40 rounded-xl h-10"
              data-ocid="orders.filter_select"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {ordersLoading ? (
          <div
            className="glass-card rounded-2xl py-16 flex items-center justify-center"
            data-ocid="orders.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="glass-card rounded-2xl py-16 text-center text-muted-foreground"
            data-ocid="orders.empty_state"
          >
            <PackageOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No orders found</p>
            {search || statusFilter !== "all" ? (
              <Button
                variant="ghost"
                className="mt-3 text-sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/40 overflow-hidden">
            <div className="px-4 py-2 bg-card/30 border-b border-border/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {filtered.length} order{filtered.length !== 1 ? "s" : ""}{" "}
                {search || statusFilter !== "all" ? "(filtered)" : ""}
              </span>
              <span className="text-xs text-muted-foreground">
                Click a row to see details
              </span>
            </div>
            <div className="overflow-x-auto">
              <Table data-ocid="orders.table">
                <TableHeader>
                  <TableRow className="bg-card/50 border-border/40">
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => toggleSort("id")}
                    >
                      #ID <SortIcon k="id" />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => toggleSort("totalAmount")}
                    >
                      Total <SortIcon k="totalAmount" />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => toggleSort("createdAt")}
                    >
                      Date <SortIcon k="createdAt" />
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((order) => (
                    <OrderDetailRow
                      key={order.id.toString()}
                      order={order}
                      onStatusChange={handleStatusChange}
                      isPending={updateStatus.isPending}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border/40">
          © {new Date().getFullYear()} FoodieHub Order Manager
        </footer>
      </main>
    </div>
  );
}
