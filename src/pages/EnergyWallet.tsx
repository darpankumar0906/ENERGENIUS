import React, { useState } from 'react';
import { 
  Wallet, 
  ShieldCheck, 
  Eye, 
  FileCheck
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import type { WalletTransaction } from '../types';
import { HardwareProofModal } from '../components/wallet/HardwareProofModal';

export const EnergyWallet: React.FC = () => {
  const { energyCredits, verifiedWh, generatedWh, ledgerTransactions, consumedWh } = useSimulation();
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* 1. ENERGY CREDIT ACCOUNTING PIPELINE */}
      <div className="quiet-surface p-6 rounded-2xl border border-navy-850 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-850 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
              Internal Accounting & Credit Ledger
            </span>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              <Wallet className="w-5 h-5 text-emerald-400" />
              ENERGY CREDIT ACCOUNTING
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Accounting Rule: <strong className="text-emerald-400">1 EC = 0.1 Wh Verified Energy</strong>
          </div>
        </div>

        {/* 3-Step Accounting Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">STEP 01 &bull; GENERATED ENERGY</span>
            <div className="text-2xl font-black font-mono text-slate-100">{generatedWh} <span className="text-xs font-normal text-emerald-400">Wh</span></div>
            <p className="text-[10px] text-slate-400 font-sans">Raw array generation</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/80 border border-emerald-500/30 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">STEP 02 &bull; VERIFIED ENERGY</span>
            <div className="text-2xl font-black font-mono text-emerald-400 glow-text-emerald">{verifiedWh} <span className="text-xs font-normal text-slate-300">Wh</span></div>
            <p className="text-[10px] text-slate-400 font-sans">Telemetry verified</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">STEP 03 &bull; ENERGY CREDITS</span>
            <div className="text-3xl font-black font-mono text-slate-100">{energyCredits} <span className="text-xs font-normal text-emerald-400">EC</span></div>
            <p className="text-[10px] text-slate-400 font-sans">Issued internal credits</p>
          </div>
        </div>
      </div>

      {/* 2. LARGE ACCOUNTING READOUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block font-bold">ENERGY GENERATED</span>
          <div className="text-3xl font-black font-mono text-slate-100">{generatedWh} <span className="text-xs font-normal text-emerald-400">Wh</span></div>
          <span className="text-[10px] font-mono text-slate-400 block">Total harvested today</span>
        </div>

        <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block font-bold">ENERGY CONTRIBUTED</span>
          <div className="text-3xl font-black font-mono text-emerald-400 glow-text-emerald">2.84 <span className="text-xs font-normal text-slate-300">Wh</span></div>
          <span className="text-[10px] font-mono text-slate-400 block">Shared with facility buffer</span>
        </div>

        <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block font-bold">ENERGY CONSUMED</span>
          <div className="text-3xl font-black font-mono text-amber-400">{consumedWh} <span className="text-xs font-normal text-slate-300">Wh</span></div>
          <span className="text-[10px] font-mono text-slate-400 block">Consumed by IoT fleet</span>
        </div>
      </div>

      {/* 3. VERIFIED LEDGER TABLE */}
      <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Verified Energy Credit Accounting Ledger ({ledgerTransactions.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Deterministic Internal Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-950/90 text-slate-400 border-b border-navy-850 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Credit ID</th>
                <th className="py-3 px-4">Source Node</th>
                <th className="py-3 px-4">Energy (Wh)</th>
                <th className="py-3 px-4">Credits (EC)</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-850/60 text-slate-200">
              {ledgerTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-navy-900/50 transition-colors">
                  <td className="py-3 px-4 text-slate-400">{tx.id}</td>
                  <td className="py-3 px-4 font-bold text-emerald-300">{tx.creditId}</td>
                  <td className="py-3 px-4 text-slate-300">{tx.sourcePvId}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">+{tx.amountWh} Wh</td>
                  <td className="py-3 px-4 font-bold text-slate-100">+{tx.credits} EC</td>
                  <td className="py-3 px-4 text-slate-400">{tx.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{tx.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Telemetry Proof</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware Proof Modal */}
      <HardwareProofModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
