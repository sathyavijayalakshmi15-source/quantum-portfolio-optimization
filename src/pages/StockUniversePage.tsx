import React, { useState } from 'react';
import { StockItem } from '../types';
import { Globe, Search, Filter, TrendingUp, ShieldAlert, BarChart2 } from 'lucide-react';

interface StockUniversePageProps {
  universe: StockItem[];
  selectedTickers: string[];
  onToggleTicker: (ticker: string) => void;
}

export const StockUniversePage: React.FC<StockUniversePageProps> = ({
  universe,
  selectedTickers,
  onToggleTicker
}) => {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  const sectors = ['All', ...Array.from(new Set(universe.map(u => u.sector)))];

  const filteredUniverse = universe.filter(item => {
    const matchesSearch = item.ticker.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'All' || item.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
            <Globe className="w-6 h-6 text-cyan-400" />
            <span>Stock Universe & Asset Explorer</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and curate equity assets for quantum Hamiltonian mapping.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ticker or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-surface-border rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sector Filter Chips */}
      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
        {sectors.map(sector => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedSector === sector
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                : 'bg-slate-900/60 text-slate-400 border border-surface-border hover:bg-slate-800'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredUniverse.map(stock => {
          const isSelected = selectedTickers.includes(stock.ticker);
          return (
            <div
              key={stock.ticker}
              onClick={() => onToggleTicker(stock.ticker)}
              className={`p-5 rounded-2xl glass-card border transition-all cursor-pointer space-y-4 ${
                isSelected
                  ? 'border-cyan-500/50 bg-cyan-950/10 shadow-glow-cyan'
                  : 'border-surface-border hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-extrabold text-lg text-white block">{stock.ticker}</span>
                  <span className="text-xs text-slate-400 line-clamp-1">{stock.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                  isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isSelected ? 'Selected' : 'Add'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-surface-border">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Sector</span>
                  <span className="text-slate-200 font-medium">{stock.sector}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Market Cap</span>
                  <span className="text-slate-200 font-mono font-medium">{stock.market_cap}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
