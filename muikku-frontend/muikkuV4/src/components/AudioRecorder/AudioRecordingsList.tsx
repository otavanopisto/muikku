import { Button, Group, Modal, Progress, Text } from "@mantine/core";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import type { AudioClip } from "./types";
import classes from "./AudioRecorder.module.css";

/**
 * RecordingsListProps
 */
export interface AudioRecordingsListProps {
  records: AudioClip[];
  getPlaybackUrl?: (clip: AudioClip) => string | undefined;
  onDelete?: (index: number) => void;
  emptyLabel?: string;
}

/**
 * Playable clip list. Pass onDelete only when removal is allowed.
 */
export function AudioRecordingsList(props: AudioRecordingsListProps) {
  const {
    records,
    getPlaybackUrl,
    onDelete,
    emptyLabel = "Ei tallenteita",
  } = props;
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  if (records.length === 0) {
    return emptyLabel ? (
      <Text className={classes.empty}>{emptyLabel}</Text>
    ) : null;
  }

  return (
    <>
      <div className={classes.list}>
        {records.map((clip, index) => {
          const src = clip.url ?? getPlaybackUrl?.(clip);
          const key = clip.id ?? clip.clientId ?? String(index);

          if (clip.failed) {
            return (
              <div className={classes.clip} key={key}>
                <Text c="red" size="sm">
                  Äänen tallennus epäonnistui.
                </Text>
                {onDelete ? (
                  <Button
                    size="compact-xs"
                    color="red"
                    variant="subtle"
                    onClick={() => setPendingDelete(index)}
                  >
                    Poista
                  </Button>
                ) : null}
              </div>
            );
          }

          if (clip.uploading) {
            return (
              <div className={classes.clip} key={key}>
                <Progress
                  animated
                  className={classes.progress}
                  value={(clip.progress ?? 0) * 100}
                  transitionDuration={200}
                />
                <Text size="sm">
                  Lähetetään {Math.round((clip.progress ?? 0) * 100)} %
                </Text>
              </div>
            );
          }

          return (
            <div className={classes.clip} key={key}>
              {src ? (
                <audio
                  className={classes.player}
                  controls
                  src={src}
                  preload="metadata"
                />
              ) : null}
              {src ? (
                <Button
                  component="a"
                  href={src}
                  download={clip.name}
                  size="compact-xs"
                  variant="subtle"
                  leftSection={<IconDownload size={14} />}
                >
                  Lataa
                </Button>
              ) : null}
              {onDelete ? (
                <Button
                  size="compact-xs"
                  color="red"
                  variant="subtle"
                  leftSection={<IconTrash size={14} />}
                  onClick={() => setPendingDelete(index)}
                >
                  Poista
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
      <Modal
        opened={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Poista äänite?"
      >
        <Text size="sm" mb="md">
          Äänitettä ei voi palauttaa.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setPendingDelete(null)}>
            Peruuta
          </Button>
          <Button
            color="red"
            onClick={() => {
              if (pendingDelete !== null) {
                onDelete?.(pendingDelete);
              }
              setPendingDelete(null);
            }}
          >
            Poista
          </Button>
        </Group>
      </Modal>
    </>
  );
}
