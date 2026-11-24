import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Search, 
  Grid, 
  List, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Wrench,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import type { PVStatus } from '../types';

export const HarvestingUnits: React.FC = () => {
  const { pvUnits } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'id' | 'power' | 'lux' | 'performance'>('id');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const activeUnits = pvUnits.filter(p => p.status === 'ACTIVE');
  const lowOutputUnits = pvUnits.filter(p => p.status === 'LOW OUTPUT');
  const offlineUnits = pvUnits.filter(p => p.status === 'OFFLINE' || p.status === 'MAINTENANCE');
  const totalPowerMw = pvUnits.reduce((acc, p) => acc + p.powerMw, 0);

  // Filter & Search logic
  const filteredUnits = pvUnits.filter(unit => {
    const matchesSearch = unit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          unit.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort logic
  const sortedUnits = [...filteredUnits].sort((a, b) => {
    if (sortBy === 'power') return b.powerMw - a.powerMw;
    if (sortBy === 'lux') return b.lightIntensityLux - a.lightIntensityLux;
    if (sortBy === 'performance') return b.performancePct - a.performancePct;
    return a.id.localeCompare(b.id);
  });

  const getStatusBadge = (status: PVStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>ACTIVE</span>
          </span>
        );
      case 'LOW OUTPUT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>LOW OUTPUT</span>
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-500/30">
            <XCircle className="w-3 h-3 text-red-400" />
            <span>OFFLINE</span>
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
            <Wrench className="w-3 h-3 text-indigo-400" />
            <span>MAINTENANCE</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* 1. VISUAL PV COMMAND CENTER TOPOLOGY DIAGRAM */}
      <div className="glass-card p-6 rounded-2xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800/80 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
              Distributed PV Network Command Center
            </span>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              <Sun className="w-5 h-5 text-emerald-400" />
              PV HARVESTING ARRAY
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-800">
              Total Array: <strong className="text-slate-100">{pvUnits.length} Units</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
              Active: {activeUnits.length}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300">
              Low Output: {lowOutputUnits.length}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-800 text-slate-400">
              Offline: {offlineUnits.length}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-800 text-cyan-300 font-bold">
              Generation: {totalPowerMw.toFixed(1)} mW
            </div>
          </div>
        </div>

        {/* Visual Distributed Network Tree */}
        <div className="space-y-4 pt-2">
          {/* Top Row: Representative Distributed PV Sticker Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {pvUnits.slice(0, 6).map((unit) => (
              <div key={unit.id} className="p-3 rounded-xl bg-navy-950/90 border border-navy-800 text-center space-y-1 hover:border-emerald-500/40 transition-colors">
                <span className="text-[10px] font-mono text-slate-400 block font-bold">{unit.id}</span>
                <span className="text-xs font-bold text-slate-200 block truncate">{unit.name}</span>
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  {unit.powerMw} mW
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  {unit.lightIntensityLux} Lux
                </div>
              </div>
            ))}
          </div>

          {/* Connection Converge Line */}
          <div className="flex items-center justify-center py-1">
            <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400/20 border border-emerald-400 animate-ping" />
            </div>
          </div>

          {/* Center Pipeline: PRODUCTION ZONE -> ENERGY BUS -> STORAGE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-navy-950/90 border border-navy-800 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Stage 1</span>
              <h4 className="text-xs font-bold text-slate-200">PRODUCTION ZONE</h4>
              <p className="text-[10px] text-emerald-400 font-mono font-semibold">20 Indoor PV Sticker Flexible Array</p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950/90 border border-emerald-500/30 text-center space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">Stage 2</span>
              <h4 className="text-xs font-bold text-slate-100">MPPT ENERGY BUS</h4>
              <p className="text-[10px] text-cyan-300 font-mono font-semibold">94.2% Harvesting Efficiency</p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950/90 border border-navy-800 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Stage 3</span>
              <h4 className="text-xs font-bold text-slate-200">SUPERCAPACITOR STORAGE</h4>
              <p className="text-[10px] text-emerald-400 font-mono font-semibold">5.00 Wh Capacity Buffer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Sort, View Toggle */}
      <div className="glass-card p-4 rounded-2xl border border-navy-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by PV ID (e.g. PV-001), name or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-navy-900 border border-navy-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {['ALL', 'ACTIVE', 'LOW OUTPUT', 'OFFLINE', 'MAINTENANCE'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-cyan-500 text-navy-950 shadow-energy'
                  : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-navy-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sort & View Mode Controls */}
        <div className="flex items-center space-x-2 border-t lg:border-t-0 lg:border-l border-navy-800 pt-3 lg:pt-0 lg:pl-3">
          <div className="relative flex items-center space-x-1 text-xs font-mono">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-navy-900 border border-navy-800 text-slate-300 rounded-xl px-2 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="id">Sort by ID</option>
              <option value="power">Sort by Power (mW)</option>
              <option value="lux">Sort by Lux</option>
              <option value="performance">Sort by Efficiency</option>
            </select>
          </div>

          <div className="flex items-center bg-navy-900 rounded-xl p-0.5 border border-navy-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-cyan-500 text-navy-950' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-cyan-500 text-navy-950' : 'text-slate-400'}`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="glass-card rounded-2xl border border-navy-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-navy-900/90 text-slate-400 border-b border-navy-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">PV Unit ID</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Light Flux</th>
                  <th className="py-3.5 px-4">Voltage (V)</th>
                  <th className="py-3.5 px-4">Current (mA)</th>
                  <th className="py-3.5 px-4">Power (mW)</th>
                  <th className="py-3.5 px-4">Generated</th>
                  <th className="py-3.5 px-4">Efficiency</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-slate-200">
                {sortedUnits.map(unit => (
                  <tr key={unit.id} className="hover:bg-navy-900/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-cyan-300 flex items-center space-x-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{unit.id}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans">{unit.location}</td>
                    <td className="py-3 px-4 font-bold text-amber-300">{unit.lightIntensityLux} Lux</td>
                    <td className="py-3 px-4 text-slate-200">{unit.voltageV} V</td>
                    <td className="py-3 px-4 text-slate-200">{unit.currentMa} mA</td>
                    <td className="py-3 px-4 font-bold text-slate-100">{unit.powerMw} mW</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{unit.energyGeneratedWh} Wh</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-navy-950 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${unit.performancePct}%` }} />
                        </div>
                        <span className="text-[11px]">{unit.performancePct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(unit.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/harvesting/${unit.id}`}
                        className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedUnits.map(unit => (
            <div key={unit.id} className="glass-card p-4 rounded-2xl border border-navy-800 glass-card-hover flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-300 text-sm">{unit.id}</span>
                  {getStatusBadge(unit.status)}
                </div>
                <h4 className="text-xs font-bold text-slate-200 mt-1">{unit.name}</h4>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">{unit.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-navy-950 p-2.5 rounded-xl border border-navy-850">
                <div>
                  <span className="text-[10px] text-slate-500">Light Flux</span>
                  <div className="font-bold text-amber-300">{unit.lightIntensityLux} Lux</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Power P=V×I</span>
                  <div className="font-bold text-cyan-300">{unit.powerMw} mW</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Voltage / Current</span>
                  <div className="text-slate-300">{unit.voltageV}V / {unit.currentMa}mA</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Efficiency</span>
                  <div className="text-emerald-400 font-bold">{unit.performancePct}%</div>
                </div>
              </div>

              <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-slate-400">Gen: {unit.energyGeneratedWh} Wh</span>
                <Link
                  to={`/harvesting/${unit.id}`}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-0.5"
                >
                  Inspect <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
