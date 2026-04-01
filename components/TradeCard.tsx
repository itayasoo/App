"use client";

import { TradeSetup, RiskLevel } from "@/lib/trading-types";

interface TradeCardProps {
  trade: TradeSetup;
  onAddToJournal?: (trade: TradeSetup) => void;
  compact?: boolean;
}

const riskColors: Record<RiskLevel, string> = {
  Conservative: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  Moderate: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  Aggressive: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};

const strategyColors: Record<string, string> = {
  Momentum: "text-purple-400 bg-purple-400/10",
  "Mean Reversion": "text-cyan-400 bg-cyan-400/10",
  Options: "text-orange-400 bg-orange-400/10",
  "ETF Rotation": "text-indigo-400 bg-indigo-400/10",
};

function Stars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-0.5" dir="ltr">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? "text-amber-400 fill-amber-400" : "text-gray-600 fill-gray-600"}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TradeCard({ trade, onAddToJournal, compact = false }: TradeCardProps) {
  const isLong = trade.direction === "Long";
  const riskPerShare = Math.abs(trade.entryPrice - trade.stopLoss);
  const rewardPerShare = Math.abs(trade.takeProfit - trade.entryPrice);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`text-xl font-bold ${isLong ? "text-emerald-400" : "text-rose-400"}`} dir="ltr">
              {trade.symbol}
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${isLong ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" : "text-rose-400 bg-rose-400/10 border-rose-400/30"}`}
              dir="ltr"
            >
              {isLong ? "▲ Long" : "▼ Short"}
            </span>
          </div>
          <Stars count={trade.confidence} />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${strategyColors[trade.strategyType] || "text-gray-400 bg-gray-700"}`}>
            {trade.strategyType}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${riskColors[trade.riskLevel]}`}>
            {trade.riskLevel}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full text-gray-400 bg-gray-700">
            {trade.sector}
          </span>
        </div>

        {/* Price levels */}
        <div className="grid grid-cols-3 gap-2 mb-3" dir="ltr">
          <div className="bg-gray-700/50 rounded-lg p-2 text-center">
            <div className="text-gray-400 text-xs mb-0.5">Entry</div>
            <div className="text-white font-bold text-sm">${trade.entryPrice}</div>
          </div>
          <div className="bg-rose-900/20 rounded-lg p-2 text-center border border-rose-900/30">
            <div className="text-rose-400 text-xs mb-0.5">Stop Loss</div>
            <div className="text-rose-400 font-bold text-sm">${trade.stopLoss}</div>
          </div>
          <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-900/30">
            <div className="text-emerald-400 text-xs mb-0.5">Take Profit</div>
            <div className="text-emerald-400 font-bold text-sm">${trade.takeProfit}</div>
          </div>
        </div>

        {/* R/R and risk per share */}
        <div className="flex items-center justify-between text-sm mb-3" dir="ltr">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-gray-400 text-xs">R/R: </span>
              <span className="text-white font-bold">{trade.riskReward}:1</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Risk: </span>
              <span className="text-rose-400 font-semibold">${riskPerShare.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Reward: </span>
              <span className="text-emerald-400 font-semibold">${rewardPerShare.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Hebrew explanation */}
        <div className="bg-gray-700/30 rounded-lg p-3 mb-3" dir="rtl">
          <p className="text-gray-300 text-sm leading-relaxed">{trade.hebrewExplanation}</p>
        </div>

        {/* Educational note - only in full mode */}
        {!compact && (
          <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-3" dir="ltr">
            <div className="text-indigo-400 text-xs font-semibold mb-1">Educational Note</div>
            <p className="text-gray-400 text-xs leading-relaxed">{trade.educationalNote}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {onAddToJournal && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onAddToJournal(trade)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm cursor-pointer"
          >
            הוסף ליומן
          </button>
        </div>
      )}
    </div>
  );
}
