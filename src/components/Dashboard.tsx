import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Layers, ArrowRight } from 'lucide-react';
import { SAMPLE_BOMS } from '../data/sampleBoms';
import { BOMItem } from '../types';

interface DashboardProps {
  onSelectSampleBOM: (bom: typeof SAMPLE_BOMS[0]) => void;
  onCustomFileUpload: (items: BOMItem[], fileName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectSampleBOM,
  onCustomFileUpload
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        let items: BOMItem[] = [];
        if (file.name.endsWith('.json')) {
          items = JSON.parse(text);
        } else {
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
    <div className="space-y-8 animate-fade-in py-4">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="font-display text-2xl font-bold text-white tracking-tight">
          Select Bill of Materials Workspace
        </h2>
        <p className="text-xs text-slate-400">
          Load a pre-configured engineering dataset or upload your own to start.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Presets Card */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              <h3 className="font-display text-sm font-bold text-white">
                Sample BOM Presets
              </h3>
            </div>
            <div className="space-y-2 pt-2">
              {SAMPLE_BOMS.map((bom) => (
                <button
                  key={bom.id}
                  onClick={() => onSelectSampleBOM(bom)}
                  className="w-full text-left rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 hover:border-emerald-500/40 transition group flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-display text-xs font-bold text-white group-hover:text-emerald-300">
                      {bom.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {bom.items.length} parts
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-emerald-400" />
              <h3 className="font-display text-sm font-bold text-white">
                Upload Custom BOM
              </h3>
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
              className={`border border-dashed rounded-xl p-6 text-center transition flex-1 flex flex-col items-center justify-center ${
                dragActive ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/15 bg-black/20'
              }`}
            >
              <FileSpreadsheet className="h-8 w-8 text-emerald-400 mb-1.5 opacity-80" />
              <span className="block text-[11px] font-semibold text-slate-200">
                Drag & Drop file
              </span>
              <span className="block text-[9px] text-slate-500">
                Supports .csv / .json
              </span>

              <label className="mt-3 inline-block cursor-pointer rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-white/10 border border-white/15">
                Browse
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
    </div>
  );
};
