
import React from 'react';
import { MarketData } from '@/types/trading';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketDataFeedProps {
  marketData: Record<string, MarketData>;
  selectedSymbol: string;
  onSymbolSelect: (symbol: string) => void;
}

export const MarketDataFeed: React.FC<MarketDataFeedProps> = ({
  marketData,
  selectedSymbol,
  onSymbolSelect
}) => {
  return (
    <div className="terminal-panel p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-terminal-accent font-semibold text-lg">Market Data Feed</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-bull-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-terminal-text/70">LIVE</span>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {Object.values(marketData).map((data) => (
          <div
            key={data.symbol}
            className={`p-3 rounded border cursor-pointer transition-all duration-200 data-row
              ${selectedSymbol === data.symbol 
                ? 'border-terminal-accent bg-terminal-accent/10' 
                : 'border-terminal-border hover:border-terminal-accent/50'
              }`}
            onClick={() => onSymbolSelect(data.symbol)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-terminal-accent">{data.symbol}</span>
              <div className="flex items-center space-x-1">
                {data.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-bull-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-bear-500" />
                )}
                <span className={`text-sm font-medium ${
                  data.change >= 0 ? 'text-bull-500' : 'text-bear-500'
                }`}>
                  {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-terminal-text/70 text-xs">Price</div>
                <div className="font-mono font-semibold">
                  ${data.price.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-terminal-text/70 text-xs">Bid/Ask</div>
                <div className="font-mono text-xs">
                  <span className="text-bull-500">{data.bid.toFixed(2)}</span>
                  <span className="text-terminal-text/50 mx-1">/</span>
                  <span className="text-bear-500">{data.ask.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <div className="text-terminal-text/70 text-xs">Volume</div>
                <div className="font-mono text-xs">
                  {(data.volume / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
