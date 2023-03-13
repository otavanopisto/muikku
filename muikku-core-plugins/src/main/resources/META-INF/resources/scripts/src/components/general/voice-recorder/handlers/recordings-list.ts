import { SetRecorder } from "~/@types/recorder";

/**
 * deleteAudio
 * @param recordId recordId
 * @param setRecordings setRecordings
 */
export function deleteAudio(recordId: string, setRecordings: SetRecorder) {
  setRecordings((prevState) => ({
    ...prevState,
    values: prevState.values.filter((record) => record.id !== recordId),
  }));
}
