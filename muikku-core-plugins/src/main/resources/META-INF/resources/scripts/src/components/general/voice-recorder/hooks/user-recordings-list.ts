import { useState, useEffect } from "react";
import { deleteAudio } from "../handlers/recordings-list";
import { RecordValue } from "../../../../@types/recorder";

export default function useRecordingsList(records: RecordValue[] | null) {
  const [recordings, setRecordings] = useState<RecordValue[]>([]);

  useEffect(() => {
    if (records)
      setRecordings((prevState: RecordValue[]) => {
        return [...records];
      });
  }, [records]);

  return {
    recordings,
    deleteAudio: (audioKey: string) => deleteAudio(audioKey, setRecordings),
  };
}
