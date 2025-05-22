import * as React from "react";
import { bindActionCreators } from "redux";
import { UseRecorder } from "../../../@types/recorder";
import useRecorder from "./hooks/use-recorder";
import RecorderControls from "./recorder-controls";
import RecordingsList from "./recordings-list";
import { StateType } from "../../../reducers/index";
import { connect } from "react-redux";
import { StatusType } from "../../../reducers/base/status";
import AnimateHeight from "react-animate-height";
import "~/sass/elements/voice-recorder.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { RecordValue } from "~/@types/recorder";
import ProgressBar from "@ramonak/react-progress-bar";
import moment from "moment";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * RecorderProps
 */
interface RecorderProps extends WithTranslation {
  status: StatusType;
  /**
   * Handles changes is recording changes
   */
  onIsRecordingChange?: (isRecording: boolean) => void;
  onChange?: (audioAssessments: RecordValue[]) => void;
  values?: RecordValue[];
}

// this is the maximum recording time in seconds
const MAX_RECORDING_TIME_IN_SECONDS = 60 * 5;

/**
 * Recorder
 * @param props props
 * @returns React.JSX.Element
 */
function Recorder(props: RecorderProps) {
  const { onIsRecordingChange, onChange, values, t } = props;

  const { recorderState, ...handlers }: UseRecorder = useRecorder({
    status: props.status,
    values: props.values,
  });

  /* const { recordings, deleteAudio } = useRecordingsList(recorderState.values); */

  // Mutatable object to be changed on initial render
  // it helps checks if initial render has happened or not
  const firstUpdate = React.useRef(true);

  React.useEffect(() => {
    // If onIsRecordingChange props is present, tell parent component
    // whether recording is on or off
    if (onIsRecordingChange) {
      onIsRecordingChange(recorderState.initRecording);
    }
  }, [onIsRecordingChange, recorderState.initRecording]);

  React.useEffect(() => {
    // Check if intial render has happened, if not then changed mutatable object
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const uploading = recorderState.values.some(
      (recording) => recording.uploading
    );

    // After initial render and if onChange method has been passed, not uplaoding any values,
    // and recording values compared to previous values are not equal, then call onChange method
    if (
      onChange &&
      !uploading &&
      JSON.stringify(values) !== JSON.stringify(recorderState.values)
    ) {
      onChange(recorderState.values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, recorderState.values]);

  const { seconds, initRecording } = recorderState;

  return (
    <div className="voice-recorder">
      <RecorderControls recorderState={recorderState} handlers={handlers} />

      <AnimateHeight duration={300} height={initRecording ? "auto" : 0}>
        <div className="voice-recorder__file-container voice-recorder__file-container--recording">
          <div className="voice-recorder__file voice-recorder__file--recording">
            <ProgressBar
              className="voice-recorder__file-record-progressbar"
              completed={(seconds / 300) * 100}
              maxCompleted={100}
              customLabel={`${Math.round((seconds / 300) * 100)}%`}
              bgColor="#de3211"
              baseBgColor="#f5f5f5"
              height="5px"
            />
            <div className="voice-recorder__file-record-percentage voice-recorder__file-record-percentage--recording">
              {t("notifications.recording", {
                ns: "materials",
                currentLength: moment("2015-01-01")
                  .startOf("day")
                  .seconds(seconds)
                  .format("mm:ss"),
                maxLength: moment("2015-01-01")
                  .startOf("day")
                  .seconds(MAX_RECORDING_TIME_IN_SECONDS)
                  .format("mm:ss"),
              })}
            </div>
          </div>
        </div>
      </AnimateHeight>
      <RecordingsList
        records={recorderState.values}
        deleteAudio={handlers.deleteAudio}
      />
    </div>
  );
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Recorder)
);
