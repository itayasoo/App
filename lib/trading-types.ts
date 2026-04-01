export type RiskLevel = "Conservative" | "Moderate" | "Aggressive";
export type Direction = "Long" | "Short";
export type StrategyType = "Momentum" | "Mean Reversion" | "Options" | "ETF Rotation";
export type TradeStatus = "open" | "closed";

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface TradeSetup {
  id: string;
  symbol: string;
  strategyType: StrategyType;
  direction: Direction;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  confidence: number; // 1-5
  riskLevel: RiskLevel;
  hebrewExplanation: string;
  educationalNote: string;
  sector: string;
}

export interface JournalTrade {
  id: string;
  symbol: string;
  direction: Direction;
  entryPrice: number;
  quantity: number;
  entryDate: string;
  exitPrice?: number;
  exitDate?: string;
  status: TradeStatus;
  notes: string;
  stopLoss?: number;
  takeProfit?: number;
  strategyType?: StrategyType;
}

export interface PortfolioStats {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  averageR: number;
}

export interface RoadmapPhase {
  id: number;
  titleHebrew: string;
  months: string;
  capital: string;
  goalHebrew: string;
  tasks: { titleHebrew: string; completed: boolean }[];
  color: string;
}

export interface DailyTip {
  id: number;
  textHebrew: string;
}
