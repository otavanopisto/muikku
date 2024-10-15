import * as React from "react";
import { bindActionCreators } from "redux";
import { UseRecorder } from "../../../@types/recorder";
import useRecorder from "./hooks/use-recorder";
import RecorderControls from "./recorder-controls";
import RecordingsList from "./recordings-list";
import { AnyActionType } from "../../../actions/index";
import { StateType } from "../../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { StatusType } from "../../../reducers/base/status";
import moment from "moment";
import AnimateHeight from "react-animate-height";
import "~/sass/elements/voice-recorder.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { RecordValue } from "~/@types/recorder";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { Line } from "rc-progress";

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

/**
 * Recorder
 * @param props props
 * @returns JSX.Element
 */
function Recorder(props: RecorderProps) {
  const { onIsRecordingChange, onChange, values } = props;

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
        <span className="voice-recorder__file-container voice-recorder__file-container--recording">
          <Line
            className="voice-recorder__file-record-progressbar"
            percent={(seconds / 300) * 100}
          />
        </span>
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Recorder)
);
