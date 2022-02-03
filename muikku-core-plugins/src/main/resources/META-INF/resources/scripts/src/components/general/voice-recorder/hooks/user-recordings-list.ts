import { useState, useEffect } from "react";
import { deleteAudio } from "../handlers/recordings-list";
import { RecordValue } from "../../../../@types/recorder";

/**
 * useRecordingsList
 * @param records
 * @returns
 */
export default function useRecordingsList(records: RecordValue[] | null) {
  const [recordings, setRecordings] = useState<RecordValue[]>([]);

  useEffect(() => {
    const isUploading = JSON.stringify(records) !== JSON.stringify(recordings);

    if (records.length !== recordings.length || isUploading) {
      setRecordings([...records]);
    }
  }, [records]);

  return {
    recordings,

    // eslint-disable-next-line
    deleteAudio: (audioKey: string) => deleteAudio(audioKey, setRecordings),
  };
}
