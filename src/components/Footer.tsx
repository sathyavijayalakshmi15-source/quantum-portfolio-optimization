import React from 'react';
import { Cpu, ShieldCheck, Zap, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface-border bg-[#090D16] py-12 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white text-base">Q-Optima</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation financial portfolio optimization powered by IBM Qiskit Quantum Approximate Optimization Algorithm (QAOA) and Markowitz Modern Portfolio Theory.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Quantum Tech</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5 text-slate-400">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Qiskit 1.0+ Engine</span>
              </li>
              <li>Dicke State & XY Mixer</li>
              <li>CVaR Expectation Objective</li>
              <li>Ising Hamiltonian QUBO</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Quantitative Finance</h4>
            <ul className="space-y-2 text-xs">
              <li>Markowitz Mean-Variance</li>
              <li>Efficient Frontier Curve</li>
              <li>Ledoit-Wolf Shrinkage Covariance</li>
              <li>12-Month Walk-Forward Backtest</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Domain Focus</h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-surface-border">
              <div className="flex items-center space-x-2 text-xs text-cyan-400 font-medium mb-1">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Finance & Wealth Tech</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Strictly tailored for asset allocation, equity portfolio risk minimization, and stock selection benchmarking.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Q-Optima Quantum Portfolio Platform. Powered by Qiskit & FastAPI.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0 font-mono">
            <span>FastAPI v1.0</span>
            <span>Qiskit v1.0+</span>
            <span>React 18</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
