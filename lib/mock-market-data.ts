import { MarketIndex, TradeSetup, DailyTip } from "./trading-types";

export const marketIndices: MarketIndex[] = [
  { symbol: "SPY", name: "S&P 500", price: 580.42, change: 3.21, changePercent: 0.56 },
  { symbol: "QQQ", name: "NASDAQ", price: 499.87, change: 5.43, changePercent: 1.1 },
  { symbol: "VIX", name: "VIX", price: 18.2, change: -0.8, changePercent: -4.2 },
];

export const mockCurrentPrices: Record<string, number> = {
  AAPL: 240.15,
  MSFT: 421.33,
  NVDA: 140.52,
  AMD: 131.28,
  TSLA: 281.44,
  META: 622.87,
  SPY: 580.42,
  QQQ: 499.87,
};

export const tradeSetups: TradeSetup[] = [
  {
    id: "1",
    symbol: "NVDA",
    strategyType: "Momentum",
    direction: "Long",
    entryPrice: 138,
    stopLoss: 133,
    takeProfit: 150,
    riskReward: 2.4,
    confidence: 4,
    riskLevel: "Moderate",
    hebrewExplanation:
      "NVDA מראה תנועה חזקה לאחר פריצת התנגדות מרכזית. ה-AI ממשיך לצמוח ו-NVDA היא המוביל. כניסה עם סטופ מתחת לתמיכה של 133.",
    educationalNote:
      "Momentum trading: Trading in the direction of a strong trend. We enter after a breakout above resistance, with a stop below the prior support level.",
    sector: "Technology",
  },
  {
    id: "2",
    symbol: "SPY",
    strategyType: "ETF Rotation",
    direction: "Long",
    entryPrice: 578,
    stopLoss: 568,
    takeProfit: 600,
    riskReward: 2.2,
    confidence: 3,
    riskLevel: "Conservative",
    hebrewExplanation:
      "S&P 500 בטרנד עולה. מתאים למתחילים - פחות תנודתי. תמיכה חזקה ב-568.",
    educationalNote:
      "ETF Rotation: Using broad market ETFs to capture trends with lower volatility than individual stocks. SPY tracks the S&P 500 index.",
    sector: "ETF",
  },
  {
    id: "3",
    symbol: "TSLA",
    strategyType: "Mean Reversion",
    direction: "Short",
    entryPrice: 285,
    stopLoss: 295,
    takeProfit: 260,
    riskReward: 2.5,
    confidence: 3,
    riskLevel: "Aggressive",
    hebrewExplanation:
      "TSLA התנפחה ב-15% בשבוע האחרון ללא קטליזטור. RSI מעל 75 - אזור קניית יתר. מתאים לטריידרים מנוסים בלבד.",
    educationalNote:
      "Mean Reversion: When a stock moves too far from its average, it tends to revert back. RSI above 70 signals overbought conditions.",
    sector: "Automotive",
  },
  {
    id: "4",
    symbol: "AAPL",
    strategyType: "Momentum",
    direction: "Long",
    entryPrice: 238,
    stopLoss: 232,
    takeProfit: 252,
    riskReward: 2.3,
    confidence: 4,
    riskLevel: "Conservative",
    hebrewExplanation:
      "AAPL שוברת מעל ממוצע נע של 50 ימים. מכירות iPhone חזקות. סיכון נמוך יחסית עם פוטנציאל טוב.",
    educationalNote:
      "Moving Average Breakout: When price crosses above the 50-day MA, it signals a potential trend change. AAPL is a blue-chip stock with strong fundamentals.",
    sector: "Technology",
  },
  {
    id: "5",
    symbol: "QQQ",
    strategyType: "ETF Rotation",
    direction: "Long",
    entryPrice: 498,
    stopLoss: 488,
    takeProfit: 525,
    riskReward: 2.7,
    confidence: 4,
    riskLevel: "Moderate",
    hebrewExplanation:
      "NASDAQ בתנועה חזקה על רקע תוצאות טכנולוגיה. QQQ פחות תנודתי מ-NVDA עם חשיפה לאותו טרנד.",
    educationalNote:
      "ETF Rotation: QQQ tracks the Nasdaq-100 index, giving exposure to top tech companies. Lower risk than individual stocks while capturing the tech trend.",
    sector: "ETF",
  },
  {
    id: "6",
    symbol: "META",
    strategyType: "Momentum",
    direction: "Long",
    entryPrice: 618,
    stopLoss: 605,
    takeProfit: 655,
    riskReward: 2.8,
    confidence: 4,
    riskLevel: "Moderate",
    hebrewExplanation:
      "META הכתה תחזיות בדוחות הרבעון. מחזיר רכישות מניות. ברייקאאוט מעל רמת 615.",
    educationalNote:
      "Earnings Momentum: After strong earnings beats, stocks often continue higher as analysts revise estimates upward. Stock buybacks reduce supply and support prices.",
    sector: "Technology",
  },
  {
    id: "7",
    symbol: "AMD",
    strategyType: "Mean Reversion",
    direction: "Long",
    entryPrice: 128,
    stopLoss: 122,
    takeProfit: 145,
    riskReward: 2.8,
    confidence: 3,
    riskLevel: "Moderate",
    hebrewExplanation:
      "AMD ירדה חזק ב-20% מהשיא ללא שינוי בפונדמנטלס. מחיר אטרקטיבי לכניסה. תמיכה חזקה ב-122.",
    educationalNote:
      "Mean Reversion Long: When a fundamentally strong stock drops significantly without a catalyst, it often bounces back. Look for support levels to define your stop.",
    sector: "Technology",
  },
  {
    id: "8",
    symbol: "MSFT",
    strategyType: "Momentum",
    direction: "Long",
    entryPrice: 418,
    stopLoss: 408,
    takeProfit: 445,
    riskReward: 2.7,
    confidence: 5,
    riskLevel: "Conservative",
    hebrewExplanation:
      "MSFT - אחת המניות הבטוחות ביותר. Azure צומח, Copilot AI מוסיף הכנסות. מתאים לסחר ראשוני.",
    educationalNote:
      "Blue Chip Momentum: MSFT has multiple growth drivers - Azure cloud (growing 30%+ YoY), AI Copilot adoption, and Office 365 subscriptions. Lowest risk tech trade.",
    sector: "Technology",
  },
  {
    id: "9",
    symbol: "SPY",
    strategyType: "Options",
    direction: "Long",
    entryPrice: 578,
    stopLoss: 570,
    takeProfit: 595,
    riskReward: 2.1,
    confidence: 3,
    riskLevel: "Aggressive",
    hebrewExplanation:
      "קול אופציה על SPY - ניצול המומנטום של השוק עם סיכון מוגבל. מתאים רק למי שמבין אופציות.",
    educationalNote:
      "Options - Call Option: Buying a call option gives you the right to buy SPY at a fixed price. Higher leverage than owning the stock, but time decay works against you.",
    sector: "ETF",
  },
  {
    id: "10",
    symbol: "NVDA",
    strategyType: "Options",
    direction: "Long",
    entryPrice: 138,
    stopLoss: 130,
    takeProfit: 158,
    riskReward: 2.5,
    confidence: 3,
    riskLevel: "Aggressive",
    hebrewExplanation:
      "אופציות קול על NVDA ל-30 יום. ניצול תנועת AI עם מינוף. סיכון מוגבל לפרמיה ששולמה.",
    educationalNote:
      "Options Trading: Buying calls on NVDA provides leveraged exposure to AI momentum. Max loss is limited to the premium paid, but theta decay requires the move to happen quickly.",
    sector: "Technology",
  },
];

export const dailyTips: DailyTip[] = [
  { id: 1, textHebrew: "ניהול סיכונים הוא הכלי החשוב ביותר. אף פעם אל תסכן יותר מ-2% מהתיק בעסקה אחת." },
  { id: 2, textHebrew: "הגדר תמיד סטופ לוס לפני הכניסה לעסקה. לא אחריה." },
  { id: 3, textHebrew: "R/R (Risk/Reward) גבוה מ-2:1 הוא הכלל הזהב. אם לא - אל תיכנס." },
  { id: 4, textHebrew: "יומן מסחר הוא ההבדל בין טריידר מצליח לבין מי שמנחש. רשום הכל." },
  { id: 5, textHebrew: "VIX מעל 25 = שוק פחדני = הזדמנויות. VIX מתחת 15 = שוק רגוע = פחות הזדמנויות." },
  { id: 6, textHebrew: "אל תתאהב במניה. היא לא יודעת שאתה מחזיק אותה." },
  { id: 7, textHebrew: "הטריידרים הטובים ביותר מרוויחים 60% מהעסקאות שלהם - לא 100%." },
];

export function getDailyTip(): DailyTip {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  return dailyTips[dayOfYear % dailyTips.length];
}
