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
import { RecordsInfoProvider } from "~/components/general/records-history/context/records-info-context";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import RecordsListing from "~/components/general/records-history/records";
import { StudyActivityState } from "~/reducers/study-activity";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import Link from "~/components/general/link";

/**
 * RecordsProps
 */
interface RecordsProps extends WithTranslation {
  records: RecordsType;
  studyActivity: StudyActivityState;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
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
      this.props.studyActivity.userStudyActivityStatus === "LOADING" ||
      this.props.studyActivity.userStudyActivityStatus === "IDLE" ||
      this.props.studyActivity.courseMatrixStatus === "LOADING" ||
      this.props.studyActivity.courseMatrixStatus === "IDLE"
    ) {
      return null;
    } else if (
      this.props.studyActivity.userStudyActivityStatus === "ERROR" ||
      this.props.studyActivity.courseMatrixStatus === "ERROR"
    ) {
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return (
        <div className="empty">
          <span>{"ERROR"}</span>
        </div>
      );
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
                      context: "workspaces",
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
        {studentRecords}
        <ApplicationSubPanel>
          <ApplicationSubPanel.Header>
            {t("labels.files")}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body>
            {this.props.records.files.length ? (
              <ApplicationList>
                {this.props.records.files.map((file) => (
                  <ApplicationListItem
                    className="application-list__item application-list__item--studies-file-attacment"
                    key={file.id}
                  >
                    <span className="icon-attachment"></span>
                    <Link
                      className="link link--studies-file-attachment"
                      href={`/rest/records/files/${file.id}/content`}
                      openInNewTab={file.title}
                    >
                      {file.title}
                    </Link>
                  </ApplicationListItem>
                ))}
              </ApplicationList>
            ) : (
              <ApplicationListItem className="application-list__item application-list__item--studies-file-attacment">
                <div className="empty">
                  <span>
                    {t("content.empty", { ns: "files", context: "files" })}
                  </span>
                </div>
              </ApplicationListItem>
            )}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
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
