import { SetRecordings } from "../../../../@types/recorder";

export function deleteAudio(recordId: string, setRecordings: SetRecordings) {
  setRecordings((prevState) =>
    prevState.filter((record) => record.id !== recordId)
  );
}
