import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  Layers, 
  Activity,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onStartOptimizer: () => void;
  onViewCircuit: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartOptimizer, onViewCircuit }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Close tooltip on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTooltip(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTooltip = (metric: string) => {
    setActiveTooltip(prev => prev === metric ? null : metric);
  };

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 border border-surface-border">
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-glow"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Qiskit QAOA + Dicke State Initialization</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Optimize Stock Portfolios with <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Quantum Computing
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Eliminate infeasible portfolio samples and minimize tail loss using zero-infeasibility Dicke state preparation, XY mixers, and CVaR weighted Ising Hamiltonians.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onStartOptimizer}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Launch Optimizer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewCircuit}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-surface-border text-slate-200 font-medium text-sm transition-all duration-200"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>View QAOA Circuit</span>
              </button>
            </div>

            {/* Quick Proof KPI Metric Badges with Interactive Tooltips */}
            <div className="pt-6 border-t border-surface-border grid grid-cols-3 gap-4 text-left">
              
              {/* Metric 1: Infeasibility Rate */}
              <div className="relative group">
                <div className="text-2xl font-bold font-mono text-cyan-400">0.0%</div>
                <div className="flex items-center space-x-1 text-xs text-slate-400 mt-0.5">
                  <span>Infeasibility Rate</span>
                  <button
                    onClick={() => toggleTooltip('infeasibility')}
                    onFocus={() => setActiveTooltip('infeasibility')}
                    aria-label="Info about Infeasibility Rate"
                    className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-full p-0.5 transition-all"
                  >
                    <Info className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                </div>

                {/* Tooltip Popup */}
                <div 
                  className={`absolute bottom-full left-0 mb-3 w-72 sm:w-80 p-4 rounded-2xl glass-panel bg-slate-900/95 border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 backdrop-blur-md z-30 transition-all duration-200 pointer-events-auto ${
                    activeTooltip === 'infeasibility' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'
                  }`}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-surface-border mb-2">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Info className="w-3.5 h-3.5 text-cyan-400" />
                      <span>What is Infeasibility Rate?</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Excellent
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    This metric shows the percentage of generated portfolios that violate the optimization constraints (such as selecting an invalid combination of assets). Lower values are better.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A value of 0.0% means every generated portfolio satisfies all investment constraints, indicating a stable and reliable optimization process.
                  </p>
                  <div className="mt-3 pt-2 border-t border-surface-border text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Excellent — No infeasible portfolios generated.</span>
                  </div>

                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-6 -mt-1 w-3 h-3 bg-slate-900 border-r border-b border-cyan-500/40 rotate-45"></div>
                </div>
              </div>

              {/* Metric 2: CVaR Tail Loss Cut */}
              <div className="relative group">
                <div className="text-2xl font-bold font-mono text-purple-400">18.4%</div>
                <div className="flex items-center space-x-1 text-xs text-slate-400 mt-0.5">
                  <span>CVaR Tail Loss Cut</span>
                  <button
                    onClick={() => toggleTooltip('cvar')}
                    onFocus={() => setActiveTooltip('cvar')}
                    aria-label="Info about CVaR Tail Loss Cut"
                    className="text-purple-400 hover:text-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400 rounded-full p-0.5 transition-all"
                  >
                    <Info className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                </div>

                {/* Tooltip Popup */}
                <div 
                  className={`absolute bottom-full left-0 mb-3 w-72 sm:w-80 p-4 rounded-2xl glass-panel bg-slate-900/95 border border-purple-500/40 shadow-2xl shadow-purple-950/50 backdrop-blur-md z-30 transition-all duration-200 pointer-events-auto ${
                    activeTooltip === 'cvar' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'
                  }`}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-surface-border mb-2">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Info className="w-3.5 h-3.5 text-purple-400" />
                      <span>What is CVaR Tail Loss Cut?</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Excellent
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    CVaR (Conditional Value at Risk) measures expected losses during the worst market scenarios.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This value indicates how much the optimization reduced potential downside risk compared with the baseline portfolio. Higher percentages indicate better protection during market downturns.
                  </p>
                  <div className="mt-3 pt-2 border-t border-surface-border text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Better downside risk protection.</span>
                  </div>

                  <div className="absolute top-full left-6 -mt-1 w-3 h-3 bg-slate-900 border-r border-b border-purple-500/40 rotate-45"></div>
                </div>
              </div>

              {/* Metric 3: Optimality Gap */}
              <div className="relative group">
                <div className="text-2xl font-bold font-mono text-emerald-400">2.8%</div>
                <div className="flex items-center space-x-1 text-xs text-slate-400 mt-0.5">
                  <span>Optimality Gap</span>
                  <button
                    onClick={() => toggleTooltip('gap')}
                    onFocus={() => setActiveTooltip('gap')}
                    aria-label="Info about Optimality Gap"
                    className="text-emerald-400 hover:text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded-full p-0.5 transition-all"
                  >
                    <Info className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                </div>

                {/* Tooltip Popup */}
                <div 
                  className={`absolute bottom-full right-0 sm:right-auto sm:left-0 mb-3 w-72 sm:w-80 p-4 rounded-2xl glass-panel bg-slate-900/95 border border-emerald-500/40 shadow-2xl shadow-emerald-950/50 backdrop-blur-md z-30 transition-all duration-200 pointer-events-auto ${
                    activeTooltip === 'gap' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'
                  }`}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-surface-border mb-2">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-400" />
                      <span>What is Optimality Gap?</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Excellent
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    The Optimality Gap measures how close the quantum optimization result is to the theoretical best possible solution. Lower values indicate higher optimization quality.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A value of 2.8% means the generated portfolio is extremely close to the optimal solution.
                  </p>
                  <div className="mt-3 pt-2 border-t border-surface-border text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ High-quality optimization result.</span>
                  </div>

                  <div className="absolute top-full right-6 sm:right-auto sm:left-6 -mt-1 w-3 h-3 bg-slate-900 border-r border-b border-emerald-500/40 rotate-45"></div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Visualizer Widget */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl glass-card p-6 border border-cyan-500/20 space-y-5">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-slate-300 font-semibold">QAOA Circuit Execution</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  p = 2 Layers
                </span>
              </div>

              {/* Animated Gate Diagram */}
              <div className="space-y-3 font-mono text-xs">
                {['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'].map((ticker) => (
                  <div key={ticker} className="flex items-center space-x-2">
                    <span className="w-12 text-slate-400 font-bold">{ticker}</span>
                    <div className="flex-1 flex items-center space-x-1 overflow-hidden">
                      <span className="px-2 py-1 bg-blue-900/40 text-blue-300 border border-blue-700/50 rounded text-[10px]">H</span>
                      <span className="text-slate-600">─</span>
                      <span className="px-2 py-1 bg-purple-900/40 text-purple-300 border border-purple-700/50 rounded text-[10px]">RZ(γ)</span>
                      <span className="text-slate-600">──</span>
                      <span className="px-2 py-1 bg-cyan-900/40 text-cyan-300 border border-cyan-700/50 rounded text-[10px]">CX</span>
                      <span className="text-slate-600">─</span>
                      <span className="px-2 py-1 bg-amber-900/40 text-amber-300 border border-amber-700/50 rounded text-[10px]">RX(β)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-surface-border text-xs flex justify-between items-center text-slate-300">
                <span>Selected Allocation:</span>
                <span className="font-mono text-emerald-400 font-semibold">AAPL (40%) • NVDA (35%) • GOOGL (25%)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Quantum Advantage in Asset Allocation</h2>
          <p className="text-slate-400 text-sm">
            Combining non-convex binary stock selection with exact Ising Hamiltonian solver benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Feasibility-Preserving QAOA</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Uses Dicke state preparation and particle-number conserving XY mixers to ensure 100% valid K-stock selections.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">CVaR Tail-Risk Optimization</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Replaces plain variance with Conditional Value-at-Risk (95% confidence) to protect against severe market downside.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Exact Brute-Force Benchmarking</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every quantum execution is checked against exact 2^N binary eigensolvers to verify optimality gap transparently.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
