import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Zap
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const ActivityLog: React.FC = () => {
  const { activityLogs } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="glass-card p-5 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">System Audit & Real-time Activity Log</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Immutable system state logs, telemetry events, and verification ledger updates.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-700 text-xs font-mono text-slate-300">
          Total Audit Records: <strong className="text-cyan-300">{activityLogs.length}</strong>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit logs by event, PV ID or details..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-navy-900 border border-navy-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {['ALL', 'GENERATION', 'VERIFICATION', 'OPTIMIZATION', 'SYSTEM'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                typeFilter === type
                  ? 'bg-cyan-500 text-navy-950 shadow-energy'
                  : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-navy-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Timeline Table */}
      <div className="glass-card p-5 rounded-2xl border border-navy-800">
        <div className="space-y-3">
          {filteredLogs.map(log => (
            <div key={log.id} className="p-3.5 rounded-xl bg-navy-900/80 border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-navy-950 border border-cyan-500/30 text-cyan-400 flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-100">{log.event}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-navy-950 text-cyan-300 border border-cyan-500/30">
                      {log.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">{log.details}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 font-mono text-[10px] text-slate-500">
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
