export interface ProductVariant {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  badge?: string;
  badgeColor?: string;
  features: string[];
  dimensions: string;
  material: string;
  color: string; // tailwind bg class for card accent
  emoji: string;
}

// All variants share the same fixed price for this stage
export const FIXED_PRICE = 149;

export const MESSENGER_PAGE_URL = "https://m.me/YOUR_PAGE_NAME"; // replace with real page
export const WHATSAPP_NUMBER = "+1234567890"; // replace with real number
export const FACEBOOK_PAGE_URL = "https://www.facebook.com/YOUR_PAGE_NAME"; // replace

export const variants: ProductVariant[] = [
  {
    id: "classic",
    name: "Classic Edition",
    subtitle: "The timeless favourite",
    description:
      "Our best-selling set crafted from solid walnut with smooth leather-wrapped interior. Perfect for everyday play at home.",
    price: FIXED_PRICE,
    badge: "Best Seller",
    badgeColor: "bg-amber-500",
    features: [
      "Solid walnut wood case",
      "Full-grain leather playing surface",
      "30 high-gloss checkers included",
      "Professional dice & shaker",
      "Magnetic closure",
    ],
    dimensions: '18" × 10" (open)',
    material: "Walnut + leather",
    color: "amber",
    emoji: "♟️",
  },
  {
    id: "deluxe",
    name: "Deluxe Edition",
    subtitle: "Luxury at every touch",
    description:
      "Hand-stitched Italian leather exterior with mother-of-pearl inlaid checkers. A statement piece for discerning collectors.",
    price: FIXED_PRICE,
    badge: "Most Popular",
    badgeColor: "bg-emerald-600",
    features: [
      "Italian leather exterior",
      "Mother-of-pearl inlaid checkers",
      "Velvet-lined interior",
      "Gold-plated hardware",
      "Gift box included",
    ],
    dimensions: '20" × 12" (open)',
    material: "Leather + pearl",
    color: "emerald",
    emoji: "👑",
  },
  {
    id: "tournament",
    name: "Tournament Edition",
    subtitle: "Regulation play, pro level",
    description:
      "Built to World Backgammon Federation specs. Preferred by competitive players worldwide. Serious game for serious players.",
    price: FIXED_PRICE,
    badge: "Pro Choice",
    badgeColor: "bg-blue-600",
    features: [
      "WBF regulation size",
      "Anti-glare suede surface",
      "Precision-weight checkers",
      "Doubling cube included",
      "Carry strap & case",
    ],
    dimensions: '24" × 14" (open)',
    material: "Suede + aluminium",
    color: "blue",
    emoji: "🏆",
  },
  {
    id: "travel",
    name: "Travel Edition",
    subtitle: "Play anywhere, anytime",
    description:
      "Compact and lightweight with a hard-shell magnetic closure. Fits in your carry-on. Never miss a game on the road.",
    price: FIXED_PRICE,
    features: [
      "Ultra-lightweight design",
      "Hard-shell magnetic case",
      "Non-slip rubber base",
      "All pieces stored inside",
      "TSA carry-on friendly",
    ],
    dimensions: '14" × 8" (open)',
    material: "ABS shell + felt",
    color: "rose",
    emoji: "✈️",
  },
];
