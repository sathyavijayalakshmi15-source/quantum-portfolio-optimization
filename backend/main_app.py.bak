from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import io
import os

from market_data import fetch_stock_data, STOCK_UNIVERSE
from portfolio_engine import (
    optimize_classical_markowitz,
    exact_binary_portfolio_solver,
    compute_efficient_frontier,
    calculate_cvar_var,
    run_walk_forward_backtest
)
from quantum_engine import run_quantum_optimization, QAOAEngine
from pdf_generator import generate_portfolio_pdf_report

app = FastAPI(
    title="Quantum Portfolio Optimization Platform",
    description="High-performance web app utilizing Qiskit QAOA and Classical Markowitz algorithms for stock portfolio optimization.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files setup
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def serve_index():
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "Quantum Portfolio Optimization API is live."}

# Request Models
class MarketDataRequest(BaseModel):
    tickers: List[str] = Field(default=["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN"])
    period: str = Field(default="1y")

class OptimizationRequest(BaseModel):
    tickers: List[str] = Field(default=["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN"])
    risk_factor: float = Field(default=0.5, ge=0.0, le=1.0)
    budget_k: int = Field(default=3, ge=1)
    p_layers: int = Field(default=2, ge=1, le=5)
    period: str = Field(default="1y")
    investment_amount: float = Field(default=10000.0)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Quantum Portfolio Optimizer API",
        "version": "1.0.0",
        "domain": "Finance"
    }

@app.get("/api/stocks/universe")
def get_stock_universe():
    return {"universe": STOCK_UNIVERSE}

@app.post("/api/stocks/data")
def get_stock_data_endpoint(req: MarketDataRequest):
    prices, mu, cov = fetch_stock_data(req.tickers, req.period)
    
    vol = np.sqrt(np.diag(cov.values))
    vol_outer = np.outer(vol, vol)
    vol_outer[vol_outer == 0] = 1.0
    corr = cov.values / vol_outer
    
    return {
        "tickers": list(prices.columns),
        "expected_returns": {ticker: float(val) for ticker, val in mu.items()},
        "volatility": {ticker: float(np.sqrt(cov.loc[ticker, ticker])) for ticker in prices.columns},
        "covariance_matrix": cov.values.tolist(),
        "correlation_matrix": corr.tolist(),
        "historical_prices": prices.reset_index().to_dict(orient="records")
    }

@app.post("/api/optimize/classical")
def optimize_classical_endpoint(req: OptimizationRequest):
    prices, mu, cov = fetch_stock_data(req.tickers, req.period)
    classical_res = optimize_classical_markowitz(mu, cov, risk_factor=req.risk_factor, k_selection=req.budget_k)
    exact_res = exact_binary_portfolio_solver(mu, cov, risk_factor=req.risk_factor, k_budget=req.budget_k)
    
    allocation_dollars = {t: w * req.investment_amount for t, w in classical_res["weights"].items()}
    return {
        "classical": classical_res,
        "exact_solver": exact_res,
        "allocation_dollars": allocation_dollars
    }

@app.post("/api/optimize/quantum")
def optimize_quantum_endpoint(req: OptimizationRequest):
    prices, mu, cov = fetch_stock_data(req.tickers, req.period)
    
    quantum_res = run_quantum_optimization(
        mu, cov,
        risk_factor=req.risk_factor,
        k_budget=req.budget_k,
        p_layers=req.p_layers
    )
    
    exact_res = exact_binary_portfolio_solver(mu, cov, risk_factor=req.risk_factor, k_budget=req.budget_k)
    q_cost = quantum_res["best_cost"]
    exact_cost = exact_res["best_cost"]
    optimality_gap = abs(q_cost - exact_cost) / (abs(exact_cost) + 1e-6)
    quantum_res["optimality_gap"] = float(optimality_gap)
    
    allocation_dollars = {t: w * req.investment_amount for t, w in quantum_res["portfolio_weights"].items()}
    quantum_res["allocation_dollars"] = allocation_dollars
    
    return quantum_res

@app.post("/api/optimize/compare")
def compare_optimization_endpoint(req: OptimizationRequest):
    prices, mu, cov = fetch_stock_data(req.tickers, req.period)
    
    classical_res = optimize_classical_markowitz(mu, cov, risk_factor=req.risk_factor, k_selection=req.budget_k)
    exact_res = exact_binary_portfolio_solver(mu, cov, risk_factor=req.risk_factor, k_budget=req.budget_k)
    quantum_res = run_quantum_optimization(
        mu, cov,
        risk_factor=req.risk_factor,
        k_budget=req.budget_k,
        p_layers=req.p_layers
    )
    
    q_cost = quantum_res["best_cost"]
    exact_cost = exact_res["best_cost"]
    optimality_gap = abs(q_cost - exact_cost) / (abs(exact_cost) + 1e-6)
    quantum_res["optimality_gap"] = float(optimality_gap)

    returns_df = prices.pct_change().dropna()
    cvar_quantum = calculate_cvar_var(returns_df, quantum_res["portfolio_weights"])
    cvar_classical = calculate_cvar_var(returns_df, classical_res["weights"])

    return {
        "quantum": quantum_res,
        "classical": classical_res,
        "exact": exact_res,
        "risk_metrics": {
            "quantum": cvar_quantum,
            "classical": cvar_classical
        },
        "comparison_summary": {
            "quantum_sharpe": quantum_res["sharpe_ratio"],
            "classical_sharpe": classical_res["sharpe_ratio"],
            "quantum_return": quantum_res["expected_return"],
            "classical_return": classical_res["expected_return"],
            "quantum_risk": quantum_res["volatility"],
            "classical_risk": classical_res["volatility"],
            "optimality_gap_percent": float(optimality_gap * 100),
            "infeasibility_rate_percent": float(quantum_res["infeasibility_rate"] * 100)
        }
    }

@app.post("/api/efficient-frontier")
def efficient_frontier_endpoint(req: MarketDataRequest):
    prices, mu, cov = fetch_stock_data(req.tickers, req.period)
    frontier = compute_efficient_frontier(mu, cov, points=30)
    
    individual_assets = []
    for ticker in prices.columns:
        ret = float(mu[ticker])
        vol = float(np.sqrt(cov.loc[ticker, ticker]))
        individual_assets.append({
            "ticker": ticker,
            "expected_return": ret,
            "volatility": vol,
            "sharpe_ratio": float((ret - 0.03) / vol) if vol > 0 else 0
        })
        
    return {
        "frontier": frontier,
        "assets": individual_assets
    }

@app.post("/api/quantum/circuit")
def get_quantum_circuit_endpoint(req: OptimizationRequest):
    prices, mu, cov = fetch_stock_data(req.tickers, req.period)
    engine = QAOAEngine(mu, cov, risk_factor=req.risk_factor, k_budget=req.budget_k, p_layers=req.p_layers)
    metadata = engine.get_circuit_metadata()
    return metadata

@app.post("/api/backtest")
def run_backtest_endpoint(req: OptimizationRequest):
    prices, mu, cov = fetch_stock_data(req.tickers, period="2y")
    results = run_walk_forward_backtest(prices, k_budget=req.budget_k)
    return results

@app.post("/api/export/csv")
def export_csv_endpoint(req: OptimizationRequest):
    prices, mu, cov = fetch_stock_data(req.tickers, req.period)
    classical_res = optimize_classical_markowitz(mu, cov, risk_factor=req.risk_factor, k_selection=req.budget_k)
    quantum_res = run_quantum_optimization(mu, cov, risk_factor=req.risk_factor, k_budget=req.budget_k, p_layers=req.p_layers)
    
    output = io.StringIO()
    output.write("Ticker,Quantum Weight %,Quantum Dollars,Classical Weight %,Classical Dollars,Expected Annual Return %,Volatility %\n")
    
    for t in req.tickers:
        qw = quantum_res["portfolio_weights"].get(t, 0.0)
        cw = classical_res["weights"].get(t, 0.0)
        q_dol = qw * req.investment_amount
        c_dol = cw * req.investment_amount
        ret = float(mu.get(t, 0.0)) * 100
        vol = float(np.sqrt(cov.loc[t, t])) * 100 if t in cov.columns else 0.0
        
        output.write(f"{t},{qw*100:.2f},{q_dol:.2f},{cw*100:.2f},{c_dol:.2f},{ret:.2f},{vol:.2f}\n")
        
    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=quantum_portfolio_results.csv"
    return response

@app.post("/api/export/pdf")
def export_pdf_endpoint(req: OptimizationRequest):
    prices, mu, cov = fetch_stock_data(req.tickers, req.period)
    classical_res = optimize_classical_markowitz(mu, cov, risk_factor=req.risk_factor, k_selection=req.budget_k)
    quantum_res = run_quantum_optimization(mu, cov, risk_factor=req.risk_factor, k_budget=req.budget_k, p_layers=req.p_layers)
    
    exact_res = exact_binary_portfolio_solver(mu, cov, risk_factor=req.risk_factor, k_budget=req.budget_k)
    q_cost = quantum_res["best_cost"]
    exact_cost = exact_res["best_cost"]
    quantum_res["optimality_gap"] = float(abs(q_cost - exact_cost) / (abs(exact_cost) + 1e-6))
    
    pdf_bytes = generate_portfolio_pdf_report({
        "quantum": quantum_res,
        "classical": classical_res,
        "exact": exact_res
    })
    
    response = Response(content=pdf_bytes, media_type="application/pdf")
    response.headers["Content-Disposition"] = "attachment; filename=quantum_portfolio_report.pdf"
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
