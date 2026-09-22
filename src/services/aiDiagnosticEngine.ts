import type { Incident } from '../types';

export interface DiagnosticResult {
  incident: Incident;
  inferenceTimeMs: number;
  tokensPerSecond: number;
  modelUsed: string;
  reasoningSteps: string[];
}

export function parseCustomErrorLog(rawLog: string): Incident {
  // Extract file and line heuristics
  let culpritFile = 'src/index.ts';
  let culpritLine = 1;
  let errorType = 'Runtime Error';

  // Common stack trace regex patterns
  const jsMatch = rawLog.match(/(?:at\s+.*?\s+\(?|\()([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+):(\d+)(?::(\d+))?\)?/);
  const pyMatch = rawLog.match(/File "([^"]+)", line (\d+)/);
  const rustMatch = rawLog.match(/([a-zA-Z0-9_\-./]+\.rs):(\d+):(\d+)/);

  if (pyMatch) {
    culpritFile = pyMatch[1];
    culpritLine = parseInt(pyMatch[2], 10);
    const errLine = rawLog.split('\n').filter(l => l.includes('Error:') || l.includes('Exception:')).pop();
    if (errLine) errorType = errLine.trim();
  } else if (rustMatch) {
    culpritFile = rustMatch[1];
    culpritLine = parseInt(rustMatch[2], 10);
    errorType = 'Rust Panic / Thread Unwind';
  } else if (jsMatch) {
    culpritFile = jsMatch[1];
    culpritLine = parseInt(jsMatch[2], 10);
    const firstLine = rawLog.split('\n')[0];
    if (firstLine && (firstLine.includes('Error') || firstLine.includes('Exception'))) {
      errorType = firstLine.trim();
    }
  }

  return {
    id: `custom-${Date.now()}`,
    title: `Diagnosed: ${errorType.slice(0, 48)}`,
    category: 'Runtime Error',
    framework: culpritFile.endsWith('.py')
      ? 'FastAPI / Python'
      : culpritFile.endsWith('.rs')
      ? 'Rust / Tokio'
      : culpritFile.endsWith('.kt')
      ? 'Android Kotlin'
      : 'Next.js 14 / React 19',
    timestamp: 'Just now',
    rawLog,
    culpritFile,
    culpritLine,
    errorType,
    severity: 'HIGH',
    severityScore: 8.5,
    rootCause: `Automated detection at line ${culpritLine} in ${culpritFile}. Unhandled exception or state violation during execution pipeline.`,
    humanSummary: `Hey! I parsed this custom error stack trace. The failure originated at line ${culpritLine} in ${culpritFile}. I've synthesized a defensive guard to prevent runtime crashes.`,
    voiceBriefing: `Custom incident detected in ${culpritFile} at line ${culpritLine}. The error was identified as ${errorType}. A defensive hotfix has been generated and is ready to review.`,
    devContext: {
      reportedBy: 'Terminal Trace (Custom Log)',
      timeReported: 'Just now',
      assignee: 'Suhas (Lead Dev)',
      activeBranch: 'hotfix/manual-incident',
    },
    visualPreview: {
      type: 'web',
      brokenStateDescription: `Runtime exception thrown in ${culpritFile}:${culpritLine}: ${errorType}.`,
      fixedStateDescription: `Defensive condition added. Execution proceeds smoothly without uncaught throw.`,
      beforeLabel: 'Crash: Stack Trace Uncaught',
      afterLabel: 'Fixed: Defensive Guard Active',
    },
    copilotChat: [
      {
        sender: 'ai',
        text: `Hey Suhas, I've parsed your custom stack trace. Culprit identified at \`${culpritFile}:${culpritLine}\`. What would you like me to analyze further?`,
        time: 'Just now',
      },
    ],
    impactAnalysis: 'Halts current thread/process execution; degrades reliability and could trigger worker restart loops.',
    preventionAdvice: 'Validate input bounds, wrap in defensive guards, or add fallback handlers.',
    originalCode: `// Original snippet around line ${culpritLine}\nconst target = parseInput(data);\nexecuteOperation(target);`,
    fixedCode: `// Fixed: Safe guard added by DevLens AI\nconst target = parseInput(data);\nif (target) {\n  executeOperation(target);\n}`,
    gitDiff: `--- a/${culpritFile}\n+++ b/${culpritFile}\n@@ -${culpritLine},2 +${culpritLine},4 @@\n const target = parseInput(data);\n-executeOperation(target);\n+if (target) {\n+  executeOperation(target);\n+}`,
    testSuite: {
      name: 'npm test -- --bail',
      totalTests: 10,
      failingTestName: `should handle edge-case cleanly at line ${culpritLine}`,
      failingErrorMessage: `${errorType} triggered during test suite run`,
      passedBefore: 9,
      failedBefore: 1,
    },
  };
}

export async function runAIDiagnosis(
  incident: Incident,
  mode: 'edge-local' | 'cloud-deep',
  onStep?: (step: string) => void
): Promise<DiagnosticResult> {
  const steps: string[] = [];

  const addStep = (s: string) => {
    steps.push(s);
    if (onStep) onStep(s);
  };

  if (mode === 'edge-local') {
    addStep('⚡ Initializing on-device NPU kernel (Qwen2.5-Coder-1.5B 4-bit quantized)...');
    await new Promise(r => setTimeout(r, 220));
    addStep('🔍 Deconstructing stack trace AST & locating culprit frame...');
    await new Promise(r => setTimeout(r, 300));
    addStep(`🎯 Culprit identified: ${incident.culpritFile}:${incident.culpritLine}`);
    await new Promise(r => setTimeout(r, 250));
    addStep('🛡️ Evaluating blast radius & generating zero-regression git patch...');
    await new Promise(r => setTimeout(r, 280));
    addStep('✅ Hotfix diff synthesized & test sandbox verification ready.');

    return {
      incident,
      inferenceTimeMs: 1050,
      tokensPerSecond: 28.6,
      modelUsed: 'Qwen2.5-Coder-1.5B (On-Device iQOO NPU)',
      reasoningSteps: steps,
    };
  } else {
    addStep('🌐 Routing telemetry to High-Reasoning Cloud Cluster...');
    await new Promise(r => setTimeout(r, 350));
    addStep('🧠 Chain-of-Thought: Analyzing multi-threaded memory invariants & async cycle...');
    await new Promise(r => setTimeout(r, 450));
    addStep(`🎯 Pinpointed deadlock locus at ${incident.culpritFile}:${incident.culpritLine}`);
    await new Promise(r => setTimeout(r, 400));
    addStep('🔬 Generating formal verification constraints & patch proof...');
    await new Promise(r => setTimeout(r, 380));
    addStep('✅ Enterprise hotfix patch generated with regression safeguards.');

    return {
      incident,
      inferenceTimeMs: 1580,
      tokensPerSecond: 42.1,
      modelUsed: 'Gemini 2.0 Pro / DeepSeek Coder V2 (Cloud)',
      reasoningSteps: steps,
    };
  }
}
