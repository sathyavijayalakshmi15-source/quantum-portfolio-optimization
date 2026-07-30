import { 
  StockItem, 
  OptimizationParams, 
  ComparisonResult, 
  EfficientFrontierData, 
  BacktestResult
} from '../types';

// STATIC DEMO MODE DATA PROVIDERS (No backend API calls required)

export const fetchStockUniverse = async (): Promise<StockItem[]> => {
  return [
    { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", market_cap: "3.3T" },
    { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", market_cap: "3.1T" },
    { ticker: "NVDA", name: "NVIDIA Corp.", sector: "Technology", market_cap: "3.0T" },
    { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Technology", market_cap: "2.2T" },
    { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", market_cap: "1.9T" },
    { ticker: "META", name: "Meta Platforms Inc.", sector: "Technology", market_cap: "1.3T" },
    { ticker: "TSLA", name: "Tesla Inc.", sector: "Consumer Cyclical", market_cap: "750B" },
    { ticker: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services", market_cap: "580B" },
    { ticker: "V", name: "Visa Inc.", sector: "Financial Services", market_cap: "540B" },
    { ticker: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive", market_cap: "530B" },
    { ticker: "PG", name: "Procter & Gamble Co.", sector: "Consumer Defensive", market_cap: "390B" },
    { ticker: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", market_cap: "480B" }
  ];
};

export const fetchMarketData = async (tickers: string[]) => {
  return {
    tickers,
    means: tickers.map((_, i) => 0.12 + i * 0.03),
    cov: tickers.map(() => tickers.map(() => 0.02))
  };
};

export const runComparisonOptimization = async (params: OptimizationParams): Promise<ComparisonResult> => {
  // Simulate 600ms computation delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 600));

  const n = params.tickers.length;
  const k = Math.min(params.budget_k, n);
  const selected = params.tickers.slice(0, k);
  
  const quantum_weights: Record<string, number> = {};
  const classical_weights: Record<string, number> = {};
  
  params.tickers.forEach((t, i) => {
    quantum_weights[t] = i < k ? Number((1 / k).toFixed(3)) : 0;
    classical_weights[t] = Number((1 / n).toFixed(3));
  });

  return {
    quantum: {
      optimal_gamma: [0.35, 0.42],
      optimal_beta: [0.55, 0.28],
      optimal_bitstring: "1".repeat(k) + "0".repeat(Math.max(0, n - k)),
      best_cost: -0.185,
      expected_energy: -0.172,
      infeasibility_rate: 0.0,
      selected_tickers: selected,
      portfolio_weights: quantum_weights,
      expected_return: 0.245,
      volatility: 0.162,
      sharpe_ratio: 1.327,
      optimality_gap: 0.028,
      optimization_history: [-0.05, -0.09, -0.13, -0.16, -0.18, -0.185],
      top_bitstrings: [
        { bitstring: "1".repeat(k) + "0".repeat(Math.max(0, n - k)), probability: 0.68, cost: -0.185, selected_count: k, is_feasible: true },
        { bitstring: "0" + "1".repeat(k) + "0".repeat(Math.max(0, n - k - 1)), probability: 0.18, cost: -0.162, selected_count: k, is_feasible: true }
      ],
      circuit_metadata: {
        num_qubits: n,
        num_clbits: n,
        depth: 18,
        p_layers: params.p_layers,
        gate_counts: { rz: 14, cx: 12, rx: 10, h: n },
        total_gates: 36 + n,
        ascii_diagram: "q_0: ───[H]───[RZ(2γ₁)]───■────────[RX(2β₁)]───M──\nq_1: ───[H]───[RZ(2γ₁)]───┼───■────[RX(2β₁)]───M──",
        gate_sequence: [
          { gate: "H", targets: [0], layer: "Initialization" },
          { gate: "RZ", targets: [0], param: "2γ_0", layer: "Cost H (p=1)" },
          { gate: "CNOT", targets: [0, 1], layer: "Cost H (p=1)" },
          { gate: "RX", targets: [0], param: "2β_0", layer: "Mixer H (p=1)" }
        ]
      }
    },
    classical: {
      tickers: params.tickers,
      weights: classical_weights,
      weights_array: params.tickers.map((_, i) => i < k ? Number((1 / k).toFixed(3)) : 0),
      expected_return: 0.221,
      volatility: 0.178,
      sharpe_ratio: 1.073,
      cost: -0.168,
      selected_count: k
    },
    exact: {
      best_bitstring: "1".repeat(k) + "0".repeat(Math.max(0, n - k)),
      best_cost: -0.189,
      selected_tickers: selected,
      weights: quantum_weights,
      expected_return: 0.248,
      volatility: 0.159,
      sharpe_ratio: 1.371,
      total_combinations: 1 << Math.min(n, 12)
    },
    risk_metrics: {
      quantum: {
        var_95_daily: 0.018,
        cvar_95_daily: 0.026,
        var_95_annual: 0.285,
        cvar_95_annual: 0.412,
        max_drawdown: 0.142,
        skewness: -0.12,
        kurtosis: 3.15
      },
      classical: {
        var_95_daily: 0.022,
        cvar_95_daily: 0.032,
        var_95_annual: 0.349,
        cvar_95_annual: 0.508,
        max_drawdown: 0.189,
        skewness: -0.28,
        kurtosis: 3.82
      }
    },
    comparison_summary: {
      quantum_sharpe: 1.327,
      classical_sharpe: 1.073,
      quantum_return: 0.245,
      classical_return: 0.221,
      quantum_risk: 0.162,
      classical_risk: 0.178,
      optimality_gap_percent: 2.8,
      infeasibility_rate_percent: 0.0
    }
  };
};

export const fetchEfficientFrontier = async (tickers: string[]): Promise<EfficientFrontierData> => {
  const frontier = Array.from({ length: 25 }, (_, i) => {
    const vol = 0.10 + i * 0.012;
    const ret = 0.08 + Math.sqrt(i) * 0.045;
    return { risk_factor: i / 24, volatility: vol, expected_return: ret, sharpe_ratio: (ret - 0.03) / vol };
  });
  
  const assets = tickers.map((t, idx) => ({
    ticker: t,
    expected_return: 0.12 + (idx % 5) * 0.04,
    volatility: 0.15 + (idx % 3) * 0.05,
    sharpe_ratio: 0.8 + (idx % 4) * 0.2
  }));

  return { frontier, assets };
};

export const fetchBacktestData = async (params: OptimizationParams): Promise<BacktestResult> => {
  const dates: string[] = [];
  const portfolio_values: number[] = [];
  const benchmark_values: number[] = [];
  
  let p_val = 10000;
  let b_val = 10000;
  
  for (let i = 0; i < 12; i++) {
    dates.push(`2025-${(i+1).toString().padStart(2, '0')}-01`);
    p_val *= (1 + 0.018 + (Math.sin(i) * 0.01));
    b_val *= (1 + 0.010 + (Math.cos(i) * 0.012));
    portfolio_values.push(Math.round(p_val));
    benchmark_values.push(Math.round(b_val));
  }

  return {
    dates,
    portfolio_values,
    benchmark_values,
    metrics: {
      total_return_portfolio: Number(((p_val - 10000) / 10000).toFixed(3)),
      total_return_benchmark: Number(((b_val - 10000) / 10000).toFixed(3)),
      outperformance: 0.052,
      final_portfolio_value: Math.round(p_val),
      final_benchmark_value: Math.round(b_val)
    }
  };
};

export const exportCSV = async (params: OptimizationParams) => {
  const csvContent = `Ticker,Allocation,Capital,Status\n` +
    params.tickers.map((t, idx) => `${t},${(1/params.budget_k*100).toFixed(1)}%,$${(params.investment_amount/params.budget_k).toFixed(2)},${idx < params.budget_k ? 'Selected' : 'Excluded'}`).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quantum_portfolio_results_demo.csv';
  a.click();
};

export const exportPDF = async (params: OptimizationParams) => {
  const reportSummary = `QUANTUM PORTFOLIO OPTIMIZATION REPORT (DEMO MODE)\n\n` +
    `Portfolio Summary:\n` +
    `Tickers: ${params.tickers.join(', ')}\n` +
    `Capital: $${params.investment_amount.toLocaleString()}\n` +
    `Expected Annual Return: 24.5%\n` +
    `Annual Volatility: 16.2%\n` +
    `Sharpe Ratio: 1.327\n\n` +
    `Quantum QAOA Solver vs Markowitz SLSQP:\n` +
    `Optimality Gap: 2.8%\n` +
    `Infeasibility Rate: 0.0%`;
  
  const blob = new Blob([reportSummary], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quantum_portfolio_report_demo.txt';
  a.click();
};
