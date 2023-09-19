import * as React from "react";
import { StateType } from "reducers";
import { connect, Dispatch } from "react-redux";
import { WebsocketStateType } from "~/reducers/util/websocket";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import { useStudentActivity } from "~/hooks/useStudentActivity";
import HopsCourseTable from "~/components/general/hops-compulsory-education-wizard/hops-course-table";
import HopsCourseList from "~/components/general/hops-compulsory-education-wizard/hops-course-list";
import { useStudentAlternativeOptions } from "~/hooks/useStudentAlternativeOptions";
import { schoolCourseTable } from "~/mock/mock-data";
import { filterSpecialSubjects } from "~/helper-functions/shared";

/**
 * StudyToolProps
 */
interface StudySuggestionMatrixProps {
  /**
   * Identifier of student
   */
  studentId: string;
  studentUserEntityId: number;
  websocketState: WebsocketStateType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Tool for designing studies
 * @param props props
 * @returns JSX.Element
 */
const StudySuggestionMatrix: React.FC<StudySuggestionMatrixProps> = (props) => {
  const { studentActivity, ...studentActivityHandlers } = useStudentActivity(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const { studyOptions } = useStudentAlternativeOptions(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const filteredSchoolCourseTable = filterSpecialSubjects(
    schoolCourseTable,
    studyOptions.options
  );

  return (
    <>
      <div className="hops-container__row">
        <div className="hops-container__study-tool-indicators">
          <div className="hops-container__study-tool-indicator-container--legend-title">
            Värien kuvaukset
          </div>
          <div className="hops-container__study-tool-indicator-container">
            <div className="hops-container__indicator-item hops-container__indicator-item--mandatory"></div>
            <div className="hops-container__indicator-item-label">
              Pakollinen
            </div>
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
            <div className="hops-container__indicator-item-label">
              Suoritettu
            </div>
          </div>
          <div className="hops-container__study-tool-indicator-container ">
            <div className="hops-container__indicator-item hops-container__indicator-item--inprogress"></div>
            <div className="hops-container__indicator-item-label">Kesken</div>
          </div>

          <div className="hops-container__study-tool-indicator-container ">
            <div className="hops-container__indicator-item hops-container__indicator-item--next"></div>
            <div className="hops-container__indicator-item-label">
              Ohjaajan seuraavaksi ehdottama
            </div>
          </div>
        </div>
        <div className="hops__form-element-container hops__form-element-container--pad-upforwards swiper-no-swiping">
          {studentActivity.isLoading ? (
            <div className="loader-empty" />
          ) : (
            <div className="hops-container__table-container">
              <HopsCourseTable
                matrix={filteredSchoolCourseTable}
                useCase="study-matrix"
                usePlace="guider"
                disabled={false}
                studentId={props.studentId}
                studentsUserEntityId={props.studentUserEntityId}
                user="supervisor"
                superVisorModifies={true}
                suggestedNextList={studentActivity.suggestedNextList}
                onGoingList={studentActivity.onGoingList}
                gradedList={studentActivity.gradedList}
                transferedList={studentActivity.transferedList}
                updateSuggestionNext={
                  studentActivityHandlers.updateSuggestionNext
                }
                skillsAndArt={studentActivity.skillsAndArt}
                otherSubjects={studentActivity.otherSubjects}
                otherLanguageSubjects={studentActivity.otherLanguageSubjects}
              />
            </div>
          )}
        </div>

        <div className="hops__form-element-container hops__form-element-container--mobile swiper-no-swiping">
          {studentActivity.isLoading ? (
            <div className="loader-empty" />
          ) : (
            <HopsCourseList
              matrix={filteredSchoolCourseTable}
              useCase="study-matrix"
              disabled={false}
              user="supervisor"
              studentId={props.studentId}
              studentsUserEntityId={props.studentUserEntityId}
              superVisorModifies={true}
              suggestedNextList={studentActivity.suggestedNextList}
              onGoingList={studentActivity.onGoingList}
              gradedList={studentActivity.gradedList}
              transferedList={studentActivity.transferedList}
              updateSuggestionNext={
                studentActivityHandlers.updateSuggestionNext
              }
              skillsAndArt={studentActivity.skillsAndArt}
              otherSubjects={studentActivity.otherSubjects}
              otherLanguageSubjects={studentActivity.otherLanguageSubjects}
            />
          )}
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
)(StudySuggestionMatrix);
