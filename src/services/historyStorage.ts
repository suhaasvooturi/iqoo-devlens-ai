import type { AnalysisHistoryItem, DashboardStats } from '../types';

const HISTORY_KEY = 'devpilot_analysis_history';
const STATS_KEY = 'devpilot_dashboard_stats';

const DEFAULT_STATS: DashboardStats = {
  totalAnalyses: 18,
  bugsFixed: 12,
  vulnerabilitiesFound: 5,
  optimizationsApplied: 9,
  testsGenerated: 42,
};

const INITIAL_HISTORY: AnalysisHistoryItem[] = [
  {
    id: 'hist-1',
    toolId: 'debugger',
    toolName: 'AI Debugger',
    language: 'TypeScript',
    summary: 'Resolved Next.js SSR window is not defined hydration error in Navbar.tsx',
    timestamp: '5 mins ago',
    status: 'success',
    snippetPreview: 'const authToken = window.localStorage.getItem(...)',
  },
  {
    id: 'hist-2',
    toolId: 'security',
    toolName: 'Security Scanner',
    language: 'Python',
    summary: 'Detected unescaped SQL parameter in user login query (CWE-89)',
    timestamp: '22 mins ago',
    status: 'warning',
    snippetPreview: 'cursor.execute(f"SELECT * FROM users WHERE user=\'{username}\'")',
  },
  {
    id: 'hist-3',
    toolId: 'optimizer',
    toolName: 'Code Optimizer',
    language: 'JavaScript',
    summary: 'Reduced nested array lookup from O(n²) to O(n) using Map',
    timestamp: '1 hour ago',
    status: 'success',
    snippetPreview: 'items.filter(item => otherList.some(o => o.id === item.id))',
  },
  {
    id: 'hist-4',
    toolId: 'testgen',
    toolName: 'Test Generator',
    language: 'TypeScript',
    summary: 'Created 6 Jest test cases covering boundary conditions & null checks',
    timestamp: '2 hours ago',
    status: 'success',
    snippetPreview: 'export function calculateDiscount(price: number, code: string)',
  },
  {
    id: 'hist-5',
    toolId: 'complexity',
    toolName: 'Complexity Analyzer',
    language: 'Python',
    summary: 'Analyzed recursive Fibonacci function: Time O(2ⁿ), Space O(n)',
    timestamp: '3 hours ago',
    status: 'warning',
    snippetPreview: 'def fib(n): return n if n <= 1 else fib(n-1) + fib(n-2)',
  },
];

export function getHistory(): AnalysisHistoryItem[] {
  if (typeof window === 'undefined') return INITIAL_HISTORY;
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_HISTORY;
  }
}

export function addHistoryItem(item: Omit<AnalysisHistoryItem, 'id' | 'timestamp'>): AnalysisHistoryItem {
  const newItem: AnalysisHistoryItem = {
    ...item,
    id: `hist-${Date.now()}`,
    timestamp: 'Just now',
  };

  if (typeof window !== 'undefined') {
    try {
      const history = getHistory();
      const updated = [newItem, ...history].slice(0, 50); // keep last 50
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

      // Increment stats
      const stats = getStats();
      stats.totalAnalyses += 1;
      if (item.toolId === 'debugger') stats.bugsFixed += 1;
      if (item.toolId === 'security') stats.vulnerabilitiesFound += 1;
      if (item.toolId === 'optimizer') stats.optimizationsApplied += 1;
      if (item.toolId === 'testgen') stats.testsGenerated += 4;
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }

  return newItem;
}

export function getStats(): DashboardStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) {
      localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
      return DEFAULT_STATS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_STATS;
  }
}

export function clearHistory(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
  }
}
