import React from 'react';
import { X, ShieldCheck, QrCode, Cpu, Zap, Copy, Check } from 'lucide-react';
import type { WalletTransaction } from '../../types';

interface ProofModalProps {
  transaction: WalletTransaction | null;
  onClose: () => void;
}

export const HardwareProofModal: React.FC<ProofModalProps> = ({ transaction, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const mockHash = `0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
      <div className="bg-navy-900 border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Top Glow & Watermark Banner */}
        <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 h-1.5" />
        
        <div className="flex items-center justify-between pb-4 border-b border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-energy">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Hardware Verification Proof
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                {transaction.creditId}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-navy-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Notice */}
        <div className="my-4 p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">SIMULATED HARDWARE VERIFICATION</span>
        </div>

        {/* Verification Record Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono my-4">
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-400 uppercase">Source PV Unit</span>
            <div className="font-bold text-slate-100 mt-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              {transaction.sourcePvId}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-400 uppercase">Harvested Energy</span>
            <div className="font-bold text-emerald-400 mt-1">
              {transaction.amountWh} Wh (+{transaction.credits} EC)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-400 uppercase">PMIC Voltage / Current</span>
            <div className="font-bold text-slate-200 mt-1">
              2.84 V / 37.2 mA
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-400 uppercase">Sampling Duration</span>
            <div className="font-bold text-slate-200 mt-1">
              240 Seconds
            </div>
          </div>
        </div>

        {/* QR Code & Proof Visual */}
        <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex items-center space-x-4 my-4">
          <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center flex-shrink-0">
            <QrCode className="w-20 h-20 text-navy-950" />
          </div>
          <div className="flex-1 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">PMIC Telemetry Signature Hash</span>
            <div className="bg-navy-900 p-2 rounded-lg text-[10px] font-mono text-slate-300 break-all border border-navy-800 flex items-center justify-between">
              <span className="truncate max-w-[200px]">{mockHash}</span>
              <button onClick={copyToClipboard} className="ml-2 text-cyan-400 hover:text-cyan-300">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Status: <span className="text-emerald-400 font-bold">HARDWARE VERIFIED (Simulated)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-navy-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">1 EC = 0.1 Wh Verified Harvested Energy</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Proof
          </button>
        </div>
      </div>
    </div>
  );
};
