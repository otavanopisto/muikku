import * as React from "react";
import { SchoolSubject } from "~/@types/shared";
import CourseTable from "../../course-table";
import { mockSchoolSubjects } from "../../../../../../../mock/mock-data";
import { HopsStudies, CourseStatus } from "../../../../../../../@types/shared";
import { TextField } from "../text-field";

interface StudiesProps {
  studies: HopsStudies;
  onStudiesChange: (studies: HopsStudies) => void;
}

interface StudiesState {}

class Studies extends React.Component<StudiesProps, StudiesState> {
  /**
   * constructor
   * @param props
   */
  constructor(props: StudiesProps) {
    super(props);

    this.state = {};
  }

  /**
   * calculateCompletedMandatoryHours
   * @returns sum of completed course hours
   */
  calculateCompletedMandatoryHours = (): number => {
    let hoursCompleted = 0;

    for (const sSubject of this.props.studies.selectedSubjects) {
      let oneSubjectMandatoryHours = 0;

      for (const aCourse of sSubject.availableCourses) {
        if (!aCourse.mandatory) {
          continue;
        }

        if (
          aCourse.status === CourseStatus.APPROVAL ||
          aCourse.status === CourseStatus.COMPLETED
        ) {
          oneSubjectMandatoryHours += aCourse.length;
        }
      }

      hoursCompleted += oneSubjectMandatoryHours;
    }

    return hoursCompleted;
  };

  /**
   * calculateMandatoryHoursNeeded
   * @returns number of mandatory hours needed to complete all mandatory courses
   */
  calculateMandatoryHoursNeeded = (): number => {
    let hoursNeeded = 0;

    for (const sSubject of this.props.studies.selectedSubjects) {
      let oneSubjectMandatoryHours = 0;

      if (
        this.props.studies.finnishAsSecondLanguage &&
        sSubject.subjectCode === "ai"
      ) {
        continue;
      }
      if (
        !this.props.studies.finnishAsSecondLanguage &&
        sSubject.subjectCode === "s2"
      ) {
        continue;
      }
      if (this.props.studies.ethics && sSubject.subjectCode === "ua") {
        continue;
      }
      if (!this.props.studies.ethics && sSubject.subjectCode === "ea") {
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
   * getTotalTime
   * @param totalHours
   * @param hoursPerWeek
   */
  getTotalTime = (totalHours: number, hoursPerWeek: number) => {
    const totalWeeks = totalHours / hoursPerWeek;
    let totalTimeValue: any;
    let offsetYears = 0;
    let offsetMonths = 0;
    let offsetWeeks = 0;

    if (!hoursPerWeek || hoursPerWeek === 0) {
      return 0;
    }

    if (totalWeeks > 52) {
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
    }

    if (offsetMonths > 0) {
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
    }

    return totalTimeValue;
  };

  /**
   * handleFinlandAsSecondLanguage
   * @param e
   */
  handleFinnishAsSecondLanguage = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onStudiesChange({
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
    this.props.onStudiesChange({
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
   * handleUsedHoursPerWeekChange
   */
  handleUsedHoursPerWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onStudiesChange({
      ...this.props.studies,
      usedHoursPerWeek: parseInt(e.currentTarget.value),
    });
  };

  /**
   * handleSelectedSubjectsChange
   * @param selectedSubjects
   */
  handleSelectedSubjectsChange = (selectedSubjects: SchoolSubject[]) => {
    this.props.onStudiesChange({ ...this.props.studies, selectedSubjects });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const mandatoryNeededHours = this.calculateMandatoryHoursNeeded();
    const completedMandatoryHours = this.calculateCompletedMandatoryHours();
    const totalTime = this.getTotalTime(
      mandatoryNeededHours,
      this.props.studies.usedHoursPerWeek
    );
    const updatedTimeToCompleteMandatoryCourses = this.getTotalTime(
      mandatoryNeededHours - completedMandatoryHours,
      this.props.studies.usedHoursPerWeek
    );

    return (
      <div className="hops__step-container">
        <fieldset className="hops__step-container__fieldset">
          <legend className="hops__step-container__subheader">
            Kurssivalinnat
          </legend>

          <div className="hops__step-container__row">
            <div className="hops__step-form__element-container hops__step-form__element-container--single-row">
              <label className="hops__step__label">
                Suoritan äidinkielen sijaan Suomen toisena kielenä?
              </label>
              <input
                type="checkbox"
                className="hops__step__input"
                checked={this.props.studies.finnishAsSecondLanguage}
                onChange={this.handleFinnishAsSecondLanguage}
              ></input>
            </div>
          </div>
          <div className="hops__step-container__row">
            <div className="hops__step-form__element-container hops__step-form__element-container--single-row">
              <label className="hops__step__label">
                Suoritan uskonnon elämänkatsomustietona?
              </label>
              <input
                type="checkbox"
                className="hops__step__input"
                checked={this.props.studies.ethics}
                onChange={this.handleEthicsChange}
              ></input>
            </div>
          </div>
        </fieldset>
        <fieldset className="hops__step-container__fieldset">
          <legend className="hops__step-container__subheader">
            Opintolaskuri
          </legend>
          <div className="hops__step-container__row">
            <div className="hops__step-form__element-container">
              <TextField
                label="Paljonko tunteja käytettävissä viikossa"
                onChange={this.handleUsedHoursPerWeekChange}
                value={this.props.studies.usedHoursPerWeek}
                className="hops__step__input"
              />
            </div>
          </div>

          <div className="hops__step-container__row">
            <div className="hops__step-form__element-container hops__step-form__element-container-study__counter">
              <div>
                <h1>Tunteja viikossa:</h1>
                <h1 className="hops__result-title">
                  {this.props.studies.usedHoursPerWeek}
                </h1>
              </div>
              <div>
                <h1>Arvioitu tarvittava tuntimäärä (pakolliset kurssit):</h1>
                <h1 className="hops__result-title">{mandatoryNeededHours}</h1>
              </div>
              <div>
                <h1>Laskennallinen opiskeluaika:</h1>
                <h1 className="hops__result-title">{totalTime}</h1>
              </div>
              <hr className="hops__calculated__hours-divider" />
              <div>
                <h1>Suoritetut tunnit:</h1>
                <h1 className="hops__result-title">
                  {completedMandatoryHours}
                </h1>
              </div>
              <div>
                <h1>Päivitetty opiskeluaika:</h1>
                <h1 className="hops__result-title">
                  {updatedTimeToCompleteMandatoryCourses}
                </h1>
              </div>
            </div>
          </div>

          <div className="hops__step-container__row">
            <div className="hops__step-form__element-container">
              <CourseTable
                selectedSubjects={this.props.studies.selectedSubjects}
                onChange={this.handleSelectedSubjectsChange}
                ethicsSelected={this.props.studies.ethics}
                finnishAsSecondLanguage={
                  this.props.studies.finnishAsSecondLanguage
                }
              />
            </div>
          </div>

          <div className="hops__step-container__indicator-examples">
            <div className="hops__step-container__course-completed">
              <div className="hops__step-container__course-completed-indicator"></div>
              <p>Suoritettu</p>
            </div>
            <div className="hops__step-container__course-inprogress">
              <div className="hops__step-container__course-inprogress-indicator"></div>
              <p>Kesken</p>
            </div>
            <div className="hops__step-container__course-approval">
              <div className="hops__step-container__course-approval-indicator"></div>
              <p>Hyväksiluettu</p>
            </div>
          </div>

          <div className="hops__step-container__row">
            <div className="hops__step-form__element-container">
              <p>*-merkityt ovat valinnaisia kursseja</p>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default Studies;
