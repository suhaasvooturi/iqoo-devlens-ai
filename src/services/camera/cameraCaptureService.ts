export interface CameraStatus {
  isActive: boolean;
  hasPermission: boolean | null; // null = unprompted
  error: string | null;
  deviceLabel: string | null;
}

export class CameraCaptureService {
  private mediaStream: MediaStream | null = null;
  private videoTrack: MediaStreamTrack | null = null;

  public async startCamera(
    videoElement: HTMLVideoElement,
    facingMode: 'environment' | 'user' = 'environment'
  ): Promise<CameraStatus> {
    // 1. Check browser support
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return {
        isActive: false,
        hasPermission: false,
        error: 'Camera API (navigator.mediaDevices.getUserMedia) is not supported in this browser.',
        deviceLabel: null,
      };
    }

    try {
      // 2. Stop any existing track
      this.stopCamera();

      // 3. Request camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      this.mediaStream = stream;
      this.videoTrack = stream.getVideoTracks()[0] || null;

      // 4. Attach to video element
      videoElement.srcObject = stream;
      videoElement.setAttribute('playsinline', 'true'); // Required for iOS Safari
      await videoElement.play();

      return {
        isActive: true,
        hasPermission: true,
        error: null,
        deviceLabel: this.videoTrack?.label || 'Camera active',
      };
    } catch (err: unknown) {
      const errorObj = err as Error;
      let userFriendlyError = 'Could not access camera.';

      if (errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError') {
        userFriendlyError = 'Camera permission denied. Please allow camera access in browser settings.';
      } else if (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError') {
        userFriendlyError = 'No camera hardware found on this device.';
      } else if (errorObj.name === 'NotReadableError' || errorObj.name === 'TrackStartError') {
        userFriendlyError = 'Camera is already in use by another application.';
      }

      return {
        isActive: false,
        hasPermission: false,
        error: userFriendlyError,
        deviceLabel: null,
      };
    }
  }

  public stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
      this.videoTrack = null;
    }
  }

  public captureSnapshot(videoElement: HTMLVideoElement): { dataUrl: string; width: number; height: number } | null {
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.85),
      width: canvas.width,
      height: canvas.height,
    };
  }
}

export const cameraCaptureService = new CameraCaptureService();
