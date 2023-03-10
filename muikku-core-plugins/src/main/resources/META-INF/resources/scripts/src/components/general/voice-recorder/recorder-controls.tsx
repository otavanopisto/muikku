import * as React from "react";
import { Recorder } from "~/@types/recorder";
import Link from "~/components/general/link";
import { useTranslation } from "react-i18next";

/**
 * RecorderControlsProps
 */
export interface RecorderControlsProps {
  recorderState: Recorder;
  handlers: {
    startRecording: () => void;
    cancelRecording: () => void;
    saveRecording: () => void;
  };
}

/**
 * RecorderControls
 * Component that renders recording controls, start/save buttons etc
 * @param props component properties
 * @returns JSX.Element
 */
function RecorderControls(props: RecorderControlsProps) {
  const { initRecording } = props.recorderState;
  const { startRecording, saveRecording } = props.handlers;
  const { t } = useTranslation("materials");

  const disabled = props.recorderState.values.some((rItem) => rItem.uploading);

  return (
    <div className="voice-recorder__controls">
      {!initRecording ? (
        <Link
          className="voice-recorder__start-record-button icon-record"
          onClick={startRecording}
          disabled={disabled}
        >
          <span className="voice-recorder__start-record-label">
            {t("actions.record")}
          </span>
        </Link>
      ) : (
        <Link
          className="voice-recorder__stop-record-button icon-stop"
          onClick={saveRecording}
          disabled={disabled}
        >
          <span className="voice-recorder__stop-record-label">
            {t("actions.record", { context: "stop" })}
          </span>
        </Link>
      )}
      {!initRecording ? (
        <span className="voice-recorder__description voice-recorder__description--start-recording">
          {t("content.startRecording")}
        </span>
      ) : (
        <span className="voice-recorder__description voice-recorder__description--stop-recording">
          {t("content.stopRecording")}
        </span>
      )}
    </div>
  );
}

export default RecorderControls;
