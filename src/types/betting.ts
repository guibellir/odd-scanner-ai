export interface BettingHouse {
  id: string;
  name: string;
  logo?: string;
}

export interface BetData {
  id: string;
  bettingHouse: BettingHouse;
  betType: string;
  odds: number;
  amount: number;
  potentialProfit: number;
  gameDate: Date;
  status: 'pending' | 'won' | 'lost' | 'returned';
  createdAt: Date;
}

export interface BetSet {
  id: string;
  bets: [BetData, BetData]; // Always exactly 2 bets
  totalAmount: number;
  actualProfit: number;
  status: 'pending' | 'resolved';
  resolvedAt?: Date;
}

export interface OCRExtractedData {
  bettingHouse: string;
  betType: string;
  odds: string;
  amount: string;
  potentialProfit: string;
}