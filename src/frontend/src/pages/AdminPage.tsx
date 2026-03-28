import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Pencil,
  PlusCircle,
  ShieldOff,
  Trash2,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FoodItem } from "../backend.d";
import { SEED_FOOD_ITEMS } from "../data/seedData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllFoodItems,
  useAllOrders,
  useCreateFoodItem,
  useDeleteFoodItem,
  useIsAdmin,
  useUpdateFoodItem,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4"];

const EMPTY_FORM: Omit<FoodItem, "id"> = {
  name: "",
  category: "Pizza",
  price: 0,
  description: "",
  imageUrl: "",
  isAvailable: true,
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  out_for_delivery: "bg-orange-500/20 text-orange-400",
  delivered: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/20 text-destructive",
};

export default function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: backendItems } = useAllFoodItems();
  const { data: orders } = useAllOrders();
  const foodItems =
    backendItems && backendItems.length > 0 ? backendItems : SEED_FOOD_ITEMS;

  const createItem = useCreateFoodItem();
  const updateItem = useUpdateFoodItem();
  const deleteItem = useDeleteFoodItem();
  const updateStatus = useUpdateOrderStatus();

  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [form, setForm] = useState<Omit<FoodItem, "id">>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleFormChange = (
    key: keyof Omit<FoodItem, "id">,
    value: string | number | boolean,
  ) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Food item deleted");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateItem.mutateAsync({ ...form, id: editingItem.id });
        toast.success("Item updated");
      } else {
        await createItem.mutateAsync({ ...form, id: BigInt(0) });
        toast.success("Item added");
      }
      setForm(EMPTY_FORM);
      setEditingItem(null);
      setShowForm(false);
    } catch {
      toast.error("Failed to save item");
    }
  };

  const handleStatusChange = async (id: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isInitializing || adminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
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
            <UtensilsCrossed className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-2">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to manage your food menu and orders
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12"
            data-ocid="admin.primary_button"
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
        data-ocid="admin.error_state"
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">
              FoodieHub <span className="text-primary">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/manage">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="admin.link"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Hub
              </Button>
            </Link>
            <Link to="/delivery">
              <Button
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                data-ocid="admin.link"
              >
                <Truck className="w-4 h-4 mr-2" />
                Delivery Manager
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => clear()}
              className="rounded-xl text-muted-foreground"
              data-ocid="admin.secondary_button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="menu">
          <TabsList className="mb-6 bg-card border border-border/40 rounded-xl p-1">
            <TabsTrigger
              value="menu"
              className="rounded-lg"
              data-ocid="admin.tab"
            >
              Menu Management
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-lg"
              data-ocid="admin.tab"
            >
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl">
                Food Items ({foodItems.length})
              </h2>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setForm(EMPTY_FORM);
                  setShowForm(!showForm);
                }}
                className="bg-primary text-primary-foreground rounded-xl btn-green-glow"
                data-ocid="admin.primary_button"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </div>

            {showForm && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-semibold mb-4">
                  {editingItem ? "Edit Item" : "Add New Item"}
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-1">
                    <Label>Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      placeholder="Dish name"
                      className="bg-muted border-border/40"
                      required
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => handleFormChange("category", v)}
                    >
                      <SelectTrigger
                        className="bg-muted border-border/40"
                        data-ocid="admin.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Pizza",
                          "Burgers",
                          "Biryani",
                          "Sushi",
                          "Tacos",
                          "Salad",
                          "Desserts",
                        ].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        handleFormChange("price", Number(e.target.value))
                      }
                      className="bg-muted border-border/40"
                      required
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Image URL</Label>
                    <Input
                      value={form.imageUrl}
                      onChange={(e) =>
                        handleFormChange("imageUrl", e.target.value)
                      }
                      placeholder="https://..."
                      className="bg-muted border-border/40"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label>Description</Label>
                    <Input
                      value={form.description}
                      onChange={(e) =>
                        handleFormChange("description", e.target.value)
                      }
                      placeholder="Short description..."
                      className="bg-muted border-border/40"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.isAvailable}
                      onCheckedChange={(v) =>
                        handleFormChange("isAvailable", v)
                      }
                      data-ocid="admin.switch"
                    />
                    <Label>Available</Label>
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="rounded-xl"
                      data-ocid="admin.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createItem.isPending || updateItem.isPending}
                      className="bg-primary text-primary-foreground rounded-xl btn-green-glow"
                      data-ocid="admin.submit_button"
                    >
                      {(createItem.isPending || updateItem.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingItem ? "Save Changes" : "Add Item"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="rounded-2xl border border-border/40 overflow-hidden">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="bg-card/50 border-border/40">
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foodItems.map((item, idx) => (
                    <TableRow
                      key={item.id.toString()}
                      className="border-border/40 hover:bg-card/30"
                      data-ocid={`admin.item.${idx + 1}`}
                    >
                      <TableCell>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs border-border/60"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.isAvailable
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                            className="rounded-lg"
                            data-ocid={`admin.item.${idx + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg text-destructive hover:text-destructive"
                            data-ocid={`admin.item.${idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl">
                Orders ({orders?.length ?? 0})
              </h2>
            </div>

            {!orders ? (
              <div className="space-y-3" data-ocid="admin.loading_state">
                {SKELETON_IDS.map((id) => (
                  <Skeleton key={id} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.empty_state"
              >
                No orders yet
              </div>
            ) : (
              <div className="rounded-2xl border border-border/40 overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="bg-card/50 border-border/40">
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <TableRow
                        key={order.id.toString()}
                        className="border-border/40 hover:bg-card/30"
                        data-ocid={`admin.item.${idx + 1}`}
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          #{order.id.toString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {order.address}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{order.phone}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{order.totalAmount}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              STATUS_COLORS[order.status] ??
                              "bg-muted text-muted-foreground"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(v) =>
                              handleStatusChange(order.id, v)
                            }
                          >
                            <SelectTrigger
                              className="w-36 h-8 text-xs bg-muted border-border/40"
                              data-ocid={`admin.item.${idx + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="out_for_delivery">
                                Out for Delivery
                              </SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
