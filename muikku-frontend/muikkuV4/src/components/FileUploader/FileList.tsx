import { Button, Group, Modal, Progress, Text } from "@mantine/core";
import { IconDownload, IconFile, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import type { FileUploaderLabels, UploadedFileItem } from "./types";
import classes from "./FileUploader.module.css";

/**
 * FileListProps
 */
export interface FileListProps {
  files: UploadedFileItem[];
  labels?: Partial<FileUploaderLabels>;
  getUploadingText?: (file: UploadedFileItem) => string;
  getFileUrl?: (file: UploadedFileItem) => string | undefined;
  onDelete?: (index: number) => void;
}

/**
 * File list. Pass onDelete only when removal is allowed.
 */
export function FileList(props: FileListProps) {
  const { files, labels, getUploadingText, getFileUrl, onDelete } = props;
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  if (files.length === 0) {
    return labels?.empty ? (
      <Text className={classes.empty}>{labels.empty}</Text>
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
                    ? labels?.tooLarge
                    : labels?.uploadFailed}
                </Text>
                {onDelete ? (
                  <Button
                    size="compact-xs"
                    color="red"
                    variant="subtle"
                    onClick={() => setPendingDelete(index)}
                  >
                    {labels?.remove}
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
                  {getUploadingText
                    ? getUploadingText(file)
                    : `${Math.round((file.progress ?? 0) * 100)} %`}
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
                  {labels?.download}
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
                  {labels?.remove}
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
      <Modal
        opened={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title={labels?.deleteTitle}
      >
        <Text size="sm" mb="md">
          {labels?.deleteConfirm}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setPendingDelete(null)}>
            {labels?.cancel}
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
            {labels?.remove}
          </Button>
        </Group>
      </Modal>
    </>
  );
}
