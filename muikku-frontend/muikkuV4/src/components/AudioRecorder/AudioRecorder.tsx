import { Text } from "@mantine/core";
import { useEffect, useRef } from "react";
import type { AudioClip, AudioRecorderProps } from "./types";
import { useAudioRecorder } from "./useAudioRecorder";
import classes from "./AudioRecorder.module.css";
import { RecorderControls } from "./AudioRecorderControls";
import { AudioRecordingsList } from "./AudioRecordingsList";

const DEFAULT_MAX_SECONDS = 300;

/**
 * Local clip key before a server id exists.
 */
function createClientId(): string {
  return crypto.randomUUID();
}

/**
 * Generic record / list / delete UI. Upload and playback URLs are injected.
 */
export function AudioRecorder(props: AudioRecorderProps) {
  const {
    values,
    readOnly,
    maxDurationSec = DEFAULT_MAX_SECONDS,
    onChange,
    upload,
    getPlaybackUrl,
    onIsRecordingChange,
  } = props;

  const valuesRef = useRef(values);
  valuesRef.current = values;

  /**
   * Apply an update against the latest clip list.
   * @param updater - List transform
   */
  function updateClips(updater: (prev: AudioClip[]) => AudioClip[]) {
    const next = updater(valuesRef.current);
    valuesRef.current = next;
    onChange(next);
  }

  /**
   * Append a recording or file and optionally upload it.
   * @param blob - Audio data
   * @param name - Optional file name
   */
  async function addBlob(blob: Blob, name?: string) {
    const clientId = createClientId();
    const pending: AudioClip = {
      clientId,
      name,
      contentType: blob.type || "audio/webm",
      url: URL.createObjectURL(blob),
      uploading: Boolean(upload),
      progress: 0,
    };

    updateClips((prev) => [...prev, pending]);

    if (!upload) {
      return;
    }

    try {
      const result = await upload(blob, { name }, (ratio) => {
        updateClips((prev) =>
          prev.map((clip) =>
            clip.clientId === clientId ? { ...clip, progress: ratio } : clip
          )
        );
      });
      updateClips((prev) =>
        prev.map((clip) =>
          clip.clientId === clientId
            ? {
                ...clip,
                id: result.id,
                name: result.name,
                contentType: result.contentType,
                uploading: false,
                progress: 1,
              }
            : clip
        )
      );
    } catch {
      updateClips((prev) =>
        prev.map((clip) =>
          clip.clientId === clientId
            ? { ...clip, uploading: false, failed: true }
            : clip
        )
      );
    }
  }

  const { recording, seconds, error, supported, start, stop } =
    useAudioRecorder({
      maxDurationSec,
      onRecorded: (blob) => {
        void addBlob(blob);
      },
    });

  useEffect(() => {
    onIsRecordingChange?.(recording);
  }, [onIsRecordingChange, recording]);

  /**
   * Remove a clip and revoke a blob URL if needed.
   * @param index - Clip index
   */
  function removeAt(index: number) {
    updateClips((prev) => {
      const clip = prev[index];
      if (clip?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(clip.url);
      }
      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  if (readOnly && values.length === 0) {
    return (
      <div className={classes.root}>
        <Text className={classes.empty}>Ei tallenteita</Text>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {!readOnly ? (
        <RecorderControls
          recording={recording}
          seconds={seconds}
          maxDurationSec={maxDurationSec}
          supported={supported}
          error={error}
          onStart={() => void start()}
          onStop={stop}
          onFilesSelected={(files) => {
            files.forEach((file) => void addBlob(file, file.name));
          }}
        />
      ) : null}

      <AudioRecordingsList
        records={values}
        getPlaybackUrl={getPlaybackUrl}
        onDelete={readOnly ? undefined : removeAt}
      />
    </div>
  );
}
