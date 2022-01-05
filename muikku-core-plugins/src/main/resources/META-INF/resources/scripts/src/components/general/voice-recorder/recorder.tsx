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
import { i18nType } from "../../../reducers/base/i18n";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import "~/sass/elements/voice-recorder.scss";
import { AudioAssessment } from "../../../@types/evaluation";
import useRecordingsList from "./hooks/user-recordings-list";
const ProgressBarLine = require("react-progress-bar.js").Line;

/**
 * RecorderProps
 */
interface RecorderProps {
  i18n: i18nType;
  status: StatusType;
  onChange?: (audioAssessments: AudioAssessment[]) => void;
  values?: AudioAssessment[];
}

/**
 * Recorder
 * @param props
 * @returns JSX.Element
 */
function Recorder(props: RecorderProps) {
  const { recorderState, ...handlers }: UseRecorder = useRecorder({
    status: props.status,
    values: props.values,
  });

  const { recordings, deleteAudio } = useRecordingsList(recorderState.values);

  /**
   * Mutatable object to be changed on initial render
   * it helps checks if initial render has happened or not
   */
  const firstUpdate = React.useRef(true);

  React.useEffect(() => {
    /**
     * Check if intial render has happened, if not then changed mutatable object
     */
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    /**
     * After initial render and if onChange method has been passed, and values have changed
     */
    if (
      props.onChange &&
      JSON.stringify(props.values) !== JSON.stringify(recordings) &&
      !firstUpdate.current
    ) {
      const audioAssessments = recordings.map((record) => {
        const object: AudioAssessment = {
          name: record.name,
          id: record.id,
          contentType: record.contentType,
        };

        return object;
      });

      props.onChange(audioAssessments);
    }
  }, [recordings]);

  const { seconds, initRecording } = recorderState;

  return (
    <div className="voice-recorder">
      <RecorderControls recorderState={recorderState} handlers={handlers} />

      <AnimateHeight duration={300} height={initRecording ? "auto" : 0}>
        <span className="voice-recorder__file-container voice-recorder__file-container--recording">
          <ProgressBarLine
            containerClassName="voice-recorder__file-record-progressbar"
            options={{
              strokeWidth: 1,
              duration: 1000,
              color: "#de3211",
              trailColor: "#f5f5f5",
              trailWidth: 1,
              svgStyle: { width: "100%", height: "4px" },
              text: {
                className: "voice-recorder__file-record-percentage",
                style: {
                  right: "100%",
                },
              },
            }}
            strokeWidth={1}
            easing="easeInOut"
            duration={1000}
            color="#de3211"
            trailColor="#f5f5f5"
            trailWidth={1}
            svgStyle={{ width: "100%", height: "4px" }}
            text={props.i18n.text.get(
              "plugin.evaluation.evaluationModal.recordingAssessment.statusRecording",
              moment("2015-01-01")
                .startOf("day")
                .seconds(seconds)
                .format("mm:ss"),
              moment("2015-01-01").startOf("day").seconds(300).format("mm:ss")
            )}
            progress={seconds / 300}
          />
        </span>
      </AnimateHeight>
      <RecordingsList records={recordings} deleteAudio={deleteAudio} />
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);
