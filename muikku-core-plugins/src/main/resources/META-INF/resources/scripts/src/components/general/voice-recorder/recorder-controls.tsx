import * as React from "react";
import { Recorder } from "~/@types/recorder";
import Link from "~/components/general/link";
import { StateType } from "~/reducers/index";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { i18nType } from "~/reducers/base/i18n";

export interface RecorderControlsProps {
  recorderState: Recorder;
  handlers: {
    startRecording: () => void;
    cancelRecording: () => void;
    saveRecording: () => void;
  };
  i18n: i18nType;
}

function RecorderControls({
  recorderState,
  handlers,
  i18n,
}: RecorderControlsProps) {
  const { initRecording } = recorderState;
  const { startRecording, saveRecording } = handlers;

  return (
    <div className="voice-recorder__controls">
      {!initRecording ? (
        <Link
          className="voice-recorder__start-record-button icon-record"
          onClick={startRecording}
        >
          <span className="voice-recorder__start-record-label">
            {i18n.text.get("plugin.workspace.audioField.startLink")}
          </span>
        </Link>
      ) : (
        <Link
          className="voice-recorder__stop-record-button icon-stop"
          onClick={saveRecording}
        >
          <span className="voice-recorder__stop-record-label">
            {i18n.text.get("plugin.workspace.audioField.stopLink")}
          </span>
        </Link>
      )}
      {!initRecording ? (
        <span className="voice-recorder__description voice-recorder__description--start-recording">
          {i18n.text.get("plugin.workspace.audioField.startRecordingHint")}
        </span>
      ) : (
        <span className="voice-recorder__description voice-recorder__description--stop-recording">
          {i18n.text.get("plugin.workspace.audioField.stopRecordingHint")}
        </span>
      )}
    </div>
  );
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RecorderControls);
