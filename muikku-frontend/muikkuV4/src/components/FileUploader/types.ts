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
 * FileUploaderProps
 */
export interface FileUploaderProps {
  values: UploadedFileItem[];
  readOnly?: boolean;
  accept?: string[] | DropzoneProps["accept"];
  maxBytes?: number;
  onChange: (files: UploadedFileItem[]) => void;
  upload?: (
    file: File,
    onProgress?: (ratio: number) => void
  ) => Promise<FileUploadResult>;
  getFileUrl?: (file: UploadedFileItem) => string | undefined;
  getDownloadAllUrl?: (files: UploadedFileItem[]) => string | undefined;
}
