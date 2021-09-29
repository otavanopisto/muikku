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
let ProgressBarLine = require("react-progress-bar.js").Line;

interface RecorderProps {
  i18n: i18nType;
  status: StatusType;
  onChange?: (audioAssessments: AudioAssessment[]) => void;
}

function Recorder(props: RecorderProps) {
  const { recorderState, ...handlers }: UseRecorder = useRecorder({
    status: props.status,
  });

  React.useEffect(() => {
    if (props.onChange) {
      let audioAssessments = recorderState.values.map(
        (value) =>
          ({
            id: value.id,
            contentType: value.contentType,
            name: value.name,
          } as AudioAssessment)
      );

      props.onChange(audioAssessments);
    }
  }, [recorderState.values]);

  const { values, seconds, initRecording } = recorderState;

  return (
    <section className="voice__recorder-section">
      <RecorderControls recorderState={recorderState} handlers={handlers} />
      <RecordingsList records={values} />
      <AnimateHeight duration={300} height={initRecording ? "auto" : 0}>
        <span className="material-page__audiofield-file material-page__audiofield-file--recording">
          <ProgressBarLine
            containerClassName="material-page__audiofield-file-record-progressbar"
            options={{
              strokeWidth: 1,
              duration: 1000,
              color: "#de3211",
              trailColor: "#f5f5f5",
              trailWidth: 1,
              svgStyle: { width: "100%", height: "4px" },
              text: {
                className: "material-page__audiofield-file-record-percentage",
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
            text={`Tallentaa -
                ${moment("2015-01-01")
                  .startOf("day")
                  .seconds(seconds)
                  .format("mm:ss")}:
               ${moment("2015-01-01")
                 .startOf("day")
                 .seconds(300)
                 .format("mm:ss")}`}
            progress={seconds / 300}
          />
        </span>
      </AnimateHeight>
    </section>
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
