
import React from 'react';
import { PerformanceMetrics as PerformanceMetricsType } from '@/types/trading';
import { Activity, Zap, Target, TrendingUp, Clock } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: PerformanceMetricsType;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 2) return 'text-bull-500';
    if (latency < 5) return 'text-terminal-warning';
    return 'text-bear-500';
  };

  return (
    <div className="terminal-panel p-4 h-full">
      <h3 className="text-terminal-accent font-semibold text-lg mb-4">Performance Metrics</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between p-3 bg-terminal-bg rounded">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-terminal-accent" />
            <div>
              <div className="text-sm text-terminal-text/70">Latency</div>
              <div className={`text-lg font-mono font-bold ${getLatencyColor(metrics.latency)}`}>
                {metrics.latency.toFixed(2)}ms
              </div>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            metrics.latency < 2 ? 'bg-bull-500' : 
            metrics.latency < 5 ? 'bg-terminal-warning' : 'bg-bear-500'
          } animate-pulse`} />
        </div>

        <div className="flex items-center justify-between p-3 bg-terminal-bg rounded">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-terminal-accent" />
            <div>
              <div className="text-sm text-terminal-text/70">Orders/Second</div>
              <div className="text-lg font-mono font-bold text-bull-500">
                {metrics.ordersPerSecond.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-terminal-bg rounded">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-terminal-accent" />
            <div>
              <div className="text-sm text-terminal-text/70">Fill Rate</div>
              <div className="text-lg font-mono font-bold text-bull-500">
                {metrics.fillRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-terminal-bg rounded">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-terminal-accent" />
            <div>
              <div className="text-sm text-terminal-text/70">Total Trades</div>
              <div className="text-lg font-mono font-bold text-terminal-accent">
                {metrics.totalTrades.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-terminal-bg rounded">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-terminal-accent" />
            <div>
              <div className="text-sm text-terminal-text/70">Uptime</div>
              <div className="text-lg font-mono font-bold text-terminal-text">
                {formatUptime(metrics.uptime)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-terminal-bg rounded">
        <div className="text-xs text-terminal-text/70 mb-2">System Status</div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-bull-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-bull-500 font-medium">OPTIMAL</span>
        </div>
        <div className="text-xs text-terminal-text/50 mt-1">
          All systems operational
        </div>
      </div>
    </div>
  );
};
