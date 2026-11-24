import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Activity, 
  Sun,
  Cpu
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const Analytics: React.FC = () => {
  const { 
    timeSeriesData, 
    selectedTimeRange,
    setSelectedTimeRange 
  } = useSimulation();

  const insights = [
    { title: 'Peak Artificial Light Yield', detail: 'Harvesting efficiency peaked at 96.4% during shift lighting hours (10:00 - 16:00).', icon: Sun, color: 'text-amber-400' },
    { title: 'Self-Sustaining Autonomy Index', detail: 'Net positive energy balance maintained for 92% of the operating cycle.', icon: TrendingUp, color: 'text-emerald-400' },
    { title: 'IoT Load Optimization', detail: 'Adaptive duty-cycling saved ~0.42 Wh of stored supercapacitor energy.', icon: Cpu, color: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="glass-card p-5 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">Industrial Energy Analytics</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Deep-dive time-series analytics, ratio analysis, and automated insights.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {['Today', '7 Days', '30 Days'].map(range => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedTimeRange === range 
                  ? 'bg-cyan-500 text-navy-950 shadow-energy font-bold' 
                  : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-navy-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Automated Insights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div key={i} className="glass-card p-4 rounded-2xl border border-navy-800 flex items-start space-x-3">
              <div className={`p-2.5 rounded-xl bg-navy-950 border border-navy-800 ${ins.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{ins.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ins.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cumulative Energy Harvest vs Consumption (8 cols) */}
        <div className="lg:col-span-8 glass-card p-5 rounded-2xl border border-navy-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Generation vs Consumption Balance Telemetry
            </h3>
            <span className="text-xs font-mono text-cyan-400">Selected: {selectedTimeRange}</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="anGenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" Wh" />
                <Tooltip contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="generatedWh" name="Harvested Energy (Wh)" stroke="#00f2fe" strokeWidth={2.5} fillOpacity={1} fill="url(#anGenGrad)" />
                <Area type="monotone" dataKey="consumedWh" name="Consumed Energy (Wh)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PV Efficiency Ratio (4 cols) */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-navy-800">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            PV Efficiency Index (%)
          </h3>
          <p className="text-xs text-slate-400 font-mono mb-4">
            Percentage of theoretical maximum photon energy captured.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSeriesData.slice(-12)}>
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[60, 100]} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="pvEfficiencyPct" name="Efficiency (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
