
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

interface OrderEntryProps {
  symbol: string;
  currentPrice: number;
  onOrderSubmit: (order: Order) => void;
}

export const OrderEntry: React.FC<OrderEntryProps> = ({
  symbol,
  currentPrice,
  onOrderSubmit
}) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [type, setType] = useState<'market' | 'limit'>('limit');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(currentPrice.toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || (type === 'limit' && !price)) return;

    const order: Order = {
      id: uuidv4(),
      symbol,
      side,
      type,
      quantity: parseFloat(quantity),
      price: type === 'limit' ? parseFloat(price) : undefined,
      status: 'pending',
      timestamp: Date.now()
    };

    onOrderSubmit(order);
    
    // Reset form
    setQuantity('');
    if (type === 'limit') {
      setPrice(currentPrice.toFixed(2));
    }
  };

  return (
    <div className="terminal-panel p-4 h-full">
      <h3 className="text-terminal-accent font-semibold text-lg mb-4">Order Entry</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={side === 'buy' ? 'default' : 'outline'}
            className={`${side === 'buy' 
              ? 'bg-bull-500 hover:bg-bull-600 text-white' 
              : 'border-bull-500 text-bull-500 hover:bg-bull-500/10'
            }`}
            onClick={() => setSide('buy')}
          >
            BUY
          </Button>
          <Button
            type="button"
            variant={side === 'sell' ? 'default' : 'outline'}
            className={`${side === 'sell' 
              ? 'bg-bear-500 hover:bg-bear-600 text-white' 
              : 'border-bear-500 text-bear-500 hover:bg-bear-500/10'
            }`}
            onClick={() => setSide('sell')}
          >
            SELL
          </Button>
        </div>

        <div>
          <label className="block text-sm text-terminal-text/70 mb-2">Order Type</label>
          <Select value={type} onValueChange={(value: 'market' | 'limit') => setType(value)}>
            <SelectTrigger className="terminal-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market</SelectItem>
              <SelectItem value="limit">Limit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm text-terminal-text/70 mb-2">Symbol</label>
          <Input
            value={symbol}
            disabled
            className="terminal-input font-mono"
          />
        </div>

        <div>
          <label className="block text-sm text-terminal-text/70 mb-2">Quantity</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className="terminal-input font-mono"
            step="0.001"
            min="0"
          />
        </div>

        {type === 'limit' && (
          <div>
            <label className="block text-sm text-terminal-text/70 mb-2">Price</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="terminal-input font-mono"
              step="0.01"
              min="0"
            />
          </div>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            className={`w-full font-semibold ${
              side === 'buy'
                ? 'bg-bull-500 hover:bg-bull-600 text-white'
                : 'bg-bear-500 hover:bg-bear-600 text-white'
            }`}
            disabled={!quantity}
          >
            {side === 'buy' ? 'PLACE BUY ORDER' : 'PLACE SELL ORDER'}
          </Button>
        </div>

        <div className="text-xs text-terminal-text/50 pt-2">
          <div>Est. Total: ${type === 'market' 
            ? (parseFloat(quantity || '0') * currentPrice).toFixed(2)
            : (parseFloat(quantity || '0') * parseFloat(price || '0')).toFixed(2)
          }</div>
        </div>
      </form>
    </div>
  );
};
