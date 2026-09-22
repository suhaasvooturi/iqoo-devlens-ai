// Common interfaces for DevLens AI modular intelligence pipeline

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AIRequest<T = Record<string, unknown>> {
  id: string;
  tool: string;
  sourceCode: string;
  language?: string;
  context?: T;
  timestamp: string;
}

export interface AIResponse<T = unknown> {
  id: string;
  requestId: string;
  success: boolean;
  durationMs: number;
  data: T;
  engine: string;
  timestamp: string;
}

export interface DiagnosticResult {
  rootCause: string;
  affectedFile?: string;
  culpritLine?: number;
  explanation: string;
  correctedCode: string;
  gitDiff: string;
  confidenceScore: number;
  recommendedAction: string;
}

export interface DebuggerOutput extends DiagnosticResult {
  fixedCode: string;
}

export interface LineExplanation {
  line: number;
  code: string;
  explanation: string;
}

export interface ExplainerOutput {
  summary: string;
  lineByLine: LineExplanation[];
  eli5: string;
  keyConcepts: string[];
}

export interface OptimizationResult {
  optimizedCode: string;
  speedupPercentage: string;
  memorySavings: string;
  bottleneckExplanation: string;
  timeComplexityBefore: string;
  timeComplexityAfter: string;
  memoryImpact: string;
  suggestedRefactor: string;
}

export type OptimizerOutput = OptimizationResult;

export interface TestGenOutput {
  testCode: string;
  framework: string;
  testCasesCount: number;
  coveredScenarios: string[];
  testCategories: {
    happyPath: string[];
    edgeCases: string[];
    boundaryCases: string[];
    invalidInputs: string[];
    regressionCases: string[];
  };
}

export interface SecurityFinding {
  id: string;
  cwe: string;
  severity: SeverityLevel;
  category: string;
  title: string;
  line: number;
  description: string;
  whyItMatters: string;
  remediation: string;
  sanitizedCode: string;
}

export type SecurityVulnerability = SecurityFinding;

export interface ComplexityOutput {
  timeComplexity: string;
  spaceComplexity: string;
  timeExplanation: string;
  spaceExplanation: string;
  hotspotLine: number;
  scalabilityRating: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
}

export interface DocGenOutput {
  documentedCode: string;
  format: 'jsdoc' | 'docstring' | 'markdown' | 'openapi';
  summary: string;
}

export interface ConverterOutput {
  convertedCode: string;
  sourceLang: string;
  targetLang: string;
  idiomaticNotes: string[];
  notes: string[];
}
