import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import type { FoodItem } from "../backend.d";
import { useCart } from "../context/CartContext";
import { RATINGS } from "../data/seedData";

interface FoodCardProps {
  item: FoodItem;
  index: number;
}

export default function FoodCard({ item, index }: FoodCardProps) {
  const { addItem } = useCart();
  const [liked, setLiked] = useState(false);
  const rating = RATINGS[item.name] ?? 4.5;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });
  };

  return (
    <div
      className="food-card rounded-2xl bg-card border border-border/40 overflow-hidden shadow-card"
      data-ocid={`menu.item.${index + 1}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          type="button"
          onClick={() => setLiked((p) => !p)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/70 backdrop-blur flex items-center justify-center transition-colors hover:bg-background/90"
          aria-label="Favorite"
        >
          <Heart
            className={`w-4 h-4 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
          />
        </button>
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs">
          {item.category}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-base text-foreground mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3.5 h-3.5 star-gold ${s <= Math.floor(rating) ? "fill-current" : s - 0.5 <= rating ? "fill-current opacity-60" : "opacity-20"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg text-foreground">
            ₹{item.price}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            className="bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 btn-green-glow"
            data-ocid={`menu.item.${index + 1}`}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
