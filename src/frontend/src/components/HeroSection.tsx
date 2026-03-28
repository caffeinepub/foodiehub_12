import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CATEGORIES, CATEGORY_EMOJIS } from "../data/seedData";

interface HeroSectionProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function HeroSection({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[480px] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('/assets/generated/hero-food-banner.dim_1200x500.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 text-center px-4 w-full max-w-3xl mx-auto">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
          Hungry? Order the <span className="text-primary">best food</span> near
          you
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Discover restaurants, explore menus, and get food delivered to your
          door
        </p>

        <div className="relative max-w-xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for dishes, restaurants..."
            className="pl-12 h-14 rounded-2xl bg-card/90 backdrop-blur border-border/50 text-foreground placeholder:text-muted-foreground text-base"
            data-ocid="hero.search_input"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all border ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-green"
                  : "bg-card/70 text-foreground border-border/40 hover:border-primary/50 hover:bg-card/90"
              }`}
              data-ocid="category.tab"
            >
              <span>{CATEGORY_EMOJIS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
