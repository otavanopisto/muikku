import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_MAX_SECONDS = 300;

/**
 * MediaRecorder session: start / stop / timer. Does not upload.
 */
export function useAudioRecorder(options?: {
  maxDurationSec?: number;
  onRecorded?: (blob: Blob) => void;
}) {
  const maxDurationSec = options?.maxDurationSec ?? DEFAULT_MAX_SECONDS;
  const onRecordedRef = useRef(options?.onRecorded);
  onRecordedRef.current = options?.onRecorded;

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef("");

  const supported =
    typeof window !== "undefined" && typeof MediaRecorder !== "undefined";

  /**
   * Stop tracks and drop the recorder.
   */
  const teardown = useCallback(() => {
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  /**
   * Start microphone capture.
   */
  const start = useCallback(async () => {
    if (!supported || recording) {
      return;
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          mimeRef.current = event.data.type;
          chunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener("stop", () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeRef.current || "audio/webm",
        });
        chunksRef.current = [];
        teardown();
        setRecording(false);
        setSeconds(0);
        if (blob.size > 0) {
          onRecordedRef.current?.(blob);
        }
      });

      recorder.start();
      setSeconds(0);
      setRecording(true);
    } catch (error) {
      teardown();
      setError("microphone");
    }
  }, [recording, supported, teardown]);

  /**
   * Stop recording; `onRecorded` runs from the stop event.
   */
  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      teardown();
      setRecording(false);
    }
  }, [teardown]);

  useEffect(() => {
    if (!recording) {
      return;
    }
    const timer = window.setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        if (next >= maxDurationSec) {
          stop();
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [maxDurationSec, recording, stop]);

  useEffect(() => () => teardown(), [teardown]);

  return { recording, seconds, error, supported, start, stop };
}

/**
 * Format seconds as mm:ss.
 * @param total - Elapsed seconds
 */
export function formatRecorderTime(total: number): string {
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}
