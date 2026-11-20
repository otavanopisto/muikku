/**
 * Response from TempFileUploadServlet.
 */
export interface TempFileUploadResponse {
  fileId: string;
  fileContentType?: string;
}

/**
 * POST a blob to /tempFileUploadServlet (same as V3 file/audio fields).
 * @param blob - File or recorded blob
 * @param fileName - Optional filename for content-type sniffing on the server
 * @param onProgress - 0–1 upload ratio
 */
export function uploadTempFile(
  blob: Blob,
  fileName?: string,
  onProgress?: (ratio: number) => void
): Promise<TempFileUploadResponse> {
  const file =
    blob instanceof File
      ? blob
      : new File([blob], fileName ?? "recording", {
          type: blob.type || "audio/webm",
        });

  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/tempFileUploadServlet");
    xhr.responseType = "json";

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress?.(event.loaded / event.total);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 413) {
        reject(new Error("too-large"));
        return;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`upload-failed:${xhr.status}`));
        return;
      }
      const body = xhr.response as TempFileUploadResponse | null;
      if (!body?.fileId) {
        reject(new Error("invalid-response"));
        return;
      }
      resolve(body);
    });

    xhr.addEventListener("error", () => reject(new Error("network")));
    xhr.send(formData);
  });
}
