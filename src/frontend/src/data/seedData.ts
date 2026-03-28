import type { FoodItem } from "../backend.d";

export const SEED_FOOD_ITEMS: FoodItem[] = [
  {
    id: BigInt(1),
    name: "Chicken Samosa (3 pcs)",
    category: "Snacks",
    price: 40,
    description:
      "Crispy golden samosas stuffed with spiced potatoes and peas. Served with green chutney and ketchup.",
    imageUrl:
      "/assets/uploads/72038b9e-68e6-4ee9-b265-67bc7f4ba6b7-019d3501-9c44-740d-906f-3cdd110bd7f6-1.png",
    isAvailable: true,
  },
  {
    id: BigInt(2),
    name: "Chicken Pakora (12 pcs)",
    category: "Snacks",
    price: 30,
    description:
      "12 pieces of crispy, spicy fried bites garnished with green chillies and fresh coriander. Served with mint chutney and ketchup.",
    imageUrl:
      "/assets/uploads/7f900a8e-1e0f-44ba-94f1-176edd22d9ed-019d350b-63bb-767b-a5be-be41d16b897d-1.png",
    isAvailable: true,
  },
  {
    id: BigInt(3),
    name: "Grilled Chicken (1 pc)",
    category: "Chicken",
    price: 70,
    description:
      "Juicy grilled chicken leg piece marinated with aromatic spices, served with lemon wedges, red onion rings and fresh greens.",
    imageUrl:
      "/assets/uploads/file_000000008f4071fa8d661d4d324afceb-019d3524-6838-7267-872a-b19770eb7783-1.png",
    isAvailable: true,
  },
  {
    id: BigInt(4),
    name: "Medu Vada (4 pcs)",
    category: "Snacks",
    price: 35,
    description:
      "4 crispy South Indian medu vadas served with coconut chutney and sambar.",
    imageUrl:
      "/assets/uploads/images-019d3528-b00a-7407-8863-e10d57a318df-1.jpeg",
    isAvailable: true,
  },
  {
    id: BigInt(5),
    name: "Masala Tikki (10 pcs)",
    category: "Snacks",
    price: 40,
    description:
      "10 pieces of crispy masala tikkis made with spiced lentils and herbs, served with tomato ketchup.",
    imageUrl:
      "/assets/uploads/images-019d352f-6a90-7249-9bcd-4d91f83688d5-1.webp",
    isAvailable: true,
  },
  {
    id: BigInt(6),
    name: "Chicken Biryani (5 pcs)",
    category: "Biryani",
    price: 500,
    description:
      "Aromatic basmati rice cooked with tender chicken pieces, caramelized onions, fresh mint and exotic spices. Served with raita.",
    imageUrl:
      "/assets/uploads/images_1-019d3531-f321-73be-b189-0ec63ebb14eb-1.jpeg",
    isAvailable: true,
  },
  {
    id: BigInt(7),
    name: "Chicken Leg Piece (1 pc)",
    category: "Chicken",
    price: 50,
    description:
      "Tender and juicy chicken leg piece cooked with aromatic spices, served hot.",
    imageUrl:
      "/assets/uploads/images_2-019d353b-e6b1-77e9-a1df-7e39447d24a4-1.jpeg",
    isAvailable: true,
  },
  {
    id: BigInt(8),
    name: "Sprite (250 ml)",
    category: "Drinks",
    price: 30,
    description:
      "Refreshing lemon-lime flavoured cold drink, 250 ml bottle. Best served chilled.",
    imageUrl:
      "/assets/uploads/yhnrvu58-019d3543-d27e-726b-b421-e211a009367d-1.jpeg",
    isAvailable: true,
  },
  {
    id: BigInt(9),
    name: "Samosa (6 pcs)",
    category: "Snacks",
    price: 45,
    description:
      "6 pieces of delicious steamed dumplings filled with flavourful stuffing, served with dipping sauce.",
    imageUrl:
      "/assets/uploads/images_3-019d3547-49bb-72be-91d8-63cdcf70f4dc-1.jpeg",
    isAvailable: true,
  },
  {
    id: BigInt(10),
    name: "Kathi Roll (1 pc)",
    category: "Snacks",
    price: 35,
    description:
      "Soft paratha roll stuffed with spiced chicken, onions and capsicum, served with green chutney.",
    imageUrl:
      "/assets/uploads/download-019d354d-2e22-749f-a5d7-d210d1095102-1.jpeg",
    isAvailable: true,
  },
  {
    id: BigInt(11),
    name: "Payaj Vara (4 pcs)",
    category: "Snacks",
    price: 30,
    description:
      "4 pieces of crispy payaj vara made with spiced onions and herbs, served with green chutney.",
    imageUrl:
      "/assets/uploads/images_4-019d354f-96e7-764a-af0a-f0f9c9a93175-1.jpeg",
    isAvailable: true,
  },
  {
    id: BigInt(12),
    name: "Thums Up (2.25 ltr)",
    category: "Drinks",
    price: 30,
    description:
      "Thums Up 2.25 litre party pack. Bold cola taste, best served chilled.",
    imageUrl:
      "/assets/uploads/2-25l-thums-up-019d35e9-b305-725a-89d8-39d2172ebdc9-1.jpg",
    isAvailable: true,
  },
];

export const CATEGORIES = ["All", "Snacks", "Chicken", "Biryani", "Drinks"];

export const CATEGORY_EMOJIS: Record<string, string> = {
  All: "🍽️",
  Snacks: "🥟",
  Chicken: "🍗",
  Biryani: "🍛",
  Drinks: "🥤",
};

export const RATINGS: Record<string, number> = {
  "Chicken Samosa (3 pcs)": 4.5,
  "Chicken Pakora (12 pcs)": 4.6,
  "Grilled Chicken (1 pc)": 4.8,
  "Medu Vada (4 pcs)": 4.4,
  "Masala Tikki (10 pcs)": 4.5,
  "Chicken Biryani (5 pcs)": 4.9,
  "Chicken Leg Piece (1 pc)": 4.7,
  "Sprite (250 ml)": 4.5,
  "Samosa (6 pcs)": 4.6,
  "Kathi Roll (1 pc)": 4.5,
  "Payaj Vara (4 pcs)": 4.5,
  "Thums Up (2.25 ltr)": 4.6,
};
