import * as React from "react";
import { SchoolSubject } from "~/@types/shared";
import CourseTable from "../../course-table";
import {
  HopsPlanningStudies,
  StudiesCourseData,
} from "../../../../../../../@types/shared";
import { TextField } from "../text-field";
import Dropdown from "../../../../../../general/dropdown";
import {
  FollowUpGoal,
  FollowUpStudies,
  StudySector,
} from "../../../../../../../@types/shared";
import Button from "../../../../../../general/button";
import { CourseStatus } from "../../../../../../../@types/shared";
import { NEEDED_STUDIES_IN_TOTAL } from "../hops-compulsory-education-wizard";
import AnimateHeight from "react-animate-height";
import { ButtonPill } from "../../../../../../general/button";
import CourseList from "../../course-list";
let ProgressBarCircle = require("react-progress-bar.js").Circle;
let ProgressBarLine = require("react-progress-bar.js").Line;

interface StudiesPlanningProps extends StudiesCourseData {
  user: "supervisor" | "student";
  disabled: boolean;
  finnishAsSecondLanguage: boolean;
  ethics: boolean;
  studies: HopsPlanningStudies;
  onStudiesPlanningChange: (studies: HopsPlanningStudies) => void;
  onDeleteSelection?: () => void;
  onDeleteNextSelection?: () => void;
}

/**
 * StudiesPlanningState
 */
interface StudiesPlanningState {
  openExtra: boolean;
  selectNextIsActive: boolean;
  selectSuggestedOptionalActive: boolean;
  supervisorSuggestedNext: number[];
  supervisorSuggestedOptional: number[];
}

/**
 * StudiesPlanning
 */
class StudiesPlanning extends React.Component<
  StudiesPlanningProps,
  StudiesPlanningState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: StudiesPlanningProps) {
    super(props);

    this.state = {
      openExtra: false,
      selectNextIsActive: false,
      selectSuggestedOptionalActive: false,
      supervisorSuggestedNext: [],
      supervisorSuggestedOptional: [],
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.setState({
      supervisorSuggestedNext:
        this.props.studies.supervisorSuggestedNextListOfIds,
    });
  };

  /**
   * componentDidUpdate
   * @param nextProps
   * @param prevState
   */
  componentDidUpdate = (
    prevProps: StudiesPlanningProps,
    prevState: StudiesPlanningState
  ) => {
    if (
      JSON.stringify(prevProps.studies.supervisorSuggestedNextListOfIds) !==
      JSON.stringify(this.props.studies.supervisorSuggestedNextListOfIds)
    ) {
      this.setState({
        supervisorSuggestedNext:
          this.props.studies.supervisorSuggestedNextListOfIds,
      });
    }
    if (
      JSON.stringify(prevProps.studies.supervisorSugestedSubjectListOfIds) !==
      JSON.stringify(this.props.studies.supervisorSugestedSubjectListOfIds)
    ) {
      this.setState({
        supervisorSuggestedOptional:
          this.props.studies.supervisorSugestedSubjectListOfIds,
      });
    }
  };

  /**
   * compareGraduationGoalToNeededMandatoryCourses
   */
  compareGraduationGoalToNeededForMandatoryStudies = () => {
    const allApprovedHours = this.calculateAllApprovedHours();
    const optionalHoursCompleted = this.calculateCompletedOptionalHours();
    const mandatoryHoursCompleted = this.calculateCompletedMandatoryHours();
    const mandatoryHoursNeeded = this.calculateMandatoryHoursNeeded();

    const updatedMandatoryHoursNeeded =
      mandatoryHoursNeeded - mandatoryHoursCompleted;

    let selectedOptionalHours = 0;

    if (this.props.studies.selectedListOfIds.length > 0) {
      selectedOptionalHours =
        this.calculateSelectedOptionalHours() - optionalHoursCompleted;
    }

    const weekFactor = parseInt(this.props.studies.graduationGoal) / 12;

    const hoursNeededToMatchGoal = Math.round(
      (updatedMandatoryHoursNeeded + selectedOptionalHours - allApprovedHours) /
        (52 * weekFactor)
    );

    const hoursInTotalToComplete =
      updatedMandatoryHoursNeeded + selectedOptionalHours - allApprovedHours;

    let totalTime = this.getTotalTime(
      hoursInTotalToComplete,
      this.props.studies.usedHoursPerWeek
    );

    if (hoursNeededToMatchGoal > this.props.studies.usedHoursPerWeek) {
      return this.renderCalculationInfoBox(
        "notenough",
        `Pohdi onko arvioitu opiskeluaika (${totalTime}) pessimistinen valmistumistavoitteeseen nähden (${this.props.studies.graduationGoal}kk).`
      );
    }
    if (hoursNeededToMatchGoal < this.props.studies.usedHoursPerWeek) {
      return this.renderCalculationInfoBox(
        "toomuch",
        `Pohdi onko arvioitu opiskeluaika (${totalTime}) optimistinen valmistumistavoitteeseen nähden (${this.props.studies.graduationGoal}kk).`
      );
    }
    if (hoursNeededToMatchGoal === this.props.studies.usedHoursPerWeek) {
      return this.renderCalculationInfoBox(
        "enough",
        `Arvioitu opiskeluaika (${totalTime}) on linjassa valmistumistavoitteesi kanssa (${this.props.studies.graduationGoal}kk).`
      );
    }
  };

  /**
   * calculateSelectedOptionalHours
   * @returns
   */
  calculateSelectedOptionalHours = (): number => {
    let hoursSelected = 0;

    if (this.props.studies.selectedListOfIds) {
      for (const sSubject of this.props.studies.selectedSubjects) {
        let oneSubjectHours = 0;

        for (const aCourse of sSubject.availableCourses) {
          if (
            this.props.studies.selectedSubjects &&
            this.props.studies.selectedListOfIds.find(
              (courseId) => courseId === aCourse.id
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
  calculateMandatoryHoursNeeded = (): number => {
    let hoursNeeded = 0;

    for (const sSubject of this.props.studies.selectedSubjects) {
      let oneSubjectMandatoryHours = 0;

      if (this.props.finnishAsSecondLanguage && sSubject.subjectCode === "ai") {
        continue;
      }
      if (
        !this.props.finnishAsSecondLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (this.props.ethics && sSubject.subjectCode === "ua") {
        continue;
      }
      if (!this.props.ethics && sSubject.subjectCode === "ea") {
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
   * @returns
   */
  calculateNumberOfCompletedMandatoryCourses = () => {
    let completed = 0;

    for (const sSubject of this.props.studies.selectedSubjects) {
      if (this.props.finnishAsSecondLanguage && sSubject.subjectCode === "ai") {
        continue;
      }
      if (
        !this.props.finnishAsSecondLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (this.props.ethics && sSubject.subjectCode === "ua") {
        continue;
      }
      if (!this.props.ethics && sSubject.subjectCode === "ea") {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        if (!aCourse.mandatory) {
          continue;
        }

        if (
          this.props.completedSubjectListOfIds ||
          this.props.approvedSubjectListOfIds
        ) {
          if (
            this.props.completedSubjectListOfIds &&
            this.props.completedSubjectListOfIds.find(
              (courseId) => courseId === aCourse.id
            )
          ) {
            completed++;
          }
          if (
            this.props.approvedSubjectListOfIds &&
            this.props.approvedSubjectListOfIds.find(
              (courseId) => courseId === aCourse.id
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
   * calculateNumberOfCompletedOptionalyCourses
   * @returns
   */
  calculateNumberOfCompletedOptionalyCourses = () => {
    let completed = 0;

    for (const sSubject of this.props.studies.selectedSubjects) {
      if (this.props.finnishAsSecondLanguage && sSubject.subjectCode === "ai") {
        continue;
      }
      if (
        !this.props.finnishAsSecondLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (this.props.ethics && sSubject.subjectCode === "ua") {
        continue;
      }
      if (!this.props.ethics && sSubject.subjectCode === "ea") {
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
        if (this.props.completedSubjectListOfIds) {
          if (
            this.props.completedSubjectListOfIds.find(
              (courseId) => courseId === aCourse.id
            )
          ) {
            completed++;
          }
        }
      }
    }

    return completed;
  };

  calculateAllApprovedHours = () => {
    let hoursCompleted = 0;

    for (const sSubject of this.props.studies.selectedSubjects) {
      let oneSubjectHours = 0;

      if (this.props.finnishAsSecondLanguage && sSubject.subjectCode === "ai") {
        continue;
      }
      if (
        !this.props.finnishAsSecondLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (this.props.ethics && sSubject.subjectCode === "ua") {
        continue;
      }
      if (!this.props.ethics && sSubject.subjectCode === "ea") {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        if (
          this.props.approvedSubjectListOfIds &&
          this.props.approvedSubjectListOfIds.findIndex(
            (cSubjectId) => cSubjectId === aCourse.id
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
   * calculateCompletedMandatoryHours
   * @returns
   */
  calculateCompletedMandatoryHours = () => {
    let hoursCompleted = 0;

    for (const sSubject of this.props.studies.selectedSubjects) {
      let oneSubjectMandatoryHours = 0;

      if (this.props.finnishAsSecondLanguage && sSubject.subjectCode === "ai") {
        continue;
      }
      if (
        !this.props.finnishAsSecondLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (this.props.ethics && sSubject.subjectCode === "ua") {
        continue;
      }
      if (!this.props.ethics && sSubject.subjectCode === "ea") {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        if (!aCourse.mandatory) {
          continue;
        }

        if (
          this.props.completedSubjectListOfIds &&
          this.props.completedSubjectListOfIds.findIndex(
            (cSubjectId) => cSubjectId === aCourse.id
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
   * @returns
   */
  calculateCompletedOptionalHours = () => {
    let hoursCompleted = 0;

    for (const sSubject of this.props.studies.selectedSubjects) {
      let oneSubjectOptionalHours = 0;

      if (this.props.finnishAsSecondLanguage && sSubject.subjectCode === "ai") {
        continue;
      }
      if (
        !this.props.finnishAsSecondLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (this.props.ethics && sSubject.subjectCode === "ua") {
        continue;
      }
      if (!this.props.ethics && sSubject.subjectCode === "ea") {
        continue;
      }

      for (const aCourse of sSubject.availableCourses) {
        if (aCourse.mandatory) {
          continue;
        }

        if (
          this.props.completedSubjectListOfIds &&
          this.props.completedSubjectListOfIds.findIndex(
            (cSubjectId) => cSubjectId === aCourse.id
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
   * @returns
   */
  calculateMaxNumberOfMandatoryCourses = () => {
    let amount = 0;

    for (const sSubject of this.props.studies.selectedSubjects) {
      if (this.props.finnishAsSecondLanguage && sSubject.subjectCode === "ai") {
        continue;
      }
      if (
        !this.props.finnishAsSecondLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (this.props.ethics && sSubject.subjectCode === "ua") {
        continue;
      }
      if (!this.props.ethics && sSubject.subjectCode === "ea") {
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
   * @param totalHours
   * @param hoursPerWeek
   */
  getTotalTime = (totalHours: number, hoursPerWeek: number) => {
    const totalMonths = Math.round(((totalHours / hoursPerWeek) * 7) / 31);
    let totalTimeValue: any = `${totalMonths}kk`;
    let offsetYears = 0;
    let offsetMonths = 0;
    let offsetWeeks = 0;

    if (!hoursPerWeek || hoursPerWeek === 0) {
      return 0;
    }

    /* if (totalWeeks > 52) {
      let countYears = totalWeeks / 52;

      if (countYears >= 1) {
        totalTimeValue = Math.floor(countYears) + " v ";
      }
      offsetYears = countYears % 1;
    } else {
      offsetYears = totalWeeks / 52;
    }

    if (offsetYears > 0) {
      let countMonths = offsetYears * 12;
      if (countMonths >= 1) {
        totalTimeValue = totalTimeValue
          ? totalTimeValue + Math.floor(countMonths) + " kk "
          : Math.floor(countMonths) + " kk ";
      }
      offsetMonths = countMonths % 1;
    } */

    /* if (offsetMonths > 0) {
      let countWeeks = offsetMonths * 4.3482;
      if (countWeeks >= 1) {
        totalTimeValue = totalTimeValue
          ? totalTimeValue + Math.floor(countWeeks) + " vko "
          : Math.floor(countWeeks) + " vko ";
      }
      offsetWeeks = countWeeks % 1;
    }

    if (offsetWeeks > 0) {
      let countDays = offsetWeeks * 7;
      if (countDays >= 1) {
        totalTimeValue = totalTimeValue
          ? totalTimeValue + Math.floor(countDays) + " pv "
          : Math.floor(countDays) + " pv ";
      }
    } */

    return totalTimeValue;
  };

  /**
   * hasValidAmountStudies
   * @returns boolean whether there is enough valid studies
   */
  hasValidAmountStudies = (): boolean => {
    const needMaxMandatoryStudies = this.calculateMaxNumberOfMandatoryCourses();
    const needMaxOptionalStudies =
      NEEDED_STUDIES_IN_TOTAL - this.calculateMaxNumberOfMandatoryCourses();

    const completedMandatoryStudies =
      this.calculateNumberOfCompletedMandatoryCourses();
    const completedOptionalStudies =
      this.calculateNumberOfCompletedOptionalyCourses();

    if (
      completedMandatoryStudies >= needMaxMandatoryStudies &&
      completedOptionalStudies >= needMaxOptionalStudies
    ) {
      return true;
    }

    return false;
  };

  /**
   * handleUsedHoursPerWeekChange
   */
  handleUsedHoursPerWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onStudiesPlanningChange({
      ...this.props.studies,
      usedHoursPerWeek: parseInt(e.currentTarget.value),
    });
  };

  /**
   * handleSelectedSubjectsChange
   * @param selectedSubjects
   */
  handleSelectedSubjectsChange = (selectedSubjects: SchoolSubject[]) => {
    this.props.onStudiesPlanningChange({
      ...this.props.studies,
      selectedSubjects,
    });
  };

  /**
   * handleSelectedSubjectListOfIdsChange
   * @param listOfIds
   */
  handleSelectedSubjectListOfIdsChange = (listOfIds: number[]) => {
    this.props.onStudiesPlanningChange({
      ...this.props.studies,
      selectedListOfIds: listOfIds,
    });
  };

  /**
   * handleSelectedSubjectListOfIdsChange
   * @param listOfIds
   */
  handleSuperVisorListOfIdsChange = (listOfIds: number[]) => {
    if (this.state.supervisorSuggestedOptional.length !== listOfIds.length) {
      this.setState({
        supervisorSuggestedOptional: listOfIds,
      });
    }
  };

  /**
   * handleSuperVisorSuggestedForNextListOfIdsChange
   */
  handleSuperVisorSuggestedForNextListOfIdsChange = (listOfIds: number[]) => {
    if (this.state.supervisorSuggestedNext.length !== listOfIds.length) {
      this.setState({
        supervisorSuggestedNext: listOfIds,
      });
    }
  };

  /**
   * handleSuperVisorSuggestedForOptionalListOfIdsChange
   */
  handleSuperVisorSuggestedForOptionalListOfIdsChange = (
    listOfIds: number[]
  ) => {
    if (this.state.supervisorSuggestedOptional.length !== listOfIds.length) {
      this.setState({
        supervisorSuggestedOptional: listOfIds,
      });
    }
  };

  /**
   * handleActivateSelectSuggestedForNext
   */
  handleActivateSelectSuggestedForNext = () => {
    this.setState({
      selectNextIsActive: !this.state.selectNextIsActive,
    });
  };

  handleActivateSelectOptional = () => {
    this.setState({
      selectSuggestedOptionalActive: !this.state.selectSuggestedOptionalActive,
    });
  };

  /**
   * handleSaveActiveSuggestedSelections
   */
  handleSaveActiveSuggestedSelections = () => {
    this.props.onStudiesPlanningChange({
      ...this.props.studies,
      supervisorSuggestedNextListOfIds: this.state.supervisorSuggestedNext,
    });

    this.setState({
      selectNextIsActive: false,
    });
  };

  /**
   * handleCancleActiveSuggestedSelectionAndRevert
   */
  handleCancleActiveSuggestedSelectionAndRevert = () => {
    this.setState({
      supervisorSuggestedNext:
        this.props.studies.supervisorSuggestedNextListOfIds,
      selectNextIsActive: false,
    });
  };

  /**
   * handleSaveActiveSuggestedOptionalSelections
   */
  handleSaveActiveSuggestedOptionalSelections = () => {
    this.props.onStudiesPlanningChange({
      ...this.props.studies,
      supervisorSugestedSubjectListOfIds:
        this.state.supervisorSuggestedOptional,
    });

    this.setState({
      selectSuggestedOptionalActive: false,
    });
  };

  /**
   * handleCancleActiveSuggestedOptionalSelectionAndRevert
   */
  handleCancleActiveSuggestedOptionalSelectionAndRevert = () => {
    this.setState({
      supervisorSuggestedNext:
        this.props.studies.supervisorSuggestedNextListOfIds,
      selectSuggestedOptionalActive: false,
    });
  };

  /**
   * handleFinlandAsSecondLanguage
   * @param e
   */
  handleFinnishAsSecondLanguage = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onStudiesPlanningChange({
      ...this.props.studies,
      finnishAsSecondLanguage: e.target.checked,
      selectedSubjects: e.target.checked
        ? this.props.studies.selectedSubjects.map((sSubject) => {
            if (sSubject.subjectCode === "ai") {
              return (sSubject = {
                ...sSubject,
                availableCourses: sSubject.availableCourses.map((aCourse) => ({
                  ...aCourse,
                  status: CourseStatus.NOSTATUS,
                })),
              });
            }
            return sSubject;
          })
        : this.props.studies.selectedSubjects.map((sSubject) => {
            if (sSubject.subjectCode === "s2") {
              return (sSubject = {
                ...sSubject,
                availableCourses: sSubject.availableCourses.map((aCourse) => ({
                  ...aCourse,
                  status: CourseStatus.NOSTATUS,
                })),
              });
            }
            return sSubject;
          }),
    });
  };

  /**
   * handleEthicsChange
   */
  handleEthicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onStudiesPlanningChange({
      ...this.props.studies,
      ethics: e.target.checked,
      selectedSubjects: e.target.checked
        ? this.props.studies.selectedSubjects.map((sSubject) => {
            if (sSubject.subjectCode === "ua") {
              return (sSubject = {
                ...sSubject,
                availableCourses: sSubject.availableCourses.map((aCourse) => ({
                  ...aCourse,
                  status: CourseStatus.NOSTATUS,
                })),
              });
            }
            return sSubject;
          })
        : this.props.studies.selectedSubjects.map((sSubject) => {
            if (sSubject.subjectCode === "ea") {
              return (sSubject = {
                ...sSubject,
                availableCourses: sSubject.availableCourses.map((aCourse) => ({
                  ...aCourse,
                  status: CourseStatus.NOSTATUS,
                })),
              });
            }
            return sSubject;
          }),
    });
  };

  /**
   * handleGoalsSelectsChange
   * @param name
   */
  handleGoalsSelectsChange =
    (name: keyof HopsPlanningStudies) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      this.props.onStudiesPlanningChange({
        ...this.props.studies,
        [name]: e.currentTarget.value,
      });
    };

  renderOptionalStudiesInfoBox = () => {
    const maxMandotoryHours =
      NEEDED_STUDIES_IN_TOTAL - this.calculateMaxNumberOfMandatoryCourses();

    const selectedNumberOfOptional =
      this.props.studies.selectedListOfIds.length;

    if (
      selectedNumberOfOptional < maxMandotoryHours ||
      (selectedNumberOfOptional < maxMandotoryHours &&
        this.props.studies.graduationGoal === "")
    ) {
      return (
        <div
          style={{
            border: "2px solid orange",
            padding: "10px",
            fontStyle: "italic",
          }}
          className="hops__form-element-container"
        >
          <h3>
            Ei tarpeeksi valinnaiskursseja valittuna ({selectedNumberOfOptional}
            /{maxMandotoryHours})
          </h3>
          {this.props.studies.graduationGoal === "" ? (
            <h3>Valmistumisaikatavoite valinta on tyhjä</h3>
          ) : null}
        </div>
      );
    } else if (selectedNumberOfOptional > maxMandotoryHours) {
      return (
        <div
          style={{
            border: "2px solid lightblue",
            padding: "10px",
            fontStyle: "italic",
          }}
          className="hops__form-element-container"
        >
          <h3>
            Sinulla on jo tarpeeksi valintoja, mutta voit suorittaa enemmänkin.
            Opiskeluaikaisi saattaa pidentyä
          </h3>
        </div>
      );
    }
  };

  /**
   * renderCalculationInfoBox
   * @param state
   * @returns JSX.Element
   */
  renderCalculationInfoBox = (
    state: "notenough" | "enough" | "toomuch",
    message?: string
  ) => {
    switch (state) {
      case "notenough":
        return (
          <div
            style={{
              border: "2px solid orange",
              padding: "10px",
              fontStyle: "italic",
            }}
            className="hops__form-element-container"
          >
            <div>
              <h3 style={{ display: "flex", alignItems: "center" }}>
                {message && message}
                <Dropdown
                  content={
                    <div>
                      Opintolaskuri kertoo myös ohjeistavan arvioin
                      valmistumistavoitteesi ja käytettävissä viikkotuntien
                      suhteesta.
                    </div>
                  }
                >
                  <div tabIndex={0}>
                    <ButtonPill>?</ButtonPill>
                  </div>
                </Dropdown>
              </h3>
            </div>
          </div>
        );

      case "enough":
        return (
          <div
            style={{
              border: "2px solid lightblue",
              padding: "10px",
              fontStyle: "italic",
            }}
            className="hops__form-element-container"
          >
            <div>
              <h3 style={{ display: "flex", alignItems: "center" }}>
                {message && message}{" "}
                <Dropdown
                  content={
                    <div>
                      Opintolaskuri kertoo myös ohjeistavan arvioin
                      valmistumistavoitteesi ja käytettävissä viikkotuntien
                      suhteesta.
                    </div>
                  }
                >
                  <div tabIndex={0}>
                    <ButtonPill>?</ButtonPill>
                  </div>
                </Dropdown>
              </h3>
            </div>
          </div>
        );

      case "toomuch":
        return (
          <div
            style={{
              border: "2px solid green",
              padding: "10px",
              fontStyle: "italic",
            }}
            className="hops__form-element-container"
          >
            <div>
              <h3 style={{ display: "flex", alignItems: "center" }}>
                {message && message}{" "}
                <Dropdown
                  content={
                    <div>
                      Opintolaskuri kertoo myös ohjeistavan arvioin
                      valmistumistavoitteesi ja käytettävissä viikkotuntien
                      suhteesta.
                    </div>
                  }
                >
                  <div tabIndex={0}>
                    <ButtonPill>?</ButtonPill>
                  </div>
                </Dropdown>
              </h3>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  renderDemo2 = () => {
    const { followUpGoal, graduationGoal, followUpStudies, studySector } =
      this.props.studies;

    const allApprovedHours = this.calculateAllApprovedHours();
    const optionalHoursCompleted = this.calculateCompletedOptionalHours();
    const mandatoryHoursCompleted = this.calculateCompletedMandatoryHours();
    const mandatoryHoursNeeded = this.calculateMandatoryHoursNeeded();

    const updatedMandatoryHoursNeeded =
      mandatoryHoursNeeded - mandatoryHoursCompleted;

    let selectedOptionalHours = 0;

    if (this.props.studies.selectedListOfIds.length > 0) {
      selectedOptionalHours =
        this.calculateSelectedOptionalHours() - optionalHoursCompleted;
    }

    const hoursInTotalToComplete =
      updatedMandatoryHoursNeeded + selectedOptionalHours - allApprovedHours;

    let totalTime = this.getTotalTime(
      hoursInTotalToComplete,
      this.props.studies.usedHoursPerWeek
    );

    const completedMandatoryStudies =
      this.calculateNumberOfCompletedMandatoryCourses();
    const completedOptionalStudies =
      this.calculateNumberOfCompletedOptionalyCourses();

    const needMandatoryStudies = this.calculateMaxNumberOfMandatoryCourses();
    const neededOptionalStudies =
      NEEDED_STUDIES_IN_TOTAL - this.calculateMaxNumberOfMandatoryCourses();

    let jotain = 0;

    if (
      this.props.studies.selectedListOfIds &&
      this.props.studies.selectedListOfIds.length > neededOptionalStudies
    ) {
      jotain = this.props.studies.selectedListOfIds.length;
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
      <div className="hops-container">
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Tavoitteet</legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <label className="hops-label">Valmistumisaikatavoite:</label>
              <select
                value={graduationGoal}
                onChange={this.handleGoalsSelectsChange("graduationGoal")}
                className="hops-select"
                disabled={this.props.disabled}
              >
                <option value="">Valitse...</option>
                <option value="6">6kk</option>
                <option value="12">1v.</option>
                <option value="18">1,5v.</option>
                <option value="24">2v.</option>
              </select>
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <label className="hops-label">Jatkotavoitteet:</label>
              <select
                value={followUpGoal}
                onChange={this.handleGoalsSelectsChange("followUpGoal")}
                className="hops-select"
                disabled={this.props.disabled}
              >
                <option value="">Valitse...</option>
                <option value={FollowUpGoal.POSTGRADUATE_STUDIES}>
                  Jatko-opinnot
                </option>
                <option value={FollowUpGoal.WORKING_LIFE}>Työelämä</option>
                <option value={FollowUpGoal.NO_FOLLOW_UP_GOALS}>
                  Ei muita tavotteita
                </option>
              </select>
            </div>
          </div>

          {followUpGoal === FollowUpGoal.POSTGRADUATE_STUDIES ? (
            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <label className="hops-label">Jatko-opinnot:</label>
                <select
                  value={followUpStudies}
                  onChange={this.handleGoalsSelectsChange("followUpStudies")}
                  className="hops-select"
                  disabled={this.props.disabled}
                >
                  <option value="">Valitse...</option>
                  <option value={FollowUpStudies.APPRENTICESHIP_TRAINING}>
                    Oppisopimuskoulutus
                  </option>
                  <option value={FollowUpStudies.VOCATIONAL_SCHOOL}>
                    Ammatillinen toinen aste
                  </option>
                  <option value={FollowUpStudies.UPPER_SECONDARY_SCHOOL}>
                    Lukio
                  </option>
                  <option value={FollowUpStudies.UNIVERSITY_STUDIES}>
                    Korkeakouluopinnot
                  </option>
                </select>
              </div>

              <div className="hops__form-element-container">
                <label className="hops-label">Koulutusala:</label>
                <select
                  value={studySector}
                  onChange={this.handleGoalsSelectsChange("studySector")}
                  className="hops-select"
                  disabled={this.props.disabled}
                >
                  <option value="">Valitse...</option>
                  <option value={StudySector.SOCIAL_HEALT_SECTOR}>
                    Sosiaali- ja terveysala
                  </option>
                  <option value={StudySector.TRADE_SECTOR}>Kauppa</option>
                  <option value={StudySector.TRANSPORT_SECTOR}>Liikenne</option>
                  <option value={StudySector.EDUCATION_SECTOR}>Kasvatus</option>
                  <option value={StudySector.INDUSTRY_SECTOR}>
                    Teollisuus
                  </option>
                  <option value={StudySector.ART_SECTOR}>Taide</option>
                </select>
              </div>
            </div>
          ) : null}
        </fieldset>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Opintojen suunnittelu
          </legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops-label">
                Suoritan äidinkielen sijaan Suomen toisena kielenä?
              </label>
              <input
                type="checkbox"
                className="hops-input"
                checked={this.props.finnishAsSecondLanguage}
                onChange={this.handleFinnishAsSecondLanguage}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops-label">
                Suoritan uskonnon elämänkatsomustietona?
              </label>
              <input
                type="checkbox"
                className="hops-input"
                checked={this.props.ethics}
                onChange={this.handleEthicsChange}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>
        </fieldset>
        <fieldset className="hops-container__fieldset">
          <legend className="hops__step-container__subheader">
            Opintolaskuri
          </legend>

          {this.props.studies.graduationGoal !== "" &&
          this.props.studies.selectedListOfIds &&
          this.props.studies.selectedListOfIds.length ===
            neededOptionalStudies ? (
            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <TextField
                  type="number"
                  label="Paljonko tunteja käytettävissä viikossa"
                  onChange={this.handleUsedHoursPerWeekChange}
                  value={this.props.studies.usedHoursPerWeek}
                  className="hops-input"
                  disabled={this.props.disabled}
                />
              </div>
            </div>
          ) : null}

          <div className="hops-container__row">
            {this.renderOptionalStudiesInfoBox()}
          </div>

          {this.props.studies.selectedListOfIds &&
          this.props.studies.selectedListOfIds.length ===
            neededOptionalStudies ? (
            <div className="hops-container__row">
              {this.compareGraduationGoalToNeededForMandatoryStudies()}
            </div>
          ) : null}

          <div style={{ flexFlow: "column" }} className="hops-container__row">
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
                style={{ backgroundColor: "antiquewhite", padding: "5px" }}
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
                      progress={
                        completedMandatoryStudies / needMandatoryStudies
                      }
                    />
                  </div>
                </Dropdown>
              </div>
              <div
                style={{ backgroundColor: "antiquewhite", padding: "5px" }}
                className="hops__form-element-container hops__form-element-container--hops_indicators"
              >
                <h3>Suoritetut valinnais opinnot:</h3>
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
                style={{ backgroundColor: "antiquewhite", padding: "5px" }}
                className="hops__form-element-container hops__form-element-container--hops_indicators"
              >
                <h3>Arvioitu opintoaika (kk):</h3>
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
                </Dropdown>
              </div>
            </div>
          </div>

          <div className="hops-container__row">
            {this.props.user === "supervisor" ? (
              <div className="hops_buttons hops_buttons--add">
                {this.state.selectNextIsActive ||
                this.state.selectSuggestedOptionalActive ? (
                  <>
                    <Button
                      onClick={
                        this.state.selectNextIsActive
                          ? this.handleSaveActiveSuggestedSelections
                          : this.handleSaveActiveSuggestedOptionalSelections
                      }
                    >
                      Tallenna
                    </Button>
                    <Button
                      onClick={
                        this.state.selectNextIsActive
                          ? this.handleCancleActiveSuggestedSelectionAndRevert
                          : this
                              .handleCancleActiveSuggestedOptionalSelectionAndRevert
                      }
                    >
                      Peruuta
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={this.handleActivateSelectSuggestedForNext}>
                      Seuraavaksi suoritettavat?
                    </Button>
                    <Button onClick={this.handleActivateSelectOptional}>
                      Ehdota valinnaiskursseja?
                    </Button>
                  </>
                )}
              </div>
            ) : null}

            <div className="hops_buttons hops_buttons--remove">
              {this.props.user === "supervisor" ? (
                <Button onClick={this.props.onDeleteNextSelection}>
                  Poista suoritettavat kurssiehdotukset
                </Button>
              ) : null}

              <Button onClick={this.props.onDeleteSelection}>
                Poista kurssi ehdotukset
              </Button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }} className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--pad__upforwards">
              <CourseTable
                user={this.props.user}
                selectNextIsActive={this.state.selectNextIsActive}
                selectOptionalIsActive={
                  this.state.selectSuggestedOptionalActive
                }
                selectedSubjects={this.props.studies.selectedSubjects}
                onChange={this.handleSelectedSubjectsChange}
                ethicsSelected={this.props.ethics}
                finnishAsSecondLanguage={this.props.finnishAsSecondLanguage}
                selectedSubjectListOfIds={this.props.studies.selectedListOfIds}
                approvedSubjectListOfIds={this.props.approvedSubjectListOfIds}
                completedSubjectListOfIds={this.props.completedSubjectListOfIds}
                inprogressSubjectListOfIds={
                  this.props.inprogressSubjectListOfIds
                }
                supervisorSugestedSubjectListOfIds={
                  this.state.supervisorSuggestedOptional
                }
                supervisorSuggestedNextListOfIds={
                  this.state.supervisorSuggestedNext
                }
                onChangeSelectSubjectList={
                  this.props.user === "supervisor"
                    ? this.handleSuperVisorListOfIdsChange
                    : this.handleSelectedSubjectListOfIdsChange
                }
                onChangeSuggestedForNextList={
                  this.state.selectNextIsActive
                    ? this.handleSuperVisorSuggestedForNextListOfIdsChange
                    : this.handleSuperVisorSuggestedForOptionalListOfIdsChange
                }
              />
            </div>

            <div className="hops__form-element-container hops__form-element-container--mobile">
              <CourseList
                key="jottain"
                user={this.props.user}
                selectNextIsActive={this.state.selectNextIsActive}
                selectOptionalIsActive={
                  this.state.selectSuggestedOptionalActive
                }
                selectedSubjects={this.props.studies.selectedSubjects}
                onChange={this.handleSelectedSubjectsChange}
                ethicsSelected={this.props.ethics}
                finnishAsSecondLanguage={this.props.finnishAsSecondLanguage}
                selectedSubjectListOfIds={this.props.studies.selectedListOfIds}
                approvedSubjectListOfIds={this.props.approvedSubjectListOfIds}
                completedSubjectListOfIds={this.props.completedSubjectListOfIds}
                inprogressSubjectListOfIds={
                  this.props.inprogressSubjectListOfIds
                }
                supervisorSugestedSubjectListOfIds={
                  this.state.supervisorSuggestedOptional
                }
                supervisorSuggestedNextListOfIds={
                  this.state.supervisorSuggestedNext
                }
                onChangeSelectSubjectList={
                  this.props.user === "supervisor"
                    ? this.handleSuperVisorListOfIdsChange
                    : this.handleSelectedSubjectListOfIdsChange
                }
                onChangeSuggestedForNextList={
                  this.state.selectNextIsActive
                    ? this.handleSuperVisorSuggestedForNextListOfIdsChange
                    : this.handleSuperVisorSuggestedForOptionalListOfIdsChange
                }
              />
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
        </fieldset>
      </div>
    );
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return this.renderDemo2();
  }
}

export default StudiesPlanning;
