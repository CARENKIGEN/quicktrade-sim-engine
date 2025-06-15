
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { MarketData } from '@/types/trading';

interface TradingChartProps {
  marketData: MarketData;
  priceHistory: Array<{ timestamp: number; price: number }>;
}

export const TradingChart: React.FC<TradingChartProps> = ({ marketData, priceHistory }) => {
  const chartData = useMemo(() => {
    return priceHistory.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString(),
      price: point.price,
      timestamp: point.timestamp
    }));
  }, [priceHistory]);

  const minPrice = Math.min(...priceHistory.map(p => p.price)) * 0.999;
  const maxPrice = Math.max(...priceHistory.map(p => p.price)) * 1.001;

  return (
    <div className="terminal-panel p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-terminal-accent font-semibold text-lg">Price Chart</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-terminal-text font-mono">{marketData.symbol}</span>
          <span className={`text-sm font-mono ${
            marketData.change >= 0 ? 'text-bull-500' : 'text-bear-500'
          }`}>
            ${marketData.price.toFixed(2)} ({marketData.change >= 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#e5e5e5' }}
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#e5e5e5' }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={marketData.change >= 0 ? '#22c55e' : '#ef4444'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#00ff88', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
        <div>
          <div className="text-terminal-text/70 text-xs">24h High</div>
          <div className="font-mono text-bull-500">${marketData.high24h.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-terminal-text/70 text-xs">24h Low</div>
          <div className="font-mono text-bear-500">${marketData.low24h.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-terminal-text/70 text-xs">Volume</div>
          <div className="font-mono">{(marketData.volume / 1000).toFixed(0)}K</div>
        </div>
        <div>
          <div className="text-terminal-text/70 text-xs">Spread</div>
          <div className="font-mono">${(marketData.ask - marketData.bid).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
