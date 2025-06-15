
import { useState, useCallback } from 'react';
import { Order, Position } from '@/types/trading';

export const useTradingEngine = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Record<string, Position>>({});

  const submitOrder = useCallback((order: Order) => {
    console.log('Submitting order:', order);
    
    // Simulate order processing with realistic latency
    setTimeout(() => {
      // Simulate fill probability (95% for market orders, 85% for limit orders)
      const fillProbability = order.type === 'market' ? 0.95 : 0.85;
      const shouldFill = Math.random() < fillProbability;
      
      if (shouldFill) {
        const fillPrice = order.type === 'market' 
          ? order.price! + (Math.random() - 0.5) * 0.01 // Market slippage
          : order.price!;
        
        const filledOrder: Order = {
          ...order,
          status: 'filled',
          fillPrice,
          fillQuantity: order.quantity
        };
        
        setOrders(prev => prev.map(o => o.id === order.id ? filledOrder : o));
        
        // Update positions
        setPositions(prev => {
          const current = prev[order.symbol] || {
            symbol: order.symbol,
            quantity: 0,
            avgPrice: 0,
            marketValue: 0,
            unrealizedPnL: 0,
            realizedPnL: 0
          };
          
          const newQuantity = order.side === 'buy' 
            ? current.quantity + order.quantity
            : current.quantity - order.quantity;
            
          const newAvgPrice = newQuantity !== 0
            ? ((current.avgPrice * Math.abs(current.quantity)) + (fillPrice * order.quantity * (order.side === 'buy' ? 1 : -1))) / Math.abs(newQuantity)
            : 0;
          
          return {
            ...prev,
            [order.symbol]: {
              ...current,
              quantity: newQuantity,
              avgPrice: newAvgPrice,
              marketValue: newQuantity * fillPrice
            }
          };
        });
      } else {
        // Order remains pending or gets cancelled
        const updatedOrder: Order = {
          ...order,
          status: Math.random() < 0.3 ? 'cancelled' : 'pending'
        };
        
        setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
      }
    }, Math.random() * 100 + 50); // 50-150ms latency
    
    // Add order to list immediately
    setOrders(prev => [...prev, order]);
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    console.log('Cancelling order:', orderId);
    
    setOrders(prev => prev.map(order => 
      order.id === orderId && order.status === 'pending'
        ? { ...order, status: 'cancelled' }
        : order
    ));
  }, []);

  return {
    orders,
    positions,
    submitOrder,
    cancelOrder
  };
};
