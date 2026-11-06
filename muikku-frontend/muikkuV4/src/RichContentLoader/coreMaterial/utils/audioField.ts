import type { AudioClip } from "~/src/components/AudioRecorder";

/**
 * Persisted audio-field JSON item.
 */
export interface AudioFieldClipJson {
  id: string;
  name: string;
  contentType: string;
}

/**
 * Parse saved field JSON into clips.
 * @param raw - initialValue from composite reply
 * @param getPlaybackUrl - URL for a saved clip id
 */
export function parseAudioFieldValue(
  raw: string | undefined,
  getPlaybackUrl: (clip: AudioClip) => string | undefined
): AudioClip[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as AudioFieldClipJson[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item) => item && typeof item.id === "string")
      .map((item) => {
        const clip: AudioClip = {
          id: item.id,
          name: item.name,
          contentType: item.contentType || "audio/webm",
        };
        return { ...clip, url: getPlaybackUrl(clip) };
      });
  } catch {
    return [];
  }
}

/**
 * JSON for websocket save, or null while an upload is in flight.
 * @param clips - Current UI clips
 */
export function serializeAudioFieldValue(clips: AudioClip[]): string | null {
  if (clips.some((clip) => clip.uploading)) {
    return null;
  }
  const ready: AudioFieldClipJson[] = clips
    .filter((clip) => !clip.failed && clip.id)
    .map((clip) => ({
      id: clip.id!,
      name: clip.name ?? clip.id ?? "",
      contentType: clip.contentType,
    }));
  return JSON.stringify(ready);
}
