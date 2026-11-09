import { Button, Progress, Text } from "@mantine/core";
import {
  IconPlayerRecord,
  IconPlayerStop,
  IconUpload,
} from "@tabler/icons-react";
import { useId, useRef } from "react";
import { formatRecorderTime } from "./useAudioRecorder";
import classes from "./AudioRecorder.module.css";

/**
 * RecorderControlsProps
 */
export interface RecorderControlsProps {
  recording: boolean;
  seconds: number;
  maxDurationSec: number;
  supported: boolean;
  error: string | null;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
  onFilesSelected?: (files: File[]) => void;
}

/**
 * Start / stop / file-fallback controls plus recording progress.
 */
export function RecorderControls(props: RecorderControlsProps) {
  const {
    recording,
    seconds,
    maxDurationSec,
    supported,
    error,
    disabled,
    onStart,
    onStop,
    onFilesSelected,
  } = props;
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={classes.controls}>
        {supported ? (
          recording ? (
            <Button
              color="red"
              leftSection={<IconPlayerStop size={16} />}
              disabled={disabled}
              onClick={onStop}
            >
              Lopeta
            </Button>
          ) : (
            <Button
              color="red"
              variant="light"
              leftSection={<IconPlayerRecord size={16} />}
              disabled={disabled}
              onClick={onStart}
            >
              Nauhoita
            </Button>
          )
        ) : (
          <>
            <input
              id={fileInputId}
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              hidden
              onChange={(event) => {
                const files = Array.from(event.currentTarget.files ?? []);
                onFilesSelected?.(files);
                event.currentTarget.value = "";
              }}
            />
            <Button
              variant="light"
              leftSection={<IconUpload size={16} />}
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
            >
              Lisää äänitiedosto
            </Button>
          </>
        )}
        <span className={classes.hint}>
          {recording
            ? `Nauhoitetaan ${formatRecorderTime(seconds)} / ${formatRecorderTime(maxDurationSec)}`
            : supported
              ? "Aloita nauhoitus"
              : null}
        </span>
        {error === "microphone" ? (
          <Text c="red" size="sm">
            Mikrofoniin ei saatu yhteyttä.
          </Text>
        ) : null}
      </div>
      {recording ? (
        <Progress
          className={classes.progress}
          value={(seconds / maxDurationSec) * 100}
          color="red"
          mb="sm"
        />
      ) : null}
    </>
  );
}
