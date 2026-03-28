import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useCreateOrder } from "../hooks/useQueries";

const DELIVERY_FEE = 10;
const MINIMUM_ORDER = 60;

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function OrderModal({ open, onClose }: OrderModalProps) {
  const { items, subtotal, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    homeName: "",
    address: "",
    phone: "",
    payment: "cod",
    transactionId: "",
  });

  const total = subtotal + DELIVERY_FEE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subtotal < MINIMUM_ORDER) {
      toast.error(
        `Minimum order amount is ₹${MINIMUM_ORDER}. Please add more items.`,
      );
      return;
    }
    if (!form.name || !form.address || !form.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    if (form.payment === "upi" && !form.transactionId) {
      toast.error("Please enter the UPI transaction ID");
      return;
    }
    const orderItems = items.map((i) => ({
      id: i.id.toString(),
      name: i.name,
      qty: i.quantity,
      price: i.price,
    }));
    const fullAddress = form.homeName
      ? `${form.homeName}, ${form.address}`
      : form.address;
    try {
      await createOrder.mutateAsync({
        id: BigInt(0),
        customerName: form.name,
        address: fullAddress,
        phone: form.phone,
        items: JSON.stringify(orderItems),
        totalAmount: total,
        status: "pending",
        createdAt: BigInt(Date.now()),
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Order failed: ${msg}. Please try again.`);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setForm({
      name: "",
      homeName: "",
      address: "",
      phone: "",
      payment: "cod",
      transactionId: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-card border-border/40 max-w-md"
        data-ocid="order.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {success ? "Order Placed! 🎉" : "Complete Your Order"}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div
            className="flex flex-col items-center py-8 gap-4"
            data-ocid="order.success_state"
          >
            <CheckCircle2 className="w-16 h-16 text-primary" />
            <p className="text-center text-muted-foreground">
              Your order has been placed successfully! We'll deliver soon.
            </p>
            <Button
              onClick={handleClose}
              className="bg-primary text-primary-foreground rounded-xl px-8 btn-green-glow"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {subtotal < MINIMUM_ORDER && (
              <div className="text-sm text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-center">
                Minimum order is ₹{MINIMUM_ORDER}. Add ₹
                {MINIMUM_ORDER - subtotal} more to proceed.
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Your full name"
                className="bg-muted border-border/40"
                data-ocid="order.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="homeName">Home / House Name</Label>
              <Input
                id="homeName"
                value={form.homeName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, homeName: e.target.value }))
                }
                placeholder="e.g. Green Villa, Sunrise Apartments"
                className="bg-muted border-border/40"
                data-ocid="order.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="address">Delivery Address *</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                placeholder="Street, area, landmark"
                className="bg-muted border-border/40"
                data-ocid="order.textarea"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="10-digit mobile number"
                className="bg-muted border-border/40"
                data-ocid="order.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={form.payment}
                onValueChange={(val) =>
                  setForm((p) => ({ ...p, payment: val }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">
                    Cash on Delivery
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="cursor-pointer">
                    UPI
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {form.payment === "upi" && (
              <div className="bg-muted rounded-xl p-4 space-y-3">
                <p className="text-sm text-muted-foreground">Pay to UPI ID:</p>
                <p className="font-display font-bold text-primary text-lg">
                  9337333639@fam
                </p>
                <p className="text-xs text-muted-foreground">
                  After payment, enter your transaction ID below:
                </p>
                <Input
                  value={form.transactionId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, transactionId: e.target.value }))
                  }
                  placeholder="UPI Transaction ID"
                  className="bg-background border-border/40"
                  data-ocid="order.input"
                />
              </div>
            )}
            <div className="pt-2 border-t border-border/40">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Total Amount</span>
                <span className="font-bold text-foreground text-base">
                  ₹{total}
                </span>
              </div>
            </div>
            <Button
              type="submit"
              disabled={createOrder.isPending || subtotal < MINIMUM_ORDER}
              className="w-full h-12 bg-primary text-primary-foreground rounded-2xl font-semibold btn-green-glow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              data-ocid="order.submit_button"
            >
              {createOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : subtotal < MINIMUM_ORDER ? (
                `Min. order ₹${MINIMUM_ORDER}`
              ) : (
                `Place Order · ₹${total}`
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
