export interface TenantTheme {
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  borderColor: string;
  textColor: string;
  mutedColor: string;
  fontFamily?: string;
}

export interface CurrencyPair {
  id: string;
  base: string;
  quote: string;
  bid: number;
  ask: number;
  spread: number;
  change24h: number;
  changePercent: number;
}

export type TradeDirection = 'BUY' | 'SELL';

export interface Trade {
  id: string;
  pair: string;
  direction: TradeDirection;
  amount: number;
  rate: number;
  total: number;
  timestamp: Date;
  status: 'EXECUTED' | 'PENDING' | 'CANCELLED';
}

export interface TradeFormData {
  pair: CurrencyPair;
  direction: TradeDirection;
  amount: number;
}
