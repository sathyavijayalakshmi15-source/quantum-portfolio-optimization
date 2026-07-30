import React from 'react';
import { QuantumOptimizationResult, OptimizationParams } from '../types';
import { BarChart3, Download, FileSpreadsheet, FileText, CheckCircle2, TrendingUp, ShieldAlert, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface OptimizationResultsPageProps {
  result: QuantumOptimizationResult | null;
  params: OptimizationParams;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

const COLORS = ['#06B6D4', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#EC4899'];

export const OptimizationResultsPage: React.FC<OptimizationResultsPageProps> = ({
  result,
  params,
  onExportCSV,
  onExportPDF
}) => {
  if (!result) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl max-w-xl mx-auto my-12 space-y-4">
        <BarChart3 className="w-12 h-12 text-cyan-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Results Available</h2>
        <p className="text-xs text-slate-400">Run the portfolio optimizer to view allocation weights and download reports.</p>
      </div>
    );
  }

  const pieData = Object.entries(result.portfolio_weights)
    .filter(([_, weight]) => weight > 0)
    .map(([ticker, weight]) => ({
      name: ticker,
      value: weight * 100,
      dollars: (weight * params.investment_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }));

  return (
    <div className="space-y-8 py-4">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Optimization Results & Portfolio Weights</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Qiskit QAOA optimal solution for ${params.investment_amount.toLocaleString()} capital allocation.
          </p>
        </div>

        <div className="flex space-x-3 w-full sm:w-auto">
          <button
            onClick={onExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-surface-border text-slate-200 text-xs font-semibold"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={onExportPDF}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl glass-card border border-surface-border space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase">
            <TrendingUp className="w-4 h-4" />
            <span>Expected Annual Return</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {(result.expected_return * 100).toFixed(2)}%
          </div>
          <div className="text-xs text-slate-400">Annualized weighted stock mean return</div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-surface-border space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>Annual Volatility (Risk)</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {(result.volatility * 100).toFixed(2)}%
          </div>
          <div className="text-xs text-slate-400">Covariance-weighted standard deviation</div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-surface-border space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase">
            <BarChart3 className="w-4 h-4" />
            <span>Sharpe Ratio</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {result.sharpe_ratio.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400">Risk-adjusted return vs 3.0% risk-free rate</div>
        </div>
      </div>

      {/* Allocation Breakdown: Table & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-surface-border space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span>Asset Weight & Capital Allocation</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 uppercase text-[10px] border-b border-surface-border">
                <tr>
                  <th className="pb-3">Stock Ticker</th>
                  <th className="pb-3">Allocation %</th>
                  <th className="pb-3">Capital ($)</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-slate-200">
                {Object.entries(result.portfolio_weights).map(([ticker, weight]) => {
                  const dollars = weight * params.investment_amount;
                  return (
                    <tr key={ticker} className="hover:bg-slate-800/30">
                      <td className="py-3 font-bold text-cyan-400">{ticker}</td>
                      <td className="py-3 font-bold">{(weight * 100).toFixed(1)}%</td>
                      <td className="py-3">${dollars.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3">
                        {weight > 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            Included
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-500">
                            Excluded
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-surface-border space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white">Portfolio Allocation Pie Chart</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono justify-center">
            {pieData.map((entry, idx) => (
              <span key={entry.name} className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-300">{entry.name}: {entry.value.toFixed(1)}%</span>
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
