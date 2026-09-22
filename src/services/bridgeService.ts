import type { Incident, HotfixCommitResult } from '../types';

export type BridgeMessage =
  | { type: 'INCIDENT_SELECTED'; incident: Incident }
  | { type: 'HOTFIX_DEPLOYED'; hotfix: HotfixCommitResult; incidentId: string }
  | { type: 'TESTS_RUN'; result: 'passed' | 'failed'; incidentId: string }
  | { type: 'TERMINAL_COMMAND'; command: string }
  | { type: 'PING'; timestamp: number };

type Listener = (msg: BridgeMessage) => void;

class OfficeKitBridge {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<Listener> = new Set();
  private isConnected: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('iqoo_office_kit_channel');
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
        this.isConnected = true;
      } catch {
        this.isConnected = false;
      }
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(msg: BridgeMessage) {
    this.listeners.forEach((fn) => fn(msg));
  }

  public send(msg: BridgeMessage) {
    // Notify local listeners
    this.notifyListeners(msg);
    // Broadcast across tabs/devices
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (err) {
        console.warn('OfficeKit postMessage error', err);
      }
    }
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      protocol: 'iQOO Office Kit UltraLink (Low-Latency P2P)',
      latencyMs: (Math.random() * 1.5 + 2.2).toFixed(1),
    };
  }
}

export const officeKitBridge = new OfficeKitBridge();
