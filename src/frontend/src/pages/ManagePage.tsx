import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Globe,
  LayoutDashboard,
  Loader2,
  LogOut,
  PackageOpen,
  ShieldOff,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { SEED_FOOD_ITEMS } from "../data/seedData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllFoodItems, useAllOrders, useIsAdmin } from "../hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  out_for_delivery: "bg-orange-500/20 text-orange-400",
  delivered: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/20 text-destructive",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function ManagePage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: backendItems } = useAllFoodItems();
  const { data: orders } = useAllOrders();

  const foodItems =
    backendItems && backendItems.length > 0 ? backendItems : SEED_FOOD_ITEMS;

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  if (isInitializing || adminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="manage.loading_state"
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
            <LayoutDashboard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-2">
            Management Hub
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to access the FoodieHub Management Hub
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12"
            data-ocid="manage.primary_button"
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
        data-ocid="manage.error_state"
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

  // Compute stats
  const totalOrders = orders?.length ?? 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + o.totalAmount, 0) ?? 0;
  const menuItems = foodItems.length;
  const pendingOrders =
    orders?.filter((o) => o.status === "pending").length ?? 0;
  const outForDelivery =
    orders?.filter((o) => o.status === "out_for_delivery").length ?? 0;
  const delivered = orders?.filter((o) => o.status === "delivered").length ?? 0;

  const stats = [
    {
      label: "Total Revenue",
      value: `\u20b9${totalRevenue}`,
      color: "text-primary",
      icon: "\ud83d\udcb0",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      color: "text-blue-400",
      icon: "\ud83d\udce6",
    },
    {
      label: "Menu Items",
      value: menuItems,
      color: "text-purple-400",
      icon: "\ud83c\udf7d\ufe0f",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      color: "text-yellow-400",
      icon: "\u23f3",
    },
    {
      label: "Out for Delivery",
      value: outForDelivery,
      color: "text-orange-400",
      icon: "\ud83d\ude9a",
    },
    {
      label: "Delivered",
      value: delivered,
      color: "text-green-400",
      icon: "\u2705",
    },
  ];

  // Recent 10 orders sorted descending by id
  const recentOrders = [...(orders ?? [])]
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 10);

  // Category breakdown
  const categoryMap: Record<string, string[]> = {};
  for (const item of foodItems) {
    if (!categoryMap[item.category]) categoryMap[item.category] = [];
    categoryMap[item.category].push(item.name);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">
              FoodieHub <span className="text-primary">Management</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/orders">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="manage.link"
              >
                <PackageOpen className="w-4 h-4 mr-2" />
                Orders
              </Button>
            </Link>
            <Link to="/admin">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="manage.link"
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
            <Link to="/delivery">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="manage.link"
              >
                <Truck className="w-4 h-4 mr-2" />
                Delivery
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="manage.link"
              >
                <Globe className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => clear()}
              className="rounded-xl text-muted-foreground"
              data-ocid="manage.secondary_button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <section data-ocid="manage.panel">
          <h2 className="font-display font-bold text-xl mb-4">Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass-card rounded-2xl p-4 text-center"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`font-bold text-xl ${s.color}`}>{s.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="font-display font-bold text-xl mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link to="/admin">
              <div
                className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 text-center cursor-pointer hover:border-primary/40 transition-all hover:bg-primary/5 group"
                data-ocid="manage.primary_button"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UtensilsCrossed className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-base">
                    Menu Management
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add, edit, and manage food items
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/orders">
              <div
                className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 text-center cursor-pointer hover:border-purple-500/40 transition-all hover:bg-purple-500/5 group"
                data-ocid="manage.link"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <PackageOpen className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <p className="font-display font-semibold text-base">
                    Order Manager
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    View, search &amp; update all orders
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/delivery">
              <div
                className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 text-center cursor-pointer hover:border-orange-500/40 transition-all hover:bg-orange-500/5 group"
                data-ocid="manage.secondary_button"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Truck className="w-7 h-7 text-orange-400" />
                </div>
                <div>
                  <p className="font-display font-semibold text-base">
                    Delivery Kanban
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Track and update order statuses
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/">
              <div
                className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 text-center cursor-pointer hover:border-blue-500/40 transition-all hover:bg-blue-500/5 group"
                data-ocid="manage.link"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Globe className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <p className="font-display font-semibold text-base">
                    View Live Site
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    See the customer-facing menu
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Orders */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl">
              Recent Orders{" "}
              <span className="text-muted-foreground font-normal text-sm">
                (last 10)
              </span>
            </h2>
            <Link to="/orders">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/40 text-xs"
              >
                View All Orders
              </Button>
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div
              className="glass-card rounded-2xl py-16 text-center text-muted-foreground"
              data-ocid="manage.empty_state"
            >
              No orders yet
            </div>
          ) : (
            <div className="rounded-2xl border border-border/40 overflow-hidden">
              <Table data-ocid="manage.table">
                <TableHeader>
                  <TableRow className="bg-card/50 border-border/40">
                    <TableHead>#ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order, idx) => (
                    <TableRow
                      key={order.id.toString()}
                      className="border-border/40 hover:bg-card/30"
                      data-ocid={`manage.item.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{order.id.toString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.customerName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.phone}
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        \u20b9{order.totalAmount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {STATUS_LABELS[order.status] ?? order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        {/* Menu Overview */}
        <section>
          <h2 className="font-display font-bold text-xl mb-4">Menu Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryMap).map(([category, items]) => (
              <div key={category} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold">{category}</h3>
                  <Badge variant="outline" className="border-border/60 text-xs">
                    {items.length} items
                  </Badge>
                </div>
                <ul className="space-y-1">
                  {items.map((name) => (
                    <li
                      key={name}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border/40">
          \u00a9 {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </main>
    </div>
  );
}
