import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { MatriculationExaminationSubjectSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-attended-list";
import { MatriculationExaminationCompletedSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-completed-list";
import { MatriculationExaminationFutureSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-future-list";
import { Textarea } from "./textarea";
import { TextField } from "./textfield";
import Button from '~/components/general/button';
import {
  getDefaultNextTerm,
  getDefaultPastTerm,
} from "../../../../helper-functions/matriculation-functions";
import {
  SUBJECT_MAP,
  FINNISH_SUBJECTS,
  ACADEMIC_SUBJECTS,
  ADVANCED_SUBJECTS,
  REQUIRED_FINNISH_ATTENDANCES,
  REQUIRED_MANDATORY_ATTENDANCES,
  REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN,
  REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN,
} from "./index";
import {
  ExaminationCompletedSubject,
  ExaminationFutureSubject,
  Term,
} from "../../../../@types/shared";
import {
  ExaminationAttendedSubject,
  SaveState,
} from "../../../../@types/shared";
import {
  resolveCurrentTerm,
  getNextTermOptions,
  getPastTermOptions,
} from "../../../../helper-functions/matriculation-functions";
import {
  Examination,
  ExaminationStudentInfo,
  ExaminationBasicProfile,
} from "../../../../@types/shared";

/**
 * MatriculationExaminationEnrollmentInformationProps
 */
interface MatriculationExaminationEnrollmentInformationProps {
  examination: Examination;
  saveState?: SaveState;
  draftSaveErrorMsg?: string;
  onChange: (examination: Examination) => void;
}

interface MatriculationExaminationEnrollmentInformationState {
  studentProfile: ExaminationBasicProfile;
  studentInfo: ExaminationStudentInfo;
  attendedSubjectList: ExaminationAttendedSubject[];
  completedSubjectList: ExaminationCompletedSubject[];
  futureSubjectList: ExaminationFutureSubject[];
}

/**
 * MatriculationExaminationEnrollmentInformation
 * @param props
 * @returns
 */
export class MatriculationExaminationEnrollmentInformation extends React.Component<
  MatriculationExaminationEnrollmentInformationProps,
  MatriculationExaminationEnrollmentInformationState
> {
  constructor(props: MatriculationExaminationEnrollmentInformationProps) {
    super(props);

    this.state = {
      studentProfile: {
        name: "",
        email: "",
        address: "",
        zipCode: "",
        postalDisctrict: "",
        phoneNumber: "",
        profileId: "",
        descriptionInfo: "",
        ssn: null,
      },
      studentInfo: {
        degreeType: "MATRICULATIONEXAMINATION",
        registrationType: "UPPERSECONDARY",
        superVisor: "",
        refreshingExamination: "false",
        courseCount: 0,
      },
      attendedSubjectList: [],
      completedSubjectList: [],
      futureSubjectList: [],
    };

    this.isValidated = this.isValidated.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    const {
      studentProfile,
      studentInfo,
      attendedSubjectList,
      completedSubjectList,
      futureSubjectList,
    } = this.props.examination;

    this.setState({
      studentProfile,
      studentInfo,
      attendedSubjectList,
      completedSubjectList,
      futureSubjectList,
    });
  };

  /**
   * componentDidUpdate
   * @param prevProps
   * @param prevState
   */
  componentDidUpdate = (
    prevProps: MatriculationExaminationEnrollmentInformationProps,
    prevState: MatriculationExaminationEnrollmentInformationState
  ) => {
    if (this.props !== prevProps) {
      const {
        studentProfile,
        studentInfo,
        attendedSubjectList,
        completedSubjectList,
        futureSubjectList,
      } = this.props.examination;

      this.setState({
        studentProfile,
        studentInfo,
        attendedSubjectList,
        completedSubjectList,
        futureSubjectList,
      });
    }
  };

  /**
   * This is for StepZilla way to validated "step"
   * that locks users way to get further in form
   * before all data is given and valitated
   * @returns boolean
   */
  isValidated = () => {
    return !this.isInvalid();
  };

  /**
   * newEnrolledAttendance
   */
  newEnrolledAttendance = (e: React.MouseEvent) => {
    const { examination, onChange } = this.props;

    const enrolledAttendances = this.state.attendedSubjectList;
    enrolledAttendances.push({
      subject: this.getDefaultSubject(this.getEnrolledSubjects()),
      mandatory: "true",
      repeat: "false",
      status: "UNKNOWN",
    });

    const modifiedExamination: Examination = {
      ...examination,
      attendedSubjectList: enrolledAttendances,
    };

    onChange(modifiedExamination);
  };

  /**
   * newFinishedAttendance
   */
  newFinishedAttendance = (e: React.MouseEvent) => {
    const { examination, onChange } = this.props;

    const finishedAttendances = this.state.completedSubjectList;
    finishedAttendances.push({
      term: getDefaultPastTerm().value,
      subject: this.getDefaultSubject(this.getFinishedSubjects()),
      mandatory: "false",
      grade: "UNKNOWN",
      status: "FINISHED",
    });

    const modifiedExamination: Examination = {
      ...examination,
      completedSubjectList: finishedAttendances,
    };

    onChange(modifiedExamination);
  };

  /**
   * newPlannedAttendance
   */
  newPlannedAttendance = (e: React.MouseEvent) => {
    const { examination, onChange } = this.props;

    const plannedAttendances = this.state.futureSubjectList;
    plannedAttendances.push({
      term: getDefaultNextTerm().value,
      subject: this.getDefaultSubject(this.getPlannedSubjects()),
      mandatory: "true",
      status: "PLANNED",
    });

    const modifiedExamination: Examination = {
      ...examination,
      futureSubjectList: plannedAttendances,
    };

    onChange(modifiedExamination);
  };

  /**
   * deleteEnrolledAttendance
   * @param i
   */
  deleteEnrolledAttendance = (i: number) => (e: React.MouseEvent) => {
    const { examination, onChange } = this.props;

    const enrolledAttendances = this.state.attendedSubjectList;
    enrolledAttendances.splice(i, 1);

    const modifiedExamination: Examination = {
      ...examination,
      attendedSubjectList: enrolledAttendances,
    };

    onChange(modifiedExamination);
  };

  /**
   * deleteFinishedAttendance
   * @param i
   */
  deleteFinishedAttendance = (i: number) => (e: React.MouseEvent) => {
    const { examination, onChange } = this.props;

    const finishedAttendances = this.state.completedSubjectList;
    finishedAttendances.splice(i, 1);

    const modifiedExamination: Examination = {
      ...examination,
      completedSubjectList: finishedAttendances,
    };

    onChange(modifiedExamination);
  };

  /**
   * deletePlannedAttendance
   * @param i
   */
  deletePlannedAttendance = (i: number) => (e: React.MouseEvent) => {
    const { examination, onChange } = this.props;

    const plannedAttendances = this.state.futureSubjectList;
    plannedAttendances.splice(i, 1);

    const modifiedExamination: Examination = {
      ...examination,
      futureSubjectList: plannedAttendances,
    };

    onChange(modifiedExamination);
  };

  /**
   * Returns next non selected subject from subjects list
   *
   * @param selectedSubjects list of selected subjects
   * @return next non selected subject from subjects list
   */
  getDefaultSubject = (selectedSubjects: string[]) => {
    const subjects = Object.keys(SUBJECT_MAP);

    for (let i = 0; i < subjects.length; i++) {
      if (selectedSubjects.indexOf(subjects[i]) === -1) {
        return subjects[i];
      }
    }

    return null;
  };

  /**
   * Returns list of enrolled subjects from enrolled attendances lists
   *
   * @returns list of enrolled subjects from enrolled attendances lists
   */
  getEnrolledSubjects = () => {
    return this.state.attendedSubjectList.map((attendance) => {
      return attendance.subject;
    });
  };

  /**
   * Returns list of planned subjects from planned attendances lists
   *
   * @returns list of planned subjects from planned attendances lists
   */
  getPlannedSubjects = () => {
    return this.state.futureSubjectList.map((attendance) => {
      return attendance.subject;
    });
  };

  /**
   * Returns list of finished subjects from finished attendances lists
   *
   * @returns list of finished subjects from finished attendances lists
   */
  getFinishedSubjects = () => {
    return this.state.completedSubjectList.map((attendance) => {
      return attendance.subject;
    });
  };

  /**
   * Returns an array of attendances which includes enrolledAttendances, plannedAttendances
   * and such finishedAttendances that have subjects not yet included from the previous
   * two lists.
   *
   * I.e. the array is missing the duplicates (repeated exams) which come from finished list.
   */
  getNonDuplicateAttendances() {
    const attendances = [].concat(
      this.state.attendedSubjectList,
      this.state.futureSubjectList
    );
    const attendedSubjects = attendances.map((attendance) => {
      return attendance.subject;
    });

    this.state.completedSubjectList.forEach((finishedAttendance) => {
      if (attendedSubjects.indexOf(finishedAttendance.subject) === -1) {
        attendances.push(finishedAttendance);
      }
    });

    return attendances;
  }

  /**
   * Returns count of attendances in finnish courses.
   *
   * Attendances with grade IMPROBATUR are ignored while counting attendances
   *
   * @returns count of attendances in finnish courses
   */
  getAmountOfFinnishAttendances() {
    return this.getNonDuplicateAttendances().filter((attendance) => {
      return FINNISH_SUBJECTS.indexOf(attendance.subject) !== -1;
    }).length;
  }

  /**
   * Returns count of attendances in mandatory courses
   *
   * Attendances with grade IMPROBATUR are ignored while counting attendances
   *
   * @returns count of attendances in mandatory courses
   */
  getAmountOfMandatoryAttendances() {
    return this.getNonDuplicateAttendances().filter((attendance) => {
      return attendance.mandatory === "true";
    }).length;
  }

  /**
   * Returns count of attendances in academic subjects
   *
   * Attendances with grade IMPROBATUR are ignored while counting attendances
   *
   * @returns count of attendances in academic subjects
   */
  getAmountOfAcademicSubjectAttendances() {
    return this.getNonDuplicateAttendances().filter((attendance) => {
      return (
        attendance.mandatory === "true" &&
        ACADEMIC_SUBJECTS.indexOf(attendance.subject) !== -1
      );
    }).length;
  }

  /**
   * Returns whether user has valid amount of attendances in mandatory advanced subjects
   *
   * Attendances with grade IMPROBATUR are ignored while counting attendances
   *
   * @returns whether user has valid amount of attendances in mandatory advanced subjects
   */
  getAmountOfMandatoryAdvancedSubjectAttendances() {
    return this.getNonDuplicateAttendances().filter((attendance) => {
      return (
        attendance.mandatory === "true" &&
        ADVANCED_SUBJECTS.indexOf(attendance.subject) !== -1
      );
    }).length;
  }

  /**
   * Returns whether attendance details are valid
   *
   * @returns whether attendance details are valid
   */
  isValidAttendances = () => {
    return (
      this.getAmountOfFinnishAttendances() == REQUIRED_FINNISH_ATTENDANCES &&
      this.getAmountOfMandatoryAttendances() ==
        REQUIRED_MANDATORY_ATTENDANCES &&
      this.getAmountOfAcademicSubjectAttendances() <
        REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN &&
      this.getAmountOfMandatoryAdvancedSubjectAttendances() >
        REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN
    );
  };

  /**
   * isConflictingAttendances
   * @returns list of subject groups where subject conflicted together
   */
  isConflictingAttendances = (): string[][] => {
    // Can't enroll to two subjects that are in the same group
    const conflictingGroups = [
      ["AI", "S2"],
      ["UE", "ET", "YO", "KE", "GE", "TT"],
      ["RUA", "RUB"],
      ["PS", "FI", "HI", "FY", "BI"],
      ["MAA", "MAB"],
    ];

    const subjectCodes: string[] = [];

    /**
     * Creates array of string from attendance subject codes
     */
    for (let attendance of this.state.attendedSubjectList) {
      subjectCodes.push(attendance.subject);
    }

    let conflictedGroups = [];

    /**
     * Creates list of conflicted group by subject that conflicts together
     * This will create duplicated of same items to array that are removed later
     */
    for (let group of conflictingGroups) {
      for (let subject1 of subjectCodes) {
        for (let subject2 of subjectCodes) {
          if (
            subject1 !== subject2 &&
            group.includes(subject1) &&
            group.includes(subject2)
          ) {
            conflictedGroups.push(group);
          }
        }
      }
    }

    const tmp: string[] = [];

    /**
     * Remove dublicated conflicted groups
     */
    conflictedGroups = conflictedGroups.filter((v) => {
      if (tmp.indexOf(v.toString()) < 0) {
        tmp.push(v.toString());
        return v;
      }
    });

    const conflictSubjectGroups: string[][] = [];

    /**
     * Returns list of subject that conflict together by conflictgroup
     */
    for (const cGroup of conflictedGroups) {
      const array: string[] = [];

      for (const subject of subjectCodes) {
        if (cGroup.includes(subject)) {
          array.push(subject);
        }
      }
      conflictSubjectGroups.push(array);
    }

    return conflictSubjectGroups;
  };

  /**
   * isIncompleteAttendances
   * @returns boolean
   */
  isIncompleteAttendances = (): boolean => {
    for (let attendance of this.state.attendedSubjectList) {
      if (
        attendance.subject === "" ||
        attendance.mandatory === "" ||
        attendance.repeat === ""
      ) {
        return true;
      }
    }
    for (let attendance of this.state.completedSubjectList) {
      if (
        attendance.term === "" ||
        attendance.subject === "" ||
        attendance.mandatory === "" ||
        attendance.grade === ""
      ) {
        return true;
      }
    }
    for (let attendance of this.state.futureSubjectList) {
      if (
        attendance.term === "" ||
        attendance.subject === "" ||
        attendance.mandatory === ""
      ) {
        return true;
      }
    }
  };

  /**
   * Returns true if enrolled attendance is not a repeat but there is a
   * previous exam with the same subject.
   */
  isConflictingRepeat = (attendance: ExaminationAttendedSubject) => {
    if (attendance.repeat === "false") {
      return this.getFinishedSubjects().indexOf(attendance.subject) != -1;
    } else {
      return false;
    }
  };

  /**
   * Returns true if there are any conflicting repeats; see isConflictingRepeat.
   */
  hasConflictingRepeats = () => {
    const finishedSubjects = this.getFinishedSubjects();

    return (
      this.state.attendedSubjectList.filter((attendance) => {
        return (
          attendance.repeat === "false" &&
          finishedSubjects.indexOf(attendance.subject) != -1
        );
      }).length > 0
    );
  };

  /**
   * Returns true if there is a finished attendance with the same subject but different mandatory.
   */
  isConflictingMandatory = (attendance: ExaminationAttendedSubject) => {
    return (
      this.state.completedSubjectList.filter((fin) => {
        return (
          fin.subject === attendance.subject &&
          fin.mandatory != attendance.mandatory
        );
      }).length > 0
    );
  };

  /**
   * Returns true if there are any conflicting mandatories; see isConflictingMandatory.
   */
  hasMandatoryConflicts = () => {
    const attendances = [].concat(
      this.state.attendedSubjectList,
      this.state.futureSubjectList
    );
    return (
      attendances.filter((attendance) => {
        return (
          this.state.completedSubjectList.filter((fin) => {
            return (
              fin.subject === attendance.subject &&
              fin.mandatory != attendance.mandatory
            );
          }).length > 0
        );
      }).length > 0
    );
  };

  /**
   * isInvalid
   * @returns boolean
   */
  isInvalid() {
    return (
      this.isConflictingAttendances().length > 0 ||
      this.hasConflictingRepeats() ||
      this.hasMandatoryConflicts() ||
      this.isIncompleteAttendances() ||
      !this.isValidAttendances()
    );
  }

  /**
   * onStudentProfileChange
   * @param key
   * @param value
   */
  onStudentProfileChange = <T extends keyof ExaminationBasicProfile>(
    key: T,
    value: ExaminationBasicProfile[T]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: Examination = {
      ...examination,
      studentProfile: {
        ...examination.studentProfile,
        [key]: value,
      },
    };

    onChange(modifiedExamination);
  };

  /**
   * onStudentInfoChange
   * @param key
   * @param value
   */
  onStudentInfoChange = <T extends keyof ExaminationStudentInfo>(
    key: T,
    value: ExaminationStudentInfo[T]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: Examination = {
      ...examination,
      studentInfo: {
        ...examination.studentInfo,
        [key]: value,
      },
    };

    onChange(modifiedExamination);
  };

  /**
   * onExaminationAttendSubjectListCHange
   * @param examinationSubjectList
   */
  onExaminationAttendSubjectListCHange = (
    examinationSubjectList: ExaminationAttendedSubject[]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: Examination = {
      ...examination,
      attendedSubjectList: examinationSubjectList,
    };

    onChange(modifiedExamination);
  };

  /**
   * onExaminationCompletedSubjectListCHange
   * @param examinationSubjectList
   */
  onExaminationCompletedSubjectListCHange = (
    examinationSubjectList: ExaminationCompletedSubject[]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: Examination = {
      ...examination,
      completedSubjectList: examinationSubjectList,
    };

    onChange(modifiedExamination);
  };

  /**
   * onExaminationFutureSubjectListCHange
   * @param examinationSubjectList
   */
  onExaminationFutureSubjectListCHange = (
    examinationSubjectList: ExaminationFutureSubject[]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: Examination = {
      ...examination,
      futureSubjectList: examinationSubjectList,
    };

    onChange(modifiedExamination);
  };

  render() {
    const { saveState, draftSaveErrorMsg } = this.props;

    const {
      studentProfile,
      studentInfo,
      attendedSubjectList,
      completedSubjectList,
      futureSubjectList,
    } = this.state;

    /**
     * saving draft error popper
     */
    const savingDraftError = (
      <div
        className={`matriculation__saving-draft matriculation__saving-draft--error ${
          draftSaveErrorMsg
            ? "matriculation__saving-draft--fade-in"
            : "matriculation__saving-draft--fade-out"
        }`}
      >
        <h3 className="matriculation__saving-draft-title">
          Luonnoksen tallentaminen epäonnistui!
        </h3>
        <p>{draftSaveErrorMsg}</p>
      </div>
    );

    /**
     * saving draft info popper
     */
    const savingDraftInfo = (
      <div
        className={`matriculation__saving-draft matriculation__saving-draft--info ${
          saveState === "SAVING_DRAFT" || saveState === "DRAFT_SAVED"
            ? "matriculation__saving-draft--fade-in"
            : "matriculation__saving-draft--fade-out"
        }`}
      >
        <h3 className="matriculation__saving-draft-title">
          {saveState === "SAVING_DRAFT"
            ? "Tallennetaan luonnosta"
            : "Luonnos tallennettu"}
          {saveState === "SAVING_DRAFT" && this.renderAnimatedDots()}
        </h3>
      </div>
    );

    return (
      <div className="matriculation-container">
        {savingDraftError}
        {savingDraftInfo}
        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">Perustiedot</legend>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Nimi"
                readOnly
                type="text"
                value={studentProfile.name}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Henkilötunnus"
                readOnly
                type="text"
                value={studentProfile.profileId}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Sähköpostiosoite"
                readOnly
                type="text"
                value={studentProfile.email}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Puhelinnumero"
                readOnly
                type="text"
                value={studentProfile.phoneNumber}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Osoite"
                readOnly
                type="text"
                value={studentProfile.address}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Postinumero"
                readOnly
                type="text"
                value={studentProfile.zipCode}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Postitoimipaikka"
                readOnly
                type="text"
                value={studentProfile.postalDisctrict}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <Textarea
                onChange={(e) =>
                  this.onStudentProfileChange("descriptionInfo", e.target.value)
                }
                label="Jos tietosi ovat muuttuneet, ilmoita siitä tässä"
                value={studentProfile.descriptionInfo}
                className="matriculation__textarea"
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">Opiskelijatiedot</legend>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                onChange={(e) =>
                  this.onStudentInfoChange("superVisor", e.target.value)
                }
                label="Ohjaaja"
                value={studentInfo.superVisor}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label>Ilmoittautuminen</label>
              <select
                onChange={(e) =>
                  this.onStudentInfoChange(
                    "registrationType",
                    e.currentTarget.value
                  )
                }
                className="matriculation__select"
              >
                <option value="UPPERSECONDARY">Lukion opiskelijana</option>
                <option value="VOCATIONAL">
                  Ammatillisten opintojen perusteella
                </option>
                <option value="UNKNOWN">Muu tausta</option>
              </select>
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                type="number"
                onChange={(e) =>
                  this.onStudentInfoChange(
                    "courseCount",
                    parseInt(e.target.value || "0")
                  )
                }
                label="Pakollisia kursseja suoritettuna"
                value={studentInfo.courseCount}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label className="matriculation__label">Tutkintotyyppi</label>
              <select
                onChange={(e) =>
                  this.onStudentInfoChange("degreeType", e.currentTarget.value)
                }
                className="matriculation__select"
              >
                <option value="MATRICULATIONEXAMINATION">Yo-tutkinto</option>
                <option value="MATRICULATIONEXAMINATIONSUPPLEMENT">
                  Tutkinnon korottaja tai täydentäjä
                </option>
                <option value="SEPARATEEXAM">
                  Erillinen koe (ilman yo-tutkintoa)
                </option>
              </select>
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container matriculation__form-element-container--single-row">
              <label className="matriculation__label">Aloitan tutkinnon suorittamisen uudelleen&nbsp;</label>
              <input
                onChange={(e) =>
                  this.onStudentInfoChange(
                    "refreshingExamination",
                    e.currentTarget.value
                  )
                }
                type="checkbox"
                className="matriculation__input"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">Olen jo suorittanut seuraavat ylioppilaskokeet</legend>
          <MatriculationExaminationCompletedSelectsList
            enrolledAttendances={attendedSubjectList}
            examinationCompletedList={completedSubjectList}
            pastOptions={getPastTermOptions()}
            onChange={this.onExaminationCompletedSubjectListCHange}
            onDeleteRow={this.deleteFinishedAttendance}
          />
          <div className="matriculation-container__row">
            <Button
              buttonModifiers={"add-matriculation-row"}
              onClick={this.newFinishedAttendance}
            >
              <span className="icon-plus"></span>
              Lisää uusi rivi
            </Button>
          </div>
        </fieldset>

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            {`Ilmoittaudun suorittamaan kokeen seuraavissa aineissa `}
            <b>
              {resolveCurrentTerm() ? resolveCurrentTerm().adessive : "Virhe"}
            </b>
          </legend>
          <MatriculationExaminationSubjectSelectsList
            isConflictingMandatory={this.isConflictingMandatory}
            isConflictingRepeat={this.isConflictingRepeat}
            conflictingAttendancesGroup={this.isConflictingAttendances()}
            examinationSubjectList={attendedSubjectList}
            onChange={this.onExaminationAttendSubjectListCHange}
            onDeleteRow={this.deleteEnrolledAttendance}
          />
          <div className="matriculation-container__row">
            <Button
              buttonModifiers={"add-matriculation-row"}
              onClick={this.newEnrolledAttendance}
            >
              <span className="icon-plus"></span>
              Lisää uusi rivi
            </Button>
          </div>
        </fieldset>

        {this.isConflictingAttendances().length > 0 ? (
          <div className="matriculation__warning">
            Olet ilmoittautumassa kokeisiin, joita ei voi valita
            samanaikaisesti. Kysy tarvittaessa lisää ohjaajalta.
            <h4>Aineet:</h4>
            {this.isConflictingAttendances().map((cGroup, index) => {
              return (
                <div key={index}>
                  <hr />
                  <ul>
                    {cGroup.map((cSubject, index) => (
                      <li key={index}> {SUBJECT_MAP[cSubject]} </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : null}

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa
          </legend>
          <MatriculationExaminationFutureSelectsList
            enrolledAttendances={attendedSubjectList}
            examinationFutureList={futureSubjectList}
            nextOptions={getNextTermOptions()}
            onChange={this.onExaminationFutureSubjectListCHange}
            onDeleteRow={this.deletePlannedAttendance}
          />
          <div className="matriculation-container__row">
            <Button
              buttonModifiers={"add-matriculation-row"}
              onClick={this.newPlannedAttendance}
            >
              <span className="icon-plus"></span>
              Lisää uusi rivi
            </Button>
          </div>
        </fieldset>

        {this.isIncompleteAttendances() ? (
          <div className="matriculation__warning">
            Ole hyvä ja täytä kaikki rivit
          </div>
        ) : null}

        {this.hasMandatoryConflicts() ? (
          <div className="matriculation-container__mandatory-conflicts">
            <div className="matriculation-container__mandatory-conflicts-indicator"></div>
            <p>
              Ainetta uusittaessa pakollisuustiedon on oltava sama kuin
              aiemmalla suorituskerralla
            </p>
          </div>
        ) : null}

        {this.hasConflictingRepeats() ? (
          <div className="matriculation-container__repeat-conflicts">
            <div className="matriculation-container__repeat-conflicts-indicator"></div>
            <p>
              Aine on merkittävä uusittavaksi, kun siitä on aiempi suorituskerta
            </p>
          </div>
        ) : null}

        {this.getAmountOfFinnishAttendances() == REQUIRED_FINNISH_ATTENDANCES &&
        this.getAmountOfMandatoryAttendances() ==
          REQUIRED_MANDATORY_ATTENDANCES &&
        this.getAmountOfAcademicSubjectAttendances() <
          REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN &&
        this.getAmountOfMandatoryAdvancedSubjectAttendances() >
          REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN ? null : (
          <div className="matriculation-container__state state-INFO">
            <p>Ylioppilastutkintoon tulee sisältyä</p>
            <ul>
              <li>
                äidinkieli / suomi toisena kielenä
                {this.getAmountOfFinnishAttendances() ==
                REQUIRED_FINNISH_ATTENDANCES
                  ? ""
                  : " (ei valittuna)"}
              </li>
              <li>
                neljä pakollista koetta
                {this.getAmountOfMandatoryAttendances() ==
                REQUIRED_MANDATORY_ATTENDANCES
                  ? ""
                  : ` (valittuna ${this.getAmountOfMandatoryAttendances()})`}
              </li>
              <li>
                vähintään yksi A-tason koe
                {this.getAmountOfMandatoryAdvancedSubjectAttendances() > 0
                  ? ""
                  : ` (valittuna ${this.getAmountOfMandatoryAdvancedSubjectAttendances()})`}
              </li>
              <li>
                vain yksi pakollinen reaaliaine, jos kirjoitat yhden tai
                useamman reaaliaineen.
                {this.getAmountOfAcademicSubjectAttendances() < 2
                  ? ""
                  : ` (valittuna ${this.getAmountOfAcademicSubjectAttendances()})`}
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  /**
   * renderAnimatedDots
   * @returns
   */
  renderAnimatedDots = () => {
    return (
      <>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </>
    );
  };
}

export default MatriculationExaminationEnrollmentInformation;
