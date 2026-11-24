import React from 'react';
import { 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Lock
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const Rewards: React.FC = () => {
  const { rewards, generatedWh } = useSimulation();

  const milestones = [
    { label: 'START', wh: 0, status: 'Completed' },
    { label: '100 Wh HARVESTED', wh: 100, status: generatedWh >= 100 ? 'Completed' : 'In Progress' },
    { label: '500 Wh HARVESTED', wh: 500, status: generatedWh >= 500 ? 'Completed' : 'Upcoming' },
    { label: '1000 Wh ENERGY CONTRIBUTOR', wh: 1000, status: generatedWh >= 1000 ? 'Completed' : 'Upcoming' },
  ];

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Clock': return <Clock className="w-5 h-5 text-purple-400" />;
      default: return <Trophy className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* 1. HARVESTING PROGRESS MILESTONE TIMELINE HERO */}
      <div className="quiet-surface p-6 rounded-2xl border border-navy-850 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-850 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
              Cumulative Yield Achievement Markers
            </span>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              <Trophy className="w-5 h-5 text-emerald-400" />
              HARVESTING PROGRESS & MILESTONES
            </h2>
          </div>
          <div className="text-xs font-mono text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl">
            Achievements Unlocked: {rewards.filter(r => r.unlocked).length} / {rewards.length}
          </div>
        </div>

        {/* Milestone Timeline Diagram */}
        <div className="py-2 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">HARVESTING YIELD MILESTONE TIMELINE</span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {milestones.map((m, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border space-y-1 ${
                m.status === 'Completed'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-navy-950/80 border-navy-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                  <span>0{idx + 1}</span>
                  <span>{m.status}</span>
                </div>
                <div className="text-xs font-black tracking-wider text-slate-100">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ACHIEVEMENT MARKER CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map(reward => (
          <div key={reward.id} className={`quiet-surface p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
            reward.unlocked ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-navy-850 bg-navy-950/60'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl p-0.5 border ${reward.unlocked ? 'border-emerald-500/40 bg-emerald-950' : 'border-navy-800 bg-navy-950'} flex items-center justify-center`}>
                  {getRewardIcon(reward.iconName)}
                </div>
                {reward.unlocked ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>ACHIEVED</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-navy-950 border border-navy-850">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>IN PROGRESS</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-100 mt-3">{reward.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">{reward.description}</p>
            </div>

            {/* Visual Progress Marker */}
            <div className="space-y-1.5 pt-2 border-t border-navy-850">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Progress: {reward.currentWh} / {reward.targetWh} Wh</span>
                <strong className={reward.unlocked ? 'text-emerald-400' : 'text-slate-300'}>{reward.progressPct}%</strong>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden border border-navy-850">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${reward.unlocked ? 'bg-emerald-400' : 'bg-slate-700'}`} 
                  style={{ width: `${Math.min(100, reward.progressPct)}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
