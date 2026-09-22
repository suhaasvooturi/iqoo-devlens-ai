export type DeviceViewMode = 'split' | 'phone' | 'workstation';

export type AIModelMode = 'edge-local' | 'cloud-deep';

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
  severityScore: number; // 1 - 10
  rootCause: string;
  humanSummary: string; // Warm, senior-engineer plain English explanation
  voiceBriefing: string; // Speech synthesis script
  devContext: {
    reportedBy: string; // e.g. "Sentry Webhook" or "Alex (QA Lead)"
    timeReported: string; // e.g. "4 minutes ago"
    assignee: string; // e.g. "Suhas (Lead Dev)"
    activeBranch: string; // e.g. "feat/nav-redesign"
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
  npuInferenceSpeed: string; // e.g. "21.4 tokens/s"
  modelActive: string; // e.g. "Qwen2.5-Coder-1.5B (4-bit NPU)"
  batteryTemp: string; // e.g. "32.1°C"
  mode: 'Monster Mode' | 'Efficiency Mode';
  officeKitLatency: string; // e.g. "2.8 ms"
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
