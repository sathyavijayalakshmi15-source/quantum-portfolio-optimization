# Q-Optima | Quantum Portfolio Optimization Platform

A web platform leveraging **IBM Qiskit** Quantum Approximate Optimization Algorithm (QAOA) and **Markowitz Modern Portfolio Theory** to optimize equity investment portfolios.

## Key Features

- **Qiskit QAOA Integration**: Isomorphic mapping of non-convex stock portfolio selection to Ising Hamiltonians.
- **Feasibility-Preserving Dicke States**: Zero-infeasibility ($0.0\%$) Dicke state preparation ($|D_K^N\rangle$) with particle-conserving ring XY mixers.
- **CVaR Tail-Loss Minimization**: Conditional Value-at-Risk ($95\%$) expectation evaluation protecting against market downturns.
- **Classical vs Quantum Benchmarking**: Parallel benchmarking against SciPy SLSQP Markowitz optimizer and exact $2^N$ binary eigensolver.
- **Markowitz Efficient Frontier**: Interactive risk-return scatter plots and tangency portfolio visualizers.
- **Walk-Forward Backtesting**: 12-month rolling window backtests with transaction costs and benchmark comparison.
- **PDF & CSV Export**: Automated PDF report generator with executive summary and Qiskit quantum circuit parameters.

## Technology Stack

- **Frontend**: Next.js / Vite, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Qiskit 1.0+, NumPy, SciPy, Pandas, yFinance, ReportLab

## Quick Start

### 1. Launch FastAPI Backend

```bash
cd backend
python main.py
```
Backend runs at `http://127.0.0.1:8000`

### 2. Launch React Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`

## Domain Compliance

Strictly focused on financial asset management, stock selection, risk quantification, and quantum algorithm benchmarking. Contains **NO** medical or non-financial domain components.
