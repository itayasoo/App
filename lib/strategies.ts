import { RoadmapPhase } from "./trading-types";

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 1,
    titleHebrew: "יסודות המסחר",
    months: "חודשים 1-3",
    capital: "$0 - $5,000",
    goalHebrew: "ללמוד מבלי להפסיד הרבה",
    color: "blue",
    tasks: [
      { titleHebrew: "ללמוד קריאת גרפים (Technical Analysis)", completed: false },
      { titleHebrew: "לבצע 20 עסקאות נייר (Paper Trading)", completed: false },
      { titleHebrew: "להגדיר חשבון Interactive Brokers", completed: false },
      { titleHebrew: "להבין סוגי פקודות (Market, Limit, Stop)", completed: false },
      { titleHebrew: "ללמוד על ניהול סיכונים ו-Position Sizing", completed: false },
      { titleHebrew: "לפתוח יומן מסחר", completed: false },
    ],
  },
  {
    id: 2,
    titleHebrew: "סחר בקטן",
    months: "חודשים 3-6",
    capital: "$5,000 - $20,000",
    goalHebrew: "תהליך עקבי ומתועד",
    color: "emerald",
    tasks: [
      { titleHebrew: "לבצע 50 עסקאות אמיתיות", completed: false },
      { titleHebrew: "לתעד כל עסקה ביומן", completed: false },
      { titleHebrew: "לפתח חוקי מסחר אישיים", completed: false },
      { titleHebrew: "לנתח את ה-Win Rate שלך", completed: false },
      { titleHebrew: "ללמוד על סקטורים וסיבוב סקטורים", completed: false },
      { titleHebrew: "להכיר את דוחות הרבעון", completed: false },
    ],
  },
  {
    id: 3,
    titleHebrew: "סקייל אפ",
    months: "חודשים 6-12",
    capital: "$20,000 - $50,000",
    goalHebrew: "תשואות חודשיות עקביות",
    color: "amber",
    tasks: [
      { titleHebrew: "להגדיל אסטרטגיות מנצחות", completed: false },
      { titleHebrew: "להוסיף אופציות לארסנל", completed: false },
      { titleHebrew: "לגוון בין סקטורים", completed: false },
      { titleHebrew: "ללמוד Swing Trading לעומת Day Trading", completed: false },
      { titleHebrew: "לבנות מערכת סינון עסקאות", completed: false },
      { titleHebrew: "לנתח 100 עסקאות עבר לדפוסים", completed: false },
    ],
  },
  {
    id: 4,
    titleHebrew: "שיטתי ואוטומטי",
    months: "שנה 2+",
    capital: "$50,000+",
    goalHebrew: "15-25% תשואה שנתית",
    color: "purple",
    tasks: [
      { titleHebrew: "גישה אלגוריתמית מלאה", completed: false },
      { titleHebrew: "Backtesting לאסטרטגיות", completed: false },
      { titleHebrew: "כללים שיטתיים ברורים", completed: false },
      { titleHebrew: "אוטומציה חלקית עם IBKR API", completed: false },
      { titleHebrew: "ניתוח ביצועים חודשי ורבעוני", completed: false },
      { titleHebrew: "בניית תיק מגוון ומנוהל", completed: false },
    ],
  },
];

export const phaseColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500",
    text: "text-blue-400",
    badge: "bg-blue-500",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500",
    text: "text-emerald-400",
    badge: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500",
    text: "text-amber-400",
    badge: "bg-amber-500",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500",
    text: "text-purple-400",
    badge: "bg-purple-500",
  },
};
