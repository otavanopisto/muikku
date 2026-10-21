import { Button, Group, Modal, Progress, Text } from "@mantine/core";
import { IconDownload, IconFile, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import type { UploadedFileItem } from "./types";
import classes from "./FileUploader.module.css";

/**
 * FileListProps
 */
export interface FileListProps {
  files: UploadedFileItem[];
  getFileUrl?: (file: UploadedFileItem) => string | undefined;
  onDelete?: (index: number) => void;
  emptyLabel?: string;
}

/**
 * File list. Pass onDelete only when removal is allowed.
 */
export function FileList(props: FileListProps) {
  const { files, getFileUrl, onDelete, emptyLabel } = props;
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  if (files.length === 0) {
    return emptyLabel ? (
      <Text className={classes.empty}>{emptyLabel}</Text>
    ) : null;
  }

  return (
    <>
      <div className={classes.list}>
        {files.map((file, index) => {
          const key = file.fileId ?? file.clientId ?? String(index);
          const href = file.fileId ? getFileUrl?.(file) : undefined;

          if (file.failed) {
            return (
              <div className={classes.row} key={key}>
                <Text className={classes.name} size="sm">
                  {file.name}
                </Text>
                <Text c="red" size="sm">
                  {file.failReason === "too-large"
                    ? "Tiedoston koko on liian suuri. Suurin sallittu tiedostokoko on 10 Mt."
                    : "Tiedoston lähetys epäonnistui."}
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

          if (file.uploading) {
            return (
              <div className={classes.row} key={key}>
                <Text className={classes.name} size="sm">
                  {file.name}
                </Text>
                <Progress
                  animated
                  className={classes.progress}
                  value={(file.progress ?? 0) * 100}
                  transitionDuration={200}
                />
                <Text size="sm">
                  Ladataan palvelimelle {Math.round((file.progress ?? 0) * 100)}{" "}
                  %
                </Text>
              </div>
            );
          }

          return (
            <div className={classes.row} key={key}>
              <IconFile size={16} />
              <Text className={classes.name} size="sm">
                {file.name}
              </Text>
              {href ? (
                <Button
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.name}
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
        title="Tiedoston poisto"
      >
        <Text size="sm" mb="md">
          Oletko varma, että haluat poistaa tehtävään liitetyn tiedoston?
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
