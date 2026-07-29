import React, { useState } from 'react';
import { Leaf, Cpu, ShieldCheck, Sparkles, ArrowRight, UserCheck, Upload, FileSpreadsheet, Layers, CheckCircle2 } from 'lucide-react';
import { SAMPLE_BOMS } from '../data/sampleBoms';
import { BOMItem } from '../types';

interface LandingHeroProps {
  onSelectSampleBOM: (bom: typeof SAMPLE_BOMS[0]) => void;
  onCustomFileUpload: (items: BOMItem[], fileName: string) => void;
  onContinueGoogle: () => void;
  onContinueGuest: () => void;
  userSignedIn: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSelectSampleBOM,
  onCustomFileUpload,
  onContinueGoogle,
  onContinueGuest,
  userSignedIn
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // Parse CSV or JSON
        let items: BOMItem[] = [];
        if (file.name.endsWith('.json')) {
          items = JSON.parse(text);
        } else {
          // Simple CSV line parser
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          items = lines.slice(1).map((line, idx) => {
            const cols = line.split(',');
            return {
              partId: cols[0] || `P${idx + 1}`,
              name: cols[1] || `Part ${idx + 1}`,
              category: 'Housing/Enclosure',
              quantity: parseInt(cols[2]) || 1,
              currentMaterial: cols[3] || 'Virgin ABS',
              massGrams: parseFloat(cols[4]) || 120,
              unitCostUSD: parseFloat(cols[5]) || 2.5,
              joineryType: 'Snap-fit',
              tensileStrengthMPa: 45,
              maxOperatingTempC: 85,
              recyclablePercent: 30,
              disassemblyTimeSec: 20,
              carbonFootprintKgCO2PerKg: 3.8
            };
          });
        }
        if (items.length > 0) {
          onCustomFileUpload(items, file.name);
        }
      } catch (err) {
        alert('Could not parse BOM file. Please upload a valid CSV or JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Framing Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-semibold text-emerald-300">
          <Leaf className="h-4 w-4 text-emerald-400" />
          <span>SDG 12.5 & SDG 9.4 Multi-Agent AI Engine</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Redesign Product BOMs for <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Zero-Waste Circularity</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          CircuDesign deploys 5 specialist AI agents to deconstruct hardware BOMs, research bio-based material swaps via RAG, verify mechanical yield stress, and close the constraint satisfaction loop.
        </p>

        {/* Auth Buttons: Google vs Guest Mode */}
        {!userSignedIn && (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onContinueGoogle}
              className="glass-button flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-xs font-bold text-white shadow-xl hover:scale-[1.02]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={onContinueGuest}
              className="flex items-center gap-2 rounded-2xl border border-emerald-500/50 bg-emerald-500/20 px-6 py-3.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 glow-emerald"
            >
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Continue as Guest (Instant Access)</span>
            </button>
          </div>
        )}
      </div>

      {/* Preset BOM Quick Launchers & File Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Sample BOM Presets Card */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <h3 className="font-display text-lg font-bold text-white">
              Launch Pre-Configured Sample BOM
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Select a verified hardware BOM preset to observe real multi-agent bio-substitution in real time:
          </p>

          <div className="space-y-3 pt-2">
            {SAMPLE_BOMS.map((bom) => (
              <button
                key={bom.id}
                onClick={() => onSelectSampleBOM(bom)}
                className="w-full text-left rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-emerald-500/40 group flex items-center justify-between"
              >
                <div>
                  <h4 className="font-display text-sm font-bold text-white group-hover:text-emerald-300">
                    {bom.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {bom.description} • ({bom.items.length} parts)
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Drag-and-Drop BOM Upload Card */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-emerald-400" />
              <h3 className="font-display text-lg font-bold text-white">
                Upload Custom BOM File
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Upload your engineering Bill of Materials in CSV or JSON format with part names, materials, and mass.
            </p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
              dragActive ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/15 bg-black/30'
            }`}
          >
            <FileSpreadsheet className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <span className="block text-xs font-semibold text-slate-200">
              Drag & Drop your BOM file here
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              Supports .csv or .json files
            </span>

            <label className="mt-4 inline-block cursor-pointer rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 border border-white/20">
              Browse Local File
              <input
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
