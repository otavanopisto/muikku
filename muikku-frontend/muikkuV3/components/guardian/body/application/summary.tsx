import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Instructions } from "~/components/general/instructions";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import moment from "moment";
import UserAvatar from "~/components/general/avatar";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import Button, { ButtonPill } from "~/components/general/button";
import { WhatsappButtonLink } from "~/components/general/whatsapp-link";
import StudyProgress from "./study-progress";
import MainChart from "~/components/general/graph/main-chart";
import { getName } from "~/util/modifiers";
import { MuikkuEventProperty } from "~/mock/absence";
import WallEvent from "~/components/index/layouts/panels/wall/walll-event";
import {
  updateAbsenceEventProperty,
  loadAbsenceEvents,
} from "~/actions/base/muikku-events";
import AbsenceFeedbackDialog from "~/components/general/events/dialogs/absence-feedback-dialog";

/**
 * SummaryProps
 */
interface SummaryProps {}

/**
 * Summary
 * @param props props
 */
const Summary = (props: SummaryProps) => {
  const { t } = useTranslation([
    "studies",
    "users",
    "messaging",
    "tasks",
    "materials",
    "common",
  ]);
  const { status, muikkuEvents } = useSelector((state: StateType) => state);
  const dispatch = useDispatch();
  const currentDependant = useSelector(
    (state: StateType) => state.guardian.currentDependant
  );

  /**
   * handles confirming feedback for an absence event
   * @param explanation the feedback explanation provided by the user
   * @param eventId the ID of the absence event for which feedback is being provided
   */
  const handleConfirmFeedback = (explanation: string, eventId: number) => {
    const property: MuikkuEventProperty = {
      id: 0,
      eventId,
      userEntityId: currentDependant.dependantInfo.userEntityId,
      date: new Date().toISOString(),
      name: "ABSENCE_REASON",
      value: explanation,
    };

    dispatch(updateAbsenceEventProperty(property));
  };
  React.useEffect(() => {
    if (
      currentDependant.dependantInfoStatus !== "READY" ||
      currentDependant.dependantStudyActivityStatus !== "READY" ||
      currentDependant.dependantCourseMatrixStatus !== "READY" ||
      currentDependant.dependantContactGroups.counselors.status !== "READY"
    ) {
      return;
    }
    dispatch(loadAbsenceEvents(currentDependant.dependantInfo.userEntityId));
  }, [
    dispatch,
    currentDependant.dependantInfo?.userEntityId,
    currentDependant.dependantInfoStatus,
    currentDependant.dependantStudyActivityStatus,
    currentDependant.dependantCourseMatrixStatus,
    currentDependant.dependantContactGroups.counselors.status,
  ]);

  if (
    currentDependant.dependantInfoStatus !== "READY" ||
    currentDependant.dependantStudyActivityStatus !== "READY" ||
    currentDependant.dependantCourseMatrixStatus !== "READY" ||
    currentDependant.dependantContactGroups.counselors.status !== "READY"
  ) {
    return null;
  } else {
    const absences = (
      <div className="application-sub-panel">
        <div className="application-sub-panel__header">
          {t("labels.absences", { ns: "events" })}
        </div>
        <div className="application-sub-panel__body application-sub-panel__body--studies-summary-info">
          {muikkuEvents.absenceEvents.events.map((event) => (
            <WallEvent
              key={event.id}
              event={event}
              actions={
                <AbsenceFeedbackDialog
                  absenceEvent={event}
                  onConfirm={handleConfirmFeedback}
                >
                  <Button
                    disabled={event.properties.some(
                      (p) =>
                        p.name === "ABSENCE_REASON" && p.value.trim() !== ""
                    )}
                    className="button button--primary-function-content"
                  >
                    {t("actions.giveFeedback", { ns: "events" })}
                  </Button>
                </AbsenceFeedbackDialog>
              }
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
                {currentDependant.dependantInfo?.studyStartDate
                  ? localize.date(
                      currentDependant.dependantInfo?.studyStartDate
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
              {currentDependant.dependantInfo?.studyEndDate
                ? t("labels.studyEndDate", { ns: "users" })
                : t("labels.studyTimeEnd", { ns: "users" })}
            </div>
            <div className="application-sub-panel__item-data application-sub-panel__item-data--study-end-date">
              <span className="application-sub-panel__single-entry">
                {currentDependant.dependantInfo?.studyEndDate ||
                currentDependant.dependantInfo?.studyTimeEnd
                  ? localize.date(
                      currentDependant.dependantInfo?.studyEndDate ||
                        currentDependant.dependantInfo?.studyTimeEnd
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
            {currentDependant.dependantContactGroups.counselors.list?.length >
            0 ? (
              currentDependant.dependantContactGroups.counselors.list?.map(
                (counselor) => {
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
                        <UserAvatar
                          id={counselor.userEntityId}
                          userCategory={3}
                          name={counselor.firstName}
                          hasImage={counselor.hasImage}
                        />
                      </div>
                      <div className="item-list__text-body item-list__text-body--multiline">
                        <div className="item-list__user-name">
                          {counselor.firstName} {counselor.lastName}
                        </div>
                        <div className="item-list__counselors labels">
                          {counselor.groupAdvisor && (
                            <span className="label">
                              <span className="label__text">
                                {t("labels.groupCounselor", {
                                  ns: "users",
                                })}
                              </span>
                            </span>
                          )}
                          {counselor.studyAdvisor && (
                            <span className="label">
                              <span className="label__text">
                                {t("labels.studyCounselor", {
                                  ns: "users",
                                })}
                              </span>
                            </span>
                          )}
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
                                  counselor.properties["profile-vacation-end"]
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
                }
              )
            ) : (
              <div className="empty">
                <span>
                  {t("content.empty", {
                    ns: "studies",
                    context: "counselorsGuardian",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <section>
        {muikkuEvents.absenceEvents.events &&
          muikkuEvents.absenceEvents.events.length > 0 &&
          absences}
        {studentCounselors}
        {studentBasicInfo}
        <div className="application-sub-panel">
          <div className="application-sub-panel__header application-sub-panel__header--with-instructions">
            {t("labels.studyProgress", {
              ns: "studies",
            })}
          </div>

          <StudyProgress
            curriculumName={currentDependant.dependantInfo.curriculumName}
            studyProgrammeName={
              currentDependant.dependantInfo.studyProgrammeName
            }
            studentIdentifier={currentDependant.dependantInfo.id}
            studentUserEntityId={currentDependant.dependantInfo.userEntityId}
          />
        </div>
        {status.isActiveUser ? (
          <>
            <div className="application-sub-panel">
              <div className="application-sub-panel__header">
                {t("labels.stats")}
              </div>
              {currentDependant.dependantActivityGraphData.activity &&
              currentDependant.dependantActivityGraphData.workspaces ? (
                <MainChart
                  workspaces={
                    currentDependant.dependantActivityGraphData.workspaces
                  }
                  activityLogs={
                    currentDependant.dependantActivityGraphData.activity
                  }
                />
              ) : null}
            </div>
          </>
        ) : null}
      </section>
    );
  }
};

export default Summary;
