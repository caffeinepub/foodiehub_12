import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const DELIVERY_FEE = 20;
const MINIMUM_ORDER = 60;

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
  onPlaceOrder: () => void;
}

export default function CartSidebar({
  open,
  onClose,
  onPlaceOrder,
}: CartSidebarProps) {
  const { items, updateQuantity, subtotal, totalItems } = useCart();
  const belowMinimum = subtotal < MINIMUM_ORDER;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={-1}
          aria-label="Close cart"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 glass-card shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-lg">Your Cart</h2>
            {totalItems > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl"
            data-ocid="cart.close_button"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-6 py-4">
          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-48 gap-3"
              data-ocid="cart.empty_state"
            >
              <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground text-sm">
                Your cart is empty
              </p>
              <p className="text-muted-foreground text-xs">
                Add some delicious food!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.id.toString()}
                  className="flex items-center gap-3"
                  data-ocid={`cart.item.${idx + 1}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      ₹{item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-border/40 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>₹{DELIVERY_FEE}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{subtotal + DELIVERY_FEE}</span>
              </div>
            </div>
            {belowMinimum && (
              <div className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-center">
                Minimum order is ₹{MINIMUM_ORDER}. Add ₹
                {MINIMUM_ORDER - subtotal} more to place your order.
              </div>
            )}
            <Button
              onClick={onPlaceOrder}
              disabled={belowMinimum}
              className="w-full h-12 bg-primary text-primary-foreground rounded-2xl font-semibold btn-green-glow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              data-ocid="cart.primary_button"
            >
              {belowMinimum ? `Min. order ₹${MINIMUM_ORDER}` : "Place Order"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
