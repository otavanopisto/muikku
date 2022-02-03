import { SetRecorder } from "~/@types/recorder";

/**
 * startRecording
 * @param setRecorderState setRecorderState
 */
export async function startRecording(setRecorderState: SetRecorder) {
  try {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    setRecorderState((prevState) => {
      return {
        ...prevState,
        initRecording: true,
        mediaStream: stream,
      };
    });
  } catch (err) {}
}

/**
 * saveRecording
 * @param recorder recorder
 */
export function saveRecording(recorder: MediaRecorder) {
  if (recorder.state !== "inactive") {
    recorder.stop();
  }
}
