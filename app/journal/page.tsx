"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import JournalEntry from "@/components/JournalEntry";
import { JournalTrade } from "@/lib/trading-types";
import { mockCurrentPrices } from "@/lib/mock-market-data";

function calcPnL(trade: JournalTrade): number {
  const currentPrice =
    trade.status === "closed" && trade.exitPrice !== undefined
      ? trade.exitPrice
      : mockCurrentPrices[trade.symbol] ?? trade.entryPrice;

  const pnl =
    trade.direction === "Long"
      ? (currentPrice - trade.entryPrice) * trade.quantity
      : (trade.entryPrice - currentPrice) * trade.quantity;

  return pnl;
}

function calcR(trade: JournalTrade): number | null {
  if (!trade.stopLoss) return null;
  const risk = Math.abs(trade.entryPrice - trade.stopLoss) * trade.quantity;
  if (risk === 0) return null;
  return calcPnL(trade) / risk;
}

export default function JournalPage() {
  const [trades, setTrades] = useState<JournalTrade[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [closePrice, setClosePrice] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("tradeiq-journal");
    if (saved) {
      try { setTrades(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  function saveTrades(updated: JournalTrade[]) {
    setTrades(updated);
    localStorage.setItem("tradeiq-journal", JSON.stringify(updated));
  }

  function handleAdd(trade: Omit<JournalTrade, "id" | "status">) {
    const newTrade: JournalTrade = {
      ...trade,
      id: crypto.randomUUID(),
      status: "open",
    };
    saveTrades([...trades, newTrade]);
    setShowForm(false);
  }

  function handleClose(id: string) {
    const price = parseFloat(closePrice);
    if (isNaN(price) || price <= 0) return;
    const updated = trades.map((t) =>
      t.id === id
        ? { ...t, status: "closed" as const, exitPrice: price, exitDate: new Date().toISOString().split("T")[0] }
        : t
    );
    saveTrades(updated);
    setClosingId(null);
    setClosePrice("");
  }

  function handleDelete(id: string) {
    if (!confirm("האם אתה בטוח שברצונך למחוק עסקה זו?")) return;
    saveTrades(trades.filter((t) => t.id !== id));
  }

  const openTrades = trades.filter((t) => t.status === "open");
  const closedTrades = trades.filter((t) => t.status === "closed");

  const totalPnL = trades.reduce((sum, t) => sum + calcPnL(t), 0);
  const realizedPnL = closedTrades.reduce((sum, t) => sum + calcPnL(t), 0);
  const unrealizedPnL = openTrades.reduce((sum, t) => sum + calcPnL(t), 0);

  const wins = closedTrades.filter((t) => calcPnL(t) > 0).length;
  const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0;

  const rValues = closedTrades.map((t) => calcR(t)).filter((r): r is number => r !== null);
  const avgR = rValues.length > 0 ? rValues.reduce((a, b) => a + b, 0) / rValues.length : 0;

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-gray-400 text-center py-12">טוען...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between" dir="rtl">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">יומן מסחר</h1>
            <p className="text-gray-400 text-sm">{trades.length} עסקאות סה״כ</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm cursor-pointer"
          >
            {showForm ? "✕ בטל" : "+ עסקה חדשה"}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <JournalEntry onAdd={handleAdd} />
        )}

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "רווח/הפסד כולל",
              value: `${totalPnL >= 0 ? "+" : ""}$${totalPnL.toFixed(2)}`,
              color: totalPnL >= 0 ? "text-emerald-400" : "text-rose-400",
              sub: "Total P&L",
            },
            {
              label: "ממומש",
              value: `${realizedPnL >= 0 ? "+" : ""}$${realizedPnL.toFixed(2)}`,
              color: realizedPnL >= 0 ? "text-emerald-400" : "text-rose-400",
              sub: "Realized P&L",
            },
            {
              label: "עסקאות פתוחות",
              value: `${openTrades.length}`,
              color: "text-white",
              sub: `Unrealized ${unrealizedPnL >= 0 ? "+" : ""}$${unrealizedPnL.toFixed(2)}`,
            },
            {
              label: "Win Rate",
              value: closedTrades.length > 0 ? `${winRate}%` : "–",
              color: winRate >= 50 ? "text-emerald-400" : winRate > 0 ? "text-rose-400" : "text-gray-400",
              sub: avgR !== 0 ? `Avg R: ${avgR.toFixed(2)}R` : `${closedTrades.length} עסקאות סגורות`,
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-800 rounded-xl border border-gray-700 p-4" dir="rtl">
              <div className="text-gray-400 text-xs mb-1">{stat.label}</div>
              <div className={`text-xl font-bold ${stat.color}`} dir="ltr">{stat.value}</div>
              <div className="text-gray-600 text-xs mt-1" dir="ltr">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Open positions */}
        <div>
          <h2 className="text-white font-semibold mb-3" dir="rtl">פוזיציות פתוחות ({openTrades.length})</h2>
          {openTrades.length === 0 ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center" dir="rtl">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-gray-500">אין פוזיציות פתוחות</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" dir="rtl">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-xs">
                      <th className="px-4 py-3 text-right">סימול</th>
                      <th className="px-4 py-3 text-right">כיוון</th>
                      <th className="px-4 py-3 text-right">כמות</th>
                      <th className="px-4 py-3 text-right">כניסה</th>
                      <th className="px-4 py-3 text-right">מחיר נוכחי</th>
                      <th className="px-4 py-3 text-right">רווח/הפסד</th>
                      <th className="px-4 py-3 text-right">תאריך</th>
                      <th className="px-4 py-3 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openTrades.map((trade) => {
                      const currentPrice = mockCurrentPrices[trade.symbol] ?? trade.entryPrice;
                      const pnl = calcPnL(trade);
                      const pnlPct = ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100 * (trade.direction === "Short" ? -1 : 1);

                      return (
                        <tr key={trade.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-white font-bold" dir="ltr">{trade.symbol}</span>
                            {trade.strategyType && (
                              <div className="text-gray-500 text-xs" dir="ltr">{trade.strategyType}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trade.direction === "Long" ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"}`} dir="ltr">
                              {trade.direction}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300" dir="ltr">{trade.quantity}</td>
                          <td className="px-4 py-3 text-gray-300" dir="ltr">${trade.entryPrice}</td>
                          <td className="px-4 py-3 text-white font-semibold" dir="ltr">${currentPrice}</td>
                          <td className="px-4 py-3">
                            <div className={`font-semibold ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`} dir="ltr">
                              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                            </div>
                            <div className={`text-xs ${pnl >= 0 ? "text-emerald-500" : "text-rose-500"}`} dir="ltr">
                              {pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs" dir="ltr">{trade.entryDate}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {closingId === trade.id ? (
                                <div className="flex items-center gap-1" dir="ltr">
                                  <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Exit price"
                                    value={closePrice}
                                    onChange={(e) => setClosePrice(e.target.value)}
                                    className="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-blue-500"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleClose(trade.id)}
                                    className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold cursor-pointer"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => { setClosingId(null); setClosePrice(""); }}
                                    className="text-gray-500 hover:text-gray-400 text-xs cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => { setClosingId(trade.id); setClosePrice(currentPrice.toString()); }}
                                    className="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
                                  >
                                    סגור
                                  </button>
                                  <button
                                    onClick={() => handleDelete(trade.id)}
                                    className="text-gray-500 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                                  >
                                    מחק
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Closed trades */}
        {closedTrades.length > 0 && (
          <div>
            <h2 className="text-white font-semibold mb-3" dir="rtl">עסקאות סגורות ({closedTrades.length})</h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" dir="rtl">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-xs">
                      <th className="px-4 py-3 text-right">סימול</th>
                      <th className="px-4 py-3 text-right">כיוון</th>
                      <th className="px-4 py-3 text-right">כמות</th>
                      <th className="px-4 py-3 text-right">כניסה</th>
                      <th className="px-4 py-3 text-right">יציאה</th>
                      <th className="px-4 py-3 text-right">רווח/הפסד</th>
                      <th className="px-4 py-3 text-right">R Multiple</th>
                      <th className="px-4 py-3 text-right">תאריך</th>
                      <th className="px-4 py-3 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closedTrades.map((trade) => {
                      const pnl = calcPnL(trade);
                      const r = calcR(trade);

                      return (
                        <tr key={trade.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-white font-bold" dir="ltr">{trade.symbol}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trade.direction === "Long" ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"}`} dir="ltr">
                              {trade.direction}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300" dir="ltr">{trade.quantity}</td>
                          <td className="px-4 py-3 text-gray-300" dir="ltr">${trade.entryPrice}</td>
                          <td className="px-4 py-3 text-gray-300" dir="ltr">${trade.exitPrice}</td>
                          <td className="px-4 py-3">
                            <span className={`font-semibold ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`} dir="ltr">
                              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {r !== null ? (
                              <span className={`text-xs font-semibold ${r >= 0 ? "text-emerald-400" : "text-rose-400"}`} dir="ltr">
                                {r >= 0 ? "+" : ""}{r.toFixed(2)}R
                              </span>
                            ) : (
                              <span className="text-gray-500 text-xs">–</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs" dir="ltr">{trade.exitDate}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDelete(trade.id)}
                              className="text-gray-500 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                            >
                              מחק
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {trades.length === 0 && !showForm && (
          <div className="text-center py-16" dir="rtl">
            <div className="text-5xl mb-4">📓</div>
            <h3 className="text-white font-semibold text-lg mb-2">יומן המסחר שלך ריק</h3>
            <p className="text-gray-400 mb-4">התחל לתעד עסקאות כדי לעקוב אחר הביצועים שלך</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
            >
              הוסף עסקה ראשונה
            </button>
          </div>
        )}
      </main>
    </>
  );
}
