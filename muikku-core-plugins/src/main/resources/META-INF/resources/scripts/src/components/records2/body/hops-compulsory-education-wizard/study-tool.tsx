import * as React from "react";
import { HopsPlanningStudies } from "../../../../@types/shared";
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
import { useStudentAlternativeOptions } from "./hooks/useStudentAlternativeOptions";
import { i18nType } from "~/reducers/base/i18n";

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
  studentId: string;
  disabled: boolean;
  showIndicators?: boolean;
  superVisorModifies: boolean;
  studies: HopsPlanningStudies;
  studyTimeEnd: string | null;
  websocketState: WebsocketStateType;
  displayNotification: DisplayNotificationTriggerType;
  onStudiesPlanningChange: (studies: HopsPlanningStudies) => void;
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

  const { studyOptions, ...studyOptionHandlers } = useStudentAlternativeOptions(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  const { followUpData, ...followUpHandlers } = useFollowUpGoal(
    props.studentId,
    props.websocketState,
    props.displayNotification
  );

  /**
   * compareGraduationGoalToNeededForMandatoryStudies
   * Compared graduation goal to need mandatory studies and shows indicator/message
   * if studieplan is good enough
   * @returns JSX.Element
   */
  const compareGraduationGoalToNeededForMandatoryStudies = () => {
    // All needed hours data needed
    const allApprovedHours = calculateAllApprovedHours();
    const optionalHoursCompleted = calculateCompletedOptionalHours();
    const mandatoryHoursCompleted = calculateCompletedMandatoryHours();
    const mandatoryHoursNeeded = calculateMandatoryHoursNeeded();

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
      selectedOptionalHours =
        calculateSelectedOptionalHours() - optionalHoursCompleted;
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
      .format("l");

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
          ).format(
            "l"
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
            "l"
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
            "l"
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
            "l"
          )} on täysin mahdollista!`}
        />
      );
    }
  };

  /**
   * calculateSelectedOptionalHours
   * @returns selected optional hours
   */
  const calculateSelectedOptionalHours = (): number => {
    let hoursSelected = 0;

    if (studentChoices.studentChoices.length > 0) {
      for (const sSubject of schoolCourseTable) {
        let oneSubjectHours = 0;

        for (const aCourse of sSubject.availableCourses) {
          if (
            studentChoices.studentChoices.find(
              (sItem) =>
                sItem.subject === sSubject.subjectCode &&
                sItem.courseNumber === aCourse.courseNumber
            )
          ) {
            oneSubjectHours += aCourse.length;
          }
        }

        hoursSelected += oneSubjectHours;
      }
    }

    return hoursSelected;
  };

  /**
   * calculateMandatoryHoursNeeded
   * @returns number of mandatory hours needed to complete all mandatory courses
   */
  const calculateMandatoryHoursNeeded = (): number => {
    let hoursNeeded = 0;

    for (const sSubject of schoolCourseTable) {
      let oneSubjectMandatoryHours = 0;

      /**
       * Taking account of options for "special" subjects
       */
      if (
        studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "ai"
      ) {
        continue;
      }
      if (
        !studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (
        studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ua"
      ) {
        continue;
      }
      if (
        !studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ea"
      ) {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        if (!aCourse.mandatory) {
          continue;
        }

        oneSubjectMandatoryHours += aCourse.length;
      }

      hoursNeeded += oneSubjectMandatoryHours;
    }
    return hoursNeeded;
  };

  /**
   * calculateNumberOfCompletedMandatoryCourses
   * @returns number of completed mandatory courses
   */
  const calculateNumberOfCompletedMandatoryCourses = () => {
    let completed = 0;

    for (const sSubject of schoolCourseTable) {
      /**
       * Taking account of options for "special" subjects
       */
      if (
        studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "ai"
      ) {
        continue;
      }
      if (
        !studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (
        studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ua"
      ) {
        continue;
      }
      if (
        !studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ea"
      ) {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        if (!aCourse.mandatory) {
          continue;
        }

        if (studentActivity.gradedList || studentActivity.transferedList) {
          if (
            studentActivity.gradedList &&
            studentActivity.gradedList.find(
              (gCourse) =>
                sSubject.subjectCode === gCourse.subject &&
                gCourse.courseNumber === aCourse.courseNumber
            )
          ) {
            completed++;
          }
          if (
            studentActivity.transferedList &&
            studentActivity.transferedList.find(
              (tCourse) =>
                sSubject.subjectCode === tCourse.subject &&
                tCourse.courseNumber === aCourse.courseNumber
            )
          ) {
            completed++;
          }
        }
      }
    }

    return completed;
  };

  /**
   * calculateAllApprovedHours
   * @returns number of all possible approved course hours
   */
  const calculateAllApprovedHours = () => {
    let hoursCompleted = 0;

    for (const sSubject of schoolCourseTable) {
      let oneSubjectHours = 0;

      /**
       * Taking account of options for "special" subjects
       */
      if (
        studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "ai"
      ) {
        continue;
      }
      if (
        !studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (
        studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ua"
      ) {
        continue;
      }
      if (
        !studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ea"
      ) {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        if (
          studentActivity &&
          studentActivity.transferedList.findIndex(
            (tCourse) =>
              sSubject.subjectCode === tCourse.subject &&
              tCourse.courseNumber === aCourse.courseNumber
          ) !== -1
        ) {
          oneSubjectHours += aCourse.length;
        }
      }

      hoursCompleted += oneSubjectHours;
    }
    return hoursCompleted;
  };

  /**
   * calculateNumberOfCompletedOptionalyCourses
   * @returns number of completed optional courses
   */
  const calculateNumberOfCompletedOptionalyCourses = () => {
    let completed = 0;

    for (const sSubject of schoolCourseTable) {
      /**
       * Taking account of options for "special" subjects
       */
      if (
        studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "ai"
      ) {
        continue;
      }
      if (
        !studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (
        studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ua"
      ) {
        continue;
      }
      if (
        !studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ea"
      ) {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        /**
         * Skip mandatory courses
         */
        if (aCourse.mandatory) {
          continue;
        }

        /**
         * Check if there is completed optional courses
         */
        if (studentActivity.gradedList) {
          if (
            studentActivity.gradedList.find(
              (gCourse) =>
                sSubject.subjectCode === gCourse.subject &&
                gCourse.courseNumber === aCourse.courseNumber
            )
          ) {
            completed++;
          }
        }
      }
    }

    return completed;
  };

  /**
   * calculateCompletedMandatoryHours
   * @returns completed mandatory course hours
   */
  const calculateCompletedMandatoryHours = () => {
    let hoursCompleted = 0;

    for (const sSubject of schoolCourseTable) {
      let oneSubjectMandatoryHours = 0;

      /**
       * Taking account of options for "special" subjects
       */
      if (
        studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "ai"
      ) {
        continue;
      }
      if (
        !studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (
        studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ua"
      ) {
        continue;
      }
      if (
        !studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ea"
      ) {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        /**
         * Skip non mandatory courses
         */
        if (!aCourse.mandatory) {
          continue;
        }

        if (
          studentActivity.gradedList &&
          studentActivity.gradedList.findIndex(
            (gItem) =>
              gItem.subject === sSubject.subjectCode &&
              gItem.courseNumber === aCourse.courseNumber
          ) !== -1
        ) {
          oneSubjectMandatoryHours += aCourse.length;
        }
      }

      hoursCompleted += oneSubjectMandatoryHours;
    }
    return hoursCompleted;
  };

  /**
   * calculateCompletedOptionalHours
   * @returns number of completed optional course hours
   */
  const calculateCompletedOptionalHours = () => {
    let hoursCompleted = 0;

    for (const sSubject of schoolCourseTable) {
      let oneSubjectOptionalHours = 0;

      /**
       * Taking account of options for "special" subjects
       */
      if (
        studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "ai"
      ) {
        continue;
      }
      if (
        !studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (
        studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ua"
      ) {
        continue;
      }
      if (
        !studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ea"
      ) {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        /**
         * Skip mandatory hours
         */
        if (aCourse.mandatory) {
          continue;
        }

        if (
          studentActivity.gradedList &&
          studentActivity.gradedList.findIndex(
            (gItem) =>
              gItem.subject === sSubject.subjectCode &&
              gItem.courseNumber === aCourse.courseNumber
          ) !== -1
        ) {
          oneSubjectOptionalHours += aCourse.length;
        }
      }

      hoursCompleted += oneSubjectOptionalHours;
    }
    return hoursCompleted;
  };

  /**
   * calculateMaxNumberOfMandatoryCourses
   * Calculates max number of mandatory courses
   * Takes account of possible "special" subjects
   * @returns number of mandatory courses
   */
  const calculateMaxNumberOfMandatoryCourses = () => {
    let amount = 0;

    for (const sSubject of schoolCourseTable) {
      /**
       * Taking account of options for "special" subjects
       */
      if (
        studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "ai"
      ) {
        continue;
      }
      if (
        !studyOptions.options.finnishAsLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (
        studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ua"
      ) {
        continue;
      }
      if (
        !studyOptions.options.religionAsEthics &&
        sSubject.subjectCode === "ea"
      ) {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        /**
         * Skip non mandatory courses
         */
        if (!aCourse.mandatory) {
          continue;
        }

        amount++;
      }
    }

    return amount;
  };

  /**
   * getTotalTime
   * @param totalHours totalHours
   * @param hoursPerWeek hoursPerWeek
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
    const years = Math.floor(nd / 365);
    const months = Math.floor((nd % 365) / 30);

    const yearsDisplay = years > 0 ? `${years} y` : "";
    const monthsDisplay = months > 0 ? `${months} kk` : "";
    return `${yearsDisplay} ${monthsDisplay}`;
  };

  /**
   * handleUsedHoursPerWeekChange
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

  /**
   * hasValidAmountStudies
   * @returns boolean whether there is enough valid studies
   */
  /* const hasValidAmountStudies = (): boolean => {
    const needMaxMandatoryStudies = calculateMaxNumberOfMandatoryCourses();
    const needMaxOptionalStudies =
      NEEDED_STUDIES_IN_TOTAL - calculateMaxNumberOfMandatoryCourses();

    const completedMandatoryStudies =
      calculateNumberOfCompletedMandatoryCourses();
    const completedOptionalStudies =
      calculateNumberOfCompletedOptionalyCourses();

    if (
      completedMandatoryStudies >= needMaxMandatoryStudies &&
      completedOptionalStudies >= needMaxOptionalStudies
    ) {
      return true;
    }

    return false;
  }; */

  const allApprovedHours = calculateAllApprovedHours();
  const optionalHoursCompleted = calculateCompletedOptionalHours();
  const mandatoryHoursCompleted = calculateCompletedMandatoryHours();
  const mandatoryHoursNeeded = calculateMandatoryHoursNeeded();

  const updatedMandatoryHoursNeeded =
    mandatoryHoursNeeded - mandatoryHoursCompleted;

  let selectedOptionalHours = 0;

  if (studentChoices.studentChoices.length > 0) {
    selectedOptionalHours =
      calculateSelectedOptionalHours() - optionalHoursCompleted;
  }

  const hoursInTotalToComplete =
    updatedMandatoryHoursNeeded + selectedOptionalHours - allApprovedHours;

  const totalTimeInMonths = getTotalTimeInDays(
    hoursInTotalToComplete,
    studyHours.studyHourValue
  );

  const completedMandatoryStudies =
    calculateNumberOfCompletedMandatoryCourses();
  const completedOptionalStudies = calculateNumberOfCompletedOptionalyCourses();

  const needMandatoryStudies = calculateMaxNumberOfMandatoryCourses();
  const neededOptionalStudies = NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies;

  let optionalStudiesOverRequiredAmount = 0;

  if (
    studentChoices.studentChoices &&
    studentChoices.studentChoices.length > neededOptionalStudies
  ) {
    optionalStudiesOverRequiredAmount = studentChoices.studentChoices.length;
  }

  let calculationDivider1 =
    (completedMandatoryStudies + completedOptionalStudies) /
    (needMandatoryStudies + neededOptionalStudies);

  if (completedOptionalStudies > neededOptionalStudies) {
    calculationDivider1 =
      (completedMandatoryStudies + neededOptionalStudies) /
      (neededOptionalStudies + needMandatoryStudies);
  }

  const proggressOfStudies = calculationDivider1;

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
          needMandatoryStudies={needMandatoryStudies}
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
        <div className="hops-container__info">
          <div className="hops-container__row">
            <ProgressBarLine
              containerClassName="hops-activity__progressbar-line hops-course-activity__progressbar-line hops-proggress-line"
              options={{
                strokeWidth: 1,
                duration: 1000,
                color: "#72d200",
                trailColor: "#f5f5f5",
                trailWidth: 1,
                svgStyle: { width: "100%", height: "10px" },
                initialAnimate: true,
                text: {
                  style: {
                    width: "100%",
                    position: "absolute",
                  },
                  className:
                    "hops-activity__progressbar-label hops-activity__progressbar-label--assignment  hops-activity__progressbar-label--workspace",
                },
              }}
              text={`${Math.round(proggressOfStudies * 100)}%`}
              progress={completedMandatoryStudies / needMandatoryStudies}
            />
          </div>

          <div className="hops-container__row">
            <div
              style={{
                backgroundColor: "antiquewhite",
                padding: "5px",
                boxShadow: "5px 5px 5px grey",
              }}
              className="hops__form-element-container hops__form-element-container--hops_indicators"
            >
              <h3>Suoritetut pakolliset opinnot:</h3>
              <Dropdown
                content={
                  <div>
                    <h4>Suoritetut kurssit</h4>
                    <h5>Pakolliset: {completedMandatoryStudies} </h5>
                  </div>
                }
              >
                <div tabIndex={0}>
                  <ProgressBarCircle
                    containerClassName="hops-activity__progressbar-circle hops-course-activity__progressbar-circle"
                    options={{
                      strokeWidth: 10,
                      duration: 1000,
                      color: "#008000",
                      trailColor: "#808080",
                      easing: "easeInOut",
                      trailWidth: 10,
                      initialAnimate: true,
                      svgStyle: {
                        flexBasis: "100px",
                        flexGrow: "0",
                        flexShrink: "0",
                        height: "100px",
                      },
                      text: {
                        style: null,
                        className:
                          "hops-activity__progressbar-label hops-activity__progressbar-label--assignment  hops-activity__progressbar-label--workspace",
                      },
                    }}
                    text={`${completedMandatoryStudies} / ${needMandatoryStudies}`}
                    progress={completedMandatoryStudies / needMandatoryStudies}
                  />
                </div>
              </Dropdown>
            </div>
            <div
              style={{
                backgroundColor: "antiquewhite",
                padding: "5px",
                boxShadow: "5px 5px 5px grey",
              }}
              className="hops__form-element-container hops__form-element-container--hops_indicators"
            >
              <h3>Suoritetut valinnaisopinnot:</h3>
              <Dropdown
                content={
                  <div>
                    <h4>Suoritetut kurssit</h4>
                    <h5>Valinnaiset: {completedOptionalStudies} </h5>
                  </div>
                }
              >
                <div tabIndex={0}>
                  <ProgressBarCircle
                    containerClassName="hops-activity__progressbar-circle hops-course-activity__progressbar-circle"
                    options={{
                      strokeWidth: 10,
                      duration: 1000,
                      color: "#008000",
                      trailColor: "#ADD8E6",
                      easing: "easeInOut",
                      trailWidth: 10,
                      svgStyle: {
                        flexBasis: "100px",
                        flexGrow: "0",
                        flexShrink: "0",
                        height: "100px",
                      },
                      text: {
                        style: null,
                        className:
                          "hops-activity__progressbar-label hops-activity__progressbar-label--assignment  hops-activity__progressbar-label--workspace",
                      },
                    }}
                    text={`
                    ${completedOptionalStudies}
                    /
                    ${NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies} ${
                      optionalStudiesOverRequiredAmount > 0
                        ? `(${optionalStudiesOverRequiredAmount})`
                        : ""
                    }`}
                    progress={
                      completedOptionalStudies /
                      (NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies)
                    }
                  />
                </div>
              </Dropdown>
            </div>

            <div
              style={{
                backgroundColor: "antiquewhite",
                padding: "5px",
                boxShadow: "5px 5px 5px grey",
              }}
              className="hops__form-element-container hops__form-element-container--hops_indicators"
            >
              <h3>Arvioitu opintoaika (kk):</h3>

              <ProgressBarCircle
                containerClassName="hops-activity__progressbar-circle hops-course-activity__progressbar-circle"
                options={{
                  strokeWidth: 10,
                  duration: 1000,
                  color: "grey",
                  trailColor: "grey",
                  easing: "easeInOut",
                  trailWidth: 10,
                  svgStyle: {
                    flexBasis: "100px",
                    flexGrow: "0",
                    flexShrink: "0",
                    height: "100px",
                  },
                  text: {
                    style: null,
                    className:
                      "hops-activity__progressbar-label hops-activity__progressbar-label--assignment  hops-activity__progressbar-label--workspace",
                  },
                }}
                text={`${showAsReadableTime(totalTimeInMonths)}`}
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
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return { displayNotification };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyTool);
