import React from 'react';
import { Cpu, ShieldCheck, History, Sparkles, Leaf, Layers, User } from 'lucide-react';
import { UserAuth } from '../types';

interface NavbarProps {
  user: UserAuth | null;
  onOpenHistory: () => void;
  onReset: () => void;
  activeRunTitle?: string;
  isProcessing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenHistory,
  onReset,
  activeRunTitle,
  isProcessing
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B1220]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0B1220]">
              <Leaf className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                CircuDesign
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                Multi-Agent AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Constraint-Satisfied Sustainable BOM Engineering
            </p>
          </div>
        </div>

        {/* SDG Badges & Active Status */}
        <div className="hidden md:flex items-center gap-2">
          {activeRunTitle && (
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 border border-white/10 text-xs text-slate-300">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="max-w-[180px] truncate font-medium">{activeRunTitle}</span>
              {isProcessing && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs text-emerald-300">
            <span className="font-bold text-emerald-400">SDG 12.5</span>
            <span className="text-[10px] text-emerald-400/80">Waste Reduction</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs text-blue-300">
            <span className="font-bold text-blue-400">SDG 9.4</span>
            <span className="text-[10px] text-blue-400/80">Clean Industry</span>
          </div>
        </div>

        {/* User Auth & History Drawer Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHistory}
            className="glass-button flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:text-white"
            title="View Saved Optimization Runs"
          >
            <History className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Runs History</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
              </div>
              <span className="max-w-[100px] truncate font-medium">
                {user.isGuest ? 'Guest Session' : (user.displayName || 'Engineer')}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <User className="h-3.5 w-3.5" />
              <span>Not Signed In</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
