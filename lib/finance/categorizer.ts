import type { Category, TransactionSource } from "./types";

type Rule = { keywords: string[]; category: Category };

const RULES: Rule[] = [
  // Income
  {
    keywords: ["salary", "משכורת", "payroll", "wage", "זכות שכר", "העברת משכורת", "income",
      "dividend", "refund", "החזר", "tax refund", "tax return", "government",
      "social security", "ביטוח לאומי", "pension", "פנסיה"],
    category: "income",
  },
  // Debt / CC Payments
  {
    keywords: ["credit card payment", "תשלום כרטיס אשראי", "cc payment", "card payment",
      "loan payment", "תשלום הלוואה", "mortgage payment", "משכנתא תשלום",
      "debt repayment", "installment", "תשלום תשלומים"],
    category: "debt_payment",
  },
  // Housing
  {
    keywords: ["rent", "שכר דירה", "mortgage", "משכנתא", "arnona", "ארנונה",
      "property tax", "house insurance", "ביטוח דירה", "hoa", "וועד בית"],
    category: "housing",
  },
  // Groceries
  {
    keywords: ["supermarket", "סופרמרקט", "grocery", "מכולת", "makolet", "rami levi",
      "רמי לוי", "shufersal", "שופרסל", "mega", "מגה", "victory", "ויקטורי",
      "yeinot bitan", "יינות ביתן", "co-op", "fresh market", "whole foods",
      "trader joe", "costco", "walmart grocery", "tesco", "sainsbury"],
    category: "groceries",
  },
  // Dining
  {
    keywords: ["restaurant", "מסעדה", "cafe", "קפה", "coffee", "pizza", "פיצה",
      "burger", "hamburger", "sushi", "delivery", "wolt", "10bis", "ten bis",
      "uber eats", "just eat", "domino", "mcdonalds", "starbucks", "bar ",
      "pub ", "grill", "bistro", "diner", "eatery"],
    category: "dining",
  },
  // Transport
  {
    keywords: ["fuel", "gas station", "תדלוק", "דלק", "parking", "חנייה", "חניה",
      "taxi", "מונית", "uber", "lyft", "gett", "bolt", "bus", "אוטובוס",
      "train", "רכבת", "metro", "subway", "toll", "אגרה", "auto", "car",
      "vehicle", "רכב", "service station", "תחנת שירות"],
    category: "transport",
  },
  // Utilities
  {
    keywords: ["electric", "חשמל", "electricity", "water", "מים", "gas bill", "גז",
      "internet", "אינטרנט", "phone", "טלפון", "cellcom", "partner", "hot",
      "bezeq", "בזק", "cable tv", "telecom", "mobile", "סלולרי", "utility",
      "sewage", "ביוב"],
    category: "utilities",
  },
  // Healthcare
  {
    keywords: ["pharmacy", "בית מרקחת", "doctor", "רופא", "hospital", "בית חולים",
      "clinic", "מרפאה", "dental", "שיניים", "kupat holim", "קופת חולים",
      "clalit", "כללית", "maccabi", "מכבי", "leumit", "לאומית", "meuhedet",
      "מאוחדת", "health", "medical", "optician", "משקפיים", "vision"],
    category: "healthcare",
  },
  // Shopping
  {
    keywords: ["amazon", "ebay", "aliexpress", "zara", "h&m", "hm ", "clothing",
      "apparel", "fashion", "shoes", "sneakers", "nike", "adidas", "ikea",
      "home depot", "ace ", "online store", "shop ", "mall", "קניון",
      "electronics", "אלקטרוניקה", "best buy", "apple store", "samsung"],
    category: "shopping",
  },
  // Entertainment
  {
    keywords: ["cinema", "קולנוע", "movie", "theater", "concert", "museum",
      "zoo", "amusement", "games", "sport", "gym", "fitness", "swimming",
      "bowling", "escape room", "laser tag", "recreation"],
    category: "entertainment",
  },
  // Subscriptions
  {
    keywords: ["netflix", "spotify", "apple", "google play", "microsoft",
      "adobe", "dropbox", "icloud", "youtube premium", "disney", "hbo",
      "subscription", "membership", "monthly fee", "annual fee",
      "בנק ישראל", "חבר מועדון"],
    category: "subscriptions",
  },
  // Education
  {
    keywords: ["university", "college", "school", "tuition", "course",
      "udemy", "coursera", "books", "kindle", "learning", "education",
      "tutoring", "seminar", "workshop", "שכר לימוד", "אוניברסיטה"],
    category: "education",
  },
  // Travel
  {
    keywords: ["hotel", "airbnb", "booking", "flight", "airline", "airport",
      "el al", "ryanair", "easyjet", "lufthansa", "travel agency", "tour",
      "vacation", "holiday", "hostel", "rental car", "car rental"],
    category: "travel",
  },
  // Savings / Investments
  {
    keywords: ["savings", "investment", "mutual fund", "קרן נאמנות", "etf",
      "stock", "bonds", "gemel", "גמל", "keren", "קרן", "transfer to savings",
      "deposit to savings"],
    category: "savings",
  },
  // Transfers
  {
    keywords: ["transfer", "העברה", "bit", "paybox", "paypal", "wire transfer",
      "bank transfer", "העברה בנקאית", "העברה לחשבון"],
    category: "transfers",
  },
  // Bank fees
  {
    keywords: ["bank fee", "עמלה", "fee", "charge fee", "service charge",
      "account fee", "maintenance fee", "interest charge", "ריבית",
      "overdraft fee"],
    category: "fees",
  },
];

export function categorize(
  description: string,
  amount: number,
  source: TransactionSource
): Category {
  const desc = description.toLowerCase();

  // Strong income signal: positive amount on bank account
  if (amount > 0 && source === "bank") {
    // Check if it matches any expense keyword first
    for (const rule of RULES) {
      if (rule.category === "income") continue;
      if (rule.keywords.some((k) => desc.includes(k.toLowerCase()))) {
        // It's a refund/return of expense — still treat as income
        if (
          desc.includes("refund") ||
          desc.includes("החזר") ||
          desc.includes("return")
        ) {
          return "income";
        }
        return rule.category;
      }
    }
    // Default positive bank amount to income
    return "income";
  }

  // CC charges are always negative
  for (const rule of RULES) {
    if (rule.keywords.some((k) => desc.includes(k.toLowerCase()))) {
      return rule.category;
    }
  }

  return "unidentified";
}
