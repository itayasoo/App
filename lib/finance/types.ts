export type TransactionSource = "bank" | "credit_card";

export type Category =
  | "income"
  | "groceries"
  | "dining"
  | "transport"
  | "housing"
  | "utilities"
  | "healthcare"
  | "shopping"
  | "entertainment"
  | "subscriptions"
  | "education"
  | "travel"
  | "debt_payment"
  | "savings"
  | "transfers"
  | "fees"
  | "other"
  | "unidentified";

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number; // positive = money in, negative = money out
  source: TransactionSource;
  category: Category;
  isDuplicate: boolean;
  rawRow: Record<string, string>;
}

export interface MonthSummary {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
  ccCharges: number;
  debtPayments: number;
  freeCash: number;
  unidentifiedExpenses: number;
  byCategory: Record<Category, number>;
  transactions: Transaction[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  income: "Income",
  groceries: "Groceries",
  dining: "Dining & Restaurants",
  transport: "Transport",
  housing: "Housing & Rent",
  utilities: "Utilities & Bills",
  healthcare: "Healthcare",
  shopping: "Shopping",
  entertainment: "Entertainment",
  subscriptions: "Subscriptions",
  education: "Education",
  travel: "Travel",
  debt_payment: "Debt / CC Payment",
  savings: "Savings",
  transfers: "Transfers",
  fees: "Bank Fees",
  other: "Other",
  unidentified: "Unidentified",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  income: "bg-emerald-500",
  groceries: "bg-green-400",
  dining: "bg-orange-400",
  transport: "bg-blue-400",
  housing: "bg-purple-500",
  utilities: "bg-yellow-500",
  healthcare: "bg-red-400",
  shopping: "bg-pink-400",
  entertainment: "bg-indigo-400",
  subscriptions: "bg-cyan-400",
  education: "bg-teal-400",
  travel: "bg-sky-500",
  debt_payment: "bg-rose-600",
  savings: "bg-emerald-600",
  transfers: "bg-gray-400",
  fees: "bg-gray-500",
  other: "bg-stone-400",
  unidentified: "bg-red-600",
};
