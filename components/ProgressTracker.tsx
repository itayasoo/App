"use client";

import { roadmapPhases, phaseColors } from "@/lib/strategies";

interface ProgressTrackerProps {
  currentPhase?: number;
}

const localColors: Record<string, { active: string; dot: string; bar: string }> = {
  blue: { active: "text-blue-400 border-blue-500 bg-blue-500/10", dot: "bg-blue-500", bar: "bg-blue-500" },
  emerald: { active: "text-emerald-400 border-emerald-500 bg-emerald-500/10", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  amber: { active: "text-amber-400 border-amber-500 bg-amber-500/10", dot: "bg-amber-500", bar: "bg-amber-500" },
  purple: { active: "text-purple-400 border-purple-500 bg-purple-500/10", dot: "bg-purple-500", bar: "bg-purple-500" },
};

// Suppress unused import lint - phaseColors available if needed later
void phaseColors;

export default function ProgressTracker({ currentPhase = 1 }: ProgressTrackerProps) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">מסע הלמידה שלך - Your Trading Journey</h3>

      {/* Phase progress bar */}
      <div className="flex items-center gap-1 mb-4">
        {roadmapPhases.map((phase, i) => {
          const colors = localColors[phase.color];
          const isActive = phase.id === currentPhase;
          const isDone = phase.id < currentPhase;

          return (
            <div key={phase.id} className="flex items-center flex-1">
              <div className="flex-1 relative">
                <div
                  className={`h-2 rounded-full ${isDone ? colors.bar : isActive ? colors.bar + " opacity-70" : "bg-gray-700"}`}
                />
                <div
                  className={`absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-gray-800 transition-all ${
                    isActive || isDone ? colors.dot : "bg-gray-600"
                  }`}
                />
              </div>
              {i < roadmapPhases.length - 1 && (
                <div className={`w-2 h-0.5 ${isDone ? "bg-gray-500" : "bg-gray-700"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase list */}
      <div className="space-y-2">
        {roadmapPhases.map((phase) => {
          const colors = localColors[phase.color];
          const isActive = phase.id === currentPhase;
          const isDone = phase.id < currentPhase;

          return (
            <div
              key={phase.id}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                isActive ? colors.active + " border" : isDone ? "border-gray-700 bg-gray-700/30" : "border-gray-700/50"
              }`}
            >
              <div className="flex items-center gap-2.5" dir="rtl">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    isActive || isDone ? colors.dot : "bg-gray-600"
                  }`}
                >
                  {isDone ? "✓" : phase.id}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isActive ? colors.active.split(" ")[0] : isDone ? "text-gray-400" : "text-gray-500"}`}>
                    {phase.titleHebrew}
                  </div>
                  <div className="text-xs text-gray-500" dir="ltr">{phase.months}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500" dir="ltr">{phase.capital}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
