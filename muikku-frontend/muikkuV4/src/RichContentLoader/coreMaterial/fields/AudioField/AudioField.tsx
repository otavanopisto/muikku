import { useState } from "react";
import {
  AudioRecorder,
  uploadTempFile,
  type AudioClip,
} from "~/src/components/AudioRecorder";
import type { AudioFieldContent, FieldComponentProps } from "../../types";
import { useFieldSyncHandle } from "../../hooks/useFieldSyncHandle";
import { Synchronizer } from "../Synchronizer";
import {
  parseAudioFieldValue,
  serializeAudioFieldValue,
} from "../../utils/audioField";

/**
 * AudioFieldProps
 */
interface AudioFieldProps extends FieldComponentProps<AudioFieldContent> {}

/**
 * Playback URL for a persisted workspace audio clip.
 * @param clip - Clip with server id
 */
function workspaceAudioUrl(clip: AudioClip): string | undefined {
  if (clip.url?.startsWith("blob:")) {
    return clip.url;
  }
  return clip.id ? `/rest/workspace/audioanswer/${clip.id}` : clip.url;
}

/**
 * Shared student audio field (materials + evaluation readOnly).
 * @param props - Live field props
 */
export function AudioField(props: AudioFieldProps) {
  const { content, readOnly, initialValue, invisible, onChange } = props;
  const handle = useFieldSyncHandle();
  const [clips, setClips] = useState<AudioClip[]>(() =>
    parseAudioFieldValue(initialValue, workspaceAudioUrl)
  );

  if (!content) {
    return null;
  }

  /**
   * Keep UI clips; persist JSON only when nothing is uploading.
   * @param next - Latest clip list
   */
  function handleClipsChange(next: AudioClip[]) {
    if (!content) {
      return;
    }
    setClips(next);
    const json = serializeAudioFieldValue(next);
    if (json === null) {
      return;
    }
    onChange?.(handle, content.name, json);
  }

  if (invisible) {
    return <div className="audiofield-wrapper" aria-hidden />;
  }

  return (
    <div>
      <AudioRecorder
        values={clips}
        readOnly={readOnly}
        getPlaybackUrl={workspaceAudioUrl}
        onChange={handleClipsChange}
        upload={
          readOnly
            ? undefined
            : async (blob, meta, onProgress) => {
                const result = await uploadTempFile(
                  blob,
                  meta.name,
                  onProgress
                );
                return {
                  id: result.fileId,
                  name: meta.name ?? result.fileId,
                  contentType:
                    result.fileContentType ?? blob.type ?? "audio/webm",
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
