import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { runBomDeconstructionAgent } from '../agents/bomAgent';
import { runMaterialScienceAgent } from '../agents/materialAgent';
import { runStructuralIntegrityAgent } from '../agents/structuralAgent';
import { runCircularLifecycleAgent } from '../agents/lifecycleAgent';
import { runOrchestratorAgent } from '../agents/orchestratorAgent';
import { SAMPLE_BOMS } from '../../data/sampleBoms';
import { PipelineRun } from '../../types';

export const apiRouter = Router();

// In-memory run history store for rapid, seamless session state (persisted per userUid)
const runStore = new Map<string, PipelineRun[]>();

// Gemini AI Client initialization with User-Agent telemetry
let aiClient: GoogleGenAI | undefined;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// POST /api/agent/run - Executes full multi-agent optimization pipeline
apiRouter.post('/agent/run', async (req: Request, res: Response) => {
  try {
    const { items, bomName, userUid } = req.body;
    const bomItems = items && Array.isArray(items) && items.length > 0 ? items : SAMPLE_BOMS[0].items;
    const title = bomName || 'BOM Optimization Run';
    const uid = userUid || 'guest-session';

    // Agent 1: BOM Deconstruction
    const bomDeconstruction = runBomDeconstructionAgent(bomItems);

    // Agent 2: Material Science
    const materialScience = await runMaterialScienceAgent(bomItems, aiClient);

    // Agent 3: Structural Integrity
    const structuralIntegrity = runStructuralIntegrityAgent(bomItems, materialScience.proposedSwaps);

    // Agent 4: Circular Lifecycle
    const circularLifecycle = runCircularLifecycleAgent(bomItems, materialScience.proposedSwaps);

    // Agent 5: Orchestrator
    const orchestrator = await runOrchestratorAgent(
      bomItems,
      materialScience.proposedSwaps,
      structuralIntegrity,
      circularLifecycle,
      aiClient
    );

    const agentOutputs = {
      bomDeconstruction,
      materialScience,
      structuralIntegrity,
      circularLifecycle,
      orchestrator
    };

    const runRecord: PipelineRun = {
      id: `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      title,
      inputBomName: title,
      bomData: bomItems,
      agentOutputs,
      status: orchestrator.humanGateRequired ? 'needs_review' : 'completed',
      carbonSavedKg: circularLifecycle.carbonSavingsKgCO2,
      carbonSavedPercent: circularLifecycle.carbonSavingsPercent,
      recyclabilityScore: circularLifecycle.recyclabilityPercent,
      disassemblyScore: circularLifecycle.disassemblyScore,
      userUid: uid
    };

    // Save to user session store
    const userRuns = runStore.get(uid) || [];
    userRuns.unshift(runRecord);
    runStore.set(uid, userRuns);

    return res.json({
      success: true,
      run: runRecord
    });
  } catch (error: any) {
    console.error('Error running agent pipeline:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to run multi-agent pipeline'
    });
  }
});

// GET /api/runs - Retrieve user's run history
apiRouter.get('/runs', (req: Request, res: Response) => {
  const uid = (req.query.userUid as string) || 'guest-session';
  const userRuns = runStore.get(uid) || [];
  return res.json({ runs: userRuns });
});

// DELETE /api/runs/:id - Clear a specific run
apiRouter.delete('/runs/:id', (req: Request, res: Response) => {
  const uid = (req.query.userUid as string) || 'guest-session';
  const runId = req.params.id;
  const userRuns = runStore.get(uid) || [];
  const updated = userRuns.filter(r => r.id !== runId);
  runStore.set(uid, updated);
  return res.json({ success: true });
});
