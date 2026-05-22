import * as React from "react";
import { connect } from "react-redux";
import { localize } from "~/locales/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/card.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/application-sub-panel.scss";
import { RecordsType } from "~/reducers/main-function/records";
import { SummaryType } from "~/reducers/main-function/records/summary";
import { ContactsState } from "~/reducers/base/contacts";
import { StateType } from "~/reducers";
import MainChart from "~/components/general/graph/main-chart";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import { ButtonPill } from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import { getName } from "~/util/modifiers";
import CourseCarousel from "~/components/general/carousel/course-carousel";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import { Action, bindActionCreators, Dispatch } from "redux";
import Notes from "~/components/general/notes/notes";
import { WhatsappButtonLink } from "~/components/general/whatsapp-link";
import { Instructions } from "~/components/general/instructions";
import { withTranslation, WithTranslation } from "react-i18next";
import { carouselMatrixByStudyProgramme } from "~/components/general/carousel/hooks/use-course-carousel";
import StudyProgress from "../study-progress";
import { MuikkuEvents } from "~/reducers/base/muikku-events";
import WallAbsenceEvent from "~/components/index/layouts/panels/wall/walll-event";
import { UserStudyData } from "~/reducers/study-activity";
import ContactCard from "~/components/general/contact-card";
import OtherContact from "./summary/other-contact";
import GuardianContact from "./summary/guardian-contact";

/**
 * SummaryProps
 */
interface SummaryProps extends WithTranslation {
  records: RecordsType;
  contacts: ContactsState;
  summary: SummaryType;
  status: StatusType;
  absenceEvents: MuikkuEvents;
  defaultUserStudyData: UserStudyData;
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
    const {
      t,
      absenceEvents,
      status,
      summary,
      records,
      contacts,
      defaultUserStudyData,
      displayNotification,
    } = this.props;
    if (records.location !== "summary" || summary.status !== "READY") {
      return null;
    } else {
      const absences = (
        <div className="application-sub-panel">
          <div className="application-sub-panel__header">
            {t("labels.absences", { ns: "events" })}
          </div>
          <div className="application-sub-panel__body application-sub-panel__body--studies-summary-info">
            {absenceEvents.events.map((event) => (
              <WallAbsenceEvent
                isUnder18={status.isUnder18}
                key={event.id}
                event={event}
              />
            ))}
          </div>
        </div>
      );
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
                  {summary.data.studentsDetails.studyStartDate
                    ? localize.date(summary.data.studentsDetails.studyStartDate)
                    : t("content.empty", {
                        ns: "studies",
                        context: "studyTime",
                      })}
                </span>
              </div>
            </div>
            <div className="application-sub-panel__item">
              <div className="application-sub-panel__item-title">
                {summary.data.studentsDetails.studyEndDate
                  ? t("labels.studyEndDate", { ns: "users" })
                  : t("labels.studyTimeEnd", { ns: "users" })}
              </div>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--study-end-date">
                <span className="application-sub-panel__single-entry">
                  {summary.data.studentsDetails.studyEndDate ||
                  summary.data.studentsDetails.studyTimeEnd
                    ? localize.date(
                        summary.data.studentsDetails.studyEndDate ||
                          summary.data.studentsDetails.studyTimeEnd
                      )
                    : t("content.empty", {
                        ns: "studies",
                        context: "studyTime",
                      })}
                </span>
              </div>
            </div>
          </div>
        </div>
      );

      const studentContacts = (
        <div className="application-sub-panel application-sub-panel--counselors">
          <div className="application-sub-panel__header application-sub-panel__header--with-instructions">
            {t("labels.contactInfo", {
              ns: "users",
            })}
          </div>
          <div className="application-sub-panel__body">
            <div className="item-list item-list--student-counselors">
              {contacts.others?.list.length > 0 ? (
                contacts.others.list.map((contact) => (
                  <OtherContact
                    key={contact.id}
                    contact={contact}
                    studentIdentifier={status.userSchoolDataIdentifier}
                    isUnder18={status.isUnder18}
                  />
                ))
              ) : (
                <div className="empty">
                  <span>
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
      );

      const studentCounselors = (
        <div className="application-sub-panel application-sub-panel--counselors">
          <div className="application-sub-panel__header application-sub-panel__header--with-instructions">
            {t("labels.counselors", {
              ns: "users",
            })}
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
                    __html: t("content.counselorsDescription", {
                      ns: "studies",
                    }),
                  }}
                />
              }
            />
          </div>
          <div className="application-sub-panel__body">
            <div className="item-list item-list--student-counselors">
              {contacts.counselors?.list.length > 0 ? (
                contacts.counselors.list.map((counselor) => {
                  const {
                    userEntityId,
                    email,
                    hasImage,
                    groupAdvisor,
                    studyAdvisor,
                    properties,
                  } = counselor;
                  const councelorActions = (
                    <>
                      <CommunicatorNewMessage
                        extraNamespace="guidance-counselor"
                        initialSelectedItems={[
                          {
                            type: "staff",
                            value: {
                              id: userEntityId,
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
                      {properties["profile-phone"] &&
                      properties["profile-whatsapp"] ? (
                        <WhatsappButtonLink
                          mobileNumber={properties["profile-phone"]}
                        />
                      ) : null}
                      {properties["profile-appointmentCalendar"] ? (
                        <ButtonPill
                          aria-label={t("labels.appointment")}
                          title={t("labels.appointment")}
                          icon="clock"
                          buttonModifiers="appointment-calendar"
                          openInNewTab="_blank"
                          href={properties["profile-appointmentCalendar"]}
                        />
                      ) : null}
                    </>
                  );

                  return (
                    <ContactCard
                      key={userEntityId}
                      actions={councelorActions}
                      fullName={getName(counselor, true)}
                      hasImage={hasImage}
                      id={userEntityId}
                      email={email}
                      phone={properties["profile-phone"]}
                      groupAdvisor={groupAdvisor}
                      studyAdvisor={studyAdvisor}
                      vacationStart={properties["profile-vacationStart"]}
                      vacationEnd={properties["profile-vacationEnd"]}
                    />
                  );
                })
              ) : (
                <div className="empty">
                  <span>
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
      );

      const studentGuardians = (
        <div className="application-sub-panel application-sub-panel--guardians">
          <div className="application-sub-panel__header">
            {t("labels.guardians", {
              ns: "users",
            })}
          </div>
          <div className="application-sub-panel__body">
            <div className="item-list item-list--student-guardians">
              {contacts.guardians.list.length > 0 &&
                contacts.guardians.list.map((guardian, index) => (
                  <GuardianContact
                    key={guardian.identifier}
                    guardian={guardian}
                    studentIdentifier={status.userSchoolDataIdentifier}
                    isUnder18={status.isUnder18}
                  />
                ))}
            </div>
          </div>
        </div>
      );

      return (
        <section>
          {absences}
          {studentBasicInfo}
          {studentCounselors}
          {contacts.others.list.length > 0 && studentContacts}
          {contacts.guardians.list.length > 0 && studentGuardians}
          {status.isActiveUser ? (
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
                  userId={status.userId}
                  studentId={status.userId}
                />
              </div>

              <div className="application-sub-panel">
                <div className="application-sub-panel__header application-sub-panel__header--with-instructions">
                  {t("labels.studyProgress", {
                    ns: "studies",
                  })}
                </div>

                <StudyProgress
                  curriculumName={status.profile.curriculumName}
                  studyProgrammeName={status.profile.studyProgrammeName}
                  studentIdentifier={status.userSchoolDataIdentifier}
                  studentUserEntityId={status.userId}
                />
              </div>

              {carouselMatrixByStudyProgramme(
                status.profile.studyProgrammeName,
                defaultUserStudyData.courseMatrix
              ) !== null && (
                <div className="application-sub-panel">
                  <div className="application-sub-panel__header">
                    {t("labels.coursesForYou", { ns: "studies" })}
                  </div>
                  <CourseCarousel
                    studentId={status.userSchoolDataIdentifier}
                    studentUserEntityId={status.userId}
                    studyProgrammeName={status.profile.studyProgrammeName}
                    curriculumName={status.profile.curriculumName}
                    matrix={defaultUserStudyData.courseMatrix}
                    displayNotification={displayNotification}
                  />
                </div>
              )}

              <div className="application-sub-panel">
                <div className="application-sub-panel__header">
                  {t("labels.stats")}
                </div>
                {this.props.summary.data.graphData.activity &&
                this.props.summary.data.graphData.workspaces ? (
                  <>
                    <MainChart
                      workspaces={this.props.summary.data.graphData.workspaces}
                      activityLogs={this.props.summary.data.graphData.activity}
                    />
                  </>
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
    absenceEvents: state.muikkuEvents.absenceEvents,
    summary: state.summary,
    status: state.status,
    defaultUserStudyData:
      state.studyActivity.userStudyDataByEducationTypeCode[
        state.studyActivity.defaultEducationTypeCode
      ],
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
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
