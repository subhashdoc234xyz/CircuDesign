import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, Info } from 'lucide-react';
import { FlaggedSwap } from '../types';

interface ApprovalPageProps {
  flaggedSwaps: FlaggedSwap[];
  onApproveAll: () => void;
  onRejectAll: () => void;
  runTitle: string;
}

export const ApprovalPage: React.FC<ApprovalPageProps> = ({
  flaggedSwaps,
  onApproveAll,
  onRejectAll,
  runTitle
}) => {
  return (
    <div className="max-w-3xl mx-auto my-6 animate-fade-in space-y-6">
      {/* Risk Alert Banner */}
      <div className="glass-panel border-amber-500/40 rounded-3xl p-6 flex items-start gap-4 bg-amber-500/5">
        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-lg font-bold text-white">
            Engineering Authorization Required (HITL Gate)
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The multi-agent optimization for <strong>{runTitle}</strong> completed, but triggered hard limits on structural safety safety-factors or cost multipliers. Lead mechanical engineer signature required to proceed.
          </p>
        </div>
      </div>

      {/* Flagged Swaps Details */}
      <div className="glass-panel border-white/10 rounded-3xl p-6 space-y-4">
        <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
          Flagged Substitutions Summary ({flaggedSwaps.length})
        </h3>

        <div className="space-y-4">
          {flaggedSwaps.map((swap, idx) => (
            <div key={idx} className="border border-white/5 rounded-2xl p-4 bg-black/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                <div className="text-xs font-bold text-white">
                  Part ID: <span className="font-mono text-emerald-400 font-bold">{swap.partId}</span> — {swap.partName}
                </div>
                <div className="text-[10px] rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 font-semibold text-amber-400">
                  Risk Level: High
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Original Material</span>
                  <p className="font-medium text-slate-200">{swap.currentMaterial}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Proposed Alternative</span>
                  <p className="font-medium text-emerald-300">{swap.proposedMaterial.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Risk Metric</span>
                  <p className="font-medium text-slate-200">
                    Tensile: {swap.tensileStrengthDeltaPercent}% | Cost: +{swap.costDeltaPercent}%
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 pt-1">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{swap.riskReason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HITL Control Actions */}
      <div className="flex justify-end gap-3 glass-panel border-white/10 rounded-3xl p-5">
        <button
          onClick={onRejectAll}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
        >
          <XCircle className="h-4 w-4 text-red-400" />
          <span>Reject & Reset Design</span>
        </button>

        <button
          onClick={onApproveAll}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 glow-emerald transition"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Authorize Substitutions</span>
        </button>
      </div>
    </div>
  );
};
