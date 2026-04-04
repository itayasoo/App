import type { Transaction } from "./types";

// Normalize description for comparison: lowercase, strip punctuation, collapse spaces
function normalizeDesc(desc: string): string {
  return desc
    .toLowerCase()
    .replace(/[^\w\s\u0590-\u05FF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Simple similarity: check if two strings share ≥50% of their words
function similarDesc(a: string, b: string): boolean {
  if (a === b) return true;
  const wordsA = new Set(normalizeDesc(a).split(" ").filter((w) => w.length > 2));
  const wordsB = new Set(normalizeDesc(b).split(" ").filter((w) => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return false;
  let shared = 0;
  for (const w of wordsA) if (wordsB.has(w)) shared++;
  const similarity = (shared * 2) / (wordsA.size + wordsB.size);
  return similarity >= 0.5;
}

function dateDiffDays(a: string, b: string): number {
  return Math.abs(
    (new Date(a).getTime() - new Date(b).getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Mark duplicates in a list of transactions.
 *
 * Rules:
 * 1. Exact duplicate: same source, same date, same amount, same description → keep first.
 * 2. Bank ↔ CC cross-duplicate: same amount (absolute), dates within 7 days,
 *    similar description → the CC entry is authoritative; mark bank debit as duplicate.
 *    (This catches "CC payment cleared from bank account" scenarios.)
 * 3. CC monthly billing debit: a bank debit that matches total CC charges within ±5%
 *    and description suggests "credit card" → mark bank as duplicate.
 */
export function deduplicateTransactions(transactions: Transaction[]): Transaction[] {
  const result = transactions.map((t) => ({ ...t, isDuplicate: false }));

  const seen = new Map<string, boolean>();

  // Pass 1: exact duplicates within the same source
  for (const txn of result) {
    const key = `${txn.source}|${txn.date}|${txn.amount}|${normalizeDesc(txn.description)}`;
    if (seen.has(key)) {
      txn.isDuplicate = true;
    } else {
      seen.set(key, true);
    }
  }

  // Pass 2: cross-source duplicates (bank debit that mirrors a CC charge)
  const bankDebits = result.filter(
    (t) => !t.isDuplicate && t.source === "bank" && t.amount < 0
  );
  const ccCharges = result.filter(
    (t) => !t.isDuplicate && t.source === "credit_card"
  );

  for (const bank of bankDebits) {
    // Check if this bank debit is the CC monthly payment clearing
    const isCCPayment =
      bank.description.toLowerCase().includes("credit card") ||
      bank.description.toLowerCase().includes("כרטיס אשראי") ||
      bank.description.toLowerCase().includes("cal ") ||
      bank.description.toLowerCase().includes("visa") ||
      bank.description.toLowerCase().includes("mastercard") ||
      bank.description.toLowerCase().includes("isracard") ||
      bank.description.toLowerCase().includes("max ") ||
      bank.description.toLowerCase().includes("leumi card") ||
      bank.description.toLowerCase().includes("cc payment");

    if (isCCPayment) {
      // This is a CC payment from the bank — mark as debt_payment, not a duplicate
      // (already categorized; don't mark as duplicate unless exact match exists)
      continue;
    }

    // Check for per-transaction cross-source duplicate
    for (const cc of ccCharges) {
      if (
        Math.abs(Math.abs(bank.amount) - Math.abs(cc.amount)) < 0.01 &&
        dateDiffDays(bank.date, cc.date) <= 5 &&
        similarDesc(bank.description, cc.description)
      ) {
        // Bank debit mirrors exact CC charge → bank is the duplicate
        bank.isDuplicate = true;
        break;
      }
    }
  }

  return result;
}
