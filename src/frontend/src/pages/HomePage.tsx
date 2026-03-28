import { Skeleton } from "@/components/ui/skeleton";
import { UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import CartSidebar from "../components/CartSidebar";
import FoodCard from "../components/FoodCard";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import OrderModal from "../components/OrderModal";
import { SEED_FOOD_ITEMS } from "../data/seedData";
import { useAllFoodItems } from "../hooks/useQueries";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: backendItems, isLoading } = useAllFoodItems();
  const foodItems =
    backendItems && backendItems.length > 0 ? backendItems : SEED_FOOD_ITEMS;

  const filteredItems = useMemo(() => {
    let items = foodItems;
    if (selectedCategory !== "All") {
      items = items.filter((i) => i.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }
    return items.filter((i) => i.isAvailable);
  }, [foodItems, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <HeroSection
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              {selectedCategory === "All" ? "Popular Dishes" : selectedCategory}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="menu.loading_state"
          >
            {SKELETON_IDS.map((id) => (
              <div key={id} className="rounded-2xl overflow-hidden bg-card">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-4"
            data-ocid="menu.empty_state"
          >
            <UtensilsCrossed className="w-16 h-16 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground text-lg">No dishes found</p>
            <p className="text-muted-foreground text-sm">
              Try a different category or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
              <FoodCard key={item.id.toString()} item={item} index={idx} />
            ))}
          </div>
        )}
      </main>

      <footer id="about" className="border-t border-border/40 bg-card/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg">
                  Foodie<span className="text-primary">Hub</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                The best food marketplace for ordering delicious meals from top
                restaurants.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#menu"
                    className="hover:text-primary transition-colors"
                  >
                    Menu
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Pizza", "Burgers", "Biryani", "Sushi"].map((c) => (
                  <li key={c}>
                    <span className="hover:text-primary cursor-pointer transition-colors">
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@foodiehub.com</li>
                <li>+91 7750049306</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} FoodieHub. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <a
              href="/admin"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Panel
            </a>
          </div>
        </div>
      </footer>

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onPlaceOrder={() => {
          setCartOpen(false);
          setOrderOpen(true);
        }}
      />
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </div>
  );
}
