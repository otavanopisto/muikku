import * as React from "react";
import { StateType } from "reducers";
import { connect, Dispatch } from "react-redux";
import { WebsocketStateType } from "../../../../reducers/util/websocket";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { i18nType } from "~/reducers/base/i18n";
import { AnyActionType } from "~/actions";
import { useStudentActivity } from "~/components/records/body/hops-compulsory-education-wizard/hooks/useStudentActivity";
import { useStudentChoices } from "~/components/records/body/hops-compulsory-education-wizard/hooks/useStudentChoices";
import { useStudentAlternativeOptions } from "~/components/records/body/hops-compulsory-education-wizard/hooks/useStudentAlternativeOptions";
import HopsCourseTable from "~/components/records/body/hops-compulsory-education-wizard/hops-course-table";
import HopsCourseList from "~/components/records/body/hops-compulsory-education-wizard/hops-course-list";

/**
 * StudyToolProps
 */
interface StudyMatrixProps {
  i18n: i18nType;
  /**
   * Identifier of student
   */
  studentId: string;
  websocketState: WebsocketStateType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Tool for designing studies
 * @param props props
 * @returns JSX.Element
 */
const StudyMatrix: React.FC<StudyMatrixProps> = (props) => {
  const { studentActivity, ...studentActivityHandlers } = useStudentActivity(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const { studentChoices, ...studentChoiceHandlers } = useStudentChoices(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const { studyOptions } = useStudentAlternativeOptions(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  return (
    <>
      <div className="hops-container__row">
        <div className="hops__form-element-container hops__form-element-container--pad__upforwards">
          {studentActivity.isLoading || studentChoices.isLoading ? (
            <div className="loader-empty" />
          ) : (
            <div className="hops-container__table-container">
              <HopsCourseTable
                useCase="study-matrix"
                disabled={false}
                studentId={props.studentId}
                user="supervisor"
                superVisorModifies={true}
                ethicsSelected={studyOptions.options.religionAsEthics}
                finnishAsSecondLanguage={studyOptions.options.finnishAsLanguage}
                suggestedNextList={studentActivity.suggestedNextList}
                onGoingList={studentActivity.onGoingList}
                gradedList={studentActivity.gradedList}
                transferedList={studentActivity.transferedList}
                updateSuggestion={studentActivityHandlers.updateSuggestion}
                updateStudentChoice={studentChoiceHandlers.updateStudentChoice}
              />
            </div>
          )}
        </div>

        <div className="hops__form-element-container hops__form-element-container--mobile">
          {studentActivity.isLoading || studentChoices.isLoading ? (
            <div className="loader-empty" />
          ) : (
            <HopsCourseList
              disabled={false}
              user="supervisor"
              studentId={props.studentId}
              ethicsSelected={studyOptions.options.religionAsEthics}
              finnishAsSecondLanguage={studyOptions.options.finnishAsLanguage}
              suggestedNextList={studentActivity.suggestedNextList}
              suggestedOptionalList={studentActivity.suggestedOptionalList}
              onGoingList={studentActivity.onGoingList}
              gradedList={studentActivity.gradedList}
              transferedList={studentActivity.transferedList}
              studentChoiceList={studentChoices.studentChoices}
              updateStudentChoice={studentChoiceHandlers.updateStudentChoice}
              updateSuggestion={studentActivityHandlers.updateSuggestion}
            />
          )}
        </div>
      </div>

      <div className="hops-container__study-tool-indicators">
        <div className="hops-container__study-tool-indicator-container">
          <div className="hops-container__indicator-item hops-container__indicator-item--mandatory"></div>
          <div className="hops-container__indicator-item-label">Pakollinen</div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--optional"></div>
          <div className="hops-container__indicator-item-label">
            (*)-Valinnainen
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--approval"></div>
          <div className="hops-container__indicator-item-label">
            Hyväksiluettu
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--completed"></div>
          <div className="hops-container__indicator-item-label">Suoritettu</div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--inprogress"></div>
          <div className="hops-container__indicator-item-label">Kesken</div>
        </div>

        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--next"></div>
          <div className="hops-container__indicator-item-label">
            Ohjaajan suraavaksi ehdottama
          </div>
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
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return { displayNotification };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyMatrix);
