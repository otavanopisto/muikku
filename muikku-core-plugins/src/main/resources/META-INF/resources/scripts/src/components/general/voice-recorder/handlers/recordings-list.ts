import { SetRecordings } from "~/@types/recorder";

/**
 * deleteAudio
 * @param recordId recordId
 * @param setRecordings setRecordings
 */
export function deleteAudio(recordId: string, setRecordings: SetRecordings) {
  setRecordings((prevState) =>
    prevState.filter((record) => record.id !== recordId)
  );
}
