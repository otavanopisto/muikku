import { SetRecorder } from "~/@types/recorder";

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
  } catch (err) {

  }
}

export function saveRecording(recorder: MediaRecorder) {
  if (recorder.state !== "inactive") {
    recorder.stop();
  }
}
