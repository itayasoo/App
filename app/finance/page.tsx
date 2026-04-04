"use client";

import { useState, useCallback, useRef } from "react";
import type { Transaction, Category, MonthSummary } from "@/lib/finance/types";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/finance/types";
import { parseFile } from "@/lib/finance/parser";
import { deduplicateTransactions } from "@/lib/finance/deduplicator";
import { buildMonthlySummary, getMonths, fmt } from "@/lib/finance/calculator";

// ─── helpers ────────────────────────────────────────────────────────────────

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string ?? "");
    reader.onerror = reject;
    reader.readAsText(file, "utf-8");
  });
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col gap-1">
      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{label}</span>
      <span className={`text-3xl font-extrabold ${color}`}>{value}</span>
      {sub && <span className="text-xs text-stone-400">{sub}</span>}
    </div>
  );
}

function UploadZone({
  label,
  hint,
  onFiles,
}: {
  label: string;
  hint: string;
  onFiles: (files: FileList) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
    },
    [onFiles]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
        ${dragging ? "border-blue-400 bg-blue-50" : "border-stone-300 hover:border-stone-400 bg-stone-50"}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt,.xls,.xlsx"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
      <div className="text-2xl mb-2">📂</div>
      <p className="font-semibold text-stone-700 text-sm">{label}</p>
      <p className="text-xs text-stone-400 mt-1">{hint}</p>
    </div>
  );
}

function CategoryBar({
  category,
  amount,
  max,
}: {
  category: Category;
  amount: number;
  max: number;
}) {
  const pct = max > 0 ? Math.min(100, (amount / max) * 100) : 0;
  const color = CATEGORY_COLORS[category] ?? "bg-stone-400";
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 text-xs text-stone-600 truncate text-right shrink-0">
        {CATEGORY_LABELS[category]}
      </span>
      <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-20 text-xs font-semibold text-stone-700 text-right shrink-0">
        {fmt(amount)}
      </span>
    </div>
  );
}

function TransactionTable({
  transactions,
  onCategoryChange,
}: {
  transactions: Transaction[];
  onCategoryChange: (id: string, category: Category) => void;
}) {
  const [search, setSearch] = useState("");
  const [showDupes, setShowDupes] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const filtered = transactions.filter((t) => {
    if (!showDupes && t.isDuplicate) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.description.toLowerCase().includes(q) ||
        t.category.includes(q) ||
        t.date.includes(q)
      );
    }
    return true;
  });

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 flex flex-wrap gap-3 items-center justify-between">
        <h3 className="font-bold text-stone-800">Transactions ({filtered.length})</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <label className="flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer">
            <input
              type="checkbox"
              checked={showDupes}
              onChange={(e) => setShowDupes(e.target.checked)}
              className="rounded"
            />
            Show duplicates
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr
                key={t.id}
                className={`border-t border-stone-50 hover:bg-stone-50 transition-colors
                  ${t.isDuplicate ? "opacity-40 bg-stone-50" : ""}`}
              >
                <td className="px-4 py-2.5 text-stone-500 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-2.5 text-stone-800 max-w-xs truncate">
                  {t.isDuplicate && (
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded mr-1.5">
                      dupe
                    </span>
                  )}
                  {t.description}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${t.source === "credit_card"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"}`}>
                    {t.source === "credit_card" ? "CC" : "Bank"}
                  </span>
                </td>
                <td className={`px-4 py-2.5 text-right font-semibold tabular-nums
                  ${t.amount >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {t.amount >= 0 ? "+" : "-"}{fmt(Math.abs(t.amount))}
                </td>
                <td className="px-4 py-2.5">
                  <select
                    value={t.category}
                    onChange={(e) => onCategoryChange(t.id, e.target.value as Category)}
                    className="text-xs border border-stone-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-stone-400 text-sm">
                  No transactions match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="px-5 py-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>Page {page + 1} of {pages}</span>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50 transition-colors"
            >
              ← Prev
            </button>
            <button
              disabled={page >= pages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // ── file ingestion ────────────────────────────────────────────────────────
  async function ingestFiles(files: FileList, hint: "bank" | "credit_card") {
    setLoading(true);
    setError(null);
    try {
      const newTxns: Transaction[] = [];
      for (const file of Array.from(files)) {
        const text = await readFileText(file);
        const parsed = parseFile(text, file.name, hint);
        newTxns.push(...parsed);
      }

      if (!newTxns.length) {
        setError("No transactions found. Check that the file has date, description, and amount columns.");
        return;
      }

      setTransactions((prev) => {
        const combined = deduplicateTransactions([...prev, ...newTxns]);
        return combined;
      });
    } catch (e) {
      setError(`Failed to parse file: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  // ── category override ─────────────────────────────────────────────────────
  function handleCategoryChange(id: string, category: Category) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, category } : t))
    );
  }

  // ── clear data ────────────────────────────────────────────────────────────
  function clearAll() {
    setTransactions([]);
    setSelectedMonth("");
    setError(null);
  }

  // ── computed values ───────────────────────────────────────────────────────
  const months = getMonths(transactions);
  const activeMonth = selectedMonth || months[0] || "";
  const summary: MonthSummary | null =
    activeMonth && transactions.length
      ? buildMonthlySummary(transactions, activeMonth)
      : null;

  // Top expense categories (excluding income/transfers/savings)
  const expenseCategories = summary
    ? (Object.entries(summary.byCategory) as [Category, number][])
        .filter(([c, v]) => v > 0 && !["income", "transfers", "savings"].includes(c))
        .sort((a, b) => b[1] - a[1])
    : [];
  const maxExpense = expenseCategories[0]?.[1] ?? 1;
  const totalUnidentifiedCount = transactions.filter(
    (t) => t.category === "unidentified" && !t.isDuplicate
  ).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Header */}
      <header className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Finance OS</h1>
            <p className="text-stone-400 text-xs">Personal cash flow dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {transactions.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-stone-400 hover:text-white border border-stone-700 hover:border-stone-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear all data
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Upload section */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h2 className="font-bold text-stone-800 mb-1">Upload Monthly Files</h2>
          <p className="text-sm text-stone-500 mb-5">
            Drop CSV exports from your bank and credit card. Supported formats: comma or tab separated, Hebrew or English headers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UploadZone
              label="Bank Account File"
              hint="CSV with Date, Description, Credit/Debit columns"
              onFiles={(files) => ingestFiles(files, "bank")}
            />
            <UploadZone
              label="Credit Card File"
              hint="CSV with Date, Merchant, Amount columns"
              onFiles={(files) => ingestFiles(files, "credit_card")}
            />
          </div>
          {loading && (
            <p className="text-center text-blue-500 text-sm mt-4 animate-pulse">
              Parsing files…
            </p>
          )}
          {error && (
            <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {transactions.length > 0 && (
            <p className="mt-4 text-sm text-stone-500">
              Loaded{" "}
              <strong className="text-stone-800">{transactions.filter((t) => !t.isDuplicate).length}</strong>{" "}
              transactions ({transactions.filter((t) => t.isDuplicate).length} duplicates removed).
            </p>
          )}
        </section>

        {/* Month selector */}
        {months.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-stone-600">Viewing month:</label>
            <div className="flex gap-2 flex-wrap">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${activeMonth === m
                      ? "bg-stone-900 text-white"
                      : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard */}
        {summary ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                label="Income"
                value={fmt(summary.income)}
                color="text-emerald-600"
              />
              <StatCard
                label="Expenses"
                value={fmt(summary.expenses + summary.ccCharges)}
                sub={summary.ccCharges > 0 ? `CC: ${fmt(summary.ccCharges)}` : undefined}
                color="text-rose-600"
              />
              <StatCard
                label="Debt Payments"
                value={fmt(summary.debtPayments)}
                sub="Loans & CC payments"
                color="text-orange-600"
              />
              <StatCard
                label="Free Cash"
                value={fmt(Math.abs(summary.freeCash))}
                sub={summary.freeCash >= 0 ? "surplus" : "deficit"}
                color={summary.freeCash >= 0 ? "text-blue-600" : "text-red-700"}
              />
              <StatCard
                label="Unidentified"
                value={fmt(summary.unidentifiedExpenses)}
                sub={`${totalUnidentifiedCount} transactions`}
                color={summary.unidentifiedExpenses > 0 ? "text-amber-600" : "text-stone-400"}
              />
            </div>

            {/* Cash flow bar */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
              <h3 className="font-bold text-stone-800 mb-4">Cash Flow — {activeMonth}</h3>
              <div className="space-y-3">
                {/* Income bar */}
                <div className="flex items-center gap-3">
                  <span className="w-32 text-xs text-stone-500 text-right shrink-0">Income</span>
                  <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <span className="w-24 text-sm font-bold text-emerald-600 text-right shrink-0">
                    +{fmt(summary.income)}
                  </span>
                </div>
                {/* Expenses bar */}
                {summary.income > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="w-32 text-xs text-stone-500 text-right shrink-0">Expenses</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, ((summary.expenses + summary.ccCharges) / summary.income) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-24 text-sm font-bold text-rose-600 text-right shrink-0">
                      -{fmt(summary.expenses + summary.ccCharges)}
                    </span>
                  </div>
                )}
                {/* Debt bar */}
                {summary.debtPayments > 0 && summary.income > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="w-32 text-xs text-stone-500 text-right shrink-0">Debt</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (summary.debtPayments / summary.income) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-24 text-sm font-bold text-orange-600 text-right shrink-0">
                      -{fmt(summary.debtPayments)}
                    </span>
                  </div>
                )}
                {/* Free cash */}
                <div className="border-t border-stone-100 pt-3 flex items-center gap-3">
                  <span className="w-32 text-xs font-bold text-stone-700 text-right shrink-0">Free Cash</span>
                  <div className="flex-1" />
                  <span className={`w-24 text-sm font-extrabold text-right shrink-0
                    ${summary.freeCash >= 0 ? "text-blue-600" : "text-red-700"}`}>
                    {summary.freeCash >= 0 ? "+" : "-"}{fmt(Math.abs(summary.freeCash))}
                  </span>
                </div>
              </div>
            </div>

            {/* Expense breakdown */}
            {expenseCategories.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <h3 className="font-bold text-stone-800 mb-4">Expense Breakdown</h3>
                <div className="space-y-3">
                  {expenseCategories.map(([cat, amount]) => (
                    <CategoryBar
                      key={cat}
                      category={cat}
                      amount={amount}
                      max={maxExpense}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Unidentified warning */}
            {summary.unidentifiedExpenses > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-bold text-amber-800">
                    {fmt(summary.unidentifiedExpenses)} in unidentified expenses
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    {totalUnidentifiedCount} transaction(s) could not be auto-categorized.
                    Use the table below to assign them a category.
                  </p>
                </div>
              </div>
            )}

            {/* Transaction table */}
            <TransactionTable
              transactions={summary.transactions.concat(
                transactions.filter(
                  (t) => t.isDuplicate && t.date.startsWith(activeMonth)
                )
              )}
              onCategoryChange={handleCategoryChange}
            />
          </>
        ) : (
          /* Empty state */
          !loading && transactions.length === 0 && (
            <div className="text-center py-20 text-stone-400">
              <p className="text-5xl mb-4">📊</p>
              <p className="text-lg font-semibold text-stone-500">No data yet</p>
              <p className="text-sm mt-2">Upload your bank and credit card CSV files above to get started.</p>
              <div className="mt-8 text-left inline-block bg-white border border-stone-200 rounded-2xl p-6 max-w-md text-sm text-stone-600 space-y-2">
                <p className="font-semibold text-stone-700 mb-3">Expected CSV format</p>
                <p><strong>Bank:</strong> Date, Description, Credit, Debit (or Amount), Balance</p>
                <p><strong>Credit Card:</strong> Date, Merchant/Description, Amount</p>
                <p className="text-stone-400 mt-3 text-xs">
                  Supports comma-separated and tab-separated files.<br />
                  Hebrew column names are auto-detected.
                </p>
              </div>
            </div>
          )
        )}
      </main>

      <footer className="text-center text-stone-400 text-xs py-8 mt-8 border-t border-stone-100">
        Finance OS v1 · All data stays in your browser
      </footer>
    </div>
  );
}
