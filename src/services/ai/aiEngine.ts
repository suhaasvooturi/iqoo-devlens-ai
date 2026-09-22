import type { AIRequest, AIResponse } from './types';
import { analyzeAndDebug } from './debugger';
import { analyzeAndExplain } from './explainer';
import { analyzeAndOptimize } from './optimizer';
import { generateTestSuite } from './testGenerator';
import { scanSecurityVulnerabilities } from './security';
import { calculateComplexity } from './complexity';
import { generateDocumentation } from './docGenerator';
import { convertCodeSyntax } from './converter';
import { addHistoryItem } from '../historyStorage';
import { officeKitBridge } from '../bridgeService';

export * from './types';
export {
  analyzeAndDebug,
  analyzeAndExplain,
  analyzeAndOptimize,
  generateTestSuite,
  scanSecurityVulnerabilities,
  calculateComplexity,
  generateDocumentation,
  convertCodeSyntax,
};

// ==========================================
// PRELOADED SAMPLES FOR INSTANT DEMOS
// ==========================================
export const TOOL_SAMPLES = {
  debugger: {
    code: `async function fetchUserProfile(userId: string) {
  const response = await fetch('/api/users/' + userId);
  const data = await response.json();
  // 💥 Throws TypeError if profile is null or undefined
  const avatarUrl = data.profile.avatar.url;
  return { id: data.id, avatar: avatarUrl };
}`,
    error: `TypeError: Cannot read properties of undefined (reading 'url')
    at fetchUserProfile (api/users.ts:5:34)
    at async handleUserLogin (auth/login.ts:24:12)`,
    language: 'typescript',
  },
  explainer: {
    code: `function debounce<T extends (...args: any[]) => any>(fn: T, delayMs: number) {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delayMs);
  };
}`,
    language: 'typescript',
  },
  optimizer: {
    code: `// Finding common elements between two large lists
function findCommon(listA: number[], listB: number[]): number[] {
  const common: number[] = [];
  // ❌ O(N * M) nested loop bottleneck
  for (let i = 0; i < listA.length; i++) {
    for (let j = 0; j < listB.length; j++) {
      if (listA[i] === listB[j] && !common.includes(listA[i])) {
        common.push(listA[i]);
      }
    }
  }
  return common;
}`,
    language: 'typescript',
  },
  testgen: {
    code: `export function parseJwtClaims(token: string): { sub: string; exp: number; role: string } {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token string provided');
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT must have 3 segments');
  }
  const payloadJson = atob(parts[1]);
  const parsed = JSON.parse(payloadJson);
  if (!parsed.sub || !parsed.exp) {
    throw new Error('Token payload missing mandatory claims');
  }
  return parsed;
}`,
    language: 'typescript',
    framework: 'Jest / Vitest',
  },
  security: {
    code: `import sqlite3
def search_users(user_input):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    # 💥 Vulnerable: SQL Injection via unescaped string formatting
    query = f"SELECT id, username, email FROM accounts WHERE username = '{user_input}'"
    cursor.execute(query)
    return cursor.fetchall()`,
    language: 'python',
  },
  complexity: {
    code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    language: 'python',
  },
  docgen: {
    code: `interface CacheOptions {
  ttlSeconds: number;
  maxKeys?: number;
}

class MemoryStore<K, V> {
  private store = new Map<K, { value: V; expiresAt: number }>();

  set(key: K, value: V, ttl = 300): void {
    const expiresAt = Date.now() + ttl * 1000;
    this.store.set(key, { value, expiresAt });
  }

  get(key: K): V | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }
}`,
    language: 'typescript',
  },
  converter: {
    code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
    sourceLang: 'python',
    targetLang: 'typescript',
  },
};

// Aliases for tool backward compatibility
export const runDebugger = (code: string, error: string) => analyzeAndDebug(code, error);
export const runExplainer = (code: string) => analyzeAndExplain(code);
export const runOptimizer = (code: string) => analyzeAndOptimize(code);
export const runTestGenerator = (code: string, framework: string) => generateTestSuite(code, framework);
export const runSecurityScanner = (code: string) => scanSecurityVulnerabilities(code);
export const runComplexityAnalyzer = (code: string) => calculateComplexity(code);
export const runDocGenerator = (code: string, format: 'jsdoc' | 'docstring' | 'markdown') => generateDocumentation(code, format);
export const runCodeConverter = (code: string, sourceLang: string, targetLang: string) => convertCodeSyntax(code, sourceLang, targetLang);

// ==========================================
// UNIFIED REALISTIC AI PIPELINE
// USER INPUT -> INPUT VALIDATION -> ANALYSIS -> AI ENGINE -> STRUCTURED RESULT -> HISTORY -> PHONE SYNC
// ==========================================
export class DevLensAIPipeline {
  public static async execute<T>(
    request: AIRequest,
    engineFn: (source: string) => T,
    historyCategory: {
      toolId: 'debugger' | 'explainer' | 'optimizer' | 'testgen' | 'security' | 'complexity' | 'docgen' | 'converter';
      toolName: string;
      summaryExtractor: (result: T) => string;
    }
  ): Promise<AIResponse<T>> {
    const startTime = performance.now();

    // 1. Input validation
    if (!request.sourceCode || request.sourceCode.trim().length === 0) {
      throw new Error('Input validation failure: Source code buffer is empty.');
    }

    // 2. Execute analysis engine
    const data = engineFn(request.sourceCode);
    const durationMs = Math.round(performance.now() - startTime);

    // 3. Persist to History & Stats
    try {
      const summary = historyCategory.summaryExtractor(data);
      addHistoryItem({
        toolId: historyCategory.toolId,
        toolName: historyCategory.toolName,
        language: request.language || 'TypeScript',
        summary,
        status: 'success',
        snippetPreview: request.sourceCode.slice(0, 140),
      });
    } catch (e) {
      console.warn('History storage sync deferred:', e);
    }

    // 4. Phone sync notification
    try {
      officeKitBridge.send({
        type: 'TERMINAL_COMMAND',
        command: `[DevLens AI] Completed ${historyCategory.toolName} analysis (${durationMs}ms)`,
      });
    } catch {
      // Bridge non-critical
    }

    return {
      id: `res-${Date.now()}`,
      requestId: request.id,
      success: true,
      durationMs,
      data,
      engine: 'DevLens Qwen-Coder AST Edge Engine (Local)',
      timestamp: new Date().toISOString(),
    };
  }
}
