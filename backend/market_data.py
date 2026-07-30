import numpy as np
import pandas as pd
import yfinance as yf
from typing import List, Dict, Any, Tuple
import datetime

# Predefined universe of popular stocks categorized by sector
STOCK_UNIVERSE = [
    {"ticker": "AAPL", "name": "Apple Inc.", "sector": "Technology", "market_cap": "3.3T"},
    {"ticker": "MSFT", "name": "Microsoft Corp.", "sector": "Technology", "market_cap": "3.1T"},
    {"ticker": "NVDA", "name": "NVIDIA Corp.", "sector": "Technology", "market_cap": "3.0T"},
    {"ticker": "GOOGL", "name": "Alphabet Inc.", "sector": "Technology", "market_cap": "2.2T"},
    {"ticker": "AMZN", "name": "Amazon.com Inc.", "sector": "Consumer Cyclical", "market_cap": "1.9T"},
    {"ticker": "META", "name": "Meta Platforms Inc.", "sector": "Technology", "market_cap": "1.3T"},
    {"ticker": "TSLA", "name": "Tesla Inc.", "sector": "Consumer Cyclical", "market_cap": "750B"},
    {"ticker": "JPM", "name": "JPMorgan Chase & Co.", "sector": "Financial Services", "market_cap": "580B"},
    {"ticker": "V", "name": "Visa Inc.", "sector": "Financial Services", "market_cap": "540B"},
    {"ticker": "UNH", "name": "UnitedHealth Group", "sector": "Healthcare", "market_cap": "510B"},
    {"ticker": "WMT", "name": "Walmart Inc.", "sector": "Consumer Defensive", "market_cap": "530B"},
    {"ticker": "PG", "name": "Procter & Gamble Co.", "sector": "Consumer Defensive", "market_cap": "390B"},
    {"ticker": "JNJ", "name": "Johnson & Johnson", "sector": "Healthcare", "market_cap": "370B"},
    {"ticker": "HD", "name": "Home Depot Inc.", "sector": "Consumer Cyclical", "market_cap": "360B"},
    {"ticker": "BAC", "name": "Bank of America Corp", "sector": "Financial Services", "market_cap": "310B"},
    {"ticker": "XOM", "name": "Exxon Mobil Corp.", "sector": "Energy", "market_cap": "480B"},
    {"ticker": "CVX", "name": "Chevron Corp.", "sector": "Energy", "market_cap": "290B"},
    {"ticker": "LLY", "name": "Eli Lilly and Co", "sector": "Healthcare", "market_cap": "720B"},
    {"ticker": "BRK-B", "name": "Berkshire Hathaway", "sector": "Financial Services", "market_cap": "900B"},
    {"ticker": "AMD", "name": "Advanced Micro Devices", "sector": "Technology", "market_cap": "260B"}
]

def generate_synthetic_data(tickers: List[str], days: int = 252) -> pd.DataFrame:
    """Generates realistic synthetic stock price data as a robust fallback."""
    np.random.seed(42)
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=days * 7 // 5)
    dates = pd.bdate_range(start=start_date, periods=days)
    
    n_assets = len(tickers)
    # Generate realistic mean returns and volatility
    base_returns = np.random.uniform(0.08, 0.25, n_assets) / 252.0
    vols = np.random.uniform(0.15, 0.40, n_assets) / np.sqrt(252.0)
    
    # Generate random positive-definite correlation matrix
    A = np.random.randn(n_assets, n_assets)
    corr = np.dot(A, A.T)
    d = np.sqrt(np.diag(corr))
    corr = corr / np.outer(d, d)
    
    cov = np.outer(vols, vols) * corr
    
    daily_returns = np.random.multivariate_normal(base_returns, cov, days)
    
    price_paths = {}
    base_prices = np.random.uniform(50, 500, n_assets)
    
    for i, ticker in enumerate(tickers):
        prices = base_prices[i] * np.exp(np.cumsum(daily_returns[:, i]))
        price_paths[ticker] = prices
        
    df = pd.DataFrame(price_paths, index=dates)
    return df

def fetch_stock_data(tickers: List[str], period: str = "1y") -> Tuple[pd.DataFrame, pd.Series, pd.DataFrame]:
    """
    Fetches historical stock prices using yfinance. 
    Falls back to synthetic data if API fails or tickers are invalid.
    Returns: (prices_df, expected_returns, covariance_matrix)
    """
    if not tickers:
        tickers = ["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN"]
        
    tickers = [t.upper().strip() for t in tickers]
    
    try:
        data = yf.download(tickers, period=period, progress=False, auto_adjust=True)
        if isinstance(data, pd.DataFrame) and 'Close' in data.columns:
            prices = data['Close']
        elif isinstance(data, pd.DataFrame) and not data.empty and len(tickers) == 1:
            prices = data[['Close']] if 'Close' in data.columns else data
        else:
            prices = data
            
        if isinstance(prices, pd.DataFrame):
            prices = prices.dropna(axis=1, how='all').dropna(axis=0, how='all')
        
        # Check if downloaded data is sufficient
        if prices.empty or len(prices.columns.intersection(tickers)) < len(tickers):
            prices = generate_synthetic_data(tickers)
    except Exception as e:
        print(f"yFinance fetch failed with error {e}. Using synthetic market data generator.")
        prices = generate_synthetic_data(tickers)

    # Clean prices
    prices = prices.ffill().bfill()
    
    # Calculate daily log returns
    daily_returns = np.log(prices / prices.shift(1)).dropna()
    
    # Annualized expected return (252 trading days)
    expected_returns = daily_returns.mean() * 252
    
    # Annualized covariance matrix
    cov_matrix = daily_returns.cov() * 252
    
    return prices, expected_returns, cov_matrix
