export interface BettingHouse {
  id: string;
  name: string;
  country?: string;
  logo?: string;
}

export interface BetData {
  id: string;
  bettingHouse: BettingHouse;
  betType: string; // Ex: H1(-5.5), H2(+5.5), 1X2, etc
  odds: number;
  amount: number;
  potentialProfit: number;
  actualProfit: number; // Lucro real calculado
  status: 'pending' | 'won' | 'lost' | 'returned';
  createdAt: Date;
}

export interface MatchInfo {
  id: string;
  teams: string; // Ex: "PSG Andebol - USAM Nimes"
  sport: string; // Ex: "Handebol"
  league: string; // Ex: "France - LNH Division 1" 
  eventDate: Date;
  platform: string; // Ex: "Surebet"
}

export interface BetPair {
  id: string;
  matchInfo: MatchInfo;
  bets: [BetData, BetData]; // Sempre exatamente 2 apostas opostas
  totalAmount: number;
  expectedProfit: number; // Lucro esperado da surebet
  actualProfit: number; // Lucro real após resolução
  profitPercentage: number; // Ex: 2.25%
  roi: number; // Ex: 414.19%
  status: 'pending' | 'resolved';
  resolvedAt?: Date;
  createdAt: Date;
}

export interface OCRExtractedData {
  platform: string; // Surebet, Betburger, etc
  teams: string;
  sport: string;
  league: string;
  eventDate: string;
  profitPercentage: string;
  roi: string;
  totalAmount: string;
  bet1: {
    bettingHouse: string;
    country: string;
    betType: string;
    odds: string;
    amount: string;
    profit: string;
  };
  bet2: {
    bettingHouse: string;
    country: string;
    betType: string;
    odds: string;
    amount: string;
    profit: string;
  };
}