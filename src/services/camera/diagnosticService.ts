import type { OCRResult } from './ocrService';
import type { DiagnosticResult } from '../ai/types';
import { analyzeAndDebug } from '../ai/debugger';
import { officeKitBridge } from '../bridgeService';

export class DiagnosticService {
  /**
   * Synthesizes a structured DiagnosticResult from an OCR scan result
   */
  public async diagnoseOCR(ocr: OCRResult): Promise<DiagnosticResult> {
    const sampleCode = `async function fetchUserProfile(userId: string) {
  const response = await fetch('/api/users/' + userId);
  const data = await response.json();
  const avatarUrl = data.profile.avatar.url;
  return { id: data.id, avatar: avatarUrl };
}`;

    const diagnostic = analyzeAndDebug(sampleCode, ocr.detectedError, 'typescript');

    // Notify bridge about the mobile scan diagnosis
    try {
      officeKitBridge.send({
        type: 'TERMINAL_COMMAND',
        command: `[Phone Sentinel] OCR Extracted: ${ocr.detectedError} at ${ocr.culpritFile}:${ocr.culpritLine}`,
      });
    } catch {
      // Non-critical
    }

    return diagnostic;
  }
}

export const diagnosticService = new DiagnosticService();
