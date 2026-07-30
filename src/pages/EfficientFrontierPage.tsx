import React, { useEffect, useState } from 'react';
import { EfficientFrontierData, QuantumOptimizationResult } from '../types';
import { fetchEfficientFrontier } from '../services/api';
import { TrendingUp, Activity, Compass } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface EfficientFrontierPageProps {
  tickers: string[];
  quantumResult: QuantumOptimizationResult | null;
}

export const EfficientFrontierPage: React.FC<EfficientFrontierPageProps> = ({ tickers, quantumResult }) => {
  const [data, setData] = useState<EfficientFrontierData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchEfficientFrontier(tickers).then(res => {
      if (isMounted) {
        setData(res);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [tickers]);

  const frontierPoints = data?.frontier.map(p => ({
    volatility: (p.volatility * 100).toFixed(2),
    volVal: p.volatility * 100,
    expected_return: (p.expected_return * 100).toFixed(2),
    retVal: p.expected_return * 100,
    sharpe: p.sharpe_ratio.toFixed(2)
  })) || [];

  const assetPoints = data?.assets.map(a => ({
    ticker: a.ticker,
    volVal: a.volatility * 100,
    retVal: a.expected_return * 100,
    sharpe: a.sharpe_ratio.toFixed(2)
  })) || [];

  const quantumPoint = quantumResult ? [{
    ticker: 'QAOA Optimal',
    volVal: quantumResult.volatility * 100,
    retVal: quantumResult.expected_return * 100,
    sharpe: quantumResult.sharpe_ratio.toFixed(2)
  }] : [];

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <span>Markowitz Efficient Frontier & Asset Curve</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visualizing Risk vs Return trade-off curve and Quantum QAOA solution point.
          </p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Risk (Volatility %) vs Return (Expected Annual %)</span>
          </h3>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
              <span>Efficient Frontier</span>
            </span>
            <span className="flex items-center space-x-1.5 text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
              <span>Individual Assets</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-white inline-block"></span>
              <span>Quantum Portfolio</span>
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={frontierPoints}>
                <XAxis 
                  dataKey="volVal" 
                  name="Volatility" 
                  unit="%" 
                  stroke="#64748B" 
                  fontSize={10}
                  tickLine={false}
                  label={{ value: 'Annualized Volatility (Risk %)', position: 'insideBottom', offset: -5, fill: '#64748B', fontSize: 10 }}
                />
                <YAxis 
                  dataKey="retVal" 
                  name="Expected Return" 
                  unit="%" 
                  stroke="#64748B" 
                  fontSize={10}
                  tickLine={false}
                  label={{ value: 'Expected Annual Return (%)', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                />
                
                {/* Efficient Frontier Curve */}
                <Line type="monotone" dataKey="retVal" stroke="#06B6D4" strokeWidth={3} dot={false} name="Efficient Frontier" />
                
                {/* Individual Assets */}
                <Scatter data={assetPoints} fill="#8B5CF6" name="Individual Assets" />

                {/* Quantum QAOA Point */}
                {quantumPoint.length > 0 && (
                  <Scatter data={quantumPoint} fill="#10B981" shape="circle" r={8} name="Quantum Selected" />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
};
