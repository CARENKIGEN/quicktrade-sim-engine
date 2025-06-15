
import React from 'react';
import { OrderBook as OrderBookType } from '@/types/trading';

interface OrderBookProps {
  orderBook: OrderBookType | undefined;
  symbol: string;
}

export const OrderBook: React.FC<OrderBookProps> = ({ orderBook, symbol }) => {
  if (!orderBook) {
    return (
      <div className="terminal-panel p-4 h-full flex items-center justify-center">
        <div className="text-terminal-text/50">No order book data</div>
      </div>
    );
  }

  const maxSize = Math.max(
    ...orderBook.bids.slice(0, 10).map(b => b.size),
    ...orderBook.asks.slice(0, 10).map(a => a.size)
  );

  return (
    <div className="terminal-panel p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-terminal-accent font-semibold text-lg">Order Book</h3>
        <span className="text-sm text-terminal-text/70 font-mono">{symbol}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs text-terminal-text/70 mb-2 px-2">
        <div>Price</div>
        <div className="text-center">Size</div>
        <div className="text-right">Orders</div>
      </div>
      
      {/* Asks (sells) */}
      <div className="space-y-1 mb-4">
        {orderBook.asks.slice(0, 10).reverse().map((ask, index) => (
          <div key={`ask-${index}`} className="relative">
            <div 
              className="absolute inset-0 bg-bear-500/10 rounded"
              style={{ width: `${(ask.size / maxSize) * 100}%` }}
            />
            <div className="relative grid grid-cols-3 gap-2 text-sm py-1 px-2 font-mono">
              <div className="text-bear-500 font-medium">{ask.price.toFixed(2)}</div>
              <div className="text-center">{ask.size.toLocaleString()}</div>
              <div className="text-right text-terminal-text/70">{ask.orders}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Spread */}
      <div className="border-t border-b border-terminal-border py-2 mb-4">
        <div className="text-center text-sm text-terminal-accent font-mono">
          Spread: ${(orderBook.asks[0].price - orderBook.bids[0].price).toFixed(2)}
        </div>
      </div>
      
      {/* Bids (buys) */}
      <div className="space-y-1">
        {orderBook.bids.slice(0, 10).map((bid, index) => (
          <div key={`bid-${index}`} className="relative">
            <div 
              className="absolute inset-0 bg-bull-500/10 rounded"
              style={{ width: `${(bid.size / maxSize) * 100}%` }}
            />
            <div className="relative grid grid-cols-3 gap-2 text-sm py-1 px-2 font-mono">
              <div className="text-bull-500 font-medium">{bid.price.toFixed(2)}</div>
              <div className="text-center">{bid.size.toLocaleString()}</div>
              <div className="text-right text-terminal-text/70">{bid.orders}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
