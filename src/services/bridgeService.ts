import type { Incident, HotfixCommitResult } from '../types';

export type BridgeMessage =
  | { type: 'INCIDENT_SELECTED'; incident: Incident }
  | { type: 'HOTFIX_DEPLOYED'; hotfix: HotfixCommitResult; incidentId: string }
  | { type: 'TESTS_RUN'; result: 'passed' | 'failed'; incidentId: string }
  | { type: 'TERMINAL_COMMAND'; command: string }
  | { type: 'PING'; timestamp: number }
  | { type: 'PONG'; timestamp: number; latencyMs: number }
  | { type: 'WORKSTATION_RUNTIME_ERROR'; error: string; file: string; line: number }
  | { type: 'PHONE_DEBUG_ALERT'; incidentTitle: string; severity: string }
  | { type: 'PHONE_EXPLAIN_REQUEST'; query: string }
  | { type: 'LAPTOP_EXPLANATION_RECEIVED'; response: string }
  | { type: 'PHONE_SEND_FIX'; patchDiff: string; incidentId: string }
  | { type: 'LAPTOP_PATCH_RECEIVED'; commitHash: string };

export interface BridgeEventLog {
  id: string;
  timestamp: string;
  source: 'workstation' | 'phone' | 'link';
  text: string;
  type: BridgeMessage['type'];
}

type Listener = (msg: BridgeMessage) => void;

class OfficeKitBridge {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<Listener> = new Set();
  private eventLogs: BridgeEventLog[] = [];
  private logListeners: Set<(logs: BridgeEventLog[]) => void> = new Set();
  private isConnected: boolean = false;
  private measuredLatencyMs: number = 2.1;
  private lastSyncTime: number = Date.now();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('iqoo_devlens_link_channel');
        this.channel.onmessage = (event) => {
          this.handleIncoming(event.data);
        };
        this.isConnected = true;
      } catch {
        this.isConnected = false;
      }
    }

    // Initialize default system boot events
    this.addLog({
      source: 'link',
      text: 'DevLens Link UltraLink protocol initialized (P2P Mesh ready)',
      type: 'PING',
    });
  }

  private handleIncoming(msg: BridgeMessage) {
    if (msg.type === 'PING') {
      const latency = Math.max(0.8, Date.now() - msg.timestamp);
      this.measuredLatencyMs = latency;
      this.lastSyncTime = Date.now();
      this.sendLocalOnly({ type: 'PONG', timestamp: Date.now(), latencyMs: latency });
      return;
    }

    if (msg.type === 'PONG') {
      this.measuredLatencyMs = msg.latencyMs;
      this.lastSyncTime = Date.now();
      return;
    }

    // Log contextual transactions
    if (msg.type === 'WORKSTATION_RUNTIME_ERROR') {
      this.addLog({
        source: 'workstation',
        text: `Workstation: Runtime error detected at ${msg.file}:${msg.line}`,
        type: msg.type,
      });
    } else if (msg.type === 'PHONE_DEBUG_ALERT') {
      this.addLog({
        source: 'phone',
        text: `iQOO Phone: New debugging alert received [${msg.severity}]`,
        type: msg.type,
      });
    } else if (msg.type === 'PHONE_EXPLAIN_REQUEST') {
      this.addLog({
        source: 'phone',
        text: `iQOO Phone: Requested explanation for query "${msg.query}"`,
        type: msg.type,
      });
    } else if (msg.type === 'LAPTOP_EXPLANATION_RECEIVED') {
      this.addLog({
        source: 'workstation',
        text: 'Workstation: Explanation synthesized and delivered to phone',
        type: msg.type,
      });
    } else if (msg.type === 'PHONE_SEND_FIX') {
      this.addLog({
        source: 'phone',
        text: 'iQOO Phone: Sent verified hotfix patch to laptop',
        type: msg.type,
      });
    } else if (msg.type === 'LAPTOP_PATCH_RECEIVED') {
      this.addLog({
        source: 'workstation',
        text: `Workstation: Patch applied cleanly & committed (${msg.commitHash})`,
        type: msg.type,
      });
    }

    this.notifyListeners(msg);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public subscribeLogs(listener: (logs: BridgeEventLog[]) => void): () => void {
    this.logListeners.add(listener);
    listener([...this.eventLogs]);
    return () => this.logListeners.delete(listener);
  }

  private notifyListeners(msg: BridgeMessage) {
    this.listeners.forEach((fn) => fn(msg));
  }

  private addLog(entry: Omit<BridgeEventLog, 'id' | 'timestamp'>) {
    const newLog: BridgeEventLog = {
      ...entry,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    this.eventLogs = [newLog, ...this.eventLogs.slice(0, 29)];
    this.logListeners.forEach((fn) => fn([...this.eventLogs]));
  }

  private sendLocalOnly(msg: BridgeMessage) {
    this.notifyListeners(msg);
  }

  public send(msg: BridgeMessage) {
    this.notifyListeners(msg);

    // Also log relevant local send events
    if (msg.type === 'WORKSTATION_RUNTIME_ERROR') {
      this.addLog({
        source: 'workstation',
        text: `Workstation: Runtime error caught (${msg.error})`,
        type: msg.type,
      });
    } else if (msg.type === 'PHONE_SEND_FIX') {
      this.addLog({
        source: 'phone',
        text: 'iQOO Phone: 1-Tap Hotfix transmitted to workstation',
        type: msg.type,
      });
    }

    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (err) {
        console.warn('DevLens Link postMessage error', err);
      }
    }
  }

  public getStatus() {
    const elapsedSec = Math.max(0, Math.round((Date.now() - this.lastSyncTime) / 1000));
    return {
      connected: this.isConnected,
      protocol: 'iQOO UltraLink P2P (Low-Latency Broadcast Mesh)',
      latencyMs: this.measuredLatencyMs.toFixed(1),
      lastSyncSecondsAgo: elapsedSec,
      model: 'WORKSTATION ↔ DEVLENS LINK ↔ iQOO PHONE',
    };
  }

  public getEventLogs(): BridgeEventLog[] {
    return [...this.eventLogs];
  }
}

export const officeKitBridge = new OfficeKitBridge();
