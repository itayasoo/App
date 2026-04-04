import type { Transaction, TransactionSource } from "./types";
import { categorize } from "./categorizer";

let idCounter = 0;
function nextId() {
  return `txn_${Date.now()}_${++idCounter}`;
}

// ── CSV tokenizer (handles quoted fields) ───────────────────────────────────
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if ((ch === "," || ch === "\t") && !inQuotes) {
      fields.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur.trim());
  return fields;
}

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  // Remove BOM if present
  const clean = text.replace(/^\uFEFF/, "").replace(/\r/g, "");
  const lines = clean.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = parseCSVLine(lines[0]).map((h) => h.replace(/"/g, "").trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (vals[idx] ?? "").replace(/"/g, "").trim();
    });
    rows.push(row);
  }
  return { headers, rows };
}

// ── Column detection ────────────────────────────────────────────────────────
function findCol(headers: string[], candidates: string[]): string | null {
  for (const c of candidates) {
    const match = headers.find(
      (h) => h.toLowerCase().replace(/\s+/g, "") === c.toLowerCase().replace(/\s+/g, "")
    );
    if (match) return match;
  }
  // Partial match fallback
  for (const c of candidates) {
    const match = headers.find((h) =>
      h.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(h.toLowerCase())
    );
    if (match) return match;
  }
  return null;
}

function normalizeDate(raw: string): string {
  if (!raw) return "";
  // YYYY-MM-DD already
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  // DD/MM/YYYY or DD.MM.YYYY
  const dmy = raw.match(/^(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})$/);
  if (dmy) {
    const year = dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3];
    return `${year}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }
  // MM/DD/YYYY
  const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (mdy) {
    const year = mdy[3].length === 2 ? `20${mdy[3]}` : mdy[3];
    return `${year}-${mdy[1].padStart(2, "0")}-${mdy[2].padStart(2, "0")}`;
  }
  return raw.slice(0, 10);
}

function parseAmount(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^\d.\-,]/g, "").replace(/,(?=\d{3})/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

// ── Bank file parser ─────────────────────────────────────────────────────────
export function parseBankFile(text: string, fileName: string): Transaction[] {
  const { headers, rows } = parseCSV(text);
  if (!rows.length) return [];

  const dateCol = findCol(headers, [
    "date", "תאריך", "transaction date", "value date", "תאריך ערך",
  ]);
  const descCol = findCol(headers, [
    "description", "תיאור", "פרטים", "narration", "details", "מס׳ אסמכתא",
    "transaction description", "payee", "שם",
  ]);
  const creditCol = findCol(headers, [
    "credit", "זכות", "deposit", "הפקדה", "income", "credit amount", "credits",
  ]);
  const debitCol = findCol(headers, [
    "debit", "חובה", "withdrawal", "משיכה", "expense", "debit amount", "debits",
  ]);
  const amountCol = findCol(headers, [
    "amount", "סכום", "sum", "total",
  ]);

  const transactions: Transaction[] = [];

  for (const row of rows) {
    const dateRaw = dateCol ? row[dateCol] : "";
    if (!dateRaw) continue;

    const date = normalizeDate(dateRaw);
    if (!date || date === "Invalid") continue;

    const description = descCol ? row[descCol] : fileName;
    if (!description) continue;

    let amount: number;
    if (creditCol && debitCol) {
      const credit = parseAmount(row[creditCol] || "0");
      const debit = parseAmount(row[debitCol] || "0");
      amount = credit > 0 ? credit : -Math.abs(debit);
    } else if (amountCol) {
      amount = parseAmount(row[amountCol]);
    } else {
      // Try to infer from first numeric column
      const numericCol = headers.find((h) => {
        const val = parseAmount(row[h]);
        return !isNaN(val) && val !== 0;
      });
      amount = numericCol ? parseAmount(row[numericCol]) : 0;
    }

    if (amount === 0) continue;

    transactions.push({
      id: nextId(),
      date,
      description: description.trim(),
      amount,
      source: "bank",
      category: categorize(description, amount, "bank"),
      isDuplicate: false,
      rawRow: row,
    });
  }

  return transactions;
}

// ── Credit card file parser ──────────────────────────────────────────────────
export function parseCCFile(text: string, fileName: string): Transaction[] {
  const { headers, rows } = parseCSV(text);
  if (!rows.length) return [];

  const dateCol = findCol(headers, [
    "date", "תאריך", "transaction date", "תאריך עסקה", "billing date", "תאריך חיוב",
  ]);
  const descCol = findCol(headers, [
    "description", "שם בית עסק", "merchant", "narration", "details", "פרטים",
    "transaction description", "business name",
  ]);
  const amountCol = findCol(headers, [
    "amount", "סכום", "סכום החיוב", "charge", "total", "debit",
    "transaction amount", "original amount",
  ]);

  const transactions: Transaction[] = [];

  for (const row of rows) {
    const dateRaw = dateCol ? row[dateCol] : "";
    if (!dateRaw) continue;

    const date = normalizeDate(dateRaw);
    if (!date) continue;

    const description = descCol ? row[descCol] : fileName;
    if (!description) continue;

    let amount = amountCol ? parseAmount(row[amountCol]) : 0;
    if (amount === 0) continue;

    // CC charges are always expenses (negative), unless it's a refund/credit
    // If value is already negative, keep it; if positive, negate it
    if (amount > 0) amount = -amount;

    transactions.push({
      id: nextId(),
      date,
      description: description.trim(),
      amount,
      source: "credit_card",
      category: categorize(description, amount, "credit_card"),
      isDuplicate: false,
      rawRow: row,
    });
  }

  return transactions;
}

// ── Generic parser (auto-detect type by filename / content) ─────────────────
export function parseFile(
  text: string,
  fileName: string,
  hint?: TransactionSource
): Transaction[] {
  const lower = fileName.toLowerCase();
  const isCCHint =
    hint === "credit_card" ||
    lower.includes("credit") ||
    lower.includes("cc") ||
    lower.includes("card") ||
    lower.includes("visa") ||
    lower.includes("mastercard") ||
    lower.includes("amex") ||
    lower.includes("cal") ||
    lower.includes("max") ||
    lower.includes("isracard") ||
    lower.includes("leumi_card");

  if (isCCHint) return parseCCFile(text, fileName);
  return parseBankFile(text, fileName);
}
