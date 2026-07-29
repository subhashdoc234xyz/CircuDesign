import React from 'react';
import { Cpu, ShieldCheck, History, Sparkles, Leaf, Layers, User } from 'lucide-react';
import { UserAuth } from '../types';

interface NavbarProps {
  user: UserAuth | null;
  onOpenHistory: () => void;
  onReset: () => void;
  onSignOut: () => void;
  activeRunTitle?: string;
  isProcessing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenHistory,
  onReset,
  onSignOut,
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
          </div>
        </div>

        {/* SDG Badges & Active Status - Only visible when inside active workspace */}
        <div className="hidden md:flex items-center gap-2">
          {activeRunTitle && user && (
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 border border-white/10 text-xs text-slate-300">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="max-w-[180px] truncate font-medium">{activeRunTitle}</span>
              {isProcessing && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
          )}
        </div>

        {/* User Auth & History Drawer Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={onOpenHistory}
              className="glass-button flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:text-white"
              title="View Saved Optimization Runs"
            >
              <History className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">Runs History</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
                </div>
                <span className="max-w-[100px] truncate font-medium hidden sm:inline">
                  {user.isGuest ? 'Guest' : (user.displayName || 'Engineer')}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="text-[10px] text-slate-400 hover:text-red-400 font-semibold px-2 py-1.5 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <User className="h-3.5 w-3.5" />
              <span>Secure Session</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
