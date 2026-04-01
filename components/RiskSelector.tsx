"use client";

import { RiskLevel } from "@/lib/trading-types";

interface RiskSelectorProps {
  value: RiskLevel;
  onChange: (level: RiskLevel) => void;
}

const levels: { level: RiskLevel; labelHebrew: string; description: string; color: string; bg: string; border: string }[] = [
  {
    level: "Conservative",
    labelHebrew: "שמרני",
    description: "מניות גדולות ויציבות, ETF",
    color: "text-blue-400",
    bg: "bg-blue-500",
    border: "border-blue-500",
  },
  {
    level: "Moderate",
    labelHebrew: "מאוזן",
    description: "מניות טק, מומנטום, R/R 2:1+",
    color: "text-amber-400",
    bg: "bg-amber-500",
    border: "border-amber-500",
  },
  {
    level: "Aggressive",
    labelHebrew: "אגרסיבי",
    description: "שורט, אופציות, תנודתיות גבוהה",
    color: "text-rose-400",
    bg: "bg-rose-500",
    border: "border-rose-500",
  },
];

export default function RiskSelector({ value, onChange }: RiskSelectorProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-3 text-sm">רמת סיכון - Risk Level</h3>
      <div className="grid grid-cols-3 gap-2">
        {levels.map(({ level, labelHebrew, description, color, bg, border }) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`relative p-3 rounded-lg border-2 transition-all text-right cursor-pointer ${
              value === level
                ? `${border} bg-gray-700`
                : "border-gray-600 hover:border-gray-500 bg-gray-750"
            }`}
          >
            {value === level && (
              <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${bg}`} />
            )}
            <div className={`text-sm font-bold ${value === level ? color : "text-gray-300"}`}>
              {labelHebrew}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 leading-tight">{description}</div>
            <div className={`text-xs mt-1 ${value === level ? color : "text-gray-600"}`}>{level}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
