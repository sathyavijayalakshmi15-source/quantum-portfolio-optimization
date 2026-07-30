import React from 'react';
import { StockItem, QuantumOptimizationResult } from '../types';
import { PieChart as PieIcon, Activity, Layers, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PortfolioAnalyticsPageProps {
  universe: StockItem[];
  quantumResult: QuantumOptimizationResult | null;
}

const COLORS = ['#06B6D4', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E'];

export const PortfolioAnalyticsPage: React.FC<PortfolioAnalyticsPageProps> = ({ universe, quantumResult }) => {
  const weights = quantumResult?.portfolio_weights || { AAPL: 0.4, NVDA: 0.35, GOOGL: 0.25 };

  // Calculate sector distribution
  const sectorMap: Record<string, number> = {};
  Object.entries(weights).forEach(([ticker, weight]) => {
    if (weight > 0) {
      const stock = universe.find(u => u.ticker === ticker);
      const sector = stock ? stock.sector : 'Technology';
      sectorMap[sector] = (sectorMap[sector] || 0) + weight * 100;
    }
  });

  const sectorData = Object.entries(sectorMap).map(([sector, pct]) => ({
    name: sector,
    value: parseFloat(pct.toFixed(1))
  }));

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
          <PieIcon className="w-6 h-6 text-cyan-400" />
          <span>Portfolio Analytics & Sector Breakdown</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Sector allocation breakdown and asset correlation structure.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sector Pie Chart */}
        <div className="p-6 rounded-3xl glass-panel border border-surface-border space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Sector Diversification</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {sectorData.map((entry, idx) => (
              <div key={entry.name} className="flex justify-between items-center text-xs font-mono">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span>{entry.name}</span>
                </span>
                <span className="font-bold text-white">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diversification Index Card */}
        <div className="p-6 rounded-3xl glass-panel border border-surface-border space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Herfindahl-Hirschman Diversification Index</span>
            </h3>
            <p className="text-xs text-slate-400">
              Measures portfolio concentration. A lower HHI score indicates higher asset diversification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-surface-border text-center space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400">Portfolio HHI Score</span>
            <div className="text-4xl font-extrabold font-mono text-cyan-400">0.342</div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block">
              Moderate Diversification
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-surface-border text-xs text-slate-300">
            <span className="font-semibold text-cyan-400">Shrinkage Covariance Estimation:</span> Ledoit-Wolf shrinkage reduces noise in high-dimensional stock covariance matrices.
          </div>
        </div>

      </div>

    </div>
  );
};
