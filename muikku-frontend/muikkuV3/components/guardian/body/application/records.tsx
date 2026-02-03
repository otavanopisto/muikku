import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/course.scss";
import "~/sass/elements/activity-badge.scss";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/file-uploader.scss";
import { RecordsType } from "~/reducers/main-function/records";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import { StateType } from "~/reducers";
import { AnyActionType } from "~/actions";
import { StatusType } from "~/reducers/base/status";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { withTranslation, WithTranslation } from "react-i18next";
import { Action, bindActionCreators, Dispatch } from "redux";
import { RecordsInfoProvider } from "~/components/general/records-history/context/records-info-context";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { StudyActivityState } from "~/reducers/study-activity";
import RecordsListing from "~/components/general/records-history/records";

/**
 * RecordsProps
 */
interface RecordsProps extends WithTranslation {
  records: RecordsType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  studyActivity: StudyActivityState;
}

/**
 * RecordsState
 */
interface RecordsState {}

/**
 * StoredCurriculum
 */
export interface StoredCurriculum {
  [identifier: string]: string;
}

const storedCurriculumIndex: StoredCurriculum = {};

/**
 * Records
 */
class Records extends React.Component<RecordsProps, RecordsState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: RecordsProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    if (
      this.props.records.userDataStatus === "LOADING" ||
      this.props.records.userDataStatus === "WAIT" ||
      this.props.studyActivity.userStudyActivityStatus === "LOADING" ||
      this.props.studyActivity.userStudyActivityStatus === "IDLE"
    ) {
      return null;
    } else if (
      this.props.records.userDataStatus === "ERROR" ||
      this.props.studyActivity.userStudyActivityStatus === "ERROR"
    ) {
      return (
        <div className="empty">
          <span>
            {t("content.empty", {
              ns: "studies",
              context: "records",
            })}
          </span>
        </div>
      );
    }

    if (
      !Object.keys(storedCurriculumIndex).length &&
      this.props.records.curriculums.length
    ) {
      this.props.records.curriculums.forEach((curriculum) => {
        storedCurriculumIndex[curriculum.identifier] = curriculum.name;
      });
    }

    /**
     * studentRecords
     */
    const studentRecords = (
      <RecordsInfoProvider
        value={{
          identifier: this.props.status.userSchoolDataIdentifier,
          userEntityId: this.props.status.userId,
          displayNotification: this.props.displayNotification,
          config: {
            showAssigmentsAndDiaries: false,
          },
        }}
      >
        <ApplicationSubPanel>
          <ApplicationSubPanel.Body>
            {this.props.studyActivity.userStudyActivity ? (
              <RecordsListing
                courseMatrix={this.props.studyActivity.courseMatrix}
                studyActivity={this.props.studyActivity.userStudyActivity}
              />
            ) : (
              <div className="application-sub-panel__item">
                <div className="empty">
                  <span>
                    {t("content.empty", {
                      ns: "studies",
                      context: "workspaces-guardian",
                    })}
                  </span>
                </div>
              </div>
            )}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
      </RecordsInfoProvider>
    );

    return (
      <BodyScrollKeeper
        hidden={
          this.props.records.location !== "records" ||
          !!this.props.records.current
        }
      >
        <h2 className="application-panel__content-header">
          {t("labels.records", { ns: "studies" })}
        </h2>
        {studentRecords}
      </BodyScrollKeeper>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    records: state.records,
    status: state.status,
    studyActivity: state.studyActivity,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ displayNotification }, dispatch);
}
export default withTranslation(["studies"])(
  connect(mapStateToProps, mapDispatchToProps)(Records)
);
