import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/application-sub-panel.scss";
import { RecordsType } from "~/reducers/main-function/records";
import {
  SummaryType,
  SummaryStudentsGuidanceCouncelorsType,
} from "~/reducers/main-function/records/summary";
import { HOPSType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import MainChart from "~/components/general/graph/main-chart";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import Button from "~/components/general/button";
import moment from "~/lib/moment";
import { StatusType } from "~/reducers/base/status";
import Avatar from "~/components/general/avatar";
import { getName } from "~/util/modifiers";
import CourseCarousel from "~/components/general/carousel/course-carousel";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";

/**
 * SummaryProps
 */
interface SummaryProps {
  i18n: i18nType;
  records: RecordsType;
  summary: SummaryType;
  status: StatusType;
  hops: HOPSType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * SummaryState
 */
interface SummaryState {}

/**
 * Summary
 */
class Summary extends React.Component<SummaryProps, SummaryState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: SummaryProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    if (
      this.props.records.location !== "summary" ||
      this.props.summary.status !== "READY"
    ) {
      return null;
    } else {
      const studentBasicInfo = (
        <div className="application-sub-panel">
          <div className="application-sub-panel__header">
            {this.props.i18n.text.get("plugin.records.summary.studyInfo")}
          </div>
          <div className="application-sub-panel__body application-sub-panel__body--studies-summary-info">
            <div className="application-sub-panel__item">
              <div className="application-sub-panel__item-title">
                {this.props.i18n.text.get("plugin.records.studyStartDateLabel")}
              </div>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--study-start-date">
                <span className="application-sub-panel__single-entry">
                  {this.props.summary.data.studentsDetails.studyStartDate
                    ? this.props.i18n.time.format(
                        this.props.summary.data.studentsDetails.studyStartDate
                      )
                    : this.props.i18n.text.get(
                        "plugin.records.summary.studyTime.empty"
                      )}
                </span>
              </div>
            </div>
            <div className="application-sub-panel__item">
              <div className="application-sub-panel__item-title">
                {this.props.i18n.text.get(
                  this.props.summary.data.studentsDetails.studyEndDate
                    ? "plugin.records.studyEndDateLabel"
                    : "plugin.records.studyTimeEndLabel"
                )}
              </div>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--study-end-date">
                <span className="application-sub-panel__single-entry">
                  {this.props.summary.data.studentsDetails.studyEndDate ||
                  this.props.summary.data.studentsDetails.studyTimeEnd
                    ? this.props.i18n.time.format(
                        this.props.summary.data.studentsDetails.studyEndDate ||
                          this.props.summary.data.studentsDetails.studyTimeEnd
                      )
                    : this.props.i18n.text.get(
                        "plugin.records.summary.studyTime.empty"
                      )}
                </span>
              </div>
            </div>

            <div className="application-sub-panel__item">
              <div className="application-sub-panel__item-title">
                {this.props.i18n.text.get(
                  "plugin.records.studyStudentCouncelorsLabel"
                )}
              </div>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--summary-student-councelors">
                <div className="item-list item-list--student-councelors">
                  {this.props.summary.data.studentsGuidanceCouncelors.map(
                    (councelor: SummaryStudentsGuidanceCouncelorsType) => {
                      let displayVacationPeriod =
                        !!councelor.properties["profile-vacation-start"];
                      if (councelor.properties["profile-vacation-end"]) {
                        // we must check for the ending
                        const vacationEndsAt = moment(
                          councelor.properties["profile-vacation-end"]
                        );
                        const today = moment();
                        // if it's before or it's today then we display, otherwise nope
                        displayVacationPeriod =
                          vacationEndsAt.isAfter(today, "day") ||
                          vacationEndsAt.isSame(today, "day");
                      }
                      return (
                        <div
                          className="item-list__item item-list__item--student-councelor"
                          key={councelor.userEntityId}
                        >
                          <div className="item-list__profile-picture">
                            <Avatar
                              id={councelor.userEntityId}
                              userCategory={3}
                              firstName={councelor.firstName}
                              hasImage={councelor.hasImage}
                            />
                          </div>
                          <div className="item-list__text-body item-list__text-body--multiline">
                            <div className="item-list__user-name">
                              {councelor.firstName} {councelor.lastName}
                            </div>
                            <div className="item-list__user-contact-info">
                              <div className="item-list__user-email">
                                <div className="glyph icon-envelope"></div>
                                {councelor.email}
                              </div>
                              {councelor.properties["profile-phone"] ? (
                                <div className="item-list__user-phone">
                                  <div className="glyph icon-phone"></div>
                                  {councelor.properties["profile-phone"]}
                                </div>
                              ) : null}
                            </div>
                            {displayVacationPeriod ? (
                              <div className="item-list__user-vacation-period">
                                {this.props.i18n.text.get(
                                  "plugin.workspace.index.teachersVacationPeriod.label"
                                )}
                                &nbsp;
                                {this.props.i18n.time.format(
                                  councelor.properties["profile-vacation-start"]
                                )}
                                {councelor.properties["profile-vacation-end"]
                                  ? "–" +
                                    this.props.i18n.time.format(
                                      councelor.properties[
                                        "profile-vacation-end"
                                      ]
                                    )
                                  : null}
                              </div>
                            ) : null}
                            <CommunicatorNewMessage
                              extraNamespace="guidance-councelor"
                              initialSelectedItems={[
                                {
                                  type: "staff",
                                  value: {
                                    id: councelor.userEntityId,
                                    name: getName(councelor, true),
                                  },
                                },
                              ]}
                            >
                              <Button
                                buttonModifiers={[
                                  "info",
                                  "contact-student-councelor",
                                ]}
                              >
                                {this.props.i18n.text.get(
                                  "plugin.records.contactStudentCouncelor.message.label"
                                )}
                              </Button>
                            </CommunicatorNewMessage>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      const studyStatus =
        this.props.hops.value.goalMatriculationExam === "yes" ? (
          <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-evaluated">
            <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-evaluated">
              {this.props.i18n.text.get(
                "plugin.records.summary.card.workspaces.title"
              )}
            </div>
            <div className="application-sub-panel__card-body">
              {this.props.i18n.text.get(
                "plugin.records.summary.card.workspaces.done.pre"
              )}
            </div>
            <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-evaluated">
              {this.props.summary.data.eligibilityStatus}
            </div>
            <div className="application-sub-panel__card-body">
              {this.props.i18n.text.get(
                "plugin.records.summary.card.workspaces.done.post.matriculationEligibility"
              )}
            </div>
          </div>
        ) : (
          <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-evaluated">
            <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-evaluated">
              {this.props.i18n.text.get(
                "plugin.records.summary.card.workspaces.title"
              )}
            </div>
            <div className="application-sub-panel__card-body">
              {this.props.i18n.text.get(
                "plugin.records.summary.card.workspaces.done.pre"
              )}
            </div>
            <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-evaluated">
              {this.props.summary.data.coursesDone}
            </div>
            <div className="application-sub-panel__card-body">
              {this.props.i18n.text.get(
                "plugin.records.summary.card.workspaces.done.post.workspace"
              )}
            </div>
          </div>
        );

      return (
        <section>
          <h2 className="application-panel__content-header">
            {this.props.i18n.text.get("plugin.records.summary.title")}
          </h2>
          {studentBasicInfo}
          {this.props.status.isActiveUser ? (
            <div className="react-container">
              <div className="application-sub-panel">
                <div className="application-sub-panel__header">
                  Kursseja sinulle
                </div>
                <CourseCarousel
                  studentId={this.props.status.userSchoolDataIdentifier}
                  studentUserEntityId={this.props.status.userId}
                  displayNotification={this.props.displayNotification}
                />
              </div>

              <div className="application-sub-panel">
                <div className="application-sub-panel__header">
                  {this.props.i18n.text.get(
                    "plugin.records.summary.studyEvents"
                  )}
                </div>
                <div className="application-sub-panel__body application-sub-panel__body--studies-summary-cards">
                  {studyStatus}
                  <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-activity">
                    <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-activity">
                      {this.props.i18n.text.get(
                        "plugin.records.summary.card.activity.title"
                      )}
                    </div>
                    <div className="application-sub-panel__card-body">
                      {this.props.i18n.text.get(
                        "plugin.records.summary.card.activity.stat.pre"
                      )}
                    </div>
                    <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-activity">
                      {this.props.summary.data.activity}
                    </div>
                    <div className="application-sub-panel__card-body">
                      {this.props.i18n.text.get(
                        "plugin.records.summary.card.activity.stat.post"
                      )}
                    </div>
                  </div>
                  <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-returned">
                    <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-returned">
                      {this.props.i18n.text.get(
                        "plugin.records.summary.card.tasks.title"
                      )}
                    </div>
                    <div className="application-sub-panel__card-body">
                      {this.props.i18n.text.get(
                        "plugin.records.summary.card.tasks.stat.pre"
                      )}
                    </div>
                    <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-returned">
                      {this.props.summary.data.returnedExercises}
                    </div>
                    <div className="application-sub-panel__card-body">
                      {this.props.i18n.text.get(
                        "plugin.records.summary.card.tasks.stat.post"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="application-sub-panel">
                <div className="application-sub-panel__header">
                  {this.props.i18n.text.get(
                    "plugin.guider.user.details.statistics"
                  )}
                </div>
                {this.props.summary.data.graphData.activity &&
                this.props.summary.data.graphData.workspaces ? (
                  <MainChart
                    workspaces={this.props.summary.data.graphData.workspaces}
                    activityLogs={this.props.summary.data.graphData.activity}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      );
    }
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: state.records,
    summary: state.summary,
    status: state.status,
    hops: state.hops,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
