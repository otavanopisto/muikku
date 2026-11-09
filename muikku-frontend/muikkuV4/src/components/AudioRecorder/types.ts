/**
 * One audio clip in the recorder UI (local or saved).
 */
export interface AudioClip {
  /** Stable key before the server id exists. Not persisted. */
  clientId?: string;
  id?: string;
  name?: string;
  contentType: string;
  url?: string;
  description?: string;
  uploading?: boolean;
  progress?: number;
  failed?: boolean;
}

/**
 * Result of a successful temp / feature upload.
 */
export interface AudioUploadResult {
  id: string;
  name: string;
  contentType: string;
}

/**
 * AudioRecorderProps
 */
export interface AudioRecorderProps {
  values: AudioClip[];
  readOnly?: boolean;
  maxDurationSec?: number;
  onChange: (clips: AudioClip[]) => void;
  upload?: (
    blob: Blob,
    meta: { name?: string },
    onProgress?: (ratio: number) => void
  ) => Promise<AudioUploadResult>;
  getPlaybackUrl?: (clip: AudioClip) => string | undefined;
  onIsRecordingChange?: (recording: boolean) => void;
}
