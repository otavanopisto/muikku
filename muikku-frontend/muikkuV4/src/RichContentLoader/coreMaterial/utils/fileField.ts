import type { UploadedFileItem } from "~/src/components/FileUploader";

/**
 * Persisted file-field JSON item (backend File POJO).
 */
export interface FileFieldJson {
  fileId: string;
  name: string;
  contentType: string;
}

/**
 * Parse saved field JSON into uploader items.
 * @param raw - initialValue from composite reply
 */
export function parseFileFieldValue(
  raw: string | undefined
): UploadedFileItem[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as FileFieldJson[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item) => item && typeof item.fileId === "string")
      .map((item) => ({
        fileId: item.fileId,
        name: item.name,
        contentType: item.contentType || "application/octet-stream",
      }));
  } catch {
    return [];
  }
}

/**
 * JSON for websocket save. Uploading / failed items are omitted.
 * @param files - Current UI files
 */
export function serializeFileFieldValue(files: UploadedFileItem[]): string {
  const ready: FileFieldJson[] = files
    .filter((file) => !file.failed && !file.uploading && file.fileId)
    .map((file) => ({
      fileId: file.fileId!,
      name: file.name,
      contentType: file.contentType,
    }));
  return JSON.stringify(ready);
}
