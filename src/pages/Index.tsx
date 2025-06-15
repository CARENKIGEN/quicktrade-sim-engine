import React, { useState, useEffect } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { useTradingEngine } from '@/hooks/useTradingEngine';
import { MarketDataFeed } from '@/components/MarketDataFeed';
import { OrderBook } from '@/components/OrderBook';
import { OrderEntry } from '@/components/OrderEntry';
import { OrderManagement } from '@/components/OrderManagement';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';
import { TradingChart } from '@/components/TradingChart';
import { Terminal, Zap } from 'lucide-react';

const Index = () => {
  const { marketData, orderBooks, performance, symbols } = useMarketData();
  const { orders, positions, submitOrder, cancelOrder } = useTradingEngine();
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSD');
  const [priceHistory, setPriceHistory] = useState<Array<{ timestamp: number; price: number }>>([]);

  // Track price history for chart
  useEffect(() => {
    if (marketData[selectedSymbol]) {
      setPriceHistory(prev => {
        const newHistory = [...prev, {
          timestamp: Date.now(),
          price: marketData[selectedSymbol].price
        }];
        
        // Keep only last 50 points
        return newHistory.slice(-50);
      });
    }
  }, [marketData, selectedSymbol]);

  const currentMarketData = marketData[selectedSymbol];
  const currentOrderBook = orderBooks[selectedSymbol];

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-8 h-8 text-terminal-accent" />
            <h1 className="text-2xl font-bold text-terminal-accent">HFT Simulator</h1>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-terminal-surface rounded border border-terminal-accent/30">
            <Zap className="w-4 h-4 text-terminal-accent animate-pulse-glow" />
            <span className="text-sm font-medium text-terminal-accent">LIVE TRADING</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-terminal-text/70">
            Connected to: <span className="text-terminal-accent font-mono">SIMULATION</span>
          </div>
          <div className="text-terminal-text/70">
            Latency: <span className="text-bull-500 font-mono">{performance.latency.toFixed(2)}ms</span>
          </div>
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
        {/* Left Panel - Market Data & Performance */}
        <div className="col-span-3 space-y-4">
          <div className="h-1/2">
            <MarketDataFeed
              marketData={marketData}
              selectedSymbol={selectedSymbol}
              onSymbolSelect={setSelectedSymbol}
            />
          </div>
          <div className="h-1/2">
            <PerformanceMetrics metrics={performance} />
          </div>
        </div>

        {/* Center Panel - Chart & Order Book */}
        <div className="col-span-6 space-y-4">
          <div className="h-1/2">
            {currentMarketData && (
              <TradingChart
                marketData={currentMarketData}
                priceHistory={priceHistory}
              />
            )}
          </div>
          <div className="h-1/2">
            <OrderBook
              orderBook={currentOrderBook}
              symbol={selectedSymbol}
            />
          </div>
        </div>

        {/* Right Panel - Order Entry & Management */}
        <div className="col-span-3 space-y-4">
          <div className="h-1/2">
            {currentMarketData && (
              <OrderEntry
                symbol={selectedSymbol}
                currentPrice={currentMarketData.price}
                onOrderSubmit={submitOrder}
              />
            )}
          </div>
          <div className="h-1/2">
            <OrderManagement
              orders={orders}
              onCancelOrder={cancelOrder}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-terminal-surface border-t border-terminal-border px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-6">
            <span className="text-terminal-text/70">
              Symbols: <span className="text-terminal-accent">{symbols.length}</span>
            </span>
            <span className="text-terminal-text/70">
              Active Orders: <span className="text-terminal-accent">{orders.filter(o => o.status === 'pending').length}</span>
            </span>
            <span className="text-terminal-text/70">
              Positions: <span className="text-terminal-accent">{Object.keys(positions).length}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-terminal-text/70">
              Total Trades: <span className="text-terminal-accent">{performance.totalTrades}</span>
            </span>
            <span className="text-terminal-text/70">
              Uptime: <span className="text-bull-500">{Math.floor(performance.uptime / 60)}m</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
