import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/summary.scss";
import { RecordsType } from "~/reducers/main-function/records";
import { SummaryType } from "~/reducers/main-function/records/summary";
import { HOPSType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import CourseCarousel, { Course } from "./carousel/course-carousel";
import { courses, achievementsOnGoing, achievementsDone } from "../mocks/mocks";
import AchievementsCarousel from "./carousel/achievements-carousel";
import ProgressTimeline from "./progress-timeline/progress-timeline";
import Button from "~/components/general/button";
import { AgendaNotes, AgendaNotesList } from "./agenda-notes/agenda-notes";
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
}

/**
 * SummaryState
 */
interface SummaryState {}

/**
 * Summary
 */
class Summary extends React.Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps) {
    super(props);

    this.state = {};
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="studies-summary">
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
              <CourseCarousel courses={courses} />
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
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
