import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronRight
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import type { DeviceStatus } from '../types';

export const IoTDevices: React.FC = () => {
  const { devices, storage } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const lowEnergyCount = devices.filter(d => d.status === 'Low Energy' || d.status === 'Critical').length;
  const totalLoadMw = devices.reduce((acc, d) => acc + d.powerConsumptionMw, 0);

  const filteredDevices = devices.filter(dev => {
    const matchesSearch = dev.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || dev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'Online':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>ONLINE</span>
          </span>
        );
      case 'Low Energy':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>LOW ENERGY</span>
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-500/30 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>CRITICAL</span>
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700">
            <XCircle className="w-3 h-3 text-slate-400" />
            <span>OFFLINE</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* 1. DEVICE COMMAND CENTER HERO TOPOLOGY */}
      <div className="glass-card p-6 rounded-2xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800/80 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block">
              Fleet Power Management & Topology
            </span>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              <Cpu className="w-5 h-5 text-cyan-400" />
              DEVICE COMMAND CENTER
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-center">
              <span className="text-[9px] text-slate-400 block uppercase">Active Devices</span>
              <strong className="text-emerald-400">{onlineCount} / {devices.length}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-center">
              <span className="text-[9px] text-slate-400 block uppercase">Total Load</span>
              <strong className="text-cyan-300">{totalLoadMw} mW</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-center">
              <span className="text-[9px] text-slate-400 block uppercase">Available Storage</span>
              <strong className="text-emerald-400">{storage.currentStoredWh.toFixed(2)} Wh</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-center">
              <span className="text-[9px] text-slate-400 block uppercase">Low Energy Load</span>
              <strong className="text-amber-400">{lowEnergyCount} Nodes</strong>
            </div>
          </div>
        </div>

        {/* Visual IoT Device Bus Topology */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {devices.slice(0, 5).map((device) => (
            <div key={device.id} className="p-3 rounded-xl bg-navy-950/90 border border-navy-800 text-center space-y-1 hover:border-cyan-500/40 transition-colors">
              <span className="text-[10px] font-mono text-slate-400 block font-bold">{device.id}</span>
              <span className="text-xs font-bold text-slate-200 block truncate">{device.name}</span>
              <div className="text-[11px] font-mono font-bold text-cyan-300">
                {device.powerConsumptionMw} mW Draw
              </div>
              <div className="text-[9px] font-mono text-emerald-400">
                {device.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="glass-card p-4 rounded-2xl border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search IoT devices by ID, name, sensor type or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-navy-900 border border-navy-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {['ALL', 'Online', 'Low Energy', 'Critical', 'Offline'].map(status => (
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
      </div>

      {/* Devices Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map(device => (
          <div key={device.id} className="glass-card p-5 rounded-2xl border border-navy-800 glass-card-hover flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-300 text-xs">{device.id}</span>
                {getStatusBadge(device.status)}
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-2">{device.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{device.type} &bull; {device.location}</p>
            </div>

            {/* Technical Specs Box */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-navy-950 p-3 rounded-xl border border-navy-850">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Power Draw</span>
                <div className="font-bold text-slate-100">{device.powerConsumptionMw} mW</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Battery Level</span>
                <div className={`font-bold ${device.batteryLevelPct < 25 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {device.batteryLevelPct}%
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Est. Autonomy</span>
                <div className="text-cyan-300 font-bold">{device.autonomyHours} hrs</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Sampling Rate</span>
                <div className="text-slate-300">Every {device.samplingFrequencySec}s</div>
              </div>
            </div>

            {/* Battery Progress Indicator */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Reserve Buffer</span>
                <span className="text-slate-300">{device.batteryLevelPct}%</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden border border-navy-800">
                <div 
                  className={`h-full rounded-full ${device.batteryLevelPct < 25 ? 'bg-red-400' : device.batteryLevelPct < 50 ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                  style={{ width: `${device.batteryLevelPct}%` }} 
                />
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-slate-500">Updated {device.lastUpdate}</span>
              <Link
                to={`/devices/${device.id}`}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-0.5"
              >
                Manage Device <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
