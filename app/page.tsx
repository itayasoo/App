"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import RiskSelector from "@/components/RiskSelector";
import TradeCard from "@/components/TradeCard";
import MarketOverview from "@/components/MarketOverview";
import ProgressTracker from "@/components/ProgressTracker";
import { RiskLevel, JournalTrade } from "@/lib/trading-types";
import { tradeSetups, getDailyTip, mockCurrentPrices } from "@/lib/mock-market-data";

function getPnL(trades: JournalTrade[]): number {
  let total = 0;
  for (const trade of trades) {
    const currentPrice = mockCurrentPrices[trade.symbol] ?? trade.entryPrice;
    if (trade.status === "closed" && trade.exitPrice !== undefined) {
      const pnl = trade.direction === "Long"
        ? (trade.exitPrice - trade.entryPrice) * trade.quantity
        : (trade.entryPrice - trade.exitPrice) * trade.quantity;
      total += pnl;
    } else if (trade.status === "open") {
      const pnl = trade.direction === "Long"
        ? (currentPrice - trade.entryPrice) * trade.quantity
        : (trade.entryPrice - currentPrice) * trade.quantity;
      total += pnl;
    }
  }
  return total;
}

export default function Dashboard() {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("Moderate");
  const [trades, setTrades] = useState<JournalTrade[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("tradeiq-risk") as RiskLevel | null;
    if (saved) setRiskLevel(saved);

    const savedTrades = localStorage.getItem("tradeiq-journal");
    if (savedTrades) {
      try { setTrades(JSON.parse(savedTrades)); } catch { /* ignore */ }
    }
  }, []);

  function handleRiskChange(level: RiskLevel) {
    setRiskLevel(level);
    localStorage.setItem("tradeiq-risk", level);
    // Trigger storage event for Navbar
    window.dispatchEvent(new StorageEvent("storage", { key: "tradeiq-risk" }));
  }

  const dailyTip = getDailyTip();

  // Filter top 3 recommendations for current risk level
  const riskOrder: Record<RiskLevel, RiskLevel[]> = {
    Conservative: ["Conservative"],
    Moderate: ["Conservative", "Moderate"],
    Aggressive: ["Conservative", "Moderate", "Aggressive"],
  };
  const allowedRiskLevels = riskOrder[riskLevel];
  const recommendations = tradeSetups
    .filter((t) => allowedRiskLevels.includes(t.riskLevel))
    .slice(0, 3);

  const totalPnL = mounted ? getPnL(trades) : 0;
  const openTrades = trades.filter((t) => t.status === "open");
  const closedTrades = trades.filter((t) => t.status === "closed");
  const wins = closedTrades.filter((t) => {
    if (t.exitPrice === undefined) return false;
    const pnl = t.direction === "Long"
      ? t.exitPrice - t.entryPrice
      : t.entryPrice - t.exitPrice;
    return pnl > 0;
  }).length;
  const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-400 text-sm font-medium" dir="ltr">Phase 1 Active</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">TradeIQ</h1>
          <p className="text-gray-400 text-lg" dir="rtl">המדריך האישי שלך למסחר חכם</p>
        </div>

        {/* Phase indicator */}
        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-800/30 rounded-xl p-4" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
            <div>
              <div className="text-white font-semibold">שלב נוכחי: יסודות המסחר</div>
              <div className="text-gray-400 text-sm">חודשים 1-3 · $0-$5,000 · ללמוד מבלי להפסיד הרבה</div>
            </div>
            <div className="mr-auto">
              <a
                href="/roadmap/"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                מפת דרכים מלאה ←
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Overview */}
            <MarketOverview />

            {/* Risk Selector */}
            <RiskSelector value={riskLevel} onChange={handleRiskChange} />

            {/* Today's recommendations */}
            <div>
              <div className="flex items-center justify-between mb-3" dir="rtl">
                <h2 className="text-white font-semibold text-lg">המלצות היום</h2>
                <a href="/scanner/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  כל העסקאות ←
                </a>
              </div>
              <div className="space-y-4">
                {recommendations.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} compact />
                ))}
                {recommendations.length === 0 && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
                    <p className="text-gray-400" dir="rtl">אין המלצות לרמת הסיכון הנוכחית</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Portfolio Summary */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4" dir="rtl">
              <h3 className="text-white font-semibold mb-4">סיכום תיק</h3>
              {!mounted || trades.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-gray-500 text-4xl mb-2">📈</div>
                  <p className="text-gray-500 text-sm">התיק ריק עדיין</p>
                  <a href="/journal/" className="text-blue-400 hover:text-blue-300 text-sm mt-2 block transition-colors">
                    הוסף עסקה ראשונה ←
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">רווח/הפסד כולל</span>
                    <span className={`font-bold text-lg ${totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`} dir="ltr">
                      {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">עסקאות פתוחות</span>
                    <span className="text-white font-semibold" dir="ltr">{openTrades.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">עסקאות סגורות</span>
                    <span className="text-white font-semibold" dir="ltr">{closedTrades.length}</span>
                  </div>
                  {closedTrades.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Win Rate</span>
                      <span className={`font-semibold ${winRate >= 50 ? "text-emerald-400" : "text-rose-400"}`} dir="ltr">
                        {winRate}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Progress Tracker */}
            <ProgressTracker currentPhase={1} />

            {/* Daily Tip */}
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-800/30 rounded-xl p-4" dir="rtl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <h3 className="text-indigo-400 font-semibold text-sm">טיפ היום</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{dailyTip.textHebrew}</p>
            </div>

            {/* Quick links */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4" dir="rtl">
              <h3 className="text-white font-semibold mb-3 text-sm">ניווט מהיר</h3>
              <div className="space-y-2">
                {[
                  { href: "/scanner/", label: "סורק עסקאות", icon: "🔍", desc: "8-10 הגדרות עסקה חיות" },
                  { href: "/journal/", label: "יומן מסחר", icon: "📖", desc: "מעקב אחר עסקאות" },
                  { href: "/roadmap/", label: "מפת דרכים", icon: "🗺️", desc: "4 שלבים ל-25% תשואה" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-700 transition-colors group"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <div>
                      <div className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">{link.label}</div>
                      <div className="text-gray-500 text-xs">{link.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
        <p dir="rtl">TradeIQ - מערכת תמיכת החלטות למסחר · לא ייעוץ השקעות</p>
        <p className="mt-1 text-xs text-gray-700">For educational purposes only. Not financial advice.</p>
      </footer>
    </>
  );
}
