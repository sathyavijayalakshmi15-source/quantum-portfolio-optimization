import numpy as np
import pandas as pd
from scipy.optimize import minimize
from typing import List, Dict, Any, Tuple

def portfolio_cost(weights: np.ndarray, mu: np.ndarray, sigma: np.ndarray, risk_factor: float) -> float:
    """
    Mean-Variance loss function: q * w^T Sigma w - (1 - q) * mu^T w
    where risk_factor q in [0, 1].
    """
    portfolio_return = np.dot(weights, mu)
    portfolio_risk = np.dot(weights.T, np.dot(sigma, weights))
    return risk_factor * portfolio_risk - (1 - risk_factor) * portfolio_return

def optimize_classical_markowitz(mu: pd.Series, cov: pd.DataFrame, risk_factor: float = 0.5, k_selection: int = None) -> Dict[str, Any]:
    """
    Computes optimal portfolio weights using SciPy SLSQP optimizer.
    If k_selection is given, selects top k assets based on continuous weights.
    """
    tickers = list(mu.index)
    n = len(tickers)
    mu_vec = mu.values
    sigma_mat = cov.values

    # Equal initial guess
    init_weights = np.ones(n) / n
    bounds = tuple((0.0, 1.0) for _ in range(n))
    constraints = [{'type': 'eq', 'fun': lambda w: np.sum(w) - 1.0}]

    res = minimize(
        fun=portfolio_cost,
        x0=init_weights,
        args=(mu_vec, sigma_mat, risk_factor),
        method='SLSQP',
        bounds=bounds,
        constraints=constraints
    )

    weights = res.x
    weights = np.where(weights < 1e-4, 0, weights)
    if np.sum(weights) > 0:
        weights /= np.sum(weights)

    if k_selection and k_selection < n:
        # Keep top k assets
        top_k_indices = np.argsort(weights)[-k_selection:]
        new_weights = np.zeros(n)
        new_weights[top_k_indices] = weights[top_k_indices]
        if np.sum(new_weights) > 0:
            new_weights /= np.sum(new_weights)
        weights = new_weights

    ret = float(np.dot(weights, mu_vec))
    vol = float(np.sqrt(np.dot(weights.T, np.dot(sigma_mat, weights))))
    sharpe = float((ret - 0.03) / vol) if vol > 0 else 0.0

    return {
        "tickers": tickers,
        "weights": {ticker: float(w) for ticker, w in zip(tickers, weights)},
        "weights_array": weights.tolist(),
        "expected_return": ret,
        "volatility": vol,
        "sharpe_ratio": sharpe,
        "cost": float(res.fun),
        "selected_count": int(np.count_nonzero(weights > 0.001))
    }

def exact_binary_portfolio_solver(mu: pd.Series, cov: pd.DataFrame, risk_factor: float = 0.5, k_budget: int = 3, penalty: float = 10.0) -> Dict[str, Any]:
    """
    Brute-force solver over all 2^N binary selection combinations.
    Minimizes: q * x^T Sigma x - (1 - q) * mu^T x + penalty * (sum(x) - k)^2
    Returns the true global optimal bitstring and cost.
    """
    tickers = list(mu.index)
    n = len(tickers)
    mu_vec = mu.values
    sigma_mat = cov.values

    best_cost = float('inf')
    best_bitstring = '0' * n
    all_results = []

    for i in range(1 << n):
        bitstring = format(i, f'0{n}b')
        x = np.array([int(b) for b in bitstring])
        
        # Binary portfolio cost with quadratic cardinality penalty
        ret_part = np.dot(x, mu_vec)
        risk_part = np.dot(x.T, np.dot(sigma_mat, x))
        cardinality_penalty = penalty * (np.sum(x) - k_budget) ** 2
        
        cost = risk_factor * risk_part - (1 - risk_factor) * ret_part + cardinality_penalty
        
        is_feasible = (np.sum(x) == k_budget)
        
        if cost < best_cost and is_feasible:
            best_cost = cost
            best_bitstring = bitstring

        all_results.append({
            "bitstring": bitstring,
            "cost": float(cost),
            "feasible": is_feasible
        })

    # Normalized weights for selected bitstring
    x_opt = np.array([int(b) for b in best_bitstring])
    num_selected = int(np.sum(x_opt))
    weights = x_opt / num_selected if num_selected > 0 else np.ones(n) / n

    ret = float(np.dot(weights, mu_vec))
    vol = float(np.sqrt(np.dot(weights.T, np.dot(sigma_mat, weights))))
    sharpe = float((ret - 0.03) / vol) if vol > 0 else 0.0

    return {
        "best_bitstring": best_bitstring,
        "best_cost": float(best_cost),
        "selected_tickers": [tickers[idx] for idx, b in enumerate(best_bitstring) if b == '1'],
        "weights": {ticker: float(w) for ticker, w in zip(tickers, weights)},
        "expected_return": ret,
        "volatility": vol,
        "sharpe_ratio": sharpe,
        "total_combinations": 1 << n
    }

def compute_efficient_frontier(mu: pd.Series, cov: pd.DataFrame, points: int = 25) -> List[Dict[str, float]]:
    """Generates the Markowitz Efficient Frontier curve points."""
    frontier = []
    risk_factors = np.linspace(0.01, 0.99, points)
    
    for rf in risk_factors:
        res = optimize_classical_markowitz(mu, cov, risk_factor=rf)
        frontier.append({
            "risk_factor": float(rf),
            "volatility": float(res["volatility"]),
            "expected_return": float(res["expected_return"]),
            "sharpe_ratio": float(res["sharpe_ratio"])
        })
        
    return frontier

def calculate_cvar_var(returns_df: pd.DataFrame, weights: Dict[str, float], confidence_level: float = 0.95) -> Dict[str, float]:
    """Calculates Value at Risk (VaR) and Conditional Value at Risk (CVaR)."""
    tickers = list(weights.keys())
    w_vec = np.array([weights[t] for t in tickers])
    
    portfolio_daily_returns = returns_df[tickers].dot(w_vec)
    
    sorted_returns = np.sort(portfolio_daily_returns.values)
    index = int((1 - confidence_level) * len(sorted_returns))
    
    var_daily = -sorted_returns[index]
    cvar_daily = -np.mean(sorted_returns[:index])
    
    # Annualized metrics
    var_annual = var_daily * np.sqrt(252)
    cvar_annual = cvar_daily * np.sqrt(252)
    
    # Max Drawdown
    cum_returns = (1 + portfolio_daily_returns).cumprod()
    peak = cum_returns.cummax()
    drawdown = (cum_returns - peak) / peak
    max_drawdown = float(drawdown.min())
    
    return {
        "var_95_daily": float(var_daily),
        "cvar_95_daily": float(cvar_daily),
        "var_95_annual": float(var_annual),
        "cvar_95_annual": float(cvar_annual),
        "max_drawdown": abs(float(max_drawdown)),
        "skewness": float(portfolio_daily_returns.skew()),
        "kurtosis": float(portfolio_daily_returns.kurtosis())
    }

def run_walk_forward_backtest(prices_df: pd.DataFrame, k_budget: int = 3) -> Dict[str, Any]:
    """Simulates a 12-month walk-forward rolling rebalance backtest."""
    n_days = len(prices_df)
    train_window = min(126, n_days // 2)
    rebalance_freq = 21 # Monthly
    
    portfolio_history = []
    benchmark_history = []
    dates = []
    
    initial_capital = 10000.0
    port_val = initial_capital
    bench_val = initial_capital
    
    daily_returns = prices_df.pct_change().dropna()
    tickers = list(prices_df.columns)
    n_assets = len(tickers)
    
    current_weights = np.ones(n_assets) / n_assets
    
    for i in range(train_window, n_days - 1, rebalance_freq):
        # Rolling training data
        hist_returns = daily_returns.iloc[i-train_window:i]
        mu = hist_returns.mean() * 252
        cov = hist_returns.cov() * 252
        
        # Run optimization
        opt = optimize_classical_markowitz(mu, cov, risk_factor=0.5, k_selection=k_budget)
        current_weights = np.array([opt["weights"][t] for t in tickers])
        
        # Out-of-sample period
        end_idx = min(i + rebalance_freq, n_days)
        period_returns = daily_returns.iloc[i:end_idx]
        
        for dt, day_ret in period_returns.iterrows():
            port_ret = np.dot(current_weights, day_ret.values)
            bench_ret = np.mean(day_ret.values)
            
            port_val *= (1 + port_ret)
            bench_val *= (1 + bench_ret)
            
            dates.append(dt.strftime("%Y-%m-%d"))
            portfolio_history.append(float(port_val))
            benchmark_history.append(float(bench_val))
            
    # Calculate performance summary
    total_port_ret = (port_val - initial_capital) / initial_capital
    total_bench_ret = (bench_val - initial_capital) / initial_capital
    
    return {
        "dates": dates,
        "portfolio_values": portfolio_history,
        "benchmark_values": benchmark_history,
        "metrics": {
            "total_return_portfolio": float(total_port_ret),
            "total_return_benchmark": float(total_bench_ret),
            "outperformance": float(total_port_ret - total_bench_ret),
            "final_portfolio_value": float(port_val),
            "final_benchmark_value": float(bench_val)
        }
    }
