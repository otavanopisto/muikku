import * as React from "react";
import { HopsPlanningStudies, SchoolSubject } from "../../../../@types/shared";
import { TextField } from "./text-field";
import Dropdown from "../../../general/dropdown";
import { HopsUser, NEEDED_STUDIES_IN_TOTAL } from ".";
import CourseList from "./hops-course-list";
import { schoolCourseTable } from "../../../../mock/mock-data";
import StudyToolCalculationInfoBox from "./study-tool-calculation-info-box";
import { useStudentActivity } from "./hooks/useStudentActivity";
import { StateType } from "reducers";
import { connect, Dispatch } from "react-redux";
import { WebsocketStateType } from "../../../../reducers/util/websocket";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { useFollowUpGoal } from "./hooks/useFollowUp";
import CourseTable from "./hops-course-table";
import StudyToolOptionalStudiesInfoBox from "./study-tool-optional-studiess-info-box";
import { useStudentChoices } from "./hooks/useStudentChoices";
import { useStudentStudyHour } from "./hooks/useStudentStudyHours";
import {
  AlternativeStudyObject,
  useStudentAlternativeOptions,
} from "./hooks/useStudentAlternativeOptions";
import { i18nType } from "~/reducers/base/i18n";
import { AnyActionType } from "~/actions";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarCircle = require("react-progress-bar.js").Circle;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarLine = require("react-progress-bar.js").Line;

/**
 * StudyToolProps
 */
interface StudyToolProps {
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
  studies: HopsPlanningStudies;
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
const StudyTool: React.FC<StudyToolProps> = (props) => {
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
   * @returns JSX.Element
   */
  const compareGraduationGoalToNeededForMandatoryStudies = () => {
    // All needed hours data needed
    const allApprovedHours = calculateAllApprovedData().numberOfHoursCompleted;
    const optionalHoursCompleted =
      calculateAllOptionalData().numberOfHoursCompleted;
    const mandatoryHoursCompleted =
      calculateAllMandatoryData().numberOfhoursCompleted;

    const mandatoryHoursNeeded =
      calculateAllMandatoryData().numberOfHoursInTotalToComplete;

    const optionalHoursSelected =
      calculateAllOptionalData().numberOfSelectedHours;

    /**
     * Localized moment initialzied to variable
     */
    const localizedMoment = props.i18n.time.getLocalizedMoment;

    /**
     * Mandatory hours minus completed mandatory hours
     */
    const updatedMandatoryHoursNeeded =
      mandatoryHoursNeeded - mandatoryHoursCompleted;

    let selectedOptionalHours = 0;

    if (studentChoices.studentChoices.length > 0) {
      selectedOptionalHours = optionalHoursSelected - optionalHoursCompleted;
    }

    const hoursInTotalToComplete =
      updatedMandatoryHoursNeeded + selectedOptionalHours - allApprovedHours;

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
   * Calculates all approved related data
   *
   * @returns object containing number of all possible approved course hours and number of approved courses
   */
  const calculateAllApprovedData = () => {
    let totalHoursApproved = 0;
    let totalCourseApproved = 0;

    for (const sSubject of filteredSchoolCourseTable) {
      let oneSubjectHours = 0;

      for (const aCourse of sSubject.availableCourses) {
        if (
          studentActivity &&
          studentActivity.transferedList.find(
            (tCourse) =>
              sSubject.subjectCode === tCourse.subject &&
              tCourse.courseNumber === aCourse.courseNumber
          )
        ) {
          oneSubjectHours += aCourse.length;
          totalCourseApproved++;
        }
      }

      totalHoursApproved += oneSubjectHours;
    }
    return {
      numberOfHoursCompleted: totalHoursApproved,
      numberOfCoursesCompleted: totalCourseApproved,
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
      numberOfhoursCompleted: totalHoursCompleted,
      numberOfCoursesCompleted: totalCourseCompleted,
      numberOfCoursesInTotal: totalNumberOfCourses,
      numberOfHoursInTotalToComplete: totalHoursToComplete,
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
    let totalHoursSelected = 0;

    for (const sSubject of filteredSchoolCourseTable) {
      let oneSubjectOptionalHours = 0;
      let oneSubjectOptionalHoursSelected = 0;

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

        if (
          studentChoices.studentChoices &&
          studentChoices.studentChoices.find(
            (sItem) =>
              sItem.subject === sSubject.subjectCode &&
              sItem.courseNumber === aCourse.courseNumber
          )
        ) {
          oneSubjectOptionalHoursSelected += aCourse.length;
        }
      }

      totalHoursCompleted += oneSubjectOptionalHours;
      totalHoursSelected += oneSubjectOptionalHoursSelected;
    }
    return {
      numberOfHoursCompleted: totalHoursCompleted,
      numberOfCoursesCompleted: totalCourseCompleted,
      numberOfCoursesInTotal: totalNumberOfCourses,
      numberOfSelectedHours: totalHoursSelected,
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
  const allApprovedData = calculateAllApprovedData();
  const allMandatoryData = calculateAllMandatoryData();
  const allOptionalData = calculateAllOptionalData();

  // All complete course data
  const numberOfCompletedMandatoryCourses =
    allMandatoryData.numberOfCoursesCompleted;
  const numberOfCompletedOptionalCourses =
    allOptionalData.numberOfCoursesCompleted;

  // All complete hours data
  const numberOfMandatoryHoursCompleted =
    allMandatoryData.numberOfhoursCompleted;
  const numberOfOptionalHoursCompleted =
    allOptionalData.numberOfCoursesCompleted;
  const numberOfApprovedHoursCompleted = allApprovedData.numberOfHoursCompleted;

  const numberOfTotalSelectedOptionalHours =
    allOptionalData.numberOfSelectedHours;

  const needMandatoryCoursesInTotal = allMandatoryData.numberOfCoursesInTotal;

  /**
   * number of mandatory hours in total needed
   */
  const neededMandatoryHours = allMandatoryData.numberOfHoursInTotalToComplete;

  /**
   * Updated mandatory hours at the current moment. All mandatory needed hours - all completed mandatory hours
   */
  const updatedNeededMandatoryHours =
    neededMandatoryHours - numberOfMandatoryHoursCompleted;

  const neededOptionalStudies =
    NEEDED_STUDIES_IN_TOTAL - needMandatoryCoursesInTotal;

  /**
   * Selected optional hours is default 0
   * If there is optional selection, then calculate selected optional hours and substract from it
   * all completed ooptional hours
   */
  let selectedOptionalHours = 0;

  if (studentChoices.studentChoices.length > 0) {
    selectedOptionalHours =
      numberOfTotalSelectedOptionalHours - numberOfOptionalHoursCompleted;
  }

  const hoursInTotalToComplete =
    updatedNeededMandatoryHours +
    selectedOptionalHours -
    numberOfApprovedHoursCompleted;

  /**
   * Time in days to study calculated from hours to complete and hours/week
   */
  const totalTimeInDays = getTotalTimeInDays(
    hoursInTotalToComplete,
    studyHours.studyHourValue
  );

  /**
   * By default optional studies over required amount is zero
   * and is only altered if student choises go up to that
   */
  let optionalStudiesOverRequiredAmount = 0;

  if (
    studentChoices.studentChoices &&
    studentChoices.studentChoices.length > neededOptionalStudies
  ) {
    optionalStudiesOverRequiredAmount = studentChoices.studentChoices.length;
  }

  /**
   * Total proggress of studies
   */
  let proggressOfStudies =
    (numberOfCompletedMandatoryCourses + numberOfCompletedOptionalCourses) /
    (needMandatoryCoursesInTotal + neededOptionalStudies);

  if (numberOfOptionalHoursCompleted > neededOptionalStudies) {
    proggressOfStudies =
      (numberOfCompletedMandatoryCourses + neededOptionalStudies) /
      (neededOptionalStudies + needMandatoryCoursesInTotal);
  }

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

      {!studentActivity.isLoading && !studentChoices.isLoading && (
        <StudyToolOptionalStudiesInfoBox
          needMandatoryStudies={needMandatoryCoursesInTotal}
          selectedNumberOfOptional={studentChoices.studentChoices.length}
          graduationGoal={followUpData.followUp.graduationGoal}
        />
      )}

      {!studentActivity.isLoading &&
        !studentChoices.isLoading &&
        studentChoices.studentChoices &&
        studentChoices.studentChoices.length >= neededOptionalStudies && (
          <>{compareGraduationGoalToNeededForMandatoryStudies()}</>
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
                text={`${numberOfCompletedMandatoryCourses} / ${needMandatoryCoursesInTotal}`}
                progress={
                  numberOfCompletedMandatoryCourses /
                  needMandatoryCoursesInTotal
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
                    ${numberOfCompletedOptionalCourses}
                    /
                    ${NEEDED_STUDIES_IN_TOTAL - needMandatoryCoursesInTotal} ${
                  optionalStudiesOverRequiredAmount > 0
                    ? `(${optionalStudiesOverRequiredAmount})`
                    : ""
                }`}
                progress={
                  numberOfCompletedOptionalCourses /
                  (NEEDED_STUDIES_IN_TOTAL - needMandatoryCoursesInTotal)
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
                text={`${showAsReadableTime(totalTimeInDays)}`}
              />
            </div>
          </div>
        </div>
      )}

      <div className="hops-container__row">
        <div className="hops__form-element-container hops__form-element-container--pad__upforwards">
          {studentActivity.isLoading || studentChoices.isLoading ? (
            <div className="loader-empty" />
          ) : (
            <div className="hops-container__table-container">
              <CourseTable
                disabled={props.disabled}
                studentId={props.studentId}
                user={props.user}
                superVisorModifies={props.superVisorModifies}
                ethicsSelected={studyOptions.options.religionAsEthics}
                finnishAsSecondLanguage={studyOptions.options.finnishAsLanguage}
                suggestedNextList={studentActivity.suggestedNextList}
                suggestedOptionalList={studentActivity.suggestedOptionalList}
                onGoingList={studentActivity.onGoingList}
                gradedList={studentActivity.gradedList}
                transferedList={studentActivity.transferedList}
                studentChoiceList={studentChoices.studentChoices}
                updateSuggestion={studentActivityHandlers.updateSuggestion}
                updateStudentChoice={studentChoiceHandlers.updateStudentChoice}
              />
            </div>
          )}
        </div>

        <div className="hops__form-element-container hops__form-element-container--mobile">
          {studentActivity.isLoading || studentChoices.isLoading ? (
            <div className="loader-empty" />
          ) : (
            <CourseList
              disabled={props.disabled}
              user={props.user}
              studentId={props.studentId}
              ethicsSelected={studyOptions.options.religionAsEthics}
              finnishAsSecondLanguage={studyOptions.options.finnishAsLanguage}
              suggestedNextList={studentActivity.suggestedNextList}
              suggestedOptionalList={studentActivity.suggestedOptionalList}
              onGoingList={studentActivity.onGoingList}
              gradedList={studentActivity.gradedList}
              transferedList={studentActivity.transferedList}
              studentChoiceList={studentChoices.studentChoices}
              updateStudentChoice={studentChoiceHandlers.updateStudentChoice}
              updateSuggestion={studentActivityHandlers.updateSuggestion}
            />
          )}
        </div>
      </div>

      <div className="hops-container__indicator-descriptions">
        <div className="hops-container__course-mandatory">
          <div className="hops-container__course-mandatory-indicator"></div>
          <p>Pakollinen</p>
        </div>
        <div className="hops-container__course-optional">
          <div className="hops-container__course-optional-indicator"></div>
          <p>(*)-Valinnainen</p>
        </div>
        <div className="hops-container__course-approval">
          <div className="hops-container__course-approval-indicator"></div>
          <p>Hyväksiluettu</p>
        </div>
        <div className="hops-container__course-completed">
          <div className="hops-container__course-completed-indicator"></div>
          <p>Suoritettu</p>
        </div>
        <div className="hops-container__course-inprogress">
          <div className="hops-container__course-inprogress-indicator"></div>
          <p>Kesken</p>
        </div>
        <div className="hops-container__course-suggested">
          <div className="hops-container__course-suggested-indicator"></div>
          <p>Ohjaajan ehdottama</p>
        </div>
        <div className="hops-container__course-selected">
          <div className="hops-container__course-selected-indicator"></div>
          <p>Valittu</p>
        </div>
      </div>
    </>
  );
};

/**
 * Filters special subjects away depending options selected by student
 * or loaded from pyramus
 *
 * @param schoolCourseTable intial table that is altered depending options
 * @param options options for special subjects
 * @returns altered school course table with correct special subject included
 */
const filterSpecialSubjects = (
  schoolCourseTable: SchoolSubject[],
  options: AlternativeStudyObject
) => {
  let alteredShoolCourseTable = schoolCourseTable;

  if (options.finnishAsLanguage) {
    alteredShoolCourseTable = alteredShoolCourseTable.filter(
      (sSubject) => sSubject.subjectCode !== "äi"
    );
  }
  if (!options.finnishAsLanguage) {
    alteredShoolCourseTable = alteredShoolCourseTable.filter(
      (sSubject) => sSubject.subjectCode !== "s2"
    );
  }
  if (options.religionAsEthics) {
    alteredShoolCourseTable = alteredShoolCourseTable.filter(
      (sSubject) => sSubject.subjectCode !== "ua"
    );
  }
  if (!options.religionAsEthics) {
    alteredShoolCourseTable = alteredShoolCourseTable.filter(
      (sSubject) => sSubject.subjectCode !== "ea"
    );
  }
  return alteredShoolCourseTable;
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

export default connect(mapStateToProps, mapDispatchToProps)(StudyTool);
