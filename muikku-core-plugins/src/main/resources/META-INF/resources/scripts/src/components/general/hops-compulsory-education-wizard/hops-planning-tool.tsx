import * as React from "react";
import { TextField } from "./text-field";
import { NEEDED_STUDIES_IN_TOTAL } from ".";
import StudyToolCalculationInfoBox from "./study-tool-calculation-info-box";
import {
  LANGUAGE_SUBJECTS,
  OTHER_SUBJECT_OUTSIDE_HOPS,
  SKILL_AND_ART_SUBJECTS,
} from "../../../hooks/useStudentActivity";
import { StateType } from "reducers";
import { connect, Dispatch } from "react-redux";
import { WebsocketStateType } from "../../../reducers/util/websocket";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import StudyToolOptionalStudiesInfoBox from "./study-tool-optional-studiess-info-box";
import { useStudentStudyHour } from "./hooks/useStudentStudyHours";
import { AnyActionType } from "~/actions";
import Dropdown from "../dropdown";
import { localize } from "~/locales/i18n";
import { useFollowUp } from "./context/follow-up-context";
import { useStudyProgressContextState } from "../study-progress/context";
import StudyProgress from "../study-progress";
import { schoolCourseTableCompulsory2018 } from "~/mock/mock-data";
import { filterCompulsorySubjects } from "~/helper-functions/study-matrix";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarCircle = require("react-progress-bar.js").Circle;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarLine = require("react-progress-bar.js").Line;

/**
 * StudyToolProps
 */
interface HopsPlanningToolProps {
  /**
   * Identifier of student
   */
  studentId: string;
  /**
   * If all functionalities are disabled
   * in read mode
   */
  disabled: boolean;
  /**
   * Whether study incidator are shown
   * @default true
   */
  showIndicators?: boolean;
  /**
   * Whether supervisor is modifying student hops
   * some of functionalities changes based on that
   */
  editMode: boolean;
  studyTimeEnd: string | null;
  websocketState: WebsocketStateType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Default props
 */
const defaultProps = {
  showIndicators: true,
};

/**
 * Tool for designing studies
 * @param props props
 * @returns JSX.Element
 */
const HopsPlanningTool: React.FC<HopsPlanningToolProps> = (props) => {
  props = { ...defaultProps, ...props };

  const studyProgress = useStudyProgressContextState();

  const { studyHours, ...studyHourHandlers } = useStudentStudyHour(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const filteredSchoolCourseTable = filterCompulsorySubjects(
    schoolCourseTableCompulsory2018.subjectsTable,
    studyProgress.options
  );

  const followUpData = useFollowUp();

  /**
   * Compared graduation goal to need mandatory studies and shows indicator/message
   * if studieplan is good enough
   *
   * @param hoursInTotalToComplete hoursInTotalToComplete
   * @returns JSX.Element
   */
  const compareGraduationGoalToNeededForMandatoryStudies = (
    hoursInTotalToComplete: number
  ) => {
    /**
     * Localized moment initialzied to variable
     */
    const localizedMoment = localize.getLocalizedMoment;

    /**
     * Time in months need to be study. Based on calculation from hours total to complete and study hours per week
     */
    const totalTimeInDays = getTotalTimeInDays(
      hoursInTotalToComplete,
      studyHours.studyHourValue
    );

    /**
     * Calculated graduation date based on toal time in months
     */
    const calculateGraduationDate = localizedMoment().add(
      totalTimeInDays,
      "day"
    );

    /**
     * Student's inputted studyhour's value must be valid for message boxes to appear
     */
    const validStudyHours =
      studyHours.studyHourValue > 0 && studyHours.studyHourValue !== null;

    const calculateGraduationDateFormated = localizedMoment()
      .add(totalTimeInDays, "day")
      .format("MM-yyyy");

    /**
     * Own graduation date goal changed to moment form
     */
    const ownGoal = localizedMoment(followUpData.followUp.graduationGoal).endOf(
      "month"
    );

    if (
      props.studyTimeEnd &&
      calculateGraduationDate.isAfter(localizedMoment(props.studyTimeEnd)) &&
      validStudyHours
    ) {
      return (
        <StudyToolCalculationInfoBox
          state="warning_overstudyendtime"
          message={`Jos opiskelet ${
            studyHours.studyHourValue
          } tuntia viikossa, valmistut arviolta ${calculateGraduationDateFormated}. Opinto-oikeutesi kuitenkin päättyy: ${localizedMoment(
            props.studyTimeEnd
          )
            .utc(false)
            .format(
              "MM-yyyy"
            )}. Mieti, kuinka voisit järjestää itsellesi enemmän aikaa opiskelulle.`}
        />
      );
    }

    if (followUpData.followUp.graduationGoal === null && validStudyHours) {
      return (
        <StudyToolCalculationInfoBox
          message={`Jos opiskelet ${studyHours.studyHourValue} tuntia viikossa, valmistut arviolta ${calculateGraduationDateFormated}`}
        />
      );
    }

    /**
     * If calculated graduation date exceeds student's original goal
     */
    if (
      localizedMoment()
        .add(totalTimeInDays, "day")
        .isAfter(ownGoal.endOf("month")) &&
      validStudyHours
    ) {
      return (
        <StudyToolCalculationInfoBox
          state="warning_notenough"
          message={`Jos opiskelet ${
            studyHours.studyHourValue
          } tuntia viikossa, valmistut arviolta ${calculateGraduationDateFormated}. Valmistumiselle asettamasi tavoite on: ${ownGoal.format(
            "MM-yyyy"
          )}. Voit joko valmistua myöhemmin tai etsiä itsellesi lisää aikaa opiskelemiseen. Pohdi asiaa vielä!`}
        />
      );
    }

    /**
     * If calculated graduation date predates student's original goal
     */
    if (
      localizedMoment()
        .add(totalTimeInDays, "day")
        .endOf("month")
        .isBefore(ownGoal.endOf("month")) &&
      validStudyHours
    ) {
      return (
        <StudyToolCalculationInfoBox
          state="info_toomuch"
          message={`Jos opiskelet ${
            studyHours.studyHourValue
          } tuntia viikossa, valmistut arviolta ${calculateGraduationDateFormated}. Sehän on nopeammin kuin ajattelit (${ownGoal.format(
            "MM-yyyy"
          )})! Pieni jousto aikataulussa on kuitenkin hyvä juttu, koska elämässä aina sattuu ja tapahtuu.`}
        />
      );
    }

    /**
     * If calculated graduation date is same as student original goal
     * This can be +- couple study hours per week
     */
    if (
      localizedMoment()
        .add(totalTimeInDays, "day")
        .endOf("month")
        .isSame(ownGoal.endOf("month")) &&
      validStudyHours
    ) {
      return (
        <StudyToolCalculationInfoBox
          state="info_enough"
          message={`Erinomaista! Jos opiskelet tällä tahdilla, valmistuminen ${ownGoal.format(
            "MM-yyyy"
          )} on täysin mahdollista!`}
        />
      );
    }
  };

  /**
   * calculateApprovedCoursedOutsideHops
   */
  const calculateApprovedCoursedOutsideHops = () => {
    let numberOfMandatoryTransferedOutsideHops = 0;
    let numberOfOptionalTransferedOutsideHops = 0;

    for (const s of SKILL_AND_ART_SUBJECTS) {
      for (const tc of studyProgress.transferedList) {
        if (s === tc.subject) {
          if (
            tc.transferCreditMandatory !== null &&
            tc.transferCreditMandatory
          ) {
            numberOfMandatoryTransferedOutsideHops++;
          } else {
            numberOfOptionalTransferedOutsideHops++;
          }
        }
      }
    }
    for (const s of LANGUAGE_SUBJECTS) {
      for (const tc of studyProgress.transferedList) {
        if (s === tc.subject) {
          if (
            tc.transferCreditMandatory !== null &&
            tc.transferCreditMandatory
          ) {
            numberOfMandatoryTransferedOutsideHops++;
          } else {
            numberOfOptionalTransferedOutsideHops++;
          }
        }
      }
    }
    for (const s of OTHER_SUBJECT_OUTSIDE_HOPS) {
      for (const tc of studyProgress.transferedList) {
        if (s === tc.subject) {
          if (
            tc.transferCreditMandatory !== null &&
            tc.transferCreditMandatory
          ) {
            numberOfMandatoryTransferedOutsideHops++;
          } else {
            numberOfOptionalTransferedOutsideHops++;
          }
        }
      }
    }

    return {
      numberOfMandatoryTransferedOutsideHops,
      numberOfOptionalTransferedOutsideHops,
    };
  };

  /**
   * Calculates all approved related data
   *
   * @returns object containing number of all possible approved course hours and number of approved courses
   */
  const calculateAllTransferedData = () => {
    let totalMandatoryHoursTransfered = 0;
    let totalOptionalHoursTransfered = 0;

    let totalNumberMandatoryCoursesTransfered = 0;
    let totalNumberOptionalCoursesTransfered = 0;

    for (const sSubject of filteredSchoolCourseTable) {
      for (const aCourse of sSubject.availableCourses) {
        if (
          studyProgress.transferedList.find(
            (tCourse) =>
              sSubject.subjectCode === tCourse.subject &&
              tCourse.courseNumber === aCourse.courseNumber
          )
        ) {
          if (aCourse.mandatory) {
            totalMandatoryHoursTransfered += aCourse.length;
            totalNumberMandatoryCoursesTransfered++;
          } else {
            totalOptionalHoursTransfered += aCourse.length;
            totalNumberOptionalCoursesTransfered++;
          }
        }
      }
    }
    return {
      numberOfTotalMandatoryTransferedHours: totalMandatoryHoursTransfered,
      numberOfTotalOptionalTransferedHours: totalOptionalHoursTransfered,
      numberOfTotalMandatoryTransferedCourses:
        totalNumberMandatoryCoursesTransfered,
      numberOfTotalOptionalTransferedCourses:
        totalNumberOptionalCoursesTransfered,
    };
  };

  /**
   * calculateCompletedMandatoryHours
   *
   * @returns completed mandatory course hours
   */
  const calculateAllMandatoryData = () => {
    let totalHoursCompleted = 0;
    let totalCourseCompleted = 0;
    let totalNumberOfCourses = 0;
    let totalHoursToComplete = 0;

    for (const sSubject of filteredSchoolCourseTable) {
      let oneSubjectMandatoryHours = 0;

      for (const aCourse of sSubject.availableCourses) {
        /**
         * Skip non mandatory courses
         */
        if (!aCourse.mandatory) {
          continue;
        }
        totalHoursToComplete += aCourse.length;
        totalNumberOfCourses++;

        if (
          studyProgress.gradedList.find(
            (gCourse) =>
              sSubject.subjectCode === gCourse.subject &&
              gCourse.courseNumber === aCourse.courseNumber
          )
        ) {
          oneSubjectMandatoryHours += aCourse.length;
          totalCourseCompleted++;
        }
      }

      totalHoursCompleted += oneSubjectMandatoryHours;
    }
    return {
      numberOfMandatoryHoursCompleted: totalHoursCompleted,
      numberOfMandatoryCoursesCompleted: totalCourseCompleted,
      numberOfMandatoryCoursesInTotal: totalNumberOfCourses,
      numberOfMandatoryHoursInTotalToComplete: totalHoursToComplete,
    };
  };

  /**
   * calculates
   *
   * @returns number of completed optional course hours
   */
  const calculateAllOptionalData = () => {
    let totalHoursCompleted = 0;
    let totalCourseCompleted = 0;
    let totalNumberOfCourses = 0;

    for (const sSubject of filteredSchoolCourseTable) {
      let oneSubjectOptionalHours = 0;

      for (const aCourse of sSubject.availableCourses) {
        /**
         * Skip mandatory hours
         */
        if (aCourse.mandatory) {
          continue;
        }

        totalNumberOfCourses++;

        if (
          studyProgress.gradedList.find(
            (gItem) =>
              gItem.subject === sSubject.subjectCode &&
              gItem.courseNumber === aCourse.courseNumber
          )
        ) {
          oneSubjectOptionalHours += aCourse.length;
          totalCourseCompleted++;
        }
      }

      totalHoursCompleted += oneSubjectOptionalHours;
    }
    return {
      numberOfOptionalHoursCompleted: totalHoursCompleted,
      numberOfOptionalCoursesCompleted: totalCourseCompleted,
      numberOfOptionalCoursesInTotal: totalNumberOfCourses,
      numberOfOptionalSelectedHours: studyProgress.studentChoices.length * 28,
      numberOfOptionalSelectedCourses: studyProgress.studentChoices.length,
    };
  };

  /**
   * Gets total time in days
   *
   * @param totalHours total number of hours
   * @param hoursPerWeek hours per week. Student studying speed
   * @returns total time in days
   */
  const getTotalTimeInDays = (totalHours: number, hoursPerWeek: number) => {
    if (!hoursPerWeek || hoursPerWeek === 0) {
      return 0;
    }

    const totalDays = Math.round((totalHours / hoursPerWeek) * 7);
    const totalTimeValue = totalDays;

    return totalTimeValue;
  };

  /**
   * Shows time as readable text. Years + months
   *
   * @param nd number of days
   * @returns number of years + months
   */
  const showAsReadableTime = (nd: number) => {
    const localizedMoment = localize.getLocalizedMoment;
    const momentDuration = localize.duration;

    /**
     * Current date
     */
    const start = localizedMoment();
    /**
     * Calculated end date
     */
    const end = localizedMoment().add(nd, "day");
    /**
     * Difference of these two dates
     */
    const diff = end.diff(start);

    /**
     * Duration in years, months, weeks and days
     */
    const theDiffObject = {
      years: momentDuration(diff).years(),
      months: momentDuration(diff).months(),
      weeks: momentDuration(diff).weeks(),
      days: momentDuration(diff).days(),
    };

    const yearsDisplay =
      theDiffObject.years > 0 ? `${theDiffObject.years} v` : "";
    const monthsDisplay =
      theDiffObject.months > 0 ? `${theDiffObject.months} kk` : "";
    return `${yearsDisplay} ${monthsDisplay}`;
  };

  /**
   * Handles used hours per week change
   * @param e e
   */
  const handleUsedHoursPerWeekChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    studyHourHandlers.updateStudyHours(
      props.studentId,
      parseInt(e.currentTarget.value)
    );
  };

  // All needed data
  const {
    numberOfTotalMandatoryTransferedHours,
    numberOfTotalOptionalTransferedHours,
    numberOfTotalMandatoryTransferedCourses,
    numberOfTotalOptionalTransferedCourses,
  } = calculateAllTransferedData();

  const {
    numberOfMandatoryHoursCompleted,
    numberOfMandatoryCoursesCompleted,
    numberOfMandatoryCoursesInTotal,
    numberOfMandatoryHoursInTotalToComplete,
  } = calculateAllMandatoryData();

  const {
    numberOfOptionalCoursesCompleted,
    numberOfOptionalHoursCompleted,
    numberOfOptionalSelectedCourses,
  } = calculateAllOptionalData();

  const {
    numberOfMandatoryTransferedOutsideHops,
    numberOfOptionalTransferedOutsideHops,
  } = calculateApprovedCoursedOutsideHops();

  /**
   * CONSTANT value 46 - number of mandatory coursed needed
   */
  const neededOptionalStudies =
    NEEDED_STUDIES_IN_TOTAL - numberOfMandatoryCoursesInTotal;

  /**
   * Value depending of mandatory courses. One course is multiplited by 28
   */
  const neededOptionalStudyHours = neededOptionalStudies * 28;

  /**
   * Updated mandatory hours needed.
   * All mandatory needed hours minus following values:
   * - all completed mandatory hours
   * - all completed mandatory hours outside of hops (rare case)
   */
  const updatedNeededMandatoryHours =
    numberOfMandatoryHoursInTotalToComplete -
    numberOfMandatoryHoursCompleted -
    numberOfTotalMandatoryTransferedHours -
    numberOfMandatoryTransferedOutsideHops * 28;

  /**
   * Updated optional hours at needed.
   * All optional needed hours minus following values:
   * - all completed optional hours
   * - all completed optional hours outside of hops (rare case)
   */
  const updatedNeededOptionalHours =
    neededOptionalStudyHours -
    numberOfOptionalHoursCompleted -
    numberOfTotalOptionalTransferedHours -
    numberOfOptionalTransferedOutsideHops * 28;

  /**
   * Updated completed mandatory courses at the current moment.
   * All mandatory needed hours minus following values:
   * - all completed mandatory courses
   * - all completed mandatory courses outside of hops (rare case)
   */
  const updatedCompletedMandatoryCourses =
    numberOfMandatoryCoursesCompleted +
    numberOfTotalMandatoryTransferedCourses +
    numberOfMandatoryTransferedOutsideHops;

  /**
   * Updated completed optional courses at the current moment.
   * All optional needed hours minus following values:
   * - all completed optional courses
   * - all completed optional courses outside of hops (rare case)
   */
  const updatedCompletedOptionalCourses =
    numberOfOptionalCoursesCompleted +
    numberOfTotalOptionalTransferedCourses +
    numberOfOptionalTransferedOutsideHops;

  /**
   * Default is 0
   */
  let selectedHoursOverObligatoryAmount = 0;

  /**
   * ...If student has completed/transfered optional studies and
   * this combined with selected optional studies is more than needed
   * then with these two difference multiplied 28 we get actual hour value that overflows
   * student obligatory optional studies
   */
  if (
    numberOfOptionalSelectedCourses + updatedCompletedOptionalCourses >
    neededOptionalStudies
  ) {
    const diff =
      numberOfOptionalSelectedCourses +
      updatedCompletedOptionalCourses -
      neededOptionalStudies;

    selectedHoursOverObligatoryAmount = diff * 28;
  }

  /**
   * Combined hours. Includes mandatory + optional + selected overflowing hours
   */
  const hoursInTotalToComplete =
    updatedNeededMandatoryHours +
    updatedNeededOptionalHours +
    selectedHoursOverObligatoryAmount;

  /**
   * Total proggress of studies. Only take count number of completed mandatory and optional courses
   * IF there is optional courses completed more than required then using required amount in calculation
   */
  const proggressOfStudies =
    (updatedCompletedMandatoryCourses +
      (updatedCompletedOptionalCourses > neededOptionalStudies
        ? neededOptionalStudies
        : updatedCompletedOptionalCourses)) /
    (numberOfMandatoryCoursesInTotal + neededOptionalStudies);

  // Proggress indicator values
  const mandatoryCourseProggress =
    updatedCompletedMandatoryCourses / numberOfMandatoryCoursesInTotal;
  const optionalCourseProggress =
    updatedCompletedOptionalCourses / neededOptionalStudies;

  const isLoading = studyHours.isLoading || followUpData.isLoading;

  return (
    <>
      {!studyHours.isLoading && (
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="studyHourPerWeek"
              type="number"
              min={0}
              label="Kuinka monta tuntia ehdit opiskella viikossa?"
              onChange={handleUsedHoursPerWeekChange}
              value={studyHours.studyHourValue}
              className="hops__input"
              disabled={props.disabled}
            />
          </div>
        </div>
      )}

      {!isLoading && (
        <StudyToolOptionalStudiesInfoBox
          totalOptionalStudiesNeeded={neededOptionalStudies}
          totalOptionalStudiesCompleted={updatedCompletedOptionalCourses}
          selectedNumberOfOptional={studyProgress.studentChoices.length}
          graduationGoal={followUpData.followUp.graduationGoal}
        />
      )}

      {compareGraduationGoalToNeededForMandatoryStudies(hoursInTotalToComplete)}

      {props.showIndicators && (
        <div className="hops-container__info hops-container__info--activity-progressbar">
          <div className="hops-container__row hops-container__row--activity-progressbar">
            <h3 className="hops-container__subheader hops-container__subheader--activity-title">
              Opintojen eteneminen:
            </h3>
            <Dropdown
              openByHover
              content={
                <div className="hops-planning__activity-proggressbar-tooltip">
                  Opintojen etenemistä kuvaava palkki huomioi vain aikuisten
                  perusopetuksen päättövaiheen oppimäärään sisältyvän
                  kurssimäärän (46 kurssia). Jos olet suorittanut
                  vapaaehtoisesti enemmän valinnaisia opintoja, niitä ei
                  huomioida etenemistä kuvaavassa palkissa.
                </div>
              }
            >
              <div tabIndex={0}>
                <ProgressBarLine
                  containerClassName="hops-container__activity-progressbar hops-container__activity-progressbar--line"
                  options={{
                    strokeWidth: 1,
                    duration: 1000,
                    color: "#24c118",
                    trailColor: "#ffffff",
                    trailWidth: 1,
                    svgStyle: {
                      width: "100%",
                      height: "20px",
                      borderRadius: "10px",
                    },
                    initialAnimate: true,
                    text: {
                      style: {
                        color: "#ffffff",
                        position: "absolute",
                        left: 0,
                      },
                      className:
                        "hops-container__activity-label hops-container__activity-label--progressbar-line",
                    },
                  }}
                  text={`${Math.round(proggressOfStudies * 100)}%`}
                  progress={proggressOfStudies > 1 ? 1 : proggressOfStudies}
                />
              </div>
            </Dropdown>
          </div>

          <div className="hops-container__row hops-container__row--activity-progressbar">
            <div className="hops__form-element-container hops__form-element-container--progressbar">
              <h3 className="hops-container__subheader hops-container__subheader--activity-title">
                Suoritetut pakolliset opinnot:
              </h3>
              <ProgressBarCircle
                containerClassName="hops-container__activity-progressbar hops-container__activity-progressbar--circle"
                options={{
                  strokeWidth: 13,
                  duration: 1000,
                  color: "#24c118",
                  trailColor: "#ffffff",
                  easing: "easeInOut",
                  trailWidth: 15,
                  initialAnimate: true,
                  svgStyle: {
                    flexBasis: "72px",
                    flexGrow: "0",
                    flexShrink: "0",
                    height: "72px",
                    margin: "4px",
                  },
                  text: {
                    style: null,
                    className:
                      "hops-container__activity-label hops-container__activity-label--progressbar-circle",
                  },
                }}
                text={`${updatedCompletedMandatoryCourses} / ${numberOfMandatoryCoursesInTotal}`}
                progress={
                  mandatoryCourseProggress > 1 ? 1 : mandatoryCourseProggress
                }
              />
            </div>

            <div className="hops__form-element-container hops__form-element-container--progressbar">
              <h3 className="hops-container__subheader hops-container__subheader--activity-title">
                Suoritetut valinnaisopinnot:
              </h3>

              <ProgressBarCircle
                containerClassName="hops-container__activity-progressbar hops-container__activity-progressbar--circle"
                options={{
                  strokeWidth: 13,
                  duration: 1000,
                  color: "#24c118",
                  trailColor: "#ffffff",
                  easing: "easeInOut",
                  trailWidth: 15,
                  svgStyle: {
                    flexBasis: "72px",
                    flexGrow: "0",
                    flexShrink: "0",
                    height: "72px",
                    margin: "4px",
                  },
                  text: {
                    style: null,
                    className:
                      "hops-container__activity-label hops-container__activity-label--progressbar-circle",
                  },
                }}
                text={`
                    ${updatedCompletedOptionalCourses} / ${neededOptionalStudies}`}
                progress={
                  optionalCourseProggress > 1 ? 1 : optionalCourseProggress
                }
              />
            </div>

            <div className="hops__form-element-container hops__form-element-container--progressbar">
              <h3 className="hops-container__subheader hops-container__subheader--activity-title">
                Arvioitu opintoaika (kk):
              </h3>

              <Dropdown
                openByHover
                content={
                  <div className="hops-planning__activity-proggressbar-tooltip">
                    Arvioitu opintoaika kuvaa suuntaa antavasti aikaa, joka
                    sinulla menee opintojen suorittamiseen tämän hetkisen
                    tilanteen mukaan. Opintoaika lasketaan oletuksena aikuisten
                    perusopetuksen päättövaiheen oppimäärän eli 46 kurssin
                    mukaan. Yhden kurssin laajuus on 28 tuntia. Opintoajan
                    määrittelyssä huomioidaan oma arviosi siitä, kuinka paljon
                    ehdit opiskella viikoittain. Jos valitset enemmän
                    valinnaisopintoja kuin pakollinen kurssimäärä edellyttää,
                    opintoaikasi todennäköisesti pitenee.
                  </div>
                }
              >
                <div className="hops-container__activity-progressbar hops-container__activity-progressbar--total-study-time">
                  <div className="hops-container__activity-progressbar-icon icon-clock1"></div>
                  <div className="hops-container__activity-label">
                    {showAsReadableTime(
                      getTotalTimeInDays(
                        hoursInTotalToComplete,
                        studyHours.studyHourValue
                      )
                    )}
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      )}

      <div className="hops-container__row">
        <StudyProgress
          studyProgrammeName="Nettiperuskoulu"
          curriculumName="OPS 2018"
          editMode={props.editMode}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(HopsPlanningTool);
