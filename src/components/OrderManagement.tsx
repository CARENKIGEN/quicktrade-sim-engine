
import React from 'react';
import { Order } from '@/types/trading';
import { Button } from '@/components/ui/button';
import { X, Clock, CheckCircle, XCircle } from 'lucide-react';

interface OrderManagementProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  onCancelOrder
}) => {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-terminal-warning" />;
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-bull-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-bear-500" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-terminal-accent" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-terminal-warning';
      case 'filled':
        return 'text-bull-500';
      case 'cancelled':
        return 'text-bear-500';
      case 'partial':
        return 'text-terminal-accent';
      default:
        return 'text-terminal-text';
    }
  };

  return (
    <div className="terminal-panel p-4 h-full">
      <h3 className="text-terminal-accent font-semibold text-lg mb-4">Order Management</h3>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center text-terminal-text/50 py-8">
            No orders placed
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-terminal-border rounded p-3 data-row">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold ${
                    order.side === 'buy' ? 'text-bull-500' : 'text-bear-500'
                  }`}>
                    {order.side.toUpperCase()}
                  </span>
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCancelOrder(order.id)}
                      className="h-6 w-6 p-0 hover:bg-bear-500/20"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                <div>
                  <div className="text-terminal-text/70 text-xs">Symbol</div>
                  <div>{order.symbol}</div>
                </div>
                <div>
                  <div className="text-terminal-text/70 text-xs">Type</div>
                  <div className="capitalize">{order.type}</div>
                </div>
                <div>
                  <div className="text-terminal-text/70 text-xs">Quantity</div>
                  <div>{order.quantity.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-terminal-text/70 text-xs">Price</div>
                  <div>{order.price ? `$${order.price.toFixed(2)}` : 'Market'}</div>
                </div>
              </div>
              
              {order.fillPrice && (
                <div className="mt-2 pt-2 border-t border-terminal-border">
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <div className="text-terminal-text/70 text-xs">Fill Price</div>
                      <div className="text-terminal-accent">${order.fillPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-terminal-text/70 text-xs">Filled</div>
                      <div className="text-terminal-accent">
                        {order.fillQuantity?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-2 text-xs text-terminal-text/50">
                {new Date(order.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
