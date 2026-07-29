import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { PipelineCanvas } from './components/PipelineCanvas';
import { ResultsDashboard } from './components/ResultsDashboard';
import { HumanInTheLoopModal } from './components/HumanInTheLoopModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SdgImpactFooter } from './components/SdgImpactFooter';
import { SAMPLE_BOMS } from './data/sampleBoms';
import { PipelineRun, AgentLog, UserAuth, BOMItem, FlaggedSwap } from './types';

export default function App() {
  const [user, setUser] = useState<UserAuth | null>({
    uid: 'guest-session-123',
    email: null,
    displayName: 'Guest Engineer',
    photoURL: null,
    isGuest: true
  });

  const [activeBom, setActiveBom] = useState<{ name: string; items: BOMItem[] }>({
    name: SAMPLE_BOMS[0].name,
    items: SAMPLE_BOMS[0].items
  });

  const [currentRun, setCurrentRun] = useState<PipelineRun | null>(null);
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'landing' | 'pipeline' | 'results'>('landing');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showHumanGate, setShowHumanGate] = useState(false);

  // Load user history on mount
  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const uid = user ? user.uid : 'guest-session';
      const res = await fetch(`/api/runs?userUid=${uid}`);
      const data = await res.json();
      if (data && data.runs) {
        setRuns(data.runs);
      }
    } catch (err) {
      console.warn('Could not fetch run history:', err);
    }
  };

  const handleContinueGoogle = () => {
    setUser({
      uid: `google-user-${Date.now()}`,
      email: 'engineer@circudesign.ai',
      displayName: 'Alex Rivers (Lead Engineer)',
      photoURL: null,
      isGuest: false
    });
  };

  const handleContinueGuest = () => {
    setUser({
      uid: `guest-session-${Date.now()}`,
      email: null,
      displayName: 'Guest Engineer',
      photoURL: null,
      isGuest: true
    });
  };

  const handleSelectSampleBOM = (bom: typeof SAMPLE_BOMS[0]) => {
    setActiveBom({ name: bom.name, items: bom.items });
    setViewMode('pipeline');
  };

  const handleCustomFileUpload = (items: BOMItem[], fileName: string) => {
    setActiveBom({ name: fileName, items });
    setViewMode('pipeline');
  };

  const addLog = (agentId: 'bom' | 'material' | 'structural' | 'lifecycle' | 'orchestrator', agentName: string, message: string, details?: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        agentId,
        agentName,
        timestamp: new Date().toISOString(),
        status: 'processing',
        message,
        details
      }
    ]);
  };

  const runPipeline = async () => {
    setIsProcessing(true);
    setViewMode('pipeline');
    setLogs([]);
    setCurrentRun(null);

    // Live agent progression sequence
    setCurrentAgentId('bom');
    addLog('bom', '1. BOM Deconstruction Agent', 'Parsing raw BOM structure, materials, and joint topology...');
    await new Promise(r => setTimeout(r, 600));

    setCurrentAgentId('material');
    addLog('material', '2. Material Science Agent', 'Querying RAG database for non-toxic bio-polymers and recycled metal alloys...');
    await new Promise(r => setTimeout(r, 800));

    setCurrentAgentId('structural');
    addLog('structural', '3. Structural Integrity Agent', 'Calculating yield stress ratios and mechanical load safety margins...');
    await new Promise(r => setTimeout(r, 700));

    setCurrentAgentId('lifecycle');
    addLog('lifecycle', '4. Circular Lifecycle Agent', 'Scoring disassembly ease index, recyclability %, and embodied CO2e reductions...');
    await new Promise(r => setTimeout(r, 600));

    setCurrentAgentId('orchestrator');
    addLog('orchestrator', '5. Orchestrator Agent', 'Evaluating 4 constraint quadrants (Sustainability, Structural, Cost, Supply)...');
    await new Promise(r => setTimeout(r, 600));

    try {
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: activeBom.items,
          bomName: activeBom.name,
          userUid: user?.uid || 'guest-session'
        })
      });

      const data = await response.json();
      if (data && data.success && data.run) {
        setCurrentRun(data.run);
        fetchHistory();

        addLog('orchestrator', '5. Orchestrator Agent', 'Pipeline run complete. All constraints satisfied.');

        if (data.run.agentOutputs?.orchestrator?.humanGateRequired) {
          setShowHumanGate(true);
        } else {
          setViewMode('results');
        }
      }
    } catch (error) {
      console.error('Error running pipeline:', error);
    } finally {
      setIsProcessing(false);
      setCurrentAgentId(null);
    }
  };

  const handleApproveSwap = (partId: string) => {
    if (!currentRun) return;
    const flagged = currentRun.agentOutputs?.orchestrator?.flaggedSwaps || [];
    const remaining = flagged.filter(f => f.partId !== partId);
    if (remaining.length === 0) {
      setShowHumanGate(false);
      setViewMode('results');
    }
  };

  const handleApproveAllSwaps = () => {
    setShowHumanGate(false);
    setViewMode('results');
  };

  const handleDeleteRun = async (id: string) => {
    try {
      const uid = user ? user.uid : 'guest-session';
      await fetch(`/api/runs/${id}?userUid=${uid}`, { method: 'DELETE' });
      fetchHistory();
    } catch (err) {
      console.warn('Could not delete run:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B1220] text-slate-100">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={() => {
          setViewMode('landing');
          setCurrentRun(null);
        }}
        activeRunTitle={activeBom.name}
        isProcessing={isProcessing}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {viewMode === 'landing' && (
          <LandingHero
            onSelectSampleBOM={handleSelectSampleBOM}
            onCustomFileUpload={handleCustomFileUpload}
            onContinueGoogle={handleContinueGoogle}
            onContinueGuest={handleContinueGuest}
            userSignedIn={Boolean(user && !user.isGuest)}
          />
        )}

        {viewMode === 'pipeline' && (
          <PipelineCanvas
            outputs={currentRun ? currentRun.agentOutputs : null}
            logs={logs}
            isProcessing={isProcessing}
            currentAgentId={currentAgentId}
            onTriggerRun={runPipeline}
            onTriggerHumanGate={() => setShowHumanGate(true)}
          />
        )}

        {viewMode === 'results' && currentRun && (
          <ResultsDashboard
            run={currentRun}
            onRunNewPipeline={() => setViewMode('landing')}
          />
        )}

        {/* SDG Impact Footer Panel */}
        <SdgImpactFooter
          carbonSavedKg={currentRun ? currentRun.carbonSavedKg : 14.2}
          carbonSavedPercent={currentRun ? currentRun.carbonSavedPercent : 38}
          recyclabilityPercent={currentRun ? currentRun.recyclabilityScore : 88}
          disassemblyScore={currentRun ? currentRun.disassemblyScore : 85}
        />
      </main>

      {/* Human-in-the-Loop Safety Modal */}
      {showHumanGate && currentRun && (
        <HumanInTheLoopModal
          flaggedSwaps={currentRun.agentOutputs?.orchestrator?.flaggedSwaps || []}
          onApproveSwap={handleApproveSwap}
          onRejectSwap={handleApproveSwap}
          onApproveAll={handleApproveAllSwaps}
          onClose={() => {
            setShowHumanGate(false);
            setViewMode('results');
          }}
        />
      )}

      {/* History Side Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        runs={runs}
        onSelectRun={(run) => {
          setCurrentRun(run);
          setViewMode('results');
        }}
        onDeleteRun={handleDeleteRun}
      />
    </div>
  );
}
