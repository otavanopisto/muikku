import { useState, useEffect } from "react";
import { deleteAudio } from "../handlers/recordings-list";
import { RecordValue } from "../../../../@types/recorder";

/**
 * useRecordingsList
 * @param records records
 * @returns recordings list and deleteAudio "aka" list item method
 */
export default function useRecordingsList(records: RecordValue[] | null) {
  const [recordings, setRecordings] = useState<RecordValue[]>([]);

  useEffect(() => {
    if (!records) return;

    const update = JSON.stringify(records) !== JSON.stringify(recordings);

    if (!update) return;

    setRecordings(records);
  }, [records]);

  return {
    recordings,

    /* // eslint-disable-next-line
    deleteAudio: (audioKey: string) => deleteAudio(audioKey, setRecordings), */
  };
}
