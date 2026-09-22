export type DeviceViewMode = 'split' | 'phone' | 'workstation';

export type AIModelMode = 'edge-local' | 'cloud-deep';

export type DevToolId =
  | 'dashboard'
  | 'debugger'
  | 'explainer'
  | 'optimizer'
  | 'testgen'
  | 'security'
  | 'complexity'
  | 'docgen'
  | 'converter'
  | 'sentinel';

export interface AnalysisHistoryItem {
  id: string;
  toolId: DevToolId;
  toolName: string;
  language: string;
  summary: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  snippetPreview: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  bugsFixed: number;
  vulnerabilitiesFound: number;
  optimizationsApplied: number;
  testsGenerated: number;
}

export interface StackFrame {
  file: string;
  line: number;
  column?: number;
  functionName?: string;
  codeSnippet?: string;
}

export interface Incident {
  id: string;
  title: string;
  category: 'Runtime Error' | 'Compilation Crash' | 'Concurrency Deadlock' | 'Memory / OOM' | 'Hydration / Web';
  framework: 'Next.js 14 / React 19' | 'FastAPI / Python' | 'Rust / Tokio' | 'Docker / Node.js' | 'Android Kotlin';
  timestamp: string;
  rawLog: string;
  culpritFile: string;
  culpritLine: number;
  errorType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  severityScore: number;
  rootCause: string;
  humanSummary: string;
  voiceBriefing: string;
  devContext: {
    reportedBy: string;
    timeReported: string;
    assignee: string;
    activeBranch: string;
  };
  visualPreview: {
    type: 'web' | 'api' | 'docker' | 'mobile';
    brokenStateDescription: string;
    fixedStateDescription: string;
    beforeLabel: string;
    afterLabel: string;
  };
  impactAnalysis: string;
  preventionAdvice: string;
  originalCode: string;
  fixedCode: string;
  gitDiff: string;
  copilotChat?: Array<{
    sender: 'ai' | 'user';
    text: string;
    time?: string;
  }>;
  testSuite: {
    name: string;
    totalTests: number;
    failingTestName: string;
    failingErrorMessage: string;
    passedBefore: number;
    failedBefore: number;
  };
  mockCameraImage?: string;
}

export interface HardwareTelemetry {
  npuInferenceSpeed: string;
  modelActive: string;
  batteryTemp: string;
  mode: 'Monster Mode' | 'Efficiency Mode';
  officeKitLatency: string;
  syncStatus: 'SYNCED' | 'TRANSFERRING' | 'STANDBY';
}

export interface HotfixCommitResult {
  commitHash: string;
  branch: string;
  message: string;
  appliedAt: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
}
