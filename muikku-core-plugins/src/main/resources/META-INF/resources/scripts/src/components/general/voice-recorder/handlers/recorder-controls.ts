/**
 * Try catching seems to be still in proggress state.
 * It should have better error handling without consoles
 *
 * Needs fixing at some point
 */

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

    setRecorderState((prevState) => ({
      ...prevState,
      initRecording: true,
      mediaStream: stream,
    }));
    // eslint-disable-next-line no-empty
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
