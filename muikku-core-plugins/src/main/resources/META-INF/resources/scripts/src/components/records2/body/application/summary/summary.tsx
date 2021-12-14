import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/summary.scss";
import { RecordsType } from "~/reducers/main-function/records";
import { SummaryType } from "~/reducers/main-function/records/summary";
import { HOPSType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import CourseCarousel from "./carousel/course-carousel";
import { achievementsOnGoing, achievementsDone } from "../mocks/mocks";
import AchievementsCarousel from "./carousel/achievements-carousel";
import ProgressTimeline from "./progress-timeline/progress-timeline";
import Button from "~/components/general/button";
import { AgendaNotes, AgendaNotesList } from "./agenda-notes/agenda-notes";
import MainChart from "~/components/general/graph/main-chart";
import { SummaryStudentCouncelorsType } from "../../../../../reducers/main-function/records/summary";
import moment from "../../../../../lib/moment";
import Avatar from "~/components/general/avatar";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import { getName } from "~/util/modifiers";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
let ProgressBarLine = require("react-progress-bar.js").Line;
let ProgressBarCircle = require("react-progress-bar.js").Circle;

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
 * SummaryNew
 */
class SummaryNew extends React.Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps) {
    super(props);

    this.state = {};
  }

  /**
   * renderOldSummary
   * @returns JSX.Element
   */
  renderOldSummary() {
    if (
      this.props.records.location !== "summary" ||
      this.props.summary.status !== "READY"
    ) {
      return null;
    } else {
      let studentBasicInfo = (
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
                  {this.props.summary.data.studentsStudentCouncelors.map(
                    (
                      councelor: SummaryStudentCouncelorsType,
                      index: number
                    ) => {
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

      let studyStatus =
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

  /**
   * render
   * @returns JSX.Element
   */
  renderNewSummary() {
    return (
      <div className="studies-summary">
        <h1>Opintojen yhteenveto</h1>
        <div className="studies-summary__section studies-summary__section--agenda">
          <h2 className="studies-summary__section-header">Päivän agenda</h2>
          <div
            className="studies-summary__section-content"
            style={{ marginBottom: "10px" }}
          >
            <div className="studies-summary__section-content-header">
              <h1>KALENTERI</h1>
            </div>
            <div className="studies-summary__section-content-calendar"></div>
          </div>
          <div
            style={{
              padding: "10px 0",
              backgroundColor: "#fccc8d",
              border: "10px solid orange",
              borderStyle: "ridge",
            }}
            className="studies-summary__section-content"
          >
            <AgendaNotes />
          </div>
        </div>

        <div className="studies-summary__divider studies-summary__divider--transparent"></div>

        <div className="studies-summary__section studies-summary__section--proggress">
          <h2 className="studies-summary__section-header">
            Opintojen edistyminen
          </h2>
          <div className="studies-summary__section-content">
            <div className="studies-summary__section-content-study-proggress">
              <ProgressBarLine
                containerClassName="summary-page__study-file-progressbar"
                options={{
                  strokeWidth: 1,
                  duration: 1000,
                  color: "#72d200",
                  trailColor: "#e3e3e3",
                  trailWidth: 1,
                  svgStyle: { width: "100%", height: "35px" },
                  text: {
                    className:
                      "material-page__audiofield-file-upload-percentage",
                    style: {
                      position: "absolute",
                      color: "white",
                    },
                  },
                }}
                strokeWidth={1}
                easing="easeInOut"
                duration={1000}
                color="#72d200"
                trailColor="#f5f5f5"
                trailWidth={1}
                svgStyle={{ width: "100%", height: "25px" }}
                text={`Opintojen edistyminen`}
                progress={0.5}
              />
            </div>
          </div>
          <div className="studies-summary__section-content">
            <div className="studies-summary__section-content-study-values">
              <div className="basic__info" style={{ marginBottom: "10px" }}>
                <div className="basic__info-content basic__info-content--completed-studies">
                  <div className="basic__info-content-header">
                    Suoritetut opinnot
                  </div>
                  <div className="basic__info-indicator-container">
                    <div
                      className="basic__info-indicator-item--circle"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "5px 30px",
                      }}
                    >
                      <ProgressBarCircle
                        containerClassName="summary-page__study-file-progresscircle"
                        options={{
                          strokeWidth: 10,
                          duration: 1000,
                          color: "#ce01bd",
                          trailColor: "#ebebeb",
                          easing: "easeInOut",
                          trailWidth: 10,
                          svgStyle: { width: "100px", height: "80px" },
                          text: {
                            style: null,
                            className:
                              "summary-page__study-file-progresscircle-label",
                            value: "0",
                          },
                        }}
                        progress={1}
                      />
                    </div>

                    <div className="basic__info-indicator-item--optional">
                      <div className="basic__info-indicator-item-container">
                        <div className="basic__info-indicator-item-color"></div>
                        <div style={{ margin: "0 5px" }}>Valinnaiset</div>
                      </div>
                      <div style={{ margin: "5px 0", fontSize: "1rem" }}>
                        0/7
                      </div>
                    </div>

                    <div className="basic__info-indicator-item--mandatory">
                      <div className="basic__info-indicator-item-container">
                        <div className="basic__info-indicator-item-color"></div>
                        <div style={{ margin: "0 5px" }}>Pakolliset</div>
                      </div>
                      <div style={{ margin: "5px 0", fontSize: "1rem" }}>
                        0/39
                      </div>
                    </div>
                  </div>
                  <div className="basic__info-indicator-function">
                    <Button
                      style={{ width: "100%", backgroundColor: "chocolate" }}
                    >
                      Opintosuorituksiin
                    </Button>
                  </div>
                </div>
                <div className="basic__info-content basic__info-content--completed-studies-sum">
                  <h3>Suoritettuja kursseja/opintoja yhteensä</h3>
                </div>
              </div>
              <div className="basic__info basic__info--study-time">
                <div className="basic__info-content-header">
                  Arvioitu opintoaika
                </div>
                <div
                  style={{
                    height: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "5px 0px 0px 0px",
                    flexGrow: 1,
                    justifyContent: "center",
                  }}
                >
                  <ProgressBarCircle
                    containerClassName="summary-page__study-file-progresscircle"
                    options={{
                      strokeWidth: 10,
                      duration: 1000,
                      color: "#ce01bd",
                      trailColor: "#ebebeb",
                      easing: "easeInOut",
                      trailWidth: 10,
                      svgStyle: { width: "100px", height: "80px" },
                      text: {
                        style: null,
                        className:
                          "summary-page__study-file-progresscircle-label",
                        value: "0",
                      },
                    }}
                    progress={1}
                  />
                </div>
                <div style={{ display: "flex", height: "40px" }}>
                  <Button
                    style={{ width: "100%", backgroundColor: "chocolate" }}
                  >
                    HOPSIIN
                  </Button>
                </div>
              </div>
            </div>

            <div className="studies-summary__section-content-proggress-timeline">
              <ProgressTimeline />
            </div>
          </div>
        </div>

        <div className="studies-summary__divider studies-summary__divider--transparent"></div>

        <div className="studies-summary__section studies-summary__section--courses">
          <h2 className="studies-summary__section-header">Kursseja sinulle</h2>
          <div className="studies-summary__section-content">
            <div
              className="studies-summary__section-content-courses"
              style={{ height: "auto", width: "100%", display: "content" }}
            >
              <CourseCarousel
                studentId={(window as any).MUIKKU_LOGGED_USER}
                displayNotification={this.props.displayNotification}
              />
            </div>
          </div>
        </div>

        <div className="studies-summary__divider studies-summary__divider--transparent"></div>

        <div className="studies-summary__section studies-summary__section--achivements">
          <h2 className="studies-summary__section-header">Saavutukset</h2>
          <div className="studies-summary__section-content">
            <div className="studies-summary__section-content-latest-achievements">
              <div className="studies-summary__section-content-row-header">
                Viimeisin saavutus
              </div>
              <div className="studies-summary__section-content-row-body">
                <img
                  style={{
                    width: "inherit",
                    height: "inherit",
                    objectFit: "none",
                  }}
                  src="https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg"
                />
              </div>
            </div>
            <div className="studies-summary__section-content-achivements">
              <div
                className="studies-summary__section-content-row"
                style={{ marginBottom: "5px" }}
              >
                <div className="studies-summary__section-content-row-header">
                  Muita saavutuksia
                </div>
                <div className="studies-summary__section-content-row-body">
                  <AchievementsCarousel achievements={achievementsDone} />
                </div>
              </div>
              <div className="studies-summary__section-content-row">
                <div className="studies-summary__section-content-row-header">
                  Keskeneräisiä saavutuksia
                </div>
                <div className="studies-summary__section-content-row-body">
                  <AchievementsCarousel achievements={achievementsOnGoing} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (
      this.props.records.location !== "summary" ||
      this.props.summary.status !== "READY"
    ) {
      return null;
    }

    return this.props.summary.data.studentsDetails.studyProgrammeName ===
      "Nettiperuskoulu"
      ? this.renderNewSummary()
      : this.renderOldSummary();
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
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
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    displayNotification,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryNew);
