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
 * @returns React.JSX.Element
 */
function RecorderControls(props: RecorderControlsProps) {
  const { t } = useTranslation("materials");
  const { recorderState, handlers } = props;
  const { initRecording } = recorderState;
  const { startRecording, saveRecording } = handlers;
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
            {t("actions.start")}
          </span>
        </Link>
      ) : (
        <Link
          className="voice-recorder__stop-record-button icon-stop"
          onClick={saveRecording}
          disabled={disabled}
        >
          <span className="voice-recorder__stop-record-label">
            {t("actions.stop")}
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
