/**
 * PageLocation type
 */
export type PageLocation = "Home" | "Help" | "Materials";

/**
 *
 */
export interface UploadingValue {
  name: string;
  contentType: string;
  failed?: boolean;
  progress?: number;
  file?: File;
}
