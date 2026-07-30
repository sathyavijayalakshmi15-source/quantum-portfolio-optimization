import React from 'react';
import { Info, Cpu, Zap, ShieldCheck, Layers, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
          <Info className="w-6 h-6 text-cyan-400" />
          <span>About Qiskit QAOA & Portfolio Optimization</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Technical architecture, mathematical formulation, and quantum circuit methodology.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Problem Formulation */}
        <div className="p-6 rounded-3xl glass-panel border border-surface-border space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 text-sm font-bold">
            <BookOpen className="w-4 h-4" />
            <span>1. Quadratic Unconstrained Binary Optimization (QUBO)</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Standard Markowitz portfolio optimization selects $K$ assets out of an $N$-stock universe to minimize portfolio variance while maximizing expected returns. In binary variable space ($x_i \in \{0, 1\}$), the cost objective is:
          </p>
          <div className="p-4 rounded-2xl bg-slate-950/80 font-mono text-cyan-300 text-xs border border-surface-border text-center overflow-x-auto">
            H(x) = q · x^T Σ x - (1-q) · μ^T x + P · (Σ x_i - K)^2
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            where $\Sigma$ is the stock covariance matrix, $\mu$ is the expected return vector, $q$ is the risk aversion parameter, and $P$ is the quadratic penalty for cardinality enforcement.
          </p>
        </div>

        {/* Section 2: Dicke State & XY Mixer */}
        <div className="p-6 rounded-3xl glass-panel border border-surface-border space-y-3">
          <div className="flex items-center space-x-2 text-purple-400 text-sm font-bold">
            <Zap className="w-4 h-4" />
            <span>2. Zero-Infeasibility Dicke State Initialization & XY Mixers</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Standard QAOA uses Hadamard initialization $\bigotimes |+\rangle$, which samples invalid portfolios (e.g. picking 5 stocks when $K=3$) up to 22% of the time. Our platform implements Dicke state preparation $|D_K^N\rangle$ to initialize the circuit in an exact equal superposition of all valid Hamming weight $K$ bitstrings. Combined with particle-number preserving ring XY mixers:
          </p>
          <div className="p-4 rounded-2xl bg-slate-950/80 font-mono text-purple-300 text-xs border border-surface-border text-center overflow-x-auto">
            U_{XY}(β) = exp(-i β (X_i X_j + Y_i Y_j))
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            This structurally prevents the quantum circuit from ever exploring invalid states, reducing infeasibility to strictly 0.0%.
          </p>
        </div>

        {/* Section 3: CVaR Objective */}
        <div className="p-6 rounded-3xl glass-panel border border-surface-border space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 text-sm font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>3. Conditional Value-at-Risk (CVaR) Expectation</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Instead of evaluating the standard mean expectation $\langle H \rangle$, our variational optimizer evaluates the tail expectation over the lowest $\alpha = 10\%$ percentile energy samples during COBYLA parameter updates, guiding QAOA toward worst-case risk minimization.
          </p>
        </div>

      </div>

    </div>
  );
};
