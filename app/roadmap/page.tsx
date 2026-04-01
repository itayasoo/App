"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { roadmapPhases, phaseColors as phaseColorMap } from "@/lib/strategies";
import { RoadmapPhase } from "@/lib/trading-types";

const STORAGE_KEY = "tradeiq-roadmap-tasks";

type TaskProgress = Record<string, Record<number, boolean>>;

function PhaseCard({
  phase,
  taskProgress,
  onToggleTask,
  isCurrentPhase,
}: {
  phase: RoadmapPhase;
  taskProgress: TaskProgress;
  onToggleTask: (phaseId: number, taskIdx: number) => void;
  isCurrentPhase: boolean;
}) {
  const colors = phaseColorMap[phase.color];
  const phaseTasks = taskProgress[phase.id] ?? {};
  const completedCount = Object.values(phaseTasks).filter(Boolean).length;
  const totalTasks = phase.tasks.length;
  const progressPct = Math.round((completedCount / totalTasks) * 100);

  return (
    <div
      className={`bg-gray-800 rounded-xl border-2 overflow-hidden transition-all ${
        isCurrentPhase ? colors.border : "border-gray-700"
      }`}
    >
      {/* Phase header */}
      <div className={`p-5 ${isCurrentPhase ? colors.bg : ""}`}>
        <div className="flex items-start justify-between mb-3" dir="rtl">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ${colors.badge}`}
            >
              {phase.id}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{phase.titleHebrew}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs font-medium ${colors.text}`}>{phase.months}</span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-400 text-xs" dir="ltr">{phase.capital}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isCurrentPhase && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${colors.badge}`}>
                שלב נוכחי
              </span>
            )}
          </div>
        </div>

        {/* Goal */}
        <div className={`text-sm ${colors.text} mb-4 font-medium`} dir="rtl">
          מטרה: {phase.goalHebrew}
        </div>

        {/* Progress bar */}
        <div className="mb-1 flex items-center justify-between" dir="rtl">
          <span className="text-gray-400 text-xs">התקדמות</span>
          <span className={`text-xs font-bold ${colors.text}`} dir="ltr">{completedCount}/{totalTasks}</span>
        </div>
        <div className="bg-gray-700 rounded-full h-2 overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colors.badge}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="p-5 pt-0 space-y-2">
        {phase.tasks.map((task, idx) => {
          const isDone = phaseTasks[idx] === true;
          return (
            <button
              key={idx}
              onClick={() => onToggleTask(phase.id, idx)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-right cursor-pointer ${
                isDone ? "bg-gray-700/50" : "bg-gray-700/20 hover:bg-gray-700/40"
              }`}
              dir="rtl"
            >
              <div
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  isDone ? `${colors.badge} border-transparent` : "border-gray-600"
                }`}
              >
                {isDone && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${isDone ? "text-gray-500 line-through" : "text-gray-300"}`}>
                {task.titleHebrew}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [taskProgress, setTaskProgress] = useState<TaskProgress>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setTaskProgress(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  function handleToggleTask(phaseId: number, taskIdx: number) {
    const updated: TaskProgress = {
      ...taskProgress,
      [phaseId]: {
        ...(taskProgress[phaseId] ?? {}),
        [taskIdx]: !(taskProgress[phaseId]?.[taskIdx] ?? false),
      },
    };
    setTaskProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Determine current phase based on completed tasks
  function getCurrentPhase(): number {
    for (let i = roadmapPhases.length - 1; i >= 0; i--) {
      const phase = roadmapPhases[i];
      const phaseTasks = taskProgress[phase.id] ?? {};
      const completedCount = Object.values(phaseTasks).filter(Boolean).length;
      if (completedCount > 0) return phase.id;
    }
    return 1;
  }

  const currentPhase = mounted ? getCurrentPhase() : 1;

  // Overall progress
  const totalTasks = roadmapPhases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = roadmapPhases.reduce((sum, phase) => {
    const phaseTasks = taskProgress[phase.id] ?? {};
    return sum + Object.values(phaseTasks).filter(Boolean).length;
  }, 0);
  const overallPct = Math.round((completedTasks / totalTasks) * 100);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div dir="rtl">
          <h1 className="text-2xl font-bold text-white mb-1">מפת דרכים למסחר</h1>
          <p className="text-gray-400 text-sm">4 שלבים להפוך לטריידר מקצועי עם Interactive Brokers</p>
        </div>

        {/* Overall progress */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-xl border border-gray-700 p-5" dir="rtl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">התקדמות כוללת</h3>
            <span className="text-gray-400 text-sm" dir="ltr">{completedTasks}/{totalTasks} משימות</span>
          </div>
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{overallPct}% הושלם</span>
            <span dir="ltr">Phase {currentPhase} of 4</span>
          </div>
        </div>

        {/* Timeline overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {roadmapPhases.map((phase) => {
            const colors = phaseColorMap[phase.color];
            const phaseTasks = taskProgress[phase.id] ?? {};
            const completedCount = Object.values(phaseTasks).filter(Boolean).length;
            const isActive = phase.id === currentPhase;

            return (
              <div
                key={phase.id}
                className={`bg-gray-800 rounded-xl border p-3 text-center transition-all ${
                  isActive ? `border-2 ${colors.border}` : "border-gray-700"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm ${colors.badge}`}
                >
                  {phase.id}
                </div>
                <div className="text-white text-xs font-semibold mb-0.5 leading-tight" dir="rtl">
                  {phase.titleHebrew}
                </div>
                <div className="text-gray-500 text-xs mb-2" dir="ltr">{phase.months}</div>
                <div className={`text-xs font-bold ${colors.text}`} dir="ltr">
                  {completedCount}/{phase.tasks.length}
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmapPhases.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              taskProgress={taskProgress}
              onToggleTask={handleToggleTask}
              isCurrentPhase={phase.id === currentPhase}
            />
          ))}
        </div>

        {/* Tips section */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5" dir="rtl">
          <h3 className="text-white font-semibold mb-4">עצות לדרך</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: "📚",
                title: "למד לפני שאתה סוחר",
                desc: "קרא לפחות 2-3 ספרים על ניתוח טכני לפני שאתה מתחיל להפקיד כסף אמיתי.",
              },
              {
                icon: "📊",
                title: "Paper Trading קודם",
                desc: "השתמש בסימולטור של IBKR לפחות חודש לפני מסחר אמיתי. ה-paper trading חינמי.",
              },
              {
                icon: "📖",
                title: "יומן הוא הכי חשוב",
                desc: "כל עסקה - רשום מה ראית, למה נכנסת, מה קרה. זה הדרך היחידה לשפר.",
              },
              {
                icon: "🛡️",
                title: "הגן על ההון שלך",
                desc: "אסור לסכן יותר מ-2% בעסקה אחת. ההפסד הכי גדול שלא ניתן לשרוד - הוא שמסיים את המסחר.",
              },
            ].map((tip) => (
              <div key={tip.title} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm mb-0.5">{tip.title}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IBKR specific */}
        <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-xl p-5" dir="rtl">
          <h3 className="text-indigo-400 font-semibold mb-3">Interactive Brokers - הגדרת חשבון</h3>
          <div className="space-y-2">
            {[
              "פתח חשבון Individual בinteractivebrokers.com",
              "הורד את Trader Workstation (TWS) - הפלטפורמה הראשית",
              "הפעל paper trading כדי להתאמן ללא כסף אמיתי",
              "הגדר פקודות Market, Limit ו-Stop Orders",
              "הגדר alerts על מניות המעניינות אותך",
              "קרא את המדריך של IBKR לגבי מרג'ין ו-PDT rules",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                <span className="text-indigo-500 font-bold text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span className="text-gray-300">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
