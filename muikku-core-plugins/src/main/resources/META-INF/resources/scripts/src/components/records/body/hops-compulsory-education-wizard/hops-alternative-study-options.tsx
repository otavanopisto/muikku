import * as React from "react";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { WebsocketStateType } from "~/reducers/util/websocket";
import { useStudentAlternativeOptions } from "./hooks/useStudentAlternativeOptions";
import { AnyActionType } from "~/actions";

/**
 * AlternativeStudyOptionsProps
 */
interface HopsAlternativeStudyOptionsProps {
  studentId: string;
  disabled: boolean;
  displayNotification: DisplayNotificationTriggerType;
  websocketState: WebsocketStateType;
}

/**
 * AlternativeStudyOptions
 * @param root0 root0
 * @param root0.studentId studentId
 * @param root0.displayNotification displayNotification
 * @param root0.websocketState websocketState
 * @param root0.disabled disabled
 */
const HopsAlternativeStudyOptions: React.FC<
  HopsAlternativeStudyOptionsProps
> = ({ studentId, displayNotification, websocketState, disabled }) => {
  const { studyOptions, ...studyOptionHandlers } = useStudentAlternativeOptions(
    studentId,
    websocketState,
    displayNotification
  );

  /**
   * handleFinlandAsSecondLanguage
   * @param e e
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
   * @param e e
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
          <input
            type="checkbox"
            className="hops__input"
            checked={studyOptions.options.finnishAsLanguage}
            onChange={handleFinnishAsSecondLanguage}
            disabled={disabled}
          ></input>
          <label className="hops__label">
            Suoritan äidinkielen sijaan Suomen toisena kielenä?
          </label>
        </div>
      </div>
      <div className="hops-container__row">
        <div className="hops__form-element-container hops__form-element-container--single-row">
          <input
            type="checkbox"
            className="hops__input"
            checked={studyOptions.options.religionAsEthics}
            onChange={handleEthicsChange}
            disabled={disabled}
          ></input>
          <label className="hops__label">
            Suoritan uskonnon elämänkatsomustietona?
          </label>
        </div>
      </div>
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    websocketState: state.websocket,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return { displayNotification };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HopsAlternativeStudyOptions);
