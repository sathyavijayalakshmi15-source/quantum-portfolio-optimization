import React, { useState, useEffect } from 'react';
import { QuantumOptimizationResult } from '../types';
import { 
  Layers, 
  Cpu, 
  Info, 
  Activity, 
  PlayCircle, 
  Play, 
  Pause, 
  BookOpen, 
  HelpCircle, 
  GitMerge, 
  Database, 
  Award, 
  Zap, 
  Sliders 
} from 'lucide-react';

interface CircuitViewerPageProps {
  result: QuantumOptimizationResult | null;
  tickers: string[];
  pLayers: number;
}

export const CircuitViewerPage: React.FC<CircuitViewerPageProps> = ({ result, tickers, pLayers }) => {
  const [isLearningMode, setIsLearningMode] = useState<boolean>(false);
  const [isPlayingCircuit, setIsPlayingCircuit] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [narrationText, setNarrationText] = useState<string>('Click "Play Circuit" or select any gate to explore quantum operations.');
  const [narrationBadge, setNarrationBadge] = useState<string>('Ready');
  const [selectedGateModal, setSelectedGateModal] = useState<string | null>(null);

  const numQubits = tickers.length;
  const depth = 12 + pLayers * 6;
  const cnotCount = Math.floor((numQubits * (numQubits - 1) / 2) * pLayers);
  const rotCount = (numQubits * 2) * pLayers;

  const steps = [
    { stage: 1, text: 'H creates superposition across all stock qubits.', badge: 'Step 1/5: Superposition' },
    { stage: 2, text: 'RZ encodes portfolio cost, return vectors, and covariance risk.', badge: 'Step 2/5: Cost H' },
    { stage: 3, text: 'CNOT creates entanglement between correlated stock assets.', badge: 'Step 3/5: Entanglement' },
    { stage: 4, text: 'RX explores new solution spaces and prevents local traps.', badge: 'Step 4/5: Mixer H' },
    { stage: 5, text: 'Measurement returns the optimized portfolio bitstring.', badge: 'Step 5/5: Measurement' }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingCircuit) {
      let currentStep = 0;
      timer = setInterval(() => {
        if (currentStep < steps.length) {
          const stepObj = steps[currentStep];
          setActiveStage(stepObj.stage);
          setNarrationText(stepObj.text);
          setNarrationBadge(stepObj.badge);
          currentStep++;
        } else {
          setIsPlayingCircuit(false);
          setActiveStage(null);
          setNarrationText('Optimization Complete! Valid portfolio sampled.');
          setNarrationBadge('Complete');
        }
      }, 1500);
    } else {
      setActiveStage(null);
    }
    return () => clearInterval(timer);
  }, [isPlayingCircuit]);

  const gateDescriptions: Record<string, { title: string; subtitle: string; desc: string }> = {
    'H': {
      title: 'Hadamard Gate (H)',
      subtitle: 'Superposition',
      desc: 'Creates quantum superposition, allowing the algorithm to evaluate many possible portfolio combinations simultaneously instead of one at a time.'
    },
    'RZ': {
      title: 'Cost Hamiltonian Gate (RZ)',
      subtitle: 'Cost Hamiltonian',
      desc: 'Encodes the optimization objective into the quantum circuit, including expected return, portfolio risk, and investment constraints.'
    },
    'CNOT': {
      title: 'Entanglement Gate (CNOT)',
      subtitle: 'Entanglement',
      desc: 'Creates relationships between qubits so that correlated stocks influence one another during optimization.'
    },
    'RX': {
      title: 'Mixer Hamiltonian Gate (RX)',
      subtitle: 'Mixer Hamiltonian',
      desc: 'Explores alternative portfolio combinations and prevents the algorithm from getting trapped in poor solutions.'
    },
    'Measure': {
      title: 'Measurement Operation (Measure)',
      subtitle: 'Classical Readout',
      desc: 'Converts the final quantum state into classical data that becomes the optimized portfolio shown in the Results page.'
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      
      {/* SECTION 1: Hero */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-surface-border space-y-4 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>Qiskit QAOA Circuit Synthesizer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Interactive Quantum Circuit Viewer
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Visualize how Qiskit's Quantum Approximate Optimization Algorithm (QAOA) transforms market data into an optimized investment portfolio using quantum circuits.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 rounded-3xl glass-card border border-cyan-500/40 p-4 flex flex-col items-center justify-center space-y-2 shadow-glow-cyan">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-xs font-mono font-bold text-white">QAOA Ansatz (p={pLayers})</span>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold">{numQubits} Qubits • {cnotCount} CNOTs</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: What You're Seeing */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Info className="w-5 h-5 text-cyan-400" />
          <span>Understanding the Quantum Circuit</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border flex items-start space-x-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
            <span><strong>Qubit Rails:</strong> Each horizontal row represents one quantum bit (qubit) mapped to a stock ticker.</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border flex items-start space-x-3">
            <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
            <span><strong>Stock Mapping:</strong> Each qubit corresponds to one stock selected for optimization.</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border flex items-start space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
            <span><strong>Gate Sequence:</strong> Represents the QAOA quantum circuit execution by IBM Qiskit.</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-surface-border flex items-start space-x-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
            <span><strong>Financial Transformation:</strong> Transforms return vectors and risk covariances into optimal allocations.</span>
          </div>
        </div>
      </section>

      {/* SECTION 7: Circuit Statistics */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-surface-border pb-3">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span>Circuit Statistics & Metrics</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Qiskit Synthesizer Stats</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-center">
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Total Qubits</span>
            <span className="text-xl font-bold text-cyan-400 block">{numQubits}</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Circuit Depth</span>
            <span className="text-xl font-bold text-purple-400 block">{depth}</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Entangling Gates</span>
            <span className="text-xl font-bold text-blue-400 block">{cnotCount} CNOT</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Rotation Gates</span>
            <span className="text-xl font-bold text-amber-400 block">{rotCount} RZ/RX</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Measurements</span>
            <span className="text-xl font-bold text-emerald-400 block">{numQubits}</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-surface-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">QAOA Layers</span>
            <span className="text-xl font-bold text-cyan-400 block">p = {pLayers}</span>
          </div>
        </div>
      </section>

      {/* SECTION 9: Learning Mode & SECTION 4: Animated Execution Controls */}
      <section className="glass-panel p-6 rounded-3xl border border-surface-border space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-border pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <PlayCircle className="w-5 h-5 text-cyan-400" />
              <span>Interactive Circuit Execution & Learning Controls</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any gate to inspect its mathematical purpose, or run step-by-step execution.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setIsLearningMode(!isLearningMode)} 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                isLearningMode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan' : 'bg-slate-900 text-slate-400 border border-surface-border'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isLearningMode ? 'Learning Mode: ON' : 'Enable Learning Mode'}</span>
            </button>

            <button 
              onClick={() => setIsPlayingCircuit(!isPlayingCircuit)} 
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan transition-all"
            >
              {isPlayingCircuit ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Circuit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Playback Narration Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono flex items-center justify-between text-cyan-300">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>{narrationText}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-900 text-slate-400 border border-surface-border">
            {narrationBadge}
          </span>
        </div>

        {/* Interactive Qubit Rails Circuit Canvas */}
        <div className="overflow-x-auto pb-4">
          <div className="space-y-6 min-w-[760px] pt-2">
            {tickers.map((ticker, idx) => (
              <div key={ticker} className="flex items-center space-x-3 font-mono text-xs">
                <div className="w-28 flex flex-col">
                  <span className="text-cyan-400 font-bold">q_{idx}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{ticker}</span>
                </div>
                
                <div className="flex-1 flex items-center bg-slate-900/80 p-3 rounded-2xl border border-surface-border space-x-2 relative">
                  
                  {/* Stage 1: Hadamard Gate */}
                  <div 
                    onClick={() => setSelectedGateModal('H')}
                    className={`cursor-pointer p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all font-bold text-center group relative shadow-sm ${
                      activeStage === 1 ? 'ring-2 ring-cyan-400 scale-105' : ''
                    }`}
                  >
                    <span>H</span>
                    {isLearningMode && <span className="block text-[8px] text-blue-400 uppercase font-semibold">Superposition</span>}
                  </div>

                  <span className="text-slate-600">─────</span>

                  {/* Stage 2: RZ Cost Gate */}
                  <div 
                    onClick={() => setSelectedGateModal('RZ')}
                    className={`cursor-pointer p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-all font-bold text-center group relative shadow-sm ${
                      activeStage === 2 ? 'ring-2 ring-cyan-400 scale-105' : ''
                    }`}
                  >
                    <span>RZ(2γ₁h_{idx})</span>
                    {isLearningMode && <span className="block text-[8px] text-purple-400 uppercase font-semibold">Cost H</span>}
                  </div>

                  <span className="text-slate-600">─────</span>

                  {/* Stage 3: CNOT Entangler */}
                  <div 
                    onClick={() => setSelectedGateModal('CNOT')}
                    className={`cursor-pointer p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all font-bold text-center group relative shadow-sm ${
                      activeStage === 3 ? 'ring-2 ring-cyan-400 scale-105' : ''
                    }`}
                  >
                    <span>CNOT (ZZ)</span>
                    {isLearningMode && <span className="block text-[8px] text-cyan-400 uppercase font-semibold">Entanglement</span>}
                  </div>

                  <span className="text-slate-600">─────</span>

                  {/* Stage 4: RX Mixer Gate */}
                  <div 
                    onClick={() => setSelectedGateModal('RX')}
                    className={`cursor-pointer p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all font-bold text-center group relative shadow-sm ${
                      activeStage === 4 ? 'ring-2 ring-cyan-400 scale-105' : ''
                    }`}
                  >
                    <span>RX(2β₁)</span>
                    {isLearningMode && <span className="block text-[8px] text-amber-400 uppercase font-semibold">Mixer H</span>}
                  </div>

                  <span className="text-slate-600 flex-1 border-b border-dashed border-slate-700"></span>

                  {/* Stage 5: Measurement Gate */}
                  <div 
                    onClick={() => setSelectedGateModal('Measure')}
                    className={`cursor-pointer p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all font-bold text-center group relative shadow-sm ${
                      activeStage === 5 ? 'ring-2 ring-cyan-400 scale-105' : ''
                    }`}
                  >
                    <span>Measure</span>
                    {isLearningMode && <span className="block text-[8px] text-emerald-400 uppercase font-semibold">Classical Read</span>}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Interactive Gate Reference Guide */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <span>Quantum Gate Reference Guide</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Detailed breakdown of each gate's role in QAOA portfolio optimization.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          <div onClick={() => setSelectedGateModal('H')} className="p-5 rounded-2xl glass-card border border-blue-500/30 cursor-pointer space-y-2 hover:border-blue-400 transition-all">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-mono font-bold text-sm">H Gate</span>
              <span className="text-[10px] uppercase font-mono text-blue-400">Superposition</span>
            </div>
            <h4 className="text-xs font-bold text-white">Hadamard Gate</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Creates quantum superposition, allowing the algorithm to evaluate many possible portfolio combinations simultaneously instead of one at a time.
            </p>
          </div>

          <div onClick={() => setSelectedGateModal('RZ')} className="p-5 rounded-2xl glass-card border border-purple-500/30 cursor-pointer space-y-2 hover:border-purple-400 transition-all">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-sm">RZ Gate</span>
              <span className="text-[10px] uppercase font-mono text-purple-400">Cost H</span>
            </div>
            <h4 className="text-xs font-bold text-white">Cost Hamiltonian Gate</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Encodes the optimization objective into the quantum circuit, including expected return, portfolio risk, and investment constraints.
            </p>
          </div>

          <div onClick={() => setSelectedGateModal('CNOT')} className="p-5 rounded-2xl glass-card border border-cyan-500/30 cursor-pointer space-y-2 hover:border-cyan-400 transition-all">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm">CNOT Gate</span>
              <span className="text-[10px] uppercase font-mono text-cyan-400">Entanglement</span>
            </div>
            <h4 className="text-xs font-bold text-white">Entanglement Gate</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Creates relationships between qubits so that correlated stocks influence one another during optimization.
            </p>
          </div>

          <div onClick={() => setSelectedGateModal('RX')} className="p-5 rounded-2xl glass-card border border-amber-500/30 cursor-pointer space-y-2 hover:border-amber-400 transition-all">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-sm">RX Gate</span>
              <span className="text-[10px] uppercase font-mono text-amber-400">Mixer H</span>
            </div>
            <h4 className="text-xs font-bold text-white">Mixer Hamiltonian Gate</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explores alternative portfolio combinations and prevents the algorithm from getting trapped in poor solutions.
            </p>
          </div>

          <div onClick={() => setSelectedGateModal('Measure')} className="p-5 rounded-2xl glass-card border border-emerald-500/30 cursor-pointer space-y-2 hover:border-emerald-400 transition-all sm:col-span-2 md:col-span-2">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-sm">Measure</span>
              <span className="text-[10px] uppercase font-mono text-emerald-400">Classical Readout</span>
            </div>
            <h4 className="text-xs font-bold text-white">Measurement Operation</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Converts the final quantum state into classical data that becomes the optimized portfolio shown in the Results page.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 5: Quantum Workflow */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <GitMerge className="w-6 h-6 text-purple-400" />
            <span>Quantum Optimization Workflow</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">From historical asset returns to Qiskit quantum circuit measurement.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-surface-border space-y-3 font-mono text-xs overflow-x-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-surface-border text-cyan-400 font-bold">Historical Market Data</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-surface-border text-slate-300">Portfolio Constraints</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-300 font-bold">QUBO Formulation</span>
            <span className="text-purple-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-300 font-bold">Ising Hamiltonian</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="text-cyan-400 font-bold">⬇</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 font-bold">Quantum Circuit</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 font-bold">QAOA Execution</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 font-bold">Measurement</span>
            <span className="text-emerald-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 font-bold">Optimized Portfolio</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="text-emerald-400 font-bold">⬇</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-surface-border text-slate-300">Risk Analysis</span>
            <span className="text-cyan-400 font-bold">➔</span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">PDF Report</span>
          </div>
        </div>
      </section>

      {/* SECTION 6: Qubit Mapping Table */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Database className="w-6 h-6 text-cyan-400" />
            <span>Qubit-to-Asset Mapping Table</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Dynamic binding between physical qubits and selected portfolio stock tickers.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-surface-border overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead class="text-slate-400 border-b border-surface-border uppercase">
              <tr>
                <th class="pb-3">Qubit</th>
                <th class="pb-3">Mapped Stock</th>
                <th class="pb-3">Purpose</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-border text-slate-200">
              {tickers.map((ticker, idx) => (
                <tr key={ticker}>
                  <td class="py-3 font-bold text-cyan-400">q{idx}</td>
                  <td class="py-3 font-bold text-white">{ticker}</td>
                  <td class="py-3 text-slate-400">Represents {ticker} stock asset decision variable in Ising spin register</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 8: Why This Matters */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Why Quantum Computation Matters</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Key quantum features driving asset allocation speedup and risk minimization.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <h4 className="text-sm font-bold text-cyan-400 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Superposition</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">Evaluates many portfolio combinations simultaneously in a single quantum register.</p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <h4 className="text-sm font-bold text-purple-400 flex items-center space-x-2">
              <GitMerge className="w-4 h-4" />
              <span>Entanglement</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">Models complex non-linear correlations and covariance relationships between correlated assets.</p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
              <Sliders className="w-4 h-4" />
              <span>Parameterized Gates</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">Learns higher-quality investment allocations through variational parameter optimization.</p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-surface-border space-y-2">
            <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>Hybrid Optimization</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">Combines quantum circuit statevector sampling with classical COBYLA optimizers for near-term advantage.</p>
          </div>
        </div>
      </section>

      {/* Modal Popup for Selected Gate */}
      {selectedGateModal && gateDescriptions[selectedGateModal] && (
        <div 
          onClick={() => setSelectedGateModal(null)} 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-md p-6 rounded-3xl glass-panel bg-slate-900 border border-cyan-500/40 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-surface-border pb-3">
              <span className="text-sm font-bold text-white">{gateDescriptions[selectedGateModal].title}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {gateDescriptions[selectedGateModal].subtitle}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {gateDescriptions[selectedGateModal].desc}
            </p>
            <div className="pt-2 text-right">
              <button 
                onClick={() => setSelectedGateModal(null)} 
                className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
