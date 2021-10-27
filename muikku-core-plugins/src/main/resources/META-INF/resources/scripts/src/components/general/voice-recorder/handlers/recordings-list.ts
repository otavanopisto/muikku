import { SetRecordings } from "~/@types/recorder";

/**
 * deleteAudio
 * @param recordId
 * @param setRecordings
 */
export function deleteAudio(recordId: string, setRecordings: SetRecordings) {
  setRecordings((prevState) =>
    prevState.filter((record) => record.id !== recordId)
  );
}
