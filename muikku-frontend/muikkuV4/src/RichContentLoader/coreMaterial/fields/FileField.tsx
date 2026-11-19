import { useState } from "react";
import { uploadTempFile } from "~/src/utils/uploadTempFile";
import {
  FileUploader,
  type UploadedFileItem,
} from "~/src/components/FileUploader";
import type { FieldComponentProps, FileFieldContent } from "../types";
import { useFieldSyncHandle } from "../hooks/useFieldSyncHandle";
import { Synchronizer } from "./Synchronizer";
import {
  parseFileFieldValue,
  serializeFileFieldValue,
} from "../utils/fileField";

/**
 * FileFieldProps
 */
interface FileFieldProps extends FieldComponentProps<FileFieldContent> {}

/**
 * Download URL for a persisted workspace file answer.
 * @param file - File with server fileId
 */
function workspaceFileUrl(file: UploadedFileItem): string | undefined {
  return file.fileId ? `/rest/workspace/fileanswer/${file.fileId}` : undefined;
}

/**
 * Zip of all saved files in this answer (V3 allfileanswers).
 * @param files - Saved files with fileId
 */
function workspaceDownloadAllUrl(
  files: UploadedFileItem[]
): string | undefined {
  const first = files.find((file) => file.fileId);
  if (!first?.fileId) {
    return undefined;
  }
  return `/rest/workspace/allfileanswers/${first.fileId}?archiveName=${encodeURIComponent("tiedostot.zip")}`;
}

/**
 * Shared student file field (materials + evaluation readOnly).
 * @param props - Live field props
 */
export function FileField(props: FileFieldProps) {
  const { content, readOnly, initialValue, invisible, onChange } = props;
  const handle = useFieldSyncHandle();
  const [files, setFiles] = useState<UploadedFileItem[]>(() =>
    parseFileFieldValue(initialValue)
  );

  if (!content) {
    return null;
  }

  /**
   * Keep UI files; persist JSON only when nothing is uploading.
   * @param next - Latest file list
   */
  function handleFilesChange(next: UploadedFileItem[]) {
    if (!content) {
      return;
    }
    setFiles(next);
    onChange?.(handle, content.name, serializeFileFieldValue(next));
  }

  if (invisible) {
    return <div className="filefield-wrapper" aria-hidden />;
  }

  return (
    <div>
      <FileUploader
        values={files}
        readOnly={readOnly}
        getFileUrl={workspaceFileUrl}
        getDownloadAllUrl={workspaceDownloadAllUrl}
        onChange={handleFilesChange}
        upload={
          readOnly
            ? undefined
            : async (file, onProgress) => {
                const result = await uploadTempFile(
                  file,
                  file.name,
                  onProgress
                );
                return {
                  fileId: result.fileId,
                  name: file.name,
                  contentType:
                    result.fileContentType ??
                    file.type ??
                    "application/octet-stream",
                };
              }
        }
      />
      <Synchronizer
        modified={handle.state.modified}
        synced={handle.state.synced}
        syncError={handle.state.syncError}
      />
    </div>
  );
}
