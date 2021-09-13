import * as React from "react";
import { SchoolSubject } from "~/@types/shared";
import CourseTable from "../../course-table";
import {
  HopsStudies,
  CourseStatus,
  StudiesCourseData,
} from "../../../../../../../@types/shared";
import Dropdown from "../../../../../../general/dropdown";
let ProgressBarCircle = require("react-progress-bar.js").Circle;

interface StudiesProps extends StudiesCourseData {
  studies: HopsStudies;
  ethics: boolean;
  finnishAsSecondLanguage: boolean;
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
   * calculateMaxNumberOfOptionalCourses
   * @returns
   */
  calculateMaxNumberOfOptionalCourses = () => {
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
         * Skip mandatory courses
         */
        if (aCourse.mandatory) {
          continue;
        }

        amount++;
      }
    }

    return amount;
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
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="hops-container">
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Kurssivalinnat</legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops-label">
                Suoritan äidinkielen sijaan Suomen toisena kielenä?
              </label>
              <input
                type="checkbox"
                className="hops-input"
                checked={this.props.studies.finnishAsSecondLanguage}
                onChange={this.handleFinnishAsSecondLanguage}
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
                checked={this.props.studies.ethics}
                onChange={this.handleEthicsChange}
              ></input>
            </div>
          </div>
        </fieldset>
        <fieldset className="hops__step-container__fieldset">
          <legend className="hops__step-container__subheader">
            Kurssitaulukko
          </legend>

          <div className="hops-container__row">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Dropdown
                content={
                  <div>
                    <h4>Suoritetut kurssit</h4>
                    <h5>
                      Pakolliset:{" "}
                      {this.calculateNumberOfCompletedMandatoryCourses()}{" "}
                    </h5>
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
                        flexBasis: "25px",
                        flexGrow: "0",
                        flexShrink: "0",
                        height: "25px",
                      },
                      text: {
                        style: null,
                        className:
                          "workspace-activity__progressbar-label workspace-activity__progressbar-label--assignment  workspace-activity__progressbar-label--workspace",
                      },
                    }}
                    text={`${this.calculateNumberOfCompletedMandatoryCourses()} / ${this.calculateMaxNumberOfMandatoryCourses()}`}
                    progress={
                      this.calculateNumberOfCompletedMandatoryCourses() /
                      this.calculateMaxNumberOfMandatoryCourses()
                    }
                  />
                </div>
              </Dropdown>

              <Dropdown
                content={
                  <div>
                    <h4>Suoritetut kurssit</h4>
                    <h5>
                      Valinnaiset:{" "}
                      {this.calculateNumberOfCompletedOptionalyCourses()}{" "}
                    </h5>
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
                        flexBasis: "25px",
                        flexGrow: "0",
                        flexShrink: "0",
                        height: "25px",
                      },
                      text: {
                        style: null,
                        className:
                          "workspace-activity__progressbar-label workspace-activity__progressbar-label--assignment  workspace-activity__progressbar-label--workspace",
                      },
                    }}
                    text={`
                    ${this.calculateNumberOfCompletedOptionalyCourses()}
                    / 
                    ${this.calculateMaxNumberOfOptionalCourses()}`}
                    progress={
                      this.calculateNumberOfCompletedOptionalyCourses() /
                      this.calculateMaxNumberOfOptionalCourses()
                    }
                  />
                </div>
              </Dropdown>
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              {/* <CourseTable
                selectedSubjects={this.props.studies.selectedSubjects}
                approvedSubjectListOfIds={this.props.approvedSubjectListOfIds}
                completedSubjectListOfIds={this.props.completedSubjectListOfIds}
                inprogressSubjectListOfIds={
                  this.props.inprogressSubjectListOfIds
                }
                ethicsSelected={this.props.studies.ethics}
                finnishAsSecondLanguage={
                  this.props.studies.finnishAsSecondLanguage
                }
              /> */}
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
            <div className="hops-container__course-latest_completed">
              <div className="hops-container__course-latest_completed-indicator"></div>
              <p>Viimeisin suoritettu</p>
            </div>
            <div className="hops-container__course-inprogress">
              <div className="hops-container__course-inprogress-indicator"></div>
              <p>Kesken</p>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default Studies;
