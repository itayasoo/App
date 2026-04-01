"use client";

import { useState } from "react";
import { JournalTrade, Direction, StrategyType } from "@/lib/trading-types";

interface JournalEntryProps {
  onAdd: (trade: Omit<JournalTrade, "id" | "status">) => void;
  prefill?: Partial<JournalTrade>;
}

export default function JournalEntry({ onAdd, prefill }: JournalEntryProps) {
  const [form, setForm] = useState({
    symbol: prefill?.symbol ?? "",
    direction: (prefill?.direction ?? "Long") as Direction,
    entryPrice: prefill?.entryPrice?.toString() ?? "",
    quantity: prefill?.quantity?.toString() ?? "",
    entryDate: prefill?.entryDate ?? new Date().toISOString().split("T")[0],
    notes: prefill?.notes ?? "",
    stopLoss: prefill?.stopLoss?.toString() ?? "",
    takeProfit: prefill?.takeProfit?.toString() ?? "",
    strategyType: (prefill?.strategyType ?? "Momentum") as StrategyType,
  });

  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.symbol || !form.entryPrice || !form.quantity) {
      setError("נא למלא את כל השדות החובה: סימול, מחיר כניסה, כמות");
      return;
    }

    const entryPrice = parseFloat(form.entryPrice);
    const quantity = parseFloat(form.quantity);
    if (isNaN(entryPrice) || isNaN(quantity) || quantity <= 0 || entryPrice <= 0) {
      setError("מחיר וכמות חייבים להיות מספרים חיוביים");
      return;
    }

    onAdd({
      symbol: form.symbol.toUpperCase(),
      direction: form.direction,
      entryPrice,
      quantity,
      entryDate: form.entryDate,
      notes: form.notes,
      stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : undefined,
      takeProfit: form.takeProfit ? parseFloat(form.takeProfit) : undefined,
      strategyType: form.strategyType,
    });

    // Reset
    setForm({
      symbol: "",
      direction: "Long",
      entryPrice: "",
      quantity: "",
      entryDate: new Date().toISOString().split("T")[0],
      notes: "",
      stopLoss: "",
      takeProfit: "",
      strategyType: "Momentum",
    });
  }

  const inputClass =
    "w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500";
  const labelClass = "block text-gray-400 text-xs mb-1 font-medium";

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl border border-gray-700 p-4" dir="rtl">
      <h3 className="text-white font-semibold mb-4">הוסף עסקה חדשה</h3>

      {error && (
        <div className="bg-rose-900/30 border border-rose-800 rounded-lg p-3 mb-4 text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>סימול *</label>
          <input
            className={inputClass}
            placeholder="AAPL"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>כיוון</label>
          <select
            className={inputClass}
            value={form.direction}
            onChange={(e) => setForm({ ...form, direction: e.target.value as Direction })}
            dir="ltr"
          >
            <option value="Long">Long (קנייה)</option>
            <option value="Short">Short (שורט)</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>מחיר כניסה *</label>
          <input
            className={inputClass}
            placeholder="238.50"
            type="number"
            step="0.01"
            min="0"
            value={form.entryPrice}
            onChange={(e) => setForm({ ...form, entryPrice: e.target.value })}
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>כמות מניות *</label>
          <input
            className={inputClass}
            placeholder="10"
            type="number"
            step="1"
            min="1"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>סטופ לוס</label>
          <input
            className={inputClass}
            placeholder="232.00"
            type="number"
            step="0.01"
            min="0"
            value={form.stopLoss}
            onChange={(e) => setForm({ ...form, stopLoss: e.target.value })}
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>יעד רווח</label>
          <input
            className={inputClass}
            placeholder="252.00"
            type="number"
            step="0.01"
            min="0"
            value={form.takeProfit}
            onChange={(e) => setForm({ ...form, takeProfit: e.target.value })}
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>תאריך כניסה</label>
          <input
            className={inputClass}
            type="date"
            value={form.entryDate}
            onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>אסטרטגיה</label>
          <select
            className={inputClass}
            value={form.strategyType}
            onChange={(e) => setForm({ ...form, strategyType: e.target.value as StrategyType })}
            dir="ltr"
          >
            <option value="Momentum">Momentum</option>
            <option value="Mean Reversion">Mean Reversion</option>
            <option value="ETF Rotation">ETF Rotation</option>
            <option value="Options">Options</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className={labelClass}>הערות</label>
        <textarea
          className={inputClass + " resize-none"}
          rows={2}
          placeholder="הכנסתי לאחר פריצה מעל ממוצע נע של 50 ימים..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        הוסף עסקה
      </button>
    </form>
  );
}
