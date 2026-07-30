import React, { useState } from 'react';
import { 
  BookOpen, 
  Layout, 
  ListOrdered, 
  GitMerge, 
  Zap, 
  Scale, 
  Code2, 
  HelpCircle, 
  CheckCircle2, 
  Cpu, 
  Sliders, 
  Globe, 
  Activity, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  PieChart as PieIcon, 
  GitCompare, 
  FileText, 
  Check, 
  Database,
  ChevronDown
} from 'lucide-react';

interface UserGuidePageProps {
  onNavigateOptimizer?: () => void;
}

export const UserGuidePage: React.FC<UserGuidePageProps> = ({ onNavigateOptimizer }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is portfolio optimization?",
      a: "Portfolio optimization is the mathematical process of selecting the optimal asset weights to achieve maximum expected return for a given level of risk, or minimum risk for a target return."
    },
    {
      q: "Why use QAOA?",
      a: "The Quantum Approximate Optimization Algorithm (QAOA) efficiently navigates non-convex, discrete combinatorial search spaces where classical quadratic programming solvers become computationally expensive."
    },
    {
      q: "How long does optimization take?",
      a: "Simulations typically run in 5 to 15 seconds depending on the selected stock count (N) and QAOA layer depth (p)."
    },
    {
      q: "What is the Efficient Frontier?",
      a: "The Efficient Frontier represents the set of optimal investment portfolios that offer the highest expected return for a defined risk level."
    },
    {
      q: "What is Sharpe Ratio?",
      a: "The Sharpe Ratio measures risk-adjusted performance: (Return - RiskFreeRate) / Volatility. Higher values indicate superior risk-adjusted efficiency."
    },
    {
      q: "Can I export my report?",
      a: "Yes! You can instantly download executive PDF investment reports or raw CSV datasets directly from the Results page."
    },
    {
      q: "Is this real-time market data?",
      a: "Market prices are fetched dynamically via yFinance with fallback synthetic data generators for seamless offline execution."
    }
  ];

  return (
    <div className="space-y-16 max-w-5xl mx-auto py-4">
      
      {/* SECTION 1 — Welcome */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-surface-border space-y-4 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Platform Documentation & Onboarding</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          📖 User Guide
        </h1>

        <p className="text-lg text-cyan-300 font-medium">
          Welcome to Q-Optima – a Quantum Portfolio Optimization Platform powered by IBM Qiskit and the Quantum Approximate Optimization Algorithm (QAOA).
        </p>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          This guide walks users through every feature of the platform and explains how quantum computing is used to optimize investment portfolios. Whether you are an institutional investor, quantitative researcher, or quantum enthusiast, this documentation provides step-by-step instructions to configure, run, analyze, and export quantum-optimized stock portfolios.
        </p>
      </section>

      {/* SECTION 2 — Platform Overview */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Layout className="w-6 h-6 text-cyan-400" />
            <span>Platform Navigation & Feature Overview</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Explore all 11 core modules built into the Q-Optima platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Overview</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Introduction to the platform</li>
              <li>Key features</li>
              <li>System status</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
              <Sliders className="w-4 h-4" />
              <span>Optimizer</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Select stocks</li>
              <li>Configure optimization settings</li>
              <li>Run quantum optimization</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
              <Globe className="w-4 h-4" />
              <span>Stock Universe</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Browse supported stocks</li>
              <li>View company details</li>
              <li>Filter by sector</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <Activity className="w-4 h-4" />
              <span>Quantum Simulation</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Observe quantum optimization</li>
              <li>View algorithm execution</li>
              <li>Simulation progress</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>Circuit Viewer</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Visualize generated quantum circuits</li>
              <li>Understand quantum gates</li>
              <li>Learn circuit depth</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Results</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Optimized portfolio allocation</li>
              <li>Expected return</li>
              <li>Portfolio risk & Sharpe ratio</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Efficient Frontier</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Compare risk vs return</li>
              <li>Understand optimal portfolios</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Risk Analysis</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Portfolio diversification</li>
              <li>Volatility & VaR/CVaR</li>
              <li>Correlation analysis</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <PieIcon className="w-4 h-4" />
              <span>Analytics</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Interactive charts</li>
              <li>Historical performance</li>
              <li>Asset contribution</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
              <GitCompare className="w-4 h-4" />
              <span>Comparison</span>
            </div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Compare multiple optimization results</li>
              <li>Quantum vs Classical vs Exact</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2 sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </div>
            <p className="text-xs text-slate-400">
              Generate and download a professional investment report containing allocation tables, Sharpe ratios, risk metrics, and solver comparison.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — How to Use the Platform */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <ListOrdered className="w-6 h-6 text-purple-400" />
            <span>How to Use the Platform (8-Step Guide)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Follow this step-by-step process to optimize your stock portfolio.</p>
        </div>

        <div className="relative border-l-2 border-cyan-500/30 ml-4 space-y-8 pl-6">
          {[
            { step: 1, title: "Step 1: Open Optimizer", desc: "Navigate to the Optimizer tab from the top header navigation bar.", icon: Sliders },
            { step: 2, title: "Step 2: Select your preferred stocks", desc: "Choose tickers from the stock universe grid or type custom stock symbols (e.g. AAPL, MSFT, NVDA, GOOGL).", icon: Check },
            { step: 3, title: "Step 3: Choose optimization settings", desc: "Set your total investment capital ($), cardinality budget (K), risk aversion factor (λ), and QAOA circuit layers (p).", icon: Cpu },
            { step: 4, title: "Step 4: Click Run Optimization", desc: "Click the gradient Run Optimization button to initiate the solver pipeline.", icon: Activity },
            { step: 5, title: "Step 5: Wait for QAOA to process the portfolio", desc: "The Qiskit engine constructs statevectors, optimizes gamma and beta parameters, and samples high-probability bitstrings.", icon: Layers },
            { step: 6, title: "Step 6: Review optimized portfolio allocation", desc: "Examine expected returns, annual volatility, Sharpe ratios, stock weight percentages, and dollar allocations.", icon: BarChart3 },
            { step: 7, title: "Step 7: Analyze risk and performance", desc: "Explore the Efficient Frontier, Risk Analysis (CVaR 95%), and Comparison dashboard.", icon: ShieldAlert },
            { step: 8, title: "Step 8: Export the report as PDF", desc: "Click Export PDF to generate and download an executive PDF report for your records.", icon: FileText }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative group">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-slate-950 shadow-glow-cyan">
                  {item.step}
                </div>
                <div className="p-4 rounded-2xl glass-card border border-surface-border group-hover:border-cyan-500/40 transition-all">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4 — Complete Workflow */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <GitMerge className="w-6 h-6 text-cyan-400" />
            <span>Complete System Architecture Workflow</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">End-to-end data pipeline from raw market feed to quantum circuit execution and PDF generation.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-surface-border space-y-3 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-surface-border text-cyan-400 font-bold">Market Data</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-surface-border text-slate-300">Historical Prices</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-surface-border text-slate-300">Return & Covariance</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-300 font-bold">QUBO Model Creation</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="text-purple-400 font-bold">⬇</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-300 font-bold">Ising Hamiltonian</span>
            <span className="text-purple-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 font-bold">Quantum Circuit Generation</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 font-bold">QAOA Optimization</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="text-cyan-400 font-bold">⬇</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 font-bold">Optimal Portfolio</span>
            <span className="text-emerald-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-surface-border text-slate-300">Risk Analysis</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-surface-border text-slate-300">Analytics Dashboard</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">PDF Report</span>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Understanding QAOA */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <span>Understanding QAOA & Quantum Concepts</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Beginner-friendly explanation of quantum approximate optimization.</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-4">
          <h3 className="text-lg font-bold text-white">What is QAOA?</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            The Quantum Approximate Optimization Algorithm (QAOA) is a hybrid quantum-classical algorithm designed to solve complex optimization problems. Instead of checking one portfolio at a time, QAOA efficiently explores many possible portfolio combinations and helps identify high-quality investment allocations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border space-y-1">
              <h4 class="text-xs font-bold text-cyan-400 uppercase">Hybrid Quantum-Classical Algorithm</h4>
              <p class="text-xs text-slate-400 leading-relaxed">Combines quantum circuit statevector preparation with classical optimizers (like COBYLA) to iteratively update variational parameters.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border space-y-1">
              <h4 class="text-xs font-bold text-purple-400 uppercase">QUBO Formulation</h4>
              <p class="text-xs text-slate-400 leading-relaxed">Translates stock selection, return targets, covariance risks, and budget constraints into a Quadratic Unconstrained Binary Optimization model.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border space-y-1">
              <h4 class="text-xs font-bold text-blue-400 uppercase">Ising Hamiltonian Mapping</h4>
              <p class="text-xs text-slate-400 leading-relaxed">Converts binary variables into quantum spin operators (Z_i) where energy levels correspond directly to portfolio costs.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border space-y-1">
              <h4 class="text-xs font-bold text-emerald-400 uppercase">Quantum Circuit Execution & Parameter Optimization</h4>
              <p class="text-xs text-slate-400 leading-relaxed">Alternates Cost and Mixer layers (p layers) using rotation angles (γ and β) to guide the quantum state toward high-return, low-risk portfolio bitstrings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Why Quantum? */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Scale className="w-6 h-6 text-cyan-400" />
            <span>Why Quantum Optimization?</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Comparing traditional classical solvers vs hybrid quantum algorithms.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-surface-border space-y-4">
            <div className="flex items-center space-x-2 text-slate-400 font-bold text-base border-b border-surface-border pb-3">
              <Database className="w-5 h-5" />
              <span>Classical Optimization</span>
            </div>
            <ul class="text-xs text-slate-300 space-y-2">
              <li class="flex items-center space-x-2"><span class="text-rose-400 font-bold">•</span> <span>Sequential search across combinations</span></li>
              <li class="flex items-center space-x-2"><span class="text-rose-400 font-bold">•</span> <span>Slower for complex non-convex portfolios</span></li>
              <li class="flex items-center space-x-2"><span class="text-rose-400 font-bold">•</span> <span>Computationally expensive as universe expands</span></li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-cyan-500/40 space-y-4 shadow-glow-cyan">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-base border-b border-surface-border pb-3">
              <Cpu className="w-5 h-5" />
              <span>Quantum Optimization (QAOA)</span>
            </div>
            <ul class="text-xs text-slate-300 space-y-2">
              <li class="flex items-center space-x-2"><span class="text-emerald-400 font-bold">✔</span> <span>Efficient exploration of combinatorial space</span></li>
              <li class="flex items-center space-x-2"><span class="text-emerald-400 font-bold">✔</span> <span>Handles complex non-convex optimization problems</span></li>
              <li class="flex items-center space-x-2"><span class="text-emerald-400 font-bold">✔</span> <span>Modern hybrid quantum-classical algorithm</span></li>
              <li class="flex items-center space-x-2"><span class="text-emerald-400 font-bold">✔</span> <span>Ideal for discrete stock selection & cardinality constraints</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Technology Stack */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-purple-400" />
            <span>Technology Stack</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Built with modern enterprise-grade open source frameworks.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center font-mono text-xs">
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Frontend</span>
            <span className="font-bold text-cyan-400 block">React 18</span>
            <span className="text-slate-300 text-[10px] block">TypeScript • Tailwind</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Backend</span>
            <span className="font-bold text-purple-400 block">FastAPI</span>
            <span className="text-slate-300 text-[10px] block">Python 3.10+ • Uvicorn</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Quantum</span>
            <span className="font-bold text-emerald-400 block">IBM Qiskit</span>
            <span className="text-slate-300 text-[10px] block">QAOA • Statevector</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Finance</span>
            <span className="font-bold text-amber-400 block">SciPy / NumPy</span>
            <span className="text-slate-300 text-[10px] block">Pandas • yFinance</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase block">Visualization</span>
            <span className="font-bold text-blue-400 block">Recharts</span>
            <span className="text-slate-300 text-[10px] block">Chart.js • Lucide</span>
          </div>
        </div>
      </section>

      {/* SECTION 8 — Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <span>Frequently Asked Questions (FAQ)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Common questions about quantum portfolio optimization.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl border border-surface-border p-4 transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left font-bold text-white text-sm"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-slate-300 leading-relaxed mt-3 pt-3 border-t border-surface-border">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9 — Best Practices */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span>Best Practices & Recommendations</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Recommended guidelines for optimal performance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <div className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Stock Selection</span>
            </div>
            <p className="text-xs text-slate-300">Select 5–15 stocks for meaningful portfolio optimization.</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <div className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Multi-Solver Comparison</span>
            </div>
            <p className="text-xs text-slate-300">Compare multiple portfolios across Quantum and Classical solvers.</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <div className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Risk Quantification</span>
            </div>
            <p className="text-xs text-slate-300">Analyze both expected return and CVaR 95% tail-risk metrics.</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <div className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Frontier Curves</span>
            </div>
            <p className="text-xs text-slate-300">Use the Efficient Frontier before finalizing asset allocations.</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1 sm:col-span-2 md:col-span-2">
            <div className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Documentation Export</span>
            </div>
            <p className="text-xs text-slate-300">Export the PDF report for institutional documentation and compliance archives.</p>
          </div>
        </div>
      </section>

      {/* SECTION 10 — Need Help? */}
      <section className="glass-panel p-8 rounded-3xl border border-cyan-500/30 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Need Help?</h2>
        <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
          If you're new to quantum portfolio optimization, simply follow the workflow above. The platform guides you through each stage, from selecting stocks to generating a professional portfolio report.
        </p>
        {onNavigateOptimizer && (
          <button onClick={onNavigateOptimizer} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-glow-cyan hover:opacity-90">
            Go to Optimizer
          </button>
        )}
      </section>

    </div>
  );
};
