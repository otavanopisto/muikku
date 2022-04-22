import * as React from "react";
import { TextField } from "./text-field";
import { HopsUser, NEEDED_STUDIES_IN_TOTAL } from ".";
import { schoolCourseTable } from "../../../mock/mock-data";
import StudyToolCalculationInfoBox from "./study-tool-calculation-info-box";
import {
  LANGUAGE_SUBJECTS,
  OTHER_SUBJECT_OUTSIDE_HOPS,
  SKILL_AND_ART_SUBJECTS,
  useStudentActivity,
} from "../../../hooks/useStudentActivity";
import { StateType } from "reducers";
import { connect, Dispatch } from "react-redux";
import { WebsocketStateType } from "../../../reducers/util/websocket";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { useFollowUpGoal } from "./hooks/useFollowUp";
import StudyToolOptionalStudiesInfoBox from "./study-tool-optional-studiess-info-box";
import { useStudentStudyHour } from "./hooks/useStudentStudyHours";
import { i18nType } from "~/reducers/base/i18n";
import { AnyActionType } from "~/actions";
import { useStudentChoices } from "~/hooks/useStudentChoices";
import HopsCourseList from "~/components/general/hops-compulsory-education-wizard/hops-course-list";
import HopsCourseTable from "~/components/general/hops-compulsory-education-wizard/hops-course-table";
import { useStudentAlternativeOptions } from "~/hooks/useStudentAlternativeOptions";
import { filterSpecialSubjects } from "~/helper-functions/shared";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarCircle = require("react-progress-bar.js").Circle;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarLine = require("react-progress-bar.js").Line;

/**
 * StudyToolProps
 */
interface HopsPlanningToolProps {
  i18n: i18nType;
  user: HopsUser;
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
  superVisorModifies: boolean;
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

  const { studentActivity, ...studentActivityHandlers } = useStudentActivity(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const { studentChoices, ...studentChoiceHandlers } = useStudentChoices(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const { studyHours, ...studyHourHandlers } = useStudentStudyHour(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const { studyOptions } = useStudentAlternativeOptions(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const { followUpData } = useFollowUpGoal(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const filteredSchoolCourseTable = filterSpecialSubjects(
    schoolCourseTable,
    studyOptions.options
  );

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
    const localizedMoment = props.i18n.time.getLocalizedMoment;

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
      calculateGraduationDate.isAfter(localizedMoment(props.studyTimeEnd))
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

    if (followUpData.followUp.graduationGoal === null) {
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
        .isAfter(ownGoal.endOf("month"))
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
        .isBefore(ownGoal.endOf("month"))
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
        .isSame(ownGoal.endOf("month"))
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

    if (studentActivity) {
      for (const s of SKILL_AND_ART_SUBJECTS) {
        for (const tc of studentActivity.transferedList) {
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
        for (const tc of studentActivity.transferedList) {
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
        for (const tc of studentActivity.transferedList) {
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
          studentActivity &&
          studentActivity.transferedList.find(
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
          studentActivity.gradedList &&
          studentActivity.gradedList.find(
            (gCourse) =>
              sSubject.subjectCode === gCourse.subject &&
              gCourse.courseNumber === aCourse.courseNumber
          )
        ) {
          oneSubjectMandatoryHours += aCourse.length;
          totalCourseCompleted++;
        }
        if (
          studentActivity.transferedList &&
          studentActivity.transferedList.find(
            (tCourse) =>
              sSubject.subjectCode === tCourse.subject &&
              tCourse.courseNumber === aCourse.courseNumber
          )
        ) {
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
          studentActivity.gradedList &&
          studentActivity.gradedList.find(
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
      numberOfOptionalSelectedHours: studentChoices.studentChoices
        ? studentChoices.studentChoices.length * 28
        : 0,
      numberOfOptionalSelectedCourses: studentChoices.studentChoices
        ? studentChoices.studentChoices.length
        : 0,
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
    const localizedMoment = props.i18n.time.getLocalizedMoment;
    const momentDuration = props.i18n.time.duration;

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

  const isLoading =
    studyHours.isLoading ||
    studentActivity.isLoading ||
    studentChoices.isLoading ||
    studyOptions.isLoading ||
    followUpData.isLoading;

  const showTimeComparison =
    !isLoading &&
    numberOfOptionalSelectedCourses !== 0 &&
    (updatedCompletedOptionalCourses >= neededOptionalStudies ||
      numberOfOptionalSelectedCourses + updatedCompletedOptionalCourses >=
        neededOptionalStudies);

  return (
    <>
      {!studyHours.isLoading && (
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              type="number"
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
          selectedNumberOfOptional={studentChoices.studentChoices.length}
          graduationGoal={followUpData.followUp.graduationGoal}
        />
      )}

      {showTimeComparison &&
        compareGraduationGoalToNeededForMandatoryStudies(
          hoursInTotalToComplete
        )}

      {props.showIndicators && (
        <div className="hops-container__info hops-container__info--activity-progressbar">
          <div className="hops-container__row hops-container__row--activity-progressbar">
            <h3 className="hops-container__subheader hops-container__subheader--activity-title">
              Opintojen eteneminen:
            </h3>
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
              progress={proggressOfStudies}
            />
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
                    flexBasis: "80px",
                    flexGrow: "0",
                    flexShrink: "0",
                    height: "80px",
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
                    flexBasis: "80px",
                    flexGrow: "0",
                    flexShrink: "0",
                    height: "80px",
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
                    flexBasis: "80px",
                    flexGrow: "0",
                    flexShrink: "0",
                    height: "80px",
                  },
                  text: {
                    style: null,
                    className:
                      "hops-container__activity-label hops-container__activity-label--progressbar-circle",
                  },
                }}
                text={`${showAsReadableTime(
                  getTotalTimeInDays(
                    hoursInTotalToComplete,
                    studyHours.studyHourValue
                  )
                )}`}
              />
            </div>
          </div>
        </div>
      )}

      <div className="hops-container__row">
        <div className="hops__form-element-container hops__form-element-container--pad-upforwards">
          {isLoading ? (
            <div className="loader-empty" />
          ) : (
            <div className="hops-container__table-container">
              <HopsCourseTable
                matrix={filteredSchoolCourseTable}
                useCase="hops-planing"
                disabled={props.disabled}
                studentId={props.studentId}
                user={props.user}
                superVisorModifies={props.superVisorModifies}
                suggestedNextList={studentActivity.suggestedNextList}
                suggestedOptionalList={studentActivity.suggestedOptionalList}
                onGoingList={studentActivity.onGoingList}
                gradedList={studentActivity.gradedList}
                transferedList={studentActivity.transferedList}
                skillsAndArt={studentActivity.skillsAndArt}
                otherSubjects={studentActivity.otherSubjects}
                otherLanguageSubjects={studentActivity.otherLanguageSubjects}
                studentChoiceList={studentChoices.studentChoices}
                updateSuggestion={studentActivityHandlers.updateSuggestion}
                updateStudentChoice={studentChoiceHandlers.updateStudentChoice}
              />
            </div>
          )}
        </div>

        <div className="hops__form-element-container hops__form-element-container--mobile">
          {isLoading ? (
            <div className="loader-empty" />
          ) : (
            <HopsCourseList
              matrix={filteredSchoolCourseTable}
              useCase="hops-planing"
              disabled={props.disabled}
              user={props.user}
              studentId={props.studentId}
              superVisorModifies={props.superVisorModifies}
              suggestedNextList={studentActivity.suggestedNextList}
              suggestedOptionalList={studentActivity.suggestedOptionalList}
              onGoingList={studentActivity.onGoingList}
              gradedList={studentActivity.gradedList}
              transferedList={studentActivity.transferedList}
              skillsAndArt={studentActivity.skillsAndArt}
              otherSubjects={studentActivity.otherSubjects}
              otherLanguageSubjects={studentActivity.otherLanguageSubjects}
              studentChoiceList={studentChoices.studentChoices}
              updateStudentChoice={studentChoiceHandlers.updateStudentChoice}
              updateSuggestion={studentActivityHandlers.updateSuggestion}
            />
          )}
        </div>
      </div>

      <div className="hops-container__study-tool-indicators">
        <div className="hops-container__study-tool-indicator-container">
          <div className="hops-container__indicator-item hops-container__indicator-item--mandatory"></div>
          <div className="hops-container__indicator-item-label">Pakollinen</div>
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
          <div className="hops-container__indicator-item-label">Suoritettu</div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--inprogress"></div>
          <div className="hops-container__indicator-item-label">Kesken</div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--selected"></div>
          <div className="hops-container__indicator-item-label">Valittu</div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--suggested"></div>
          <div className="hops-container__indicator-item-label">
            Ohjaajan ehdottama
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--next"></div>
          <div className="hops-container__indicator-item-label">
            Ohjaajan seuraavaksi ehdottama
          </div>
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
    i18n: state.i18n,
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
