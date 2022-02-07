import * as React from "react";
import CourseTable from "../course-table/course-table";
import {
  HopsPlanningStudies,
  StudiesCourseData,
} from "../../../../../../../@types/shared";
import { TextField } from "../text-field";
import Dropdown from "../../../../../../general/dropdown";
import {
  HopsUser,
  NEEDED_STUDIES_IN_TOTAL,
} from "../hops-compulsory-education-wizard";
import CourseList from "../course-table/course-list";
import { schoolCourseTable } from "../../../../../../../mock/mock-data";
import StudyCalculationInfoBox from "./calculation-info-box";
import OptionalStudiesInfoBox from "./optional-studiess-info-box";
import { useStudentActivity } from "./hooks/use-student-activity";
import { FollowUp } from "../../../../../../../@types/shared";
import { StateType } from "reducers";
import { connect, Dispatch } from "react-redux";
import { WebsocketStateType } from "../../../../../../../reducers/util/websocket";
import { useStudentChoices } from "./hooks/use-student-choices";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { useStudentStudyHour } from "./hooks/use-student-study-hours";
import { useStudentAlternativeOptions } from "./hooks/use-student-alternative-options";
import { useFollowUpGoal } from "../followUpGoal/hooks/useFollowUp";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarCircle = require("react-progress-bar.js").Circle;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarLine = require("react-progress-bar.js").Line;

/**
 * StudyToolProps
 */
interface StudyToolProps {
  user: HopsUser;
  studentId: string;
  disabled: boolean;
  showIndicators?: boolean;
  superVisorModifies: boolean;
  studies: HopsPlanningStudies;
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
 * @param props
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

    const updatedMandatoryHoursNeeded =
      mandatoryHoursNeeded - mandatoryHoursCompleted;

    let selectedOptionalHours = 0;

    if (studentChoices.studentChoices.length > 0) {
      selectedOptionalHours =
        calculateSelectedOptionalHours() - optionalHoursCompleted;
    }

    const weekFactor = parseInt(followUpData.followUp.graduationGoal) / 12;

    const hoursNeededToMatchGoal = Math.round(
      (updatedMandatoryHoursNeeded + selectedOptionalHours - allApprovedHours) /
        (52 * weekFactor)
    );

    const hoursInTotalToComplete =
      updatedMandatoryHoursNeeded + selectedOptionalHours - allApprovedHours;

    const totalTime = getTotalTime(
      hoursInTotalToComplete,
      studyHours.studyHourValue
    );

    if (hoursNeededToMatchGoal > studyHours.studyHourValue) {
      return StudyCalculationInfoBox({
        state: "notenough",
        message: `Pohdi onko arvioitu opiskeluaika (${totalTime}) pessimistinen valmistumistavoitteeseen nähden (${followUpData.followUp.graduationGoal}kk).`,
      });
    }
    if (hoursNeededToMatchGoal < studyHours.studyHourValue) {
      return StudyCalculationInfoBox({
        state: "toomuch",
        message: `Pohdi onko arvioitu opiskeluaika (${totalTime}) optimistinen valmistumistavoitteeseen nähden (${followUpData.followUp.graduationGoal}kk).`,
      });
    }
    if (hoursNeededToMatchGoal === studyHours.studyHourValue) {
      return StudyCalculationInfoBox({
        state: "enough",
        message: `Arvioitu opiskeluaika (${totalTime}) on linjassa valmistumistavoitteesi kanssa (${followUpData.followUp.graduationGoal}kk).`,
      });
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
  const getTotalTime = (totalHours: number, hoursPerWeek: number) => {
    const totalMonths = Math.round(((totalHours / hoursPerWeek) * 7) / 31);
    const totalTimeValue: any = `${totalMonths}kk`;
    /* let offsetYears = 0;
    let offsetMonths = 0;
    let offsetWeeks = 0; */

    if (!hoursPerWeek || hoursPerWeek === 0) {
      return 0;
    }

    return totalTimeValue;
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
  const hasValidAmountStudies = (): boolean => {
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
  };

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

  let totalTime = getTotalTime(
    hoursInTotalToComplete,
    studyHours.studyHourValue
  );

  const completedMandatoryStudies =
    calculateNumberOfCompletedMandatoryCourses();
  const completedOptionalStudies = calculateNumberOfCompletedOptionalyCourses();

  const needMandatoryStudies = calculateMaxNumberOfMandatoryCourses();
  const neededOptionalStudies = NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies;

  let jotain = 0;

  if (
    studentChoices.studentChoices &&
    studentChoices.studentChoices.length > neededOptionalStudies
  ) {
    jotain = studentChoices.studentChoices.length;
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
      {!studyHours.isLoading && followUpData.followUp.graduationGoal !== "" ? (
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              type="number"
              label="Paljonko tunteja käytettävissä viikossa"
              onChange={handleUsedHoursPerWeekChange}
              value={studyHours.studyHourValue}
              className="hops-input"
              disabled={props.disabled}
            />
          </div>
        </div>
      ) : null}

      {studentActivity.isLoading || studentChoices.isLoading ? null : (
        <div className="hops-container__row">
          <OptionalStudiesInfoBox
            needMandatoryStudies={needMandatoryStudies}
            selectedNumberOfOptional={studentChoices.studentChoices.length}
            graduationGoal={followUpData.followUp.graduationGoal}
          />
        </div>
      )}

      {studentActivity.isLoading ||
      studentChoices.isLoading ? null : studentChoices.studentChoices &&
        studentChoices.studentChoices.length >= neededOptionalStudies ? (
        <div className="hops-container__row">
          {compareGraduationGoalToNeededForMandatoryStudies()}
        </div>
      ) : null}

      {props.showIndicators && (
        <div
          style={{ flexFlow: "column", paddingBottom: "15px" }}
          className="hops-container__row"
        >
          <h2 style={{ margin: "5px" }}>Opintojen edistyminen</h2>
          <div>
            <ProgressBarLine
              containerClassName="hops-activity__progressbar-line hops-course-activity__progressbar-line hops-proggress-line"
              options={{
                strokeWidth: 10,
                duration: 1000,
                color: "#008000",
                trailColor: "#808080",
                easing: "easeInOut",
                trailWidth: 10,
                initialAnimate: true,
                svgStyle: {
                  flexBasis: "100%",
                  flexGrow: "0",
                  flexShrink: "0",
                  height: "30px",
                  boxShadow: "5px 5px 5px grey",
                },
                text: {
                  style: {
                    width: "100%",
                    position: "absolute",
                    color: "white",
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
                      jotain > 0 ? `(${jotain})` : ""
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
                text={`${totalTime}`}
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

      <div className="hops-container__indicator-examples">
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
