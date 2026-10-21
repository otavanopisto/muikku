import type { DropzoneProps } from "@mantine/dropzone";

/**
 * One file in the uploader UI (local or saved).
 */
export interface UploadedFileItem {
  clientId?: string;
  fileId?: string;
  name: string;
  contentType: string;
  uploading?: boolean;
  progress?: number;
  failed?: boolean;
  failReason?: "too-large" | "upload";
}

/**
 * Result of a successful upload.
 */
export interface FileUploadResult {
  fileId: string;
  name: string;
  contentType: string;
}

/**
 * Labels for the FileUploader.
 */
export interface FileUploaderLabels {
  dropzoneTitle: string;
  dropzoneHint: string;
  empty: string;
  download: string;
  downloadAll: string;
  remove: string;
  cancel: string;
  deleteTitle: string;
  deleteConfirm: string;
  tooLarge: string;
  uploadFailed: string;
}

/**
 * FileUploaderProps
 */
export interface FileUploaderProps {
  values: UploadedFileItem[];
  readOnly?: boolean;
  accept?: string[] | DropzoneProps["accept"];
  maxBytes?: number;
  labels?: Partial<FileUploaderLabels>;
  onChange: (files: UploadedFileItem[]) => void;
  upload?: (
    file: File,
    onProgress?: (ratio: number) => void
  ) => Promise<FileUploadResult>;
  getFileUrl?: (file: UploadedFileItem) => string | undefined;
  getDownloadAllUrl?: (files: UploadedFileItem[]) => string | undefined;
  getUploadingText?: (file: UploadedFileItem) => string;
}
