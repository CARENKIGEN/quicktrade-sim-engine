
export interface MarketData {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  change: number;
  changePercent: number;
  lastUpdate: number;
  high24h: number;
  low24h: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  orders: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdate: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  quantity: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  timestamp: number;
  fillPrice?: number;
  fillQuantity?: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
}

export interface PerformanceMetrics {
  latency: number;
  ordersPerSecond: number;
  fillRate: number;
  totalTrades: number;
  uptime: number;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
