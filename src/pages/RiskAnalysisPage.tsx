import React from 'react';
import { RiskMetrics } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, TrendingDown, Percent } from 'lucide-react';

interface RiskAnalysisPageProps {
  quantumRisk?: RiskMetrics;
  classicalRisk?: RiskMetrics;
}

export const RiskAnalysisPage: React.FC<RiskAnalysisPageProps> = ({ quantumRisk, classicalRisk }) => {
  const qRisk = quantumRisk || {
    var_95_daily: 0.018,
    cvar_95_daily: 0.026,
    var_95_annual: 0.285,
    cvar_95_annual: 0.412,
    max_drawdown: 0.142,
    skewness: -0.12,
    kurtosis: 3.15
  };

  const cRisk = classicalRisk || {
    var_95_daily: 0.022,
    cvar_95_daily: 0.032,
    var_95_annual: 0.349,
    cvar_95_annual: 0.508,
    max_drawdown: 0.189,
    skewness: -0.28,
    kurtosis: 3.82
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
          <ShieldAlert className="w-6 h-6 text-rose-400" />
          <span>Conditional Value-at-Risk (CVaR) & Risk Analysis</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tail-loss risk quantification for Quantum CVaR Hamiltonian vs Markowitz variance.
        </p>
      </div>

      {/* Primary Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quantum CVaR Card */}
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-6">
          <div className="flex justify-between items-center border-b border-surface-border pb-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white text-base">Quantum CVaR Hamiltonian</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Tail-Risk Aware
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Annualized CVaR (95%)</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">{(qRisk.cvar_95_annual * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Worst 5% tail loss mean</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Annualized VaR (95%)</span>
              <span className="text-2xl font-bold font-mono text-blue-400">{(qRisk.var_95_annual * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Maximum threshold loss</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Max Historical Drawdown</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{(qRisk.max_drawdown * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Peak-to-trough decline</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Skewness / Kurtosis</span>
              <span className="text-xl font-bold font-mono text-purple-400">{qRisk.skewness.toFixed(2)} / {qRisk.kurtosis.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Asymmetry & heavy tails</span>
            </div>
          </div>
        </div>

        {/* Classical Markowitz Card */}
        <div className="p-6 rounded-3xl glass-panel border border-surface-border space-y-6">
          <div className="flex justify-between items-center border-b border-surface-border pb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white text-base">Classical Markowitz Baseline</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-400">
              Symmetric Variance
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Annualized CVaR (95%)</span>
              <span className="text-2xl font-bold font-mono text-amber-400">{(cRisk.cvar_95_annual * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Worst 5% tail loss mean</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Annualized VaR (95%)</span>
              <span className="text-2xl font-bold font-mono text-slate-300">{(cRisk.var_95_annual * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Maximum threshold loss</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Max Historical Drawdown</span>
              <span className="text-2xl font-bold font-mono text-rose-400">{(cRisk.max_drawdown * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Peak-to-trough decline</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Skewness / Kurtosis</span>
              <span className="text-xl font-bold font-mono text-slate-300">{cRisk.skewness.toFixed(2)} / {cRisk.kurtosis.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Asymmetry & heavy tails</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
