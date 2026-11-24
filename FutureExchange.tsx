import React from 'react';
import { 
  Repeat, 
  ShieldAlert, 
  Zap
} from 'lucide-react';

export const FutureExchange: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="glass-card p-5 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Repeat className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-100">Future Regulated P2P Micro-Energy Exchange</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Conceptual architecture for facility-to-facility surplus light energy trading.
          </p>
        </div>

        {/* Prominent Future Concept Pill */}
        <div className="px-3.5 py-1.5 rounded-xl bg-indigo-950/90 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
          FUTURE CONCEPT / EXPERIMENTAL &bull; SUBJECT TO REGULATIONS
        </div>
      </div>

      {/* Conceptual Flow Diagram */}
      <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          P2P Exchange Conceptual Verification Flow
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-3">
          <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Stage 01</span>
            <h4 className="text-xs font-bold text-slate-100 mt-2">Verified Surplus Harvest</h4>
            <p className="text-[11px] text-slate-400 font-mono mt-1">PMIC verified surplus harvested from indoor flexible PV stickers.</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Stage 02</span>
            <h4 className="text-xs font-bold text-slate-100 mt-2">Energy Wallet Minting</h4>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Mint 1 EC per 0.1 Wh verified energy into hardware ledger.</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Stage 03</span>
            <h4 className="text-xs font-bold text-slate-100 mt-2">Authorized Contribution</h4>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Grid operator compliance check & automated smart contract lock.</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-amber-500/30 bg-amber-950/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Stage 04</span>
            <h4 className="text-xs font-bold text-amber-300 mt-2">P2P Peer Exchange</h4>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Micro-grid credit clearance for adjacent facility loads.</p>
          </div>
        </div>
      </div>

      {/* Compliance Disclaimer Box */}
      <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-navy-900 flex items-start space-x-4">
        <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-slate-100 uppercase tracking-wider">Regulatory Compliance & Scope Disclaimer</h4>
          <p className="text-slate-300 font-sans leading-relaxed">
            This module represents an architectural concept for future regulated micro-grid energy exchange. ENERGY OS does not perform real-world financial transactions, cryptocurrency trading, or unregulated power feeding into public utility grids.
          </p>
        </div>
      </div>
    </div>
  );
};
