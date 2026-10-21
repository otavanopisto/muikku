import { Button, Group, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconDownload, IconFile, IconUpload, IconX } from "@tabler/icons-react";
import { useRef } from "react";
import type { FileUploaderProps, UploadedFileItem } from "./types";
import { FileList } from "./FileList";
import classes from "./FileUploader.module.css";

const DEFAULT_MAX_BYTES = 10_000_000;

/**
 * Local key before a server fileId exists.
 */
function createClientId(): string {
  return crypto.randomUUID();
}

/**
 * Generic file pick / list / delete UI. Upload and download URLs are injected.
 */
export function FileUploader(props: FileUploaderProps) {
  const {
    values,
    readOnly,
    accept,
    maxBytes = DEFAULT_MAX_BYTES,
    onChange,
    upload,
    getFileUrl,
    getDownloadAllUrl,
  } = props;

  const valuesRef = useRef(values);
  valuesRef.current = values;

  /**
   * Apply an update against the latest file list.
   * @param updater - List transform
   */
  function updateFiles(
    updater: (prev: UploadedFileItem[]) => UploadedFileItem[]
  ) {
    const next = updater(valuesRef.current);
    valuesRef.current = next;
    onChange(next);
  }

  /**
   * Append a file and optionally upload it.
   * @param file - Browser File
   */
  async function addFile(file: File) {
    const clientId = createClientId();

    if (file.size >= maxBytes) {
      updateFiles((prev) => [
        ...prev,
        {
          clientId,
          name: file.name,
          contentType: file.type || "application/octet-stream",
          failed: true,
          failReason: "too-large",
        },
      ]);
      return;
    }

    const pending: UploadedFileItem = {
      clientId,
      name: file.name,
      contentType: file.type || "application/octet-stream",
      uploading: Boolean(upload),
      progress: 0,
    };

    updateFiles((prev) => [...prev, pending]);

    if (!upload) {
      return;
    }

    try {
      const result = await upload(file, (ratio) => {
        updateFiles((prev) =>
          prev.map((item) =>
            item.clientId === clientId ? { ...item, progress: ratio } : item
          )
        );
      });
      updateFiles((prev) =>
        prev.map((item) =>
          item.clientId === clientId
            ? {
                ...item,
                fileId: result.fileId,
                name: result.name,
                contentType: result.contentType,
                uploading: false,
                progress: 1,
              }
            : item
        )
      );
    } catch {
      updateFiles((prev) =>
        prev.map((item) =>
          item.clientId === clientId
            ? { ...item, uploading: false, failed: true, failReason: "upload" }
            : item
        )
      );
    }
  }

  /**
   * Remove a file by index.
   * @param index - File index
   */
  function removeAt(index: number) {
    updateFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  const downloadAllUrl = getDownloadAllUrl?.(
    values.filter((item) => item.fileId && !item.failed && !item.uploading)
  );

  return (
    <div className={classes.root}>
      {!readOnly ? (
        <Dropzone
          className={classes.dropzone}
          multiple
          maxSize={maxBytes}
          accept={accept}
          onDrop={(files) => {
            files.forEach((file) => {
              void addFile(file);
            });
          }}
          onReject={(rejections) => {
            rejections.forEach((rejection) => {
              void addFile(rejection.file);
            });
          }}
        >
          <Group
            justify="center"
            gap="xl"
            mih={150}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload size={52} color="var(--mantine-color-blue-6)" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={52} color="var(--mantine-color-red-6)" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconFile size={52} color="var(--mantine-color-dimmed)" />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images/files here or click to select files
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      ) : null}

      <FileList
        files={values}
        getFileUrl={getFileUrl}
        onDelete={readOnly ? undefined : removeAt}
        emptyLabel={readOnly ? "Ei tiedostoja" : undefined}
      />

      {downloadAllUrl && values.some((item) => item.fileId) ? (
        <Button
          className={classes.downloadAll}
          component="a"
          href={downloadAllUrl}
          size="xs"
          variant="subtle"
          leftSection={<IconDownload size={14} />}
        >
          Lataa kaikki
        </Button>
      ) : null}
    </div>
  );
}
