import * as React from "react";
import { useStudentAlternativeOptions } from "../study-tool/hooks/use-student-alternative-options";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { WebsocketStateType } from "~/reducers/util/websocket";

/**
 * AlternativeStudyOptionsProps
 */
interface AlternativeStudyOptionsProps {
  studentId: string;
  disabled: boolean;
  displayNotification: DisplayNotificationTriggerType;
  websocketState: WebsocketStateType;
}

/**
 * AlternativeStudyOptions
 * @param param0
 * @returns JSX.Element
 */
const AlternativeStudyOptions: React.FC<AlternativeStudyOptionsProps> = ({
  studentId,
  displayNotification,
  websocketState,
  disabled,
}) => {
  const { studyOptions, ...studyOptionHandlers } = useStudentAlternativeOptions(
    studentId,
    websocketState,
    displayNotification
  );

  /**
   * handleFinlandAsSecondLanguage
   * @param e
   */
  const handleFinnishAsSecondLanguage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    studyOptionHandlers.updateStudyOptions(studentId, {
      ...studyOptions.options,
      finnishAsLanguage: e.target.checked,
    });
  };

  /**
   * handleEthicsChange
   */
  const handleEthicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    studyOptionHandlers.updateStudyOptions(studentId, {
      ...studyOptions.options,
      religionAsEthics: e.target.checked,
    });
  };

  return (
    <>
      <div className="hops-container__row">
        <div className="hops__form-element-container hops__form-element-container--single-row">
          <label className="hops-label">
            Suoritan äidinkielen sijaan Suomen toisena kielenä?
          </label>
          <input
            type="checkbox"
            className="hops-input"
            checked={studyOptions.options.finnishAsLanguage}
            onChange={handleFinnishAsSecondLanguage}
            disabled={disabled}
          ></input>
        </div>
      </div>
      <div className="hops-container__row">
        <div className="hops__form-element-container hops__form-element-container--single-row">
          <label className="hops-label">
            Suoritan uskonnon elämänkatsomustietona?
          </label>
          <input
            type="checkbox"
            className="hops-input"
            checked={studyOptions.options.religionAsEthics}
            onChange={handleEthicsChange}
            disabled={disabled}
          ></input>
        </div>
      </div>
    </>
  );
};

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    websocketState: state.websocket,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return { displayNotification };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlternativeStudyOptions);
