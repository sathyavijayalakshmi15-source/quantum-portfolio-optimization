export interface StockItem {
  ticker: string;
  name: string;
  sector: string;
  market_cap: string;
  expected_return?: number;
  volatility?: number;
}

export interface OptimizationParams {
  tickers: string[];
  risk_factor: number;
  budget_k: number;
  p_layers: number;
  period: string;
  investment_amount: number;
}

export interface QuantumOptimizationResult {
  optimal_gamma: number[];
  optimal_beta: number[];
  optimal_bitstring: string;
  best_cost: number;
  expected_energy: number;
  infeasibility_rate: number;
  selected_tickers: string[];
  portfolio_weights: Record<string, number>;
  allocation_dollars?: Record<string, number>;
  expected_return: number;
  volatility: number;
  sharpe_ratio: number;
  optimality_gap?: number;
  optimization_history: number[];
  top_bitstrings: Array<{
    bitstring: string;
    probability: number;
    cost: number;
    selected_count: number;
    is_feasible: boolean;
  }>;
  circuit_metadata?: {
    num_qubits: number;
    num_clbits: number;
    depth: number;
    p_layers: number;
    gate_counts: Record<string, number>;
    total_gates: number;
    ascii_diagram: string;
    gate_sequence: Array<{
      gate: string;
      targets: number[];
      param?: string;
      layer: string;
    }>;
  };
}

export interface ClassicalOptimizationResult {
  tickers: string[];
  weights: Record<string, number>;
  weights_array: number[];
  expected_return: number;
  volatility: number;
  sharpe_ratio: number;
  cost: number;
  selected_count: number;
}

export interface ExactSolverResult {
  best_bitstring: string;
  best_cost: number;
  selected_tickers: string[];
  weights: Record<string, number>;
  expected_return: number;
  volatility: number;
  sharpe_ratio: number;
  total_combinations: number;
}

export interface RiskMetrics {
  var_95_daily: number;
  cvar_95_daily: number;
  var_95_annual: number;
  cvar_95_annual: number;
  max_drawdown: number;
  skewness: number;
  kurtosis: number;
}

export interface ComparisonResult {
  quantum: QuantumOptimizationResult;
  classical: ClassicalOptimizationResult;
  exact: ExactSolverResult;
  risk_metrics: {
    quantum: RiskMetrics;
    classical: RiskMetrics;
  };
  comparison_summary: {
    quantum_sharpe: number;
    classical_sharpe: number;
    quantum_return: number;
    classical_return: number;
    quantum_risk: number;
    classical_risk: number;
    optimality_gap_percent: number;
    infeasibility_rate_percent: number;
  };
}

export interface EfficientFrontierData {
  frontier: Array<{
    risk_factor: number;
    volatility: number;
    expected_return: number;
    sharpe_ratio: number;
  }>;
  assets: Array<{
    ticker: string;
    expected_return: number;
    volatility: number;
    sharpe_ratio: number;
  }>;
}

export interface BacktestResult {
  dates: string[];
  portfolio_values: number[];
  benchmark_values: number[];
  metrics: {
    total_return_portfolio: number;
    total_return_benchmark: number;
    outperformance: number;
    final_portfolio_value: number;
    final_benchmark_value: number;
  };
}
