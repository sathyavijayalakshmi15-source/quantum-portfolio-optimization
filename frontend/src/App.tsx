import React, { useState, useEffect } from 'react';
import { StockItem, OptimizationParams, QuantumOptimizationResult, ComparisonResult } from './types';
import { fetchStockUniverse, runComparisonOptimization, exportCSV, exportPDF } from './services/api';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { PortfolioOptimizer } from './pages/PortfolioOptimizer';
import { StockUniversePage } from './pages/StockUniversePage';
import { QuantumSimulationPage } from './pages/QuantumSimulationPage';
import { CircuitViewerPage } from './pages/CircuitViewerPage';
import { OptimizationResultsPage } from './pages/OptimizationResultsPage';
import { EfficientFrontierPage } from './pages/EfficientFrontierPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { PortfolioAnalyticsPage } from './pages/PortfolioAnalyticsPage';
import { ComparisonDashboardPage } from './pages/ComparisonDashboardPage';
import { UserGuidePage } from './pages/UserGuidePage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [universe, setUniverse] = useState<StockItem[]>([]);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [params, setParams] = useState<OptimizationParams>({
    tickers: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'],
    risk_factor: 0.5,
    budget_k: 3,
    p_layers: 2,
    period: '1y',
    investment_amount: 10000.0
  });

  const [quantumResult, setQuantumResult] = useState<QuantumOptimizationResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // Initialize data on mount
  useEffect(() => {
    fetchStockUniverse().then(data => {
      setUniverse(data);
    });

    fetch('http://127.0.0.1:8000/api/health')
      .then(res => res.ok ? setIsBackendConnected(true) : setIsBackendConnected(false))
      .catch(() => setIsBackendConnected(false));
  }, []);

  const handleRunOptimization = async () => {
    setIsLoading(true);
    try {
      const res = await runComparisonOptimization(params);
      setComparisonResult(res);
      setQuantumResult(res.quantum);
      setIsLoading(false);
      setActiveTab('results');
    } catch (err) {
      console.error('Optimization error:', err);
      setIsLoading(false);
    }
  };

  const handleToggleTicker = (ticker: string) => {
    setParams(prev => {
      const isSelected = prev.tickers.includes(ticker);
      if (isSelected) {
        if (prev.tickers.length <= 2) return prev;
        return {
          ...prev,
          tickers: prev.tickers.filter(t => t !== ticker),
          budget_k: Math.min(prev.budget_k, prev.tickers.length - 1)
        };
      } else {
        return {
          ...prev,
          tickers: [...prev.tickers, ticker]
        };
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#090D16] text-slate-100">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isBackendConnected={isBackendConnected}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'landing' && (
            <LandingPage
              onStartOptimizer={() => setActiveTab('optimizer')}
              onViewCircuit={() => setActiveTab('circuit')}
            />
          )}

          {activeTab === 'optimizer' && (
            <PortfolioOptimizer
              universe={universe}
              params={params}
              setParams={setParams}
              onRunOptimization={handleRunOptimization}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'universe' && (
            <StockUniversePage
              universe={universe}
              selectedTickers={params.tickers}
              onToggleTicker={handleToggleTicker}
            />
          )}

          {activeTab === 'simulation' && (
            <QuantumSimulationPage
              result={quantumResult}
              onRunOptimization={handleRunOptimization}
            />
          )}

          {activeTab === 'circuit' && (
            <CircuitViewerPage
              result={quantumResult}
              tickers={params.tickers}
              pLayers={params.p_layers}
            />
          )}

          {activeTab === 'results' && (
            <OptimizationResultsPage
              result={quantumResult}
              params={params}
              onExportCSV={() => exportCSV(params)}
              onExportPDF={() => exportPDF(params)}
            />
          )}

          {activeTab === 'frontier' && (
            <EfficientFrontierPage
              tickers={params.tickers}
              quantumResult={quantumResult}
            />
          )}

          {activeTab === 'risk' && (
            <RiskAnalysisPage
              quantumRisk={comparisonResult?.risk_metrics.quantum}
              classicalRisk={comparisonResult?.risk_metrics.classical}
            />
          )}

          {activeTab === 'analytics' && (
            <PortfolioAnalyticsPage
              universe={universe}
              quantumResult={quantumResult}
            />
          )}

          {activeTab === 'comparison' && (
            <ComparisonDashboardPage
              params={params}
            />
          )}

          {activeTab === 'user-guide' && (
            <UserGuidePage onNavigateOptimizer={() => setActiveTab('optimizer')} />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
