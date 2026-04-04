import type { Category, MonthSummary, Transaction } from "./types";

const ALL_CATEGORIES: Category[] = [
  "income", "groceries", "dining", "transport", "housing", "utilities",
  "healthcare", "shopping", "entertainment", "subscriptions", "education",
  "travel", "debt_payment", "savings", "transfers", "fees", "other", "unidentified",
];

function emptyByCategory(): Record<Category, number> {
  return Object.fromEntries(ALL_CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
}

/**
 * Build a MonthSummary from a set of transactions.
 * Only non-duplicate transactions are counted.
 */
export function buildMonthlySummary(
  transactions: Transaction[],
  month: string // YYYY-MM
): MonthSummary {
  const active = transactions.filter(
    (t) => !t.isDuplicate && t.date.startsWith(month)
  );

  const byCategory = emptyByCategory();
  let income = 0;
  let expenses = 0;
  let ccCharges = 0;
  let debtPayments = 0;

  for (const t of active) {
    const abs = Math.abs(t.amount);
    byCategory[t.category] = (byCategory[t.category] ?? 0) + abs;

    if (t.amount > 0) {
      income += t.amount;
    } else {
      if (t.category === "debt_payment") {
        debtPayments += abs;
      } else if (t.source === "credit_card") {
        ccCharges += abs;
      } else {
        expenses += abs;
      }
    }
  }

  const unidentifiedExpenses = active
    .filter((t) => t.category === "unidentified" && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Free cash = income - all outflows (expenses + CC charges + debt payments)
  const freeCash = income - expenses - ccCharges - debtPayments;

  return {
    month,
    income,
    expenses,
    ccCharges,
    debtPayments,
    freeCash,
    unidentifiedExpenses,
    byCategory,
    transactions: active,
  };
}

/**
 * Get all months present in a transaction set, sorted descending.
 */
export function getMonths(transactions: Transaction[]): string[] {
  const months = new Set(transactions.map((t) => t.date.slice(0, 7)));
  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

export function fmt(n: number, currency = "₪"): string {
  return `${currency}${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
