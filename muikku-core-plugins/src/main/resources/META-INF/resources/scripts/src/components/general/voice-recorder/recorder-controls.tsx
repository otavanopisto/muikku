import * as React from "react";
import { RecorderControlsProps } from "../../../@types/recorder";
import Link from "~/components/general/link";

export default function RecorderControls({
  recorderState,
  handlers,
}: RecorderControlsProps) {
  const { initRecording } = recorderState;
  const { startRecording, saveRecording } = handlers;

  return (
    <div className="voice__recorder-controls__container">
      {!initRecording ? (
        <Link
          className="voice__recorder-audiofield-start-record-button icon-record"
          onClick={startRecording}
        >
          <span className="voice__recorder-audiofield-start-record-label">
            Aloita nauhoitus
          </span>
        </Link>
      ) : (
        <Link
          className="voice__recorder-audiofield-stop-record-button icon-stop"
          onClick={saveRecording}
        >
          <span className="voice__recorder-audiofield-stop-record-label">
            Lopeta nauhoitus
          </span>
        </Link>
      )}
      {!initRecording ? (
        <span className="voice__recorder-audiofield-description voice__recorder-audiofield-description--start-recording">
          Aloita äänitys klikkaamalla painiketta
        </span>
      ) : (
        <span className="voice__recorder-audiofield-description voice__recorder-audiofield-description--stop-recording">
          Lopeta äänitys klikkaamalla painiketta
        </span>
      )}
    </div>
  );
}
