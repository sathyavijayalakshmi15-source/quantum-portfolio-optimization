import React, { useState } from 'react';
import { StockItem, OptimizationParams } from '../types';
import { Sliders, Cpu, Play, Check, AlertCircle, DollarSign, Layers, Plus, Trash2 } from 'lucide-react';

interface PortfolioOptimizerProps {
  universe: StockItem[];
  params: OptimizationParams;
  setParams: React.Dispatch<React.SetStateAction<OptimizationParams>>;
  onRunOptimization: () => void;
  isLoading: boolean;
}

export const PortfolioOptimizer: React.FC<PortfolioOptimizerProps> = ({
  universe,
  params,
  setParams,
  onRunOptimization,
  isLoading
}) => {
  const [customTicker, setCustomTicker] = useState('');

  const toggleStock = (ticker: string) => {
    if (params.tickers.includes(ticker)) {
      if (params.tickers.length > 2) {
        setParams(prev => ({
          ...prev,
          tickers: prev.tickers.filter(t => t !== ticker),
          budget_k: Math.min(prev.budget_k, prev.tickers.length - 1)
        }));
      }
    } else {
      setParams(prev => ({
        ...prev,
        tickers: [...prev.tickers, ticker]
      }));
    }
  };

  const addCustomStock = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = customTicker.trim().toUpperCase();
    if (formatted && !params.tickers.includes(formatted)) {
      setParams(prev => ({
        ...prev,
        tickers: [...prev.tickers, formatted]
      }));
      setCustomTicker('');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-8 border border-surface-border">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-surface-border pb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
              <Sliders className="w-6 h-6 text-cyan-400" />
              <span>Portfolio Optimization Engine</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure parameters for Quantum QAOA and Classical Markowitz solvers.
            </p>
          </div>

          <button
            onClick={onRunOptimization}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-glow-cyan transition-all duration-300 transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Executing Qiskit QAOA...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Optimization</span>
              </>
            )}
          </button>
        </div>

        {/* Form Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Sliders */}
          <div className="space-y-6">
            
            {/* Investment Amount */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Investment Amount ($)</span>
                <span className="font-mono text-cyan-400">${params.investment_amount.toLocaleString()}</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={params.investment_amount}
                  onChange={e => setParams(prev => ({ ...prev, investment_amount: Math.max(100, Number(e.target.value)) }))}
                  className="w-full bg-slate-900/80 border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Budget K */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Asset Selection Constraint (K)</span>
                <span className="font-mono text-purple-400">{params.budget_k} of {params.tickers.length} Stocks</span>
              </label>
              <input
                type="range"
                min={1}
                max={params.tickers.length}
                value={params.budget_k}
                onChange={e => setParams(prev => ({ ...prev, budget_k: Number(e.target.value) }))}
                className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                QAOA will enforce selecting exactly {params.budget_k} stocks out of the selected {params.tickers.length} tickers.
              </p>
            </div>

            {/* Risk Factor */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Risk vs Return Aversion (λ)</span>
                <span className="font-mono text-cyan-400">{params.risk_factor.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={params.risk_factor}
                onChange={e => setParams(prev => ({ ...prev, risk_factor: Number(e.target.value) }))}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.0 (Max Return)</span>
                <span>0.5 (Balanced)</span>
                <span>1.0 (Min Variance)</span>
              </div>
            </div>

            {/* QAOA Layer p */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>QAOA Circuit Layers (p)</span>
                <span className="font-mono text-emerald-400">p = {params.p_layers}</span>
              </label>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map(p => (
                  <button
                    key={p}
                    onClick={() => setParams(prev => ({ ...prev, p_layers: p }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                      params.p_layers === p
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow-cyan'
                        : 'bg-slate-900/60 text-slate-400 border border-surface-border hover:bg-slate-800'
                    }`}
                  >
                    p={p}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Ticker Selector */}
          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Select Stock Universe ({params.tickers.length} Selected)</span>
              <span className="text-[11px] text-slate-400">Click to toggle</span>
            </label>

            {/* Universe Ticker Badges */}
            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-3 rounded-2xl bg-slate-950/60 border border-surface-border">
              {universe.map(item => {
                const isSelected = params.tickers.includes(item.ticker);
                return (
                  <button
                    key={item.ticker}
                    onClick={() => toggleStock(item.ticker)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-slate-900 text-slate-400 border border-surface-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span>{item.ticker}</span>
                    {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Ticker Input */}
            <form onSubmit={addCustomStock} className="flex space-x-2">
              <input
                type="text"
                placeholder="Add ticker (e.g. BTC-USD, AMD)"
                value={customTicker}
                onChange={e => setCustomTicker(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-surface-border text-xs font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/90 space-y-1">
              <div className="font-semibold flex items-center space-x-1 text-cyan-400">
                <AlertCircle className="w-4 h-4" />
                <span>Qiskit Simulation Specification</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The quantum statevector simulator will construct a {params.tickers.length}-qubit system with {params.p_layers * 2} variational parameters (γ and β angles).
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
