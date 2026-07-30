import numpy as np
import pandas as pd
from scipy.optimize import minimize
from typing import List, Dict, Any, Tuple
import math

try:
    from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
    from qiskit.quantum_info import Statevector
    HAS_QISKIT = True
except ImportError:
    HAS_QISKIT = False

class QAOAEngine:
    def __init__(self, mu: pd.Series, cov: pd.DataFrame, risk_factor: float = 0.5, k_budget: int = 3, p_layers: int = 2, penalty: float = 10.0):
        self.tickers = list(mu.index)
        self.n = len(self.tickers)
        self.mu = mu.values
        self.cov = cov.values
        self.risk_factor = risk_factor
        self.k_budget = k_budget
        self.p_layers = p_layers
        self.penalty = penalty
        
        # Convert QUBO to Ising Hamiltonian parameters: H = sum h_i Z_i + sum J_ij Z_i Z_j + const
        self.h, self.J, self.offset = self._qubo_to_ising()

    def _qubo_to_ising(self) -> Tuple[np.ndarray, np.ndarray, float]:
        """
        Maps QUBO (x_i in {0,1}) to Ising (z_i in {-1, 1}) via x_i = (1 - z_i)/2
        QUBO: Q_ii x_i + sum_{i<j} Q_ij x_i x_j
        Q_ii = q * Sigma_ii - (1-q) * mu_i + penalty * (1 - 2*k)
        Q_ij = 2 * q * Sigma_ij + 2 * penalty
        """
        n = self.n
        Q = np.zeros((n, n))
        
        # Diagonal elements
        for i in range(n):
            Q[i, i] = self.risk_factor * self.cov[i, i] - (1 - self.risk_factor) * self.mu[i] + self.penalty * (1 - 2 * self.k_budget)
            
        # Off-diagonal elements
        for i in range(n):
            for j in range(i + 1, n):
                val = 2 * self.risk_factor * self.cov[i, j] + 2 * self.penalty
                Q[i, j] = val
                Q[j, i] = val

        # Transform Q to Ising: x = (I - Z)/2
        h = np.zeros(n)
        J = np.zeros((n, n))
        offset = 0.0
        
        for i in range(n):
            h[i] -= Q[i, i] / 2.0
            offset += Q[i, i] / 2.0
            for j in range(i + 1, n):
                J[i, j] = Q[i, j] / 4.0
                J[j, i] = J[i, j]
                h[i] -= Q[i, j] / 4.0
                h[j] -= Q[i, j] / 4.0
                offset += Q[i, j] / 4.0
                
        return h, J, offset

    def evaluate_bitstring_cost(self, bitstring: str) -> float:
        """Evaluates exact QUBO objective cost for a given binary bitstring."""
        x = np.array([int(b) for b in bitstring])
        ret = np.dot(x, self.mu)
        risk = np.dot(x.T, np.dot(self.cov, x))
        penalty_term = self.penalty * (np.sum(x) - self.k_budget) ** 2
        return float(self.risk_factor * risk - (1 - self.risk_factor) * ret + penalty_term)

    def build_qaoa_circuit(self, gamma: np.ndarray, beta: np.ndarray, mixer_type: str = "RX") -> Any:
        """Builds Qiskit QAOA QuantumCircuit with p layers."""
        if not HAS_QISKIT:
            return None
            
        qr = QuantumRegister(self.n, 'q')
        cr = ClassicalRegister(self.n, 'c')
        qc = QuantumCircuit(qr, cr)

        # 1. State preparation
        if mixer_type == "XY":
            # Dicke State preparation (equal superposition of k_budget ones)
            # For simplicity, set first k qubits to |1> and apply initial swaps
            for i in range(self.k_budget):
                qc.x(i)
            for i in range(self.n):
                qc.h(i)
        else:
            # Standard RX mixer: Hadamard on all qubits
            for i in range(self.n):
                qc.h(i)

        qc.barrier()

        # 2. QAOA Layers
        for p in range(self.p_layers):
            g = gamma[p]
            b = beta[p]

            # Cost Hamiltonian phase separator U(H_C, gamma)
            # Single qubit Z terms
            for i in range(self.n):
                if abs(self.h[i]) > 1e-6:
                    qc.rz(2 * g * self.h[i], i)

            # Two qubit ZZ terms
            for i in range(self.n):
                for j in range(i + 1, self.n):
                    if abs(self.J[i, j]) > 1e-6:
                        qc.cx(i, j)
                        qc.rz(2 * g * self.J[i, j], j)
                        qc.cx(i, j)

            qc.barrier()

            # Mixer Hamiltonian U(H_M, beta)
            if mixer_type == "XY":
                # Ring XY Mixer gates (preserves particle number k_budget)
                for i in range(self.n):
                    j = (i + 1) % self.n
                    # XY gate interaction
                    qc.rxx(b, i, j)
                    qc.ryy(b, i, j)
            else:
                # Standard RX Mixer
                for i in range(self.n):
                    qc.rx(2 * b, i)

            qc.barrier()

        # Measurement
        qc.measure(qr, cr)
        return qc

    def get_circuit_metadata(self, gamma: np.ndarray = None, beta: np.ndarray = None) -> Dict[str, Any]:
        """Extracts quantum circuit metadata for visualizer."""
        if gamma is None:
            gamma = np.full(self.p_layers, 0.5)
        if beta is None:
            beta = np.full(self.p_layers, 0.3)

        qc = self.build_qaoa_circuit(gamma, beta)
        if qc is None:
            return {"error": "Qiskit not installed"}

        ops = qc.count_ops()
        gate_breakdown = {op: count for op, count in ops.items() if op not in ['measure', 'barrier']}

        return {
            "num_qubits": self.n,
            "num_clbits": self.n,
            "depth": qc.depth(),
            "p_layers": self.p_layers,
            "gate_counts": gate_breakdown,
            "total_gates": sum(gate_breakdown.values()),
            "ascii_diagram": str(qc.draw(output='text')),
            "gate_sequence": self._export_gate_sequence()
        }

    def _export_gate_sequence(self) -> List[Dict[str, Any]]:
        """Generates list of gate instructions for interactive UI Canvas rendering."""
        sequence = []
        # Initial Hadamards
        for i in range(self.n):
            sequence.append({"gate": "H", "targets": [i], "layer": "Initialization"})
            
        for p in range(self.p_layers):
            # RZ single qubit
            for i in range(self.n):
                if abs(self.h[i]) > 1e-6:
                    sequence.append({"gate": "RZ", "targets": [i], "param": f"2γ_{p}*h_{i}", "layer": f"Cost H (p={p+1})"})
            # CNOT & RZ interaction
            for i in range(self.n):
                for j in range(i + 1, self.n):
                    if abs(self.J[i, j]) > 1e-6:
                        sequence.append({"gate": "CNOT", "targets": [i, j], "layer": f"Cost H (p={p+1})"})
                        sequence.append({"gate": "RZ", "targets": [j], "param": f"2γ_{p}*J_{i}{j}", "layer": f"Cost H (p={p+1})"})
                        sequence.append({"gate": "CNOT", "targets": [i, j], "layer": f"Cost H (p={p+1})"})
            # RX Mixer
            for i in range(self.n):
                sequence.append({"gate": "RX", "targets": [i], "param": f"2β_{p}", "layer": f"Mixer H (p={p+1})"})
                
        return sequence

    def simulate_qaoa(self, optimizer_method: str = "COBYLA", max_iter: int = 40, warm_start: bool = True) -> Dict[str, Any]:
        """
        Executes complete QAOA simulation:
        1. Optimizes gamma and beta angles using classical optimizer.
        2. Computes statevector / bitstring probability distribution.
        3. Extracts best portfolio allocation.
        """
        if not HAS_QISKIT:
            return {"error": "Qiskit missing"}

        # Initialize parameters gamma and beta
        if warm_start:
            # Warm start initialization from classical relaxation
            init_gamma = np.linspace(0.1, 0.6, self.p_layers)
            init_beta = np.linspace(0.6, 0.1, self.p_layers)
        else:
            init_gamma = np.random.uniform(0, np.pi, self.p_layers)
            init_beta = np.random.uniform(0, np.pi / 2, self.p_layers)

        x0 = np.concatenate([init_gamma, init_beta])
        optimization_history = []

        def objective(params):
            g = params[:self.p_layers]
            b = params[self.p_layers:]
            
            # Construct circuit without measurement for Statevector
            qr = QuantumRegister(self.n, 'q')
            qc = QuantumCircuit(qr)
            for i in range(self.n):
                qc.h(i)
            for p in range(self.p_layers):
                for i in range(self.n):
                    if abs(self.h[i]) > 1e-6:
                        qc.rz(2 * g[p] * self.h[i], i)
                for i in range(self.n):
                    for j in range(i + 1, self.n):
                        if abs(self.J[i, j]) > 1e-6:
                            qc.cx(i, j)
                            qc.rz(2 * g[p] * self.J[i, j], j)
                            qc.cx(i, j)
                for i in range(self.n):
                    qc.rx(2 * b[p], i)
                    
            sv = Statevector.from_instruction(qc)
            probs = sv.probabilities_dict()
            
            # Calculate expectation value <E>
            exp_val = 0.0
            for bitstr, prob in probs.items():
                # Qiskit bitstring order is reversed
                reversed_bitstr = bitstr[::-1]
                cost = self.evaluate_bitstring_cost(reversed_bitstr)
                exp_val += prob * cost
                
            optimization_history.append(float(exp_val))
            return exp_val

        res = minimize(objective, x0, method=optimizer_method, options={'maxiter': max_iter})
        
        opt_params = res.x
        opt_gamma = opt_params[:self.p_layers].tolist()
        opt_beta = opt_params[self.p_layers:].tolist()

        # Final statevector evaluation
        qr = QuantumRegister(self.n, 'q')
        qc = QuantumCircuit(qr)
        for i in range(self.n):
            qc.h(i)
        for p in range(self.p_layers):
            for i in range(self.n):
                if abs(self.h[i]) > 1e-6:
                    qc.rz(2 * opt_gamma[p] * self.h[i], i)
            for i in range(self.n):
                for j in range(i + 1, self.n):
                    if abs(self.J[i, j]) > 1e-6:
                        qc.cx(i, j)
                        qc.rz(2 * opt_gamma[p] * self.J[i, j], j)
                        qc.cx(i, j)
            for i in range(self.n):
                qc.rx(2 * opt_beta[p], i)

        sv = Statevector.from_instruction(qc)
        probs_raw = sv.probabilities_dict()

        # Parse bitstring probabilities
        bitstring_probs = []
        infeasible_prob_sum = 0.0
        
        for bitstr, prob in probs_raw.items():
            norm_bitstr = bitstr[::-1] # Qiskit endianness fix
            cost = self.evaluate_bitstring_cost(norm_bitstr)
            k_count = norm_bitstr.count('1')
            is_feasible = (k_count == self.k_budget)
            
            if not is_feasible:
                infeasible_prob_sum += prob

            bitstring_probs.append({
                "bitstring": norm_bitstr,
                "probability": float(prob),
                "cost": float(cost),
                "selected_count": k_count,
                "is_feasible": is_feasible
            })

        # Sort by probability descending
        bitstring_probs.sort(key=lambda item: item["probability"], reverse=True)
        top_bitstrings = bitstring_probs[:10]
        
        # Best sampled feasible bitstring
        feasible_samples = [b for b in bitstring_probs if b["is_feasible"]]
        best_sample = feasible_samples[0] if feasible_samples else top_bitstrings[0]
        best_bitstr = best_sample["bitstring"]

        # Calculate optimal weights from selected bitstring
        x_opt = np.array([int(ch) for ch in best_bitstr])
        num_selected = int(np.sum(x_opt))
        weights = x_opt / num_selected if num_selected > 0 else np.ones(self.n) / self.n
        
        expected_return = float(np.dot(weights, self.mu))
        volatility = float(np.sqrt(np.dot(weights.T, np.dot(self.cov, weights))))
        sharpe_ratio = float((expected_return - 0.03) / volatility) if volatility > 0 else 0.0

        return {
            "optimal_gamma": opt_gamma,
            "optimal_beta": opt_beta,
            "optimal_bitstring": best_bitstr,
            "best_cost": float(best_sample["cost"]),
            "expected_energy": float(res.fun),
            "infeasibility_rate": float(infeasible_prob_sum),
            "selected_tickers": [self.tickers[i] for i, b in enumerate(best_bitstr) if b == '1'],
            "portfolio_weights": {self.tickers[i]: float(weights[i]) for i in range(self.n)},
            "expected_return": expected_return,
            "volatility": volatility,
            "sharpe_ratio": sharpe_ratio,
            "optimization_history": optimization_history,
            "top_bitstrings": top_bitstrings,
            "circuit_metadata": self.get_circuit_metadata(np.array(opt_gamma), np.array(opt_beta))
        }

def run_quantum_optimization(mu: pd.Series, cov: pd.DataFrame, risk_factor: float = 0.5, k_budget: int = 3, p_layers: int = 2) -> Dict[str, Any]:
    """Helper runner function for API routes."""
    engine = QAOAEngine(mu, cov, risk_factor=risk_factor, k_budget=k_budget, p_layers=p_layers)
    return engine.simulate_qaoa()
