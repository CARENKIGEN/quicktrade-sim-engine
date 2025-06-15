
import { useState, useEffect, useCallback } from 'react';
import { MarketData, OrderBook, PerformanceMetrics } from '@/types/trading';

const SYMBOLS = ['BTCUSD', 'ETHUSD', 'AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA', 'META'];

// Simulate network latency
const simulateLatency = () => Math.random() * 5 + 1; // 1-6ms

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [orderBooks, setOrderBooks] = useState<Record<string, OrderBook>>({});
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    latency: 0,
    ordersPerSecond: 0,
    fillRate: 0,
    totalTrades: 0,
    uptime: 0
  });

  // Initialize market data
  const initializeMarketData = useCallback(() => {
    const initialData: Record<string, MarketData> = {};
    const initialOrderBooks: Record<string, OrderBook> = {};

    SYMBOLS.forEach(symbol => {
      const basePrice = Math.random() * 1000 + 100;
      const spread = basePrice * 0.001; // 0.1% spread

      initialData[symbol] = {
        symbol,
        price: basePrice,
        bid: basePrice - spread / 2,
        ask: basePrice + spread / 2,
        volume: Math.floor(Math.random() * 1000000),
        change: 0,
        changePercent: 0,
        lastUpdate: Date.now(),
        high24h: basePrice * 1.05,
        low24h: basePrice * 0.95
      };

      // Generate order book
      const bids = [];
      const asks = [];
      
      for (let i = 0; i < 20; i++) {
        bids.push({
          price: basePrice - spread / 2 - (i * spread * 0.1),
          size: Math.floor(Math.random() * 1000) + 100,
          orders: Math.floor(Math.random() * 10) + 1
        });
        
        asks.push({
          price: basePrice + spread / 2 + (i * spread * 0.1),
          size: Math.floor(Math.random() * 1000) + 100,
          orders: Math.floor(Math.random() * 10) + 1
        });
      }

      initialOrderBooks[symbol] = {
        symbol,
        bids,
        asks,
        lastUpdate: Date.now()
      };
    });

    setMarketData(initialData);
    setOrderBooks(initialOrderBooks);
  }, []);

  // Update market data with realistic price movements
  const updateMarketData = useCallback(() => {
    const startTime = performance.now();
    
    setMarketData(prev => {
      const updated = { ...prev };
      
      Object.keys(updated).forEach(symbol => {
        const data = updated[symbol];
        const volatility = 0.002; // 0.2% volatility
        const priceChange = (Math.random() - 0.5) * volatility * data.price;
        const newPrice = Math.max(0.01, data.price + priceChange);
        
        const spread = newPrice * 0.001;
        
        updated[symbol] = {
          ...data,
          price: newPrice,
          bid: newPrice - spread / 2,
          ask: newPrice + spread / 2,
          change: newPrice - (data.price - data.change),
          changePercent: ((newPrice - (data.price - data.change)) / (data.price - data.change)) * 100,
          volume: data.volume + Math.floor(Math.random() * 1000),
          lastUpdate: Date.now(),
          high24h: Math.max(data.high24h, newPrice),
          low24h: Math.min(data.low24h, newPrice)
        };
      });
      
      return updated;
    });

    // Update order books
    setOrderBooks(prev => {
      const updated = { ...prev };
      
      Object.keys(updated).forEach(symbol => {
        const book = updated[symbol];
        const marketPrice = marketData[symbol]?.price || 100;
        
        // Simulate order book updates
        const bids = book.bids.map((bid, index) => ({
          ...bid,
          size: Math.max(50, bid.size + Math.floor((Math.random() - 0.5) * 200)),
          price: marketPrice * (1 - 0.001 - index * 0.0001)
        }));
        
        const asks = book.asks.map((ask, index) => ({
          ...ask,
          size: Math.max(50, ask.size + Math.floor((Math.random() - 0.5) * 200)),
          price: marketPrice * (1 + 0.001 + index * 0.0001)
        }));
        
        updated[symbol] = {
          ...book,
          bids,
          asks,
          lastUpdate: Date.now()
        };
      });
      
      return updated;
    });

    // Update performance metrics
    const endTime = performance.now();
    const latency = endTime - startTime + simulateLatency();
    
    setPerformance(prev => ({
      ...prev,
      latency,
      ordersPerSecond: Math.floor(Math.random() * 1000) + 500,
      fillRate: 95 + Math.random() * 5,
      totalTrades: prev.totalTrades + Math.floor(Math.random() * 10),
      uptime: prev.uptime + 0.1
    }));
  }, []);

  useEffect(() => {
    initializeMarketData();
    
    const interval = setInterval(updateMarketData, 100); // 10Hz updates
    
    return () => clearInterval(interval);
  }, [initializeMarketData, updateMarketData]);

  return {
    marketData,
    orderBooks,
    performance,
    symbols: SYMBOLS
  };
};
