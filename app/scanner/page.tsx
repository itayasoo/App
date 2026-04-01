"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TradeCard from "@/components/TradeCard";
import { RiskLevel, StrategyType, Direction, JournalTrade, TradeSetup } from "@/lib/trading-types";
import { tradeSetups } from "@/lib/mock-market-data";

const allStrategies: StrategyType[] = ["Momentum", "Mean Reversion", "Options", "ETF Rotation"];
const allRisks: RiskLevel[] = ["Conservative", "Moderate", "Aggressive"];
const allDirections: Direction[] = ["Long", "Short"];

function Badge({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
        active
          ? "bg-blue-600 border-blue-600 text-white"
          : "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function ScannerPage() {
  const [selectedStrategies, setSelectedStrategies] = useState<StrategyType[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<RiskLevel[]>([]);
  const [selectedDirections, setSelectedDirections] = useState<Direction[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const savedTrades = localStorage.getItem("tradeiq-journal");
    if (savedTrades) {
      try {
        const trades: JournalTrade[] = JSON.parse(savedTrades);
        const ids = new Set(trades.map((t) => t.symbol + "-" + t.entryDate));
        setAddedIds(ids);
      } catch { /* ignore */ }
    }
  }, []);

  function toggleFilter<T>(arr: T[], item: T, setter: (v: T[]) => void) {
    if (arr.includes(item)) {
      setter(arr.filter((i) => i !== item));
    } else {
      setter([...arr, item]);
    }
  }

  function clearFilters() {
    setSelectedStrategies([]);
    setSelectedRisks([]);
    setSelectedDirections([]);
  }

  const filtered = tradeSetups.filter((t) => {
    if (selectedStrategies.length > 0 && !selectedStrategies.includes(t.strategyType)) return false;
    if (selectedRisks.length > 0 && !selectedRisks.includes(t.riskLevel)) return false;
    if (selectedDirections.length > 0 && !selectedDirections.includes(t.direction)) return false;
    return true;
  });

  function handleAddToJournal(trade: TradeSetup) {
    const today = new Date().toISOString().split("T")[0];
    const savedTrades = localStorage.getItem("tradeiq-journal");
    let trades: JournalTrade[] = [];
    if (savedTrades) {
      try { trades = JSON.parse(savedTrades); } catch { /* ignore */ }
    }

    const newTrade: JournalTrade = {
      id: crypto.randomUUID(),
      symbol: trade.symbol,
      direction: trade.direction,
      entryPrice: trade.entryPrice,
      quantity: 1,
      entryDate: today,
      notes: `Added from scanner: ${trade.strategyType}`,
      status: "open",
      stopLoss: trade.stopLoss,
      takeProfit: trade.takeProfit,
      strategyType: trade.strategyType,
    };

    trades.push(newTrade);
    localStorage.setItem("tradeiq-journal", JSON.stringify(trades));

    const key = trade.symbol + "-" + today;
    setAddedIds(new Set([...addedIds, key]));
    setNotification(`${trade.symbol} נוסף ליומן!`);
    setTimeout(() => setNotification(""), 3000);
  }

  const hasFilters = selectedStrategies.length > 0 || selectedRisks.length > 0 || selectedDirections.length > 0;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6" dir="rtl">
          <h1 className="text-2xl font-bold text-white mb-1">סורק עסקאות</h1>
          <p className="text-gray-400 text-sm">
            {filtered.length} הגדרות עסקה · מעודכן להיום
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-sm transition-all">
            ✓ {notification}
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6" dir="rtl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">סינון</h3>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-gray-400 hover:text-white text-xs transition-colors cursor-pointer"
              >
                נקה הכל
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-gray-500 text-xs mb-2">אסטרטגיה</div>
              <div className="flex flex-wrap gap-2" dir="ltr">
                {allStrategies.map((s) => (
                  <Badge
                    key={s}
                    active={selectedStrategies.includes(s)}
                    onClick={() => toggleFilter(selectedStrategies, s, setSelectedStrategies)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-2">רמת סיכון</div>
              <div className="flex flex-wrap gap-2" dir="ltr">
                {allRisks.map((r) => (
                  <Badge
                    key={r}
                    active={selectedRisks.includes(r)}
                    onClick={() => toggleFilter(selectedRisks, r, setSelectedRisks)}
                  >
                    {r}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-2">כיוון</div>
              <div className="flex flex-wrap gap-2" dir="ltr">
                {allDirections.map((d) => (
                  <Badge
                    key={d}
                    active={selectedDirections.includes(d)}
                    onClick={() => toggleFilter(selectedDirections, d, setSelectedDirections)}
                  >
                    {d}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trade grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500" dir="rtl">
            <div className="text-4xl mb-3">🔍</div>
            <p>לא נמצאו עסקאות עם הפילטרים הנוכחיים</p>
            <button onClick={clearFilters} className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors cursor-pointer">
              נקה פילטרים
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((trade) => (
              <TradeCard
                key={trade.id}
                trade={trade}
                onAddToJournal={handleAddToJournal}
              />
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-gray-800/50 rounded-xl border border-gray-700/50 p-4" dir="rtl">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">מקרא</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-purple-400 font-semibold">Momentum</span>
              <p className="text-gray-500 mt-0.5">מסחר עם הטרנד</p>
            </div>
            <div>
              <span className="text-cyan-400 font-semibold">Mean Reversion</span>
              <p className="text-gray-500 mt-0.5">חזרה לממוצע</p>
            </div>
            <div>
              <span className="text-indigo-400 font-semibold">ETF Rotation</span>
              <p className="text-gray-500 mt-0.5">סיבוב סקטורים</p>
            </div>
            <div>
              <span className="text-orange-400 font-semibold">Options</span>
              <p className="text-gray-500 mt-0.5">מינוף עם אופציות</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
