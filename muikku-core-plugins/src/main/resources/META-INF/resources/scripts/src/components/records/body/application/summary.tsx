import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { localize } from "~/locales/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/application-sub-panel.scss";
import { RecordsType } from "~/reducers/main-function/records";
import { SummaryType } from "~/reducers/main-function/records/summary";
import { HOPSState } from "~/reducers/main-function/hops";
import { ContactsState } from "~/reducers/base/contacts";
import { StateType } from "~/reducers";
import MainChart from "~/components/general/graph/main-chart";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import { ButtonPill } from "~/components/general/button";
import moment from "moment";
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
import Notes from "~/components/general/notes/notes";
import { WhatsappButtonLink } from "~/components/general/whatsapp-link";
import { Instructions } from "~/components/general/instructions";
import { withTranslation, WithTranslation } from "react-i18next";
import { carouselMatrixByStudyProgrammeAndCurriculum } from "~/components/general/carousel/hooks/use-course-carousel";
import StudyProgressContextProvider from "~/components/general/study-progress/context";
import StudyProgress from "~/components/general/study-progress";

/**
 * SummaryProps
 */
interface SummaryProps extends WithTranslation {
  records: RecordsType;
  contacts: ContactsState;
  summary: SummaryType;
  status: StatusType;
  hops: HOPSState;
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
    const { t } = this.props;

    if (
      this.props.records.location !== "summary" ||
      this.props.summary.status !== "READY"
    ) {
      return null;
    } else {
      const studentBasicInfo = (
        <div className="application-sub-panel">
          <div className="application-sub-panel__header">
            {t("labels.studyInfo", { ns: "studies" })}
          </div>
          <div className="application-sub-panel__body application-sub-panel__body--studies-summary-info">
            <div className="application-sub-panel__item">
              <div className="application-sub-panel__item-title">
                {t("labels.studyStartDate", { ns: "users" })}
              </div>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--study-start-date">
                <span className="application-sub-panel__single-entry">
                  {this.props.summary.data.studentsDetails.studyStartDate
                    ? localize.date(
                        this.props.summary.data.studentsDetails.studyStartDate
                      )
                    : t("content.empty", {
                        ns: "studies",
                        context: "studyTime",
                      })}
                </span>
              </div>
            </div>
            <div className="application-sub-panel__item">
              <div className="application-sub-panel__item-title">
                {this.props.summary.data.studentsDetails.studyEndDate
                  ? t("labels.endDate", { ns: "studies" })
                  : t("labels.studyEndDate", { ns: "users" })}
              </div>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--study-end-date">
                <span className="application-sub-panel__single-entry">
                  {this.props.summary.data.studentsDetails.studyEndDate ||
                  this.props.summary.data.studentsDetails.studyTimeEnd
                    ? localize.date(
                        this.props.summary.data.studentsDetails.studyEndDate ||
                          this.props.summary.data.studentsDetails.studyTimeEnd
                      )
                    : t("content.empty", {
                        ns: "studies",
                        context: "studyTime",
                      })}
                </span>
              </div>
            </div>

            <div className="application-sub-panel__item application-sub-panel__item--counselors">
              <div className="application-sub-panel__item-title">
                {t("labels.counselors", {
                  ns: "users",
                  count: this.props.contacts.counselors.list.length,
                })}
              </div>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--summary-student-counselors">
                <div className="item-list item-list--student-counselors">
                  {this.props.contacts.counselors.list.length > 0 ? (
                    this.props.contacts.counselors.list.map((counselor) => {
                      let displayVacationPeriod =
                        !!counselor.properties["profile-vacation-start"];
                      if (counselor.properties["profile-vacation-end"]) {
                        // we must check for the ending
                        const vacationEndsAt = moment(
                          counselor.properties["profile-vacation-end"]
                        );
                        const today = moment();
                        // if it's before or it's today then we display, otherwise nope
                        displayVacationPeriod =
                          vacationEndsAt.isAfter(today, "day") ||
                          vacationEndsAt.isSame(today, "day");
                      }
                      return (
                        <div
                          className="item-list__item item-list__item--student-counselor"
                          key={counselor.userEntityId}
                        >
                          <div className="item-list__profile-picture">
                            <Avatar
                              id={counselor.userEntityId}
                              userCategory={3}
                              firstName={counselor.firstName}
                              hasImage={counselor.hasImage}
                            />
                          </div>
                          <div className="item-list__text-body item-list__text-body--multiline">
                            <div className="item-list__user-name">
                              {counselor.firstName} {counselor.lastName}
                            </div>
                            <div className="item-list__user-contact-info">
                              <div className="item-list__user-email">
                                <div className="glyph icon-envelope"></div>
                                {counselor.email}
                              </div>
                              {counselor.properties["profile-phone"] ? (
                                <div className="item-list__user-phone">
                                  <div className="glyph icon-phone"></div>
                                  {counselor.properties["profile-phone"]}
                                </div>
                              ) : null}
                            </div>
                            {displayVacationPeriod ? (
                              <div className="item-list__user-vacation-period">
                                {t("labels.status", {
                                  context: "xa",
                                })}
                                &nbsp;
                                {localize.date(
                                  counselor.properties["profile-vacation-start"]
                                )}
                                {counselor.properties["profile-vacation-end"]
                                  ? "–" +
                                    localize.date(
                                      counselor.properties[
                                        "profile-vacation-end"
                                      ]
                                    )
                                  : null}
                              </div>
                            ) : null}
                            <div className="item-list__user-actions">
                              <CommunicatorNewMessage
                                extraNamespace="guidance-counselor"
                                initialSelectedItems={[
                                  {
                                    type: "staff",
                                    value: {
                                      id: counselor.userEntityId,
                                      name: getName(counselor, true),
                                    },
                                  },
                                ]}
                              >
                                <ButtonPill
                                  icon="envelope"
                                  aria-label={t("labels.send", {
                                    ns: "messaging",
                                  })}
                                  title={t("labels.send", {
                                    ns: "messaging",
                                  })}
                                  buttonModifiers={[
                                    "new-message",
                                    "new-message-to-staff",
                                  ]}
                                ></ButtonPill>
                              </CommunicatorNewMessage>
                              {counselor.properties["profile-phone"] &&
                              counselor.properties["profile-whatsapp"] ? (
                                <WhatsappButtonLink
                                  mobileNumber={
                                    counselor.properties["profile-phone"]
                                  }
                                />
                              ) : null}
                              {counselor.properties[
                                "profile-appointmentCalendar"
                              ] ? (
                                <ButtonPill
                                  aria-label={t("labels.appointment")}
                                  title={t("labels.appointment")}
                                  icon="clock"
                                  buttonModifiers="appointment-calendar"
                                  openInNewTab="_blank"
                                  href={
                                    counselor.properties[
                                      "profile-appointmentCalendar"
                                    ]
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty empty--sub-panel-data">
                      <span className="application-sub-panel__single-entry">
                        {t("content.empty", {
                          ns: "studies",
                          context: "counselors",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      return (
        <section>
          {studentBasicInfo}
          {this.props.status.isActiveUser ? (
            <div className="react-container">
              <div className="application-sub-panel">
                <div className="application-sub-panel__header application-sub-panel__header--with-instructions">
                  {t("labels.tasks", { ns: "tasks" })}
                  <Instructions
                    modifier="instructions"
                    alignSelfVertically="top"
                    openByHover={false}
                    closeOnClick={true}
                    closeOnOutsideClick={true}
                    persistent
                    content={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: t("content.instructions", { ns: "tasks" }),
                        }}
                      />
                    }
                  />
                </div>
                <Notes
                  usePlace="records"
                  showHistoryPanel
                  userId={this.props.status.userId}
                  studentId={this.props.status.userId}
                />
              </div>

              <div className="application-sub-panel">
                <div className="application-sub-panel__header application-sub-panel__header--with-instructions">
                  {t("labels.studyProgress", {
                    ns: "studies",
                  })}
                  {/* <Instructions
                    modifier="instructions"
                    alignSelfVertically="top"
                    openByHover={false}
                    closeOnClick={true}
                    closeOnOutsideClick={true}
                    persistent
                    content={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: t("content.instructions", { ns: "tasks" }),
                        }}
                      />
                    }
                  /> */}
                </div>
                <StudyProgressContextProvider
                  user="student"
                  useCase="state-of-studies"
                  studentId={this.props.status.userSchoolDataIdentifier}
                  studentUserEntityId={this.props.status.userId}
                  dataToLoad={["studentActivity"]}
                >
                  <StudyProgress
                    curriculumName={this.props.status.profile.curriculumName}
                    studyProgrammeName={
                      this.props.status.profile.studyProgrammeName
                    }
                    editMode={false}
                  />
                </StudyProgressContextProvider>
              </div>

              {carouselMatrixByStudyProgrammeAndCurriculum(
                this.props.status.profile.studyProgrammeName,
                this.props.status.profile.curriculumName
              ) !== null && (
                <div className="application-sub-panel">
                  <div className="application-sub-panel__header">
                    {t("labels.coursesForYou", { ns: "studies" })}
                  </div>
                  <CourseCarousel
                    studentId={this.props.status.userSchoolDataIdentifier}
                    studentUserEntityId={this.props.status.userId}
                    studyProgrammeName={
                      this.props.status.profile.studyProgrammeName
                    }
                    curriculumName={this.props.status.profile.curriculumName}
                    displayNotification={this.props.displayNotification}
                  />
                </div>
              )}

              <div className="application-sub-panel">
                <div className="application-sub-panel__header">
                  {t("labels.stats")}
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
    records: state.records,
    contacts: state.contacts,
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

export default withTranslation([
  "studies",
  "users",
  "messaging",
  "tasks",
  "materials",
  "common",
])(connect(mapStateToProps, mapDispatchToProps)(Summary));
