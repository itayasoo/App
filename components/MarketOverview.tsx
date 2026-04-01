"use client";

import { marketIndices } from "@/lib/mock-market-data";

export default function MarketOverview() {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
        Market Overview
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {marketIndices.map((index) => {
          const isVix = index.symbol === "VIX";
          const isPositive = index.change >= 0;
          // For VIX, lower is "good" (green = fear is falling)
          const isGood = isVix ? !isPositive : isPositive;

          return (
            <div key={index.symbol} className="bg-gray-700/50 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">{index.name}</div>
              <div className="text-white font-bold text-base" dir="ltr">
                {index.price.toFixed(2)}
              </div>
              <div
                className={`text-xs font-semibold mt-0.5 ${isGood ? "text-emerald-400" : "text-rose-400"}`}
                dir="ltr"
              >
                {isPositive ? "+" : ""}{index.change.toFixed(2)} ({isPositive ? "+" : ""}{index.changePercent.toFixed(2)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
