import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { MatriculationExaminationEnrolledAttendesList } from "./matriculationExaminationSelectLists/matriculation-examination-enrolled-attendes-list";
import { MatriculationExaminationFinishedAttendesList } from "./matriculationExaminationSelectLists/matriculation-examination-finished-attendes-list";
import { MatriculationExaminationPlannedAttendesList } from "./matriculationExaminationSelectLists/matriculation-examination-planned-attendes-list";
import { Textarea } from "./textarea";
import { TextField } from "./textfield";
import Button from "~/components/general/button";
import {
  getDefaultNextTerm,
  getDefaultPastTerm,
} from "~/helper-functions/matriculation-functions";
import {
  SUBJECT_MAP,
  FINNISH_SUBJECTS,
  ADVANCED_SUBJECTS,
  EXAMINATION_SUCCESS_GRADES_MAP,
} from "./index";

import {
  SaveState,
  ExaminationInformation,
  ExaminationEnrolledSubject,
  ExaminationFinishedSubject,
  ExaminationPlannedSubject,
  ExaminationFunding,
} from "~/@types/shared";

import {
  resolveCurrentTerm,
  getNextTermOptions,
  getPastTermOptions,
} from "~/helper-functions/matriculation-functions";
import { ExamEnrollmentDegreeStructure } from "~/@types/shared";

//Specific rules for old form

/**
 * Required amount attendances for valid Examination (vähintään 5 suoritusta)
 */
export const REQUIRED_AMOUNT_OF_ATTENDACNES = 5;

/**
 * Required amount finnish attendances (äidinkieli/suomi toisena kielenä)
 */
const REQUIRED_FINNISH_ATTENDANCES = 1;

/**
 * Required amount of other attendances beside finnish (4 koetta äidinkielen lisäksi)
 */
const REQUIRED_AMOUNT_OTHER_ATTENDANCES = 4;

/**
 * Required amount different attendance groups (4 koetta kolmesta ryhmästä)
 */
const REQUIRED_AMOUNT_DIFFERENT_ATTENDACE_GROUPS = 3;

/**
 * Required amount advanced subject (A-tason koe)
 */
const REQUIRED_AMOUNT_ADVANCED_SUBJECT = 1;

/**
 * Required num of courses for to attend examination
 */
const REQUIRED_NUM_OF_COURSES = 20;

const REQUIRED_GROUPS = [
  [
    "ENA",
    "RAA",
    "ESA",
    "SAA",
    "VEA",
    "RUA",
    "RUB",
    "ENC",
    "RAC",
    "ESC",
    "SAC",
    "VEC",
    "ITC",
    "POC",
    "LAC",
    "SM_DC",
    "SM_ICC",
    "SM_QC",
  ],
  ["MAA", "RUA", "ENA", "RAA", "ESA", "SAA", "VEA"],
  ["UE", "ET", "YO", "KE", "GE", "TT", "PS", "FI", "HI", "FY", "BI"],
  ["MAA", "MAB"],
];

/**
 * MatriculationExaminationEnrollmentInformationProps
 */
interface MatriculationExaminationEnrollmentInformationNewProps {
  examination: ExaminationInformation;
  saveState?: SaveState;
  draftSaveErrorMsg?: string;
  compulsoryEducationEligible: boolean;
  onChange: (examination: ExaminationInformation) => void;
}

type MatriculationExaminationEnrollmentInformationNewState =
  ExaminationInformation;

/**
 * MatriculationExaminationEnrollmentInformation
 */
export class MatriculationExaminationEnrollmentInformationNew extends React.Component<
  MatriculationExaminationEnrollmentInformationNewProps,
  MatriculationExaminationEnrollmentInformationNewState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MatriculationExaminationEnrollmentInformationNewProps) {
    super(props);

    this.state = {
      name: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      locality: "",
      changedContactInfo: "",
      guider: "",
      enrollAs: "UPPERSECONDARY",
      degreeType: "MATRICULATIONEXAMINATION",
      numMandatoryCourses: "",
      restartExam: false,
      location: "Mikkeli",
      message: "",
      studentIdentifier: "",
      initialized: false,
      enrolledAttendances: [],
      plannedAttendances: [],
      finishedAttendances: [],
      canPublishName: "true",
      enrollmentSent: false,
      guidanceCounselor: "",
      ssn: null,
      date: "",
      degreeStructure: ExamEnrollmentDegreeStructure.PRE2022,
    };

    this.isValidated = this.isValidated.bind(this);
  }

  /**
   * Set props to state
   */
  componentDidMount = () => {
    this.setState(this.props.examination);
  };

  /**
   * Updates props to state
   * @param prevProps prevProps
   */
  componentDidUpdate = (
    prevProps: MatriculationExaminationEnrollmentInformationNewProps
  ) => {
    if (this.props !== prevProps) {
      this.setState(this.props.examination);
    }
  };

  /**
   * This is for StepZilla way to validated "step"
   * that locks users way to get further in form
   * before all data is given and valitated
   * @returns boolean
   */
  isValidated = () => !this.isInvalid();

  /**
   * Returns next non selected subject from subjects list
   *
   * @param selectedSubjects list of selected subjects
   * @returns next non selected subject from subjects list
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
  getEnrolledSubjects = () =>
    this.state.enrolledAttendances.map((attendance) => attendance.subject);

  /**
   * Returns list of planned subjects from planned attendances lists
   *
   * @returns list of planned subjects from planned attendances lists
   */
  getPlannedSubjects = () =>
    this.state.plannedAttendances.map((attendance) => attendance.subject);

  /**
   * getPlannedNonDublicatedSubjects
   */
  getPlannedNonDublicatedSubjects = () =>
    this.state.plannedAttendances.map((attendance) => attendance.subject);

  /**
   * Returns list of finished subjects from finished attendances lists
   *
   * @returns list of finished subjects from finished attendances lists
   */
  getFinishedSubjects = () =>
    this.state.finishedAttendances.map((attendance) => attendance.subject);

  /**
   * Returns an array of attendances which includes enrolledAttendances
   * and such finishedAttendances that have subjects not yet included from the previous
   * two lists.
   *
   * I.e. the array is missing the duplicates (repeated exams) which come from finished list.
   */
  getNonDuplicateAttendances = () => {
    const attendances = [].concat(this.state.enrolledAttendances);

    const attendedSubjects = attendances.map(
      (attendance) => attendance.subject
    );

    this.state.finishedAttendances.forEach((finishedAttendance) => {
      if (attendedSubjects.indexOf(finishedAttendance.subject) === -1) {
        attendances.push(finishedAttendance);
      }
    });

    return attendances;
  };

  /**
   * getNonDuplicateAttendanceEnrolledAndPlanned
   */
  getNonDuplicateAttendanceEnrolledAndPlanned = () => {
    const attendances = [].concat(
      this.state.enrolledAttendances,
      this.state.plannedAttendances
    );

    const attendedSubjects = attendances.map(
      (attendance) => attendance.subject
    );

    this.state.finishedAttendances.forEach((finishedAttendance) => {
      if (attendedSubjects.indexOf(finishedAttendance.subject) === -1) {
        attendances.push(finishedAttendance);
      }
    });

    return attendances;
  };

  /**
   * getNonDuplicateAttendanceEnrolledAndPlanned
   */
  getNonDuplicateAttendanceEnrolledAndPlannedExcludingNotSucceed = () => {
    const attendances = [
      ...this.state.enrolledAttendances,
      ...this.state.plannedAttendances,
    ];

    const succesfullyFinishedExams = this.getSuccesfulFinishedExams();

    const attendedSubjects = attendances
      .map((attendance) => attendance.subject)
      .filter((subject) => succesfullyFinishedExams.indexOf(subject) !== -1);

    this.state.finishedAttendances
      .filter(
        (fAttendance) =>
          succesfullyFinishedExams.indexOf(fAttendance.subject) !== -1
      )
      .forEach((finishedAttendance) => {
        if (attendedSubjects.indexOf(finishedAttendance.subject) === -1) {
          attendances.push(finishedAttendance);
        }
      });

    return attendances;
  };

  /**
   * getFailedExamsBySomeOtherReason
   * @returns list of exams that are failed for some other reasons
   */
  getFailedExamsBySomeOtherReason = () => {
    const failedExamsBySomeOtherReason: string[] = [];

    this.state.finishedAttendances.forEach((item) => {
      if (item.grade === "K") {
        failedExamsBySomeOtherReason.push(item.subject);
      }
    });

    return failedExamsBySomeOtherReason;
  };

  /**
   * getSuccesfulFinishedExams
   * @returns list of exams that ure completed with succesful grade
   */
  getSuccesfulFinishedExams = () => {
    const succesfulFinishedExams: string[] = [];

    this.state.finishedAttendances.forEach((item) => {
      if (EXAMINATION_SUCCESS_GRADES_MAP.includes(item.grade)) {
        succesfulFinishedExams.push(item.subject);
      }
    });

    return succesfulFinishedExams;
  };

  /**
   * getRenewableForFreeFinishedAttendances
   * @returns Array of failed attendaces with IMPROBATUR GRADE
   */
  getRenewableForFreeFinishedAttendances = () => {
    const renewableForFree: string[] = [];

    this.state.finishedAttendances.forEach((item) => {
      if (item.grade === "IMPROBATUR") {
        renewableForFree.push(item.subject);
      }
    });

    return renewableForFree;
  };

  /**
   * getNonRenewableForFreeFinishedAttendances
   * @returns Array of non renewable for free list
   */
  getNonRenewableForFreeFinishedAttendances = () => [
    ...this.getSuccesfulFinishedExams(),
    ...this.getFailedExamsBySomeOtherReason(),
  ];

  /**
   * getAmountOfChoosedAttendances
   * @returns number of choosed attendance including enrolled and finished excluding dublicated attendances
   */
  getAmountOfChoosedAttendances = () =>
    this.getNonDuplicateAttendanceEnrolledAndPlanned().length;

  /**
   *getAmountOfChoosedAttendancesEnrolledAndPlanned
   */
  getAmountOfChoosedAttendancesEnrolledAndPlanned = () =>
    this.getNonDuplicateAttendanceEnrolledAndPlanned().length;

  /**
   * Returns count of attendances in finnish courses.
   *
   * @returns count of attendances in finnish courses
   */
  getAmountOfFinnishAttendances = () =>
    this.getNonDuplicateAttendanceEnrolledAndPlanned().filter(
      (attendance) => FINNISH_SUBJECTS.indexOf(attendance.subject) !== -1
    ).length;

  /**
   * getFinnishAttendance
   * @returns Array of finnish attendances
   */
  getFinnishAttendance = () => {
    const array: string[] = [];

    this.getNonDuplicateAttendanceEnrolledAndPlanned().map((attendance) => {
      if (FINNISH_SUBJECTS.includes(attendance.subject)) {
        const index = FINNISH_SUBJECTS.findIndex(
          (item) => item === attendance.subject
        );

        array.push(FINNISH_SUBJECTS[index]);
      }
    });

    return array;
  };

  /**
   * Returns whether user has valid amount of attendances in mandatory advanced subjects
   *
   * @returns whether user has valid amount of attendances in mandatory advanced subjects
   */
  getAmountOfAdvancedSubjectAttendances = () =>
    this.getNonDuplicateAttendanceEnrolledAndPlanned().filter(
      (attendance) => ADVANCED_SUBJECTS.indexOf(attendance.subject) !== -1
    ).length;

  /**
   * getSucceedExams
   * @returns amount of succeed exams
   */
  getSucceedExams = () =>
    this.state.finishedAttendances.length > 0
      ? this.state.finishedAttendances.map((item) => {
          if (item.grade !== "IMPROBATUR" && item.grade !== "K") {
            return item.subject;
          }
        })
      : [];

  /**
   * getAmountOfSucceedExams
   * @returns amount of succeed exams
   */
  getAmountOfSucceedExams = () => {
    let amountOfExamsWithOtherThanImprobatur = 0;
    let amountOFailedForOtherReasons = 0;

    this.state.finishedAttendances.map((item) => {
      if (item.grade !== "IMPROBATUR") {
        amountOfExamsWithOtherThanImprobatur++;
      }
      if (item.grade === "K") {
        amountOFailedForOtherReasons++;
      }
    });

    return amountOfExamsWithOtherThanImprobatur - amountOFailedForOtherReasons;
  };

  /**
   * getAmountOfFreeAttendances
   * @returns amountOfFreeAttendances
   */
  getAmountOfFreeAttendances = () => {
    const nonDublicatedAttendance:
      | ExaminationEnrolledSubject[]
      | ExaminationFinishedSubject[] =
      this.getNonDuplicateAttendanceEnrolledAndPlanned();

    let amountOfFreeAttendances = 0;

    [...nonDublicatedAttendance].map((item) => {
      if (item.funding === ExaminationFunding.COMPULSORYEDUCATION_FREE) {
        amountOfFreeAttendances++;
      }
    });

    return amountOfFreeAttendances;
  };

  /**
   * getAmountOfFreeRepeats
   * @returns amountOfFreeRepeats
   */
  getAmountOfFreeRepeats = () => {
    const nonDublicatedAttendance:
      | ExaminationEnrolledSubject[]
      | ExaminationFinishedSubject[] =
      this.getNonDuplicateAttendanceEnrolledAndPlanned();

    let amountOfFreeRepeats = 0;

    const renewableForFreeExams = this.getRenewableForFreeFinishedAttendances();

    [...nonDublicatedAttendance].map((item) => {
      if (
        renewableForFreeExams.includes(item.subject) &&
        item.funding === ExaminationFunding.COMPULSORYEDUCATION_FREE_RETRY
      ) {
        amountOfFreeRepeats++;
      }
    });

    return amountOfFreeRepeats;
  };

  /**
   * Returns whether user has valid amount of attendances in mandatory advanced subjects
   *
   * Attendances with grade IMPROBATUR are ignored while counting attendances
   *
   * @returns whether user has valid amount of attendances in mandatory advanced subjects
   */
  getAmountOfMandatoryAdvancedSubjectAttendances() {
    return this.getNonDuplicateAttendanceEnrolledAndPlanned().filter(
      (attendance) => ADVANCED_SUBJECTS.indexOf(attendance.subject) !== -1
    ).length;
  }

  /**
   * getAmountOfChoosedGroups
   */
  getAmountOfChoosedGroups = () => {
    const nonDublicatedAttendaces =
      this.getNonDuplicateAttendanceEnrolledAndPlanned();

    const subjectCodes: string[] = [];

    /**
     * Creates array of string from attendance subject codes
     */
    for (const attendance of nonDublicatedAttendaces) {
      subjectCodes.push(attendance.subject);
    }

    const choosedGroups: string[][] = [];

    for (const group of REQUIRED_GROUPS) {
      let groupChoosed = false;
      if (!groupChoosed) {
        for (const sCode of subjectCodes) {
          if (!groupChoosed) {
            if (group.includes(sCode)) {
              groupChoosed = true;
              choosedGroups.push(group);
            }
          }
        }
      }
    }

    return choosedGroups.length;
  };

  /**
   * isValidExamination
   * @returns whether examination is valid, and with selection student can graduate from
   */
  isValidExamination = () => {
    /**
     * Difference when finnish language or finnish as secondary language
     * is subracted from enrolled and succesfully finished exams and
     * planned exams
     */
    const difference =
      this.getSuccesfulFinishedExams().length +
      this.getNonDuplicateAttendanceEnrolledAndPlannedExcludingNotSucceed()
        .length -
      this.getAmountOfFinnishAttendances();

    const sum =
      this.getAmountOfSucceedExams() +
      (this.getNonDuplicateAttendanceEnrolledAndPlannedExcludingNotSucceed()
        .length -
        this.getAmountOfSucceedExams());

    return (
      this.getAmountOfFinnishAttendances() == REQUIRED_FINNISH_ATTENDANCES &&
      sum >= REQUIRED_AMOUNT_OF_ATTENDACNES &&
      this.getAmountOfMandatoryAdvancedSubjectAttendances() >=
        REQUIRED_AMOUNT_ADVANCED_SUBJECT &&
      this.getAmountOfChoosedGroups() >=
        REQUIRED_AMOUNT_DIFFERENT_ATTENDACE_GROUPS &&
      difference >= REQUIRED_AMOUNT_OTHER_ATTENDANCES
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
    for (const attendance of this.state.enrolledAttendances) {
      subjectCodes.push(attendance.subject);
    }

    let conflictedGroups = [];

    /**
     * Creates list of conflicted group by subject that conflicts together
     * This will create duplicated of same items to array that are removed later
     */
    for (const group of conflictingGroups) {
      for (const subject1 of subjectCodes) {
        for (const subject2 of subjectCodes) {
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
   * Checks if any attendes has empty values
   * @returns boolean
   */
  isIncompleteAttendances = (): boolean => {
    for (const attendance of this.state.enrolledAttendances) {
      if (
        attendance.subject === "" ||
        attendance.mandatory === "" ||
        attendance.repeat === "" ||
        attendance.funding === ""
      ) {
        return true;
      }
    }
    for (const attendance of this.state.finishedAttendances) {
      if (
        attendance.term === "" ||
        attendance.subject === "" ||
        attendance.mandatory === "" ||
        attendance.grade === "" ||
        attendance.funding === ""
      ) {
        return true;
      }
    }
    for (const attendance of this.state.plannedAttendances) {
      if (
        attendance.term === "" ||
        attendance.subject === "" ||
        attendance.mandatory === ""
      ) {
        return true;
      }
    }
    return false;
  };

  /**
   * Returns true if enrolled attendance is not a repeat but there is a
   * previous exam with the same subject.
   * @param attendance attendance
   */
  isConflictingRepeat = (attendance: ExaminationEnrolledSubject) => {
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
      this.state.enrolledAttendances.filter(
        (attendance) =>
          attendance.repeat === "false" &&
          finishedSubjects.indexOf(attendance.subject) != -1
      ).length > 0
    );
  };

  /**
   * Checks if any of choosed enrolled exams are renewable for free
   * @returns Boolean if renewable for free exams are chosed to be renewal for free
   */
  isRenewableForFreeChosed = () => {
    const { enrolledAttendances } = this.state;

    const nonRenewableForFree = this.getRenewableForFreeFinishedAttendances();

    for (const enrolledItem of enrolledAttendances) {
      if (nonRenewableForFree.includes(enrolledItem.subject)) {
        if (
          enrolledItem.funding !==
          ExaminationFunding.COMPULSORYEDUCATION_FREE_RETRY
        ) {
          return false;
        }
      }
    }
    return true;
  };

  /**
   * isFundingsValid
   */
  isFundingsValid = () => {
    const { compulsoryEducationEligible } = this.props;

    if (compulsoryEducationEligible) {
      const amountOfFreeAttendances = this.getAmountOfFreeAttendances();
      const amountOfFreeRepeats = this.getAmountOfFreeRepeats();

      if (amountOfFreeAttendances + amountOfFreeRepeats > 5) {
        return false;
      }
    }

    return true;
  };

  /**
   * Checks if form has any conflicted courses selected
   * @returns boolean
   */
  isInvalid = () =>
    this.isConflictingAttendances().length > 0 ||
    this.hasConflictingRepeats() ||
    this.isIncompleteAttendances() ||
    this.state.enrolledAttendances.length <= 0;

  /**
   * handles adding new enrolled attendes to list and passed modfied examination information to parent
   */
  handleNewEnrolledAttendanceClick = () => {
    const { examination, onChange, compulsoryEducationEligible } = this.props;
    const { degreeType } = this.state;

    const enrolledAttendances = this.state.enrolledAttendances;

    const funding =
      compulsoryEducationEligible &&
      degreeType !== "MATRICULATIONEXAMINATIONSUPPLEMENT"
        ? this.getAmountOfChoosedAttendances() > REQUIRED_AMOUNT_OF_ATTENDACNES
          ? ""
          : ""
        : ExaminationFunding.SELF_FUNDED;

    enrolledAttendances.push({
      subject: this.getDefaultSubject(this.getEnrolledSubjects()),
      mandatory: "false",
      repeat: "false",
      status: "ENROLLED",
      funding,
    });

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      enrolledAttendances,
    };

    /* modifiedExamination = {
      ...examination,
      ...this.checkAndParseExaminationFundings(modifiedExamination),
    }; */

    onChange(modifiedExamination);
  };

  /**
   * handles adding new finished attendes to list and passed modfied examination information to parent
   */
  handleNewFinishedAttendanceClick = () => {
    const { examination, onChange, compulsoryEducationEligible } = this.props;
    const { degreeType } = this.state;

    const finishedAttendances = this.state.finishedAttendances;

    const funding =
      compulsoryEducationEligible &&
      degreeType !== "MATRICULATIONEXAMINATIONSUPPLEMENT"
        ? this.getAmountOfChoosedAttendances() > REQUIRED_AMOUNT_OF_ATTENDACNES
          ? ""
          : ""
        : ExaminationFunding.SELF_FUNDED;

    finishedAttendances.push({
      term: getDefaultPastTerm().value,
      subject: this.getDefaultSubject(this.getFinishedSubjects()),
      mandatory: "false",
      grade: "",
      status: "FINISHED",
      funding,
    });

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      finishedAttendances,
    };

    /* modifiedExamination = {
      ...examination,
      ...this.checkAndParseExaminationFundings(modifiedExamination),
    }; */

    onChange(modifiedExamination);
  };

  /**
   * handles adding new planned attendes to list and passed modfied examination information to parent
   */
  handleNewPlannedAttendanceClick = () => {
    const { examination, onChange } = this.props;

    const plannedAttendances = this.state.plannedAttendances;

    plannedAttendances.push({
      term: getDefaultNextTerm().value,
      subject: this.getDefaultSubject(this.getPlannedSubjects()),
      mandatory: "false",
      status: "PLANNED",
    });

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      plannedAttendances,
    };

    onChange(modifiedExamination);
  };

  /**
   * handles delete enrolled attendance and passes modified examination information to parent
   * @param i index of enrolled attendacen row which will be deleted
   */
  handleDeleteEnrolledAttendanceRow = (i: number) => () => {
    const { examination, onChange } = this.props;

    const enrolledAttendances = this.state.enrolledAttendances;

    enrolledAttendances.splice(i, 1);

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      enrolledAttendances,
    };

    /* modifiedExamination = {
      ...examination,
      ...this.checkAndParseExaminationFundings(modifiedExamination),
    }; */

    onChange(modifiedExamination);
  };

  /**
   * handles delete finished attendance and passes modified examination information to parent
   * @param i index of finished attendance row which will be deleted
   */
  handleDeleteFinishedAttendanceRow = (i: number) => () => {
    const { examination, onChange } = this.props;

    const finishedAttendances = this.state.finishedAttendances;

    finishedAttendances.splice(i, 1);

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      finishedAttendances,
    };

    /* modifiedExamination = {
      ...examination,
      ...this.checkAndParseExaminationFundings(modifiedExamination),
    }; */

    onChange(modifiedExamination);
  };

  /**
   * handles delete planned attendance and passes modified examination information to parent
   * @param i index of planned attendance row which will be deleted
   */
  handleDeletePlannedAttendanceRow = (i: number) => () => {
    const { examination, onChange } = this.props;

    const plannedAttendances = this.state.plannedAttendances;
    plannedAttendances.splice(i, 1);

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      plannedAttendances,
    };

    onChange(modifiedExamination);
  };

  /**
   * handles examination information changes and passes it to parent component
   * @param key key
   * @param value value
   */
  onExaminationInformationChange = <T extends keyof ExaminationInformation>(
    key: T,
    value: ExaminationInformation[T]
  ) => {
    const { examination, onChange } = this.props;
    const { degreeType } = this.state;

    let modifiedExamination: ExaminationInformation = {
      ...examination,
      [key]: value,
    };

    /**
     * If user restarts Matriculation examination finishedAttendance should be empty list
     */
    if (modifiedExamination.restartExam) {
      modifiedExamination.finishedAttendances = [];
    }

    if (
      modifiedExamination.degreeType !== degreeType &&
      modifiedExamination.degreeType === "MATRICULATIONEXAMINATIONSUPPLEMENT"
    ) {
      modifiedExamination = {
        ...modifiedExamination,
        finishedAttendances: modifiedExamination.finishedAttendances.map(
          (fSubject) => ({
            ...fSubject,
            funding: ExaminationFunding.SELF_FUNDED,
          })
        ),
        enrolledAttendances: modifiedExamination.enrolledAttendances.map(
          (eSubject) => ({
            ...eSubject,
            funding: ExaminationFunding.SELF_FUNDED,
          })
        ),
      };
    }
    if (
      modifiedExamination.degreeType !== degreeType &&
      modifiedExamination.degreeType === "MATRICULATIONEXAMINATION"
    ) {
      modifiedExamination = {
        ...modifiedExamination,
        finishedAttendances: modifiedExamination.finishedAttendances.map(
          (fSubject) => ({
            ...fSubject,
            funding: "",
          })
        ),
        enrolledAttendances: modifiedExamination.enrolledAttendances.map(
          (eSubject) => ({
            ...eSubject,
            funding: "",
          })
        ),
      };
    }

    onChange(modifiedExamination);
  };

  /**
   * handle enrolled attendes list change and passes it to parent component
   * @param examinationSubjectList examinationSubjectList
   */
  handleExaminationEnrolledAttendSubjectListChange = (
    examinationSubjectList: ExaminationEnrolledSubject[]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      enrolledAttendances: examinationSubjectList,
    };

    /* modifiedExamination = {
      ...examination,
      ...this.checkAndParseExaminationFundings(modifiedExamination),
    }; */

    onChange(modifiedExamination);
  };

  /**
   * handles finished attendes list change and passes it to parent component
   * @param examinationSubjectList examinationSubjectList
   */
  handleExaminationFinishedSubjectListChange = (
    examinationSubjectList: ExaminationFinishedSubject[]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      finishedAttendances: examinationSubjectList,
    };

    /* modifiedExamination = {
      ...examination,
      ...this.checkAndParseExaminationFundings(modifiedExamination),
    };
 */
    onChange(modifiedExamination);
  };

  /**
   * handles planned attendes list change
   * @param examinationSubjectList examinationSubjectList
   */
  handleExaminationPlannedSubjectListChange = (
    examinationSubjectList: ExaminationPlannedSubject[]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      plannedAttendances: examinationSubjectList,
    };

    onChange(modifiedExamination);
  };

  /**
   * Render method
   */
  render() {
    const { compulsoryEducationEligible } = this.props;

    const {
      name,
      email,
      phone,
      address,
      postalCode,
      locality,
      ssn,
      restartExam,
      enrollAs,
      degreeType,
      changedContactInfo,
      guider,
      numMandatoryCourses,
      enrolledAttendances,
      plannedAttendances,
      finishedAttendances,
    } = this.state;

    return (
      <div className="matriculation-container">
        {/* <SavingDraftError draftSaveErrorMsg={draftSaveErrorMsg} />
        <SavingDraftInfo saveState={saveState} /> */}
        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Perustiedot
          </legend>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Nimi"
                readOnly
                type="text"
                defaultValue={name}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Henkilötunnus"
                readOnly
                type="text"
                defaultValue={ssn}
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
                defaultValue={email}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Puhelinnumero"
                readOnly
                type="text"
                defaultValue={phone}
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
                defaultValue={address}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Postinumero"
                readOnly
                type="text"
                defaultValue={postalCode}
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
                defaultValue={locality}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <Textarea
                onChange={(e) =>
                  this.onExaminationInformationChange(
                    "changedContactInfo",
                    e.target.value
                  )
                }
                rows={5}
                label="Jos tietosi ovat muuttuneet, ilmoita siitä tässä"
                value={changedContactInfo}
                className="matriculation__textarea"
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Opiskelijatiedot
          </legend>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                onChange={(e) =>
                  this.onExaminationInformationChange("guider", e.target.value)
                }
                label="Ohjaaja"
                defaultValue={guider}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label className="matriculation__label">Ilmoittautuminen</label>
              <select
                onChange={(e) =>
                  this.onExaminationInformationChange(
                    "enrollAs",
                    e.currentTarget.value
                  )
                }
                value={enrollAs}
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
                  this.onExaminationInformationChange(
                    "numMandatoryCourses",
                    e.target.value
                  )
                }
                label="Pakollisia kursseja suoritettuna"
                value={numMandatoryCourses}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label className="matriculation__label">Tutkintotyyppi</label>
              <select
                onChange={(e) =>
                  this.onExaminationInformationChange(
                    "degreeType",
                    e.currentTarget.value
                  )
                }
                value={degreeType}
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

          {enrollAs === "UPPERSECONDARY" && numMandatoryCourses === "" ? (
            <div className="matriculation-container__state state-WARNING">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div className="matriculation-container__state-text">
                <p>
                  Ole hyvä ja täytä suoritettujen pakollisten kurssien
                  lukumäärä.
                </p>
              </div>
            </div>
          ) : null}

          {enrollAs === "UPPERSECONDARY" &&
          numMandatoryCourses !== "" &&
          parseInt(numMandatoryCourses) < REQUIRED_NUM_OF_COURSES ? (
            <div className="matriculation-container__state state-WARNING">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div className="matriculation-container__state-text">
                <p>
                  Sinulla ei ole tarpeeksi pakollisia opintoja suoritettuna.
                </p>
              </div>
            </div>
          ) : null}

          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container matriculation__form-element-container--single-row">
              <label className="matriculation__label">
                Aloitan tutkinnon suorittamisen uudelleen
              </label>
              <input
                onChange={(e) =>
                  this.onExaminationInformationChange(
                    "restartExam",
                    e.target.checked
                  )
                }
                checked={Boolean(restartExam)}
                type="checkbox"
                className="matriculation__input"
              />
            </div>
          </div>
        </fieldset>

        {!restartExam && (
          <fieldset className="matriculation-container__fieldset">
            <legend className="matriculation-container__subheader">
              Olen jo suorittanut seuraavat ylioppilaskokeet
            </legend>
            <MatriculationExaminationFinishedAttendesList
              enrolledAttendances={enrolledAttendances}
              examinationFinishedList={finishedAttendances}
              pastOptions={getPastTermOptions()}
              onChange={this.handleExaminationFinishedSubjectListChange}
              onDeleteRow={this.handleDeleteFinishedAttendanceRow}
              useMandatorySelect={false}
              useFundingSelect={
                degreeType !== "MATRICULATIONEXAMINATIONSUPPLEMENT" &&
                compulsoryEducationEligible
              }
            />
            <div className="matriculation-container__row">
              <Button
                buttonModifiers={"add-matriculation-row"}
                onClick={this.handleNewFinishedAttendanceClick}
                icon="plus"
              >
                Lisää uusi rivi
              </Button>
            </div>
          </fieldset>
        )}

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            {`Ilmoittaudun suorittamaan kokeen seuraavissa aineissa `}
            <b>
              {resolveCurrentTerm() ? resolveCurrentTerm().adessive : "Virhe"}
            </b>
          </legend>
          <MatriculationExaminationEnrolledAttendesList
            isConflictingRepeat={this.isConflictingRepeat}
            conflictingAttendancesGroup={this.isConflictingAttendances()}
            failedFinishedList={this.getRenewableForFreeFinishedAttendances()}
            succesFinishedList={this.getNonRenewableForFreeFinishedAttendances()}
            examinationEnrolledList={enrolledAttendances}
            onChange={this.handleExaminationEnrolledAttendSubjectListChange}
            onDeleteRow={this.handleDeleteEnrolledAttendanceRow}
            useMandatorySelect={false}
            useFundingSelect={
              degreeType !== "MATRICULATIONEXAMINATIONSUPPLEMENT" &&
              compulsoryEducationEligible
            }
          />
          <div className="matriculation-container__row">
            <Button
              buttonModifiers={"add-matriculation-row"}
              onClick={this.handleNewEnrolledAttendanceClick}
              icon="plus"
            >
              Lisää uusi rivi
            </Button>
          </div>

          {this.isConflictingAttendances().length > 0 ? (
            <div className="matriculation-container__state state-WARNING">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div className="matriculation-container__state-text">
                <p>
                  Olet ilmoittautumassa kokeisiin, joita ei voi valita
                  samanaikaisesti. Kysy tarvittaessa lisää ohjaajalta.
                </p>
                <p>
                  <b>Aineet:</b>
                </p>
                {this.isConflictingAttendances().map((cGroup, index) => (
                  <div key={index}>
                    <ul>
                      {cGroup.map((cSubject, index) => (
                        <li key={index}> {SUBJECT_MAP[cSubject]} </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!this.isFundingsValid() ? (
            <div className="matriculation-container__state state-WARNING">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div className="matriculation-container__state-text">
                <p>
                  Tarkista maksullisuus tiedot. Vain viisi maksutonta
                  koesuoritusta
                </p>
              </div>
            </div>
          ) : null}
        </fieldset>

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa
          </legend>
          <MatriculationExaminationPlannedAttendesList
            examinationPlannedList={plannedAttendances}
            nextOptions={getNextTermOptions()}
            onChange={this.handleExaminationPlannedSubjectListChange}
            onDeleteRow={this.handleDeletePlannedAttendanceRow}
            useMandatorySelect={false}
          />
          <div className="matriculation-container__row">
            <Button
              buttonModifiers={"add-matriculation-row"}
              onClick={this.handleNewPlannedAttendanceClick}
              icon="plus"
            >
              Lisää uusi rivi
            </Button>
          </div>

          {this.isIncompleteAttendances() ? (
            <div className="matriculation-container__state state-WARNING">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div className="matriculation-container__state-text">
                <p>Ole hyvä ja täytä kaikki rivit</p>
              </div>
            </div>
          ) : null}
        </fieldset>

        <div className="matriculation-container__indicator-examples">
          {this.hasConflictingRepeats() ? (
            <div className="matriculation-container__repeat-conflicts">
              <div className="matriculation-container__repeat-conflicts-indicator"></div>
              <p>
                Aine on merkittävä uusittavaksi, kun siitä on aiempi
                suorituskerta
              </p>
            </div>
          ) : null}
          {!this.isRenewableForFreeChosed() ? (
            <div className="matriculation-container__repeatable-info">
              <div className="matriculation-container__repeatable-info-indicator"></div>
              <p>
                Arvosanalla IMPROBATUR suorituksen voi uusia maksutta
                Oppivelvollisuus rahoitus (uusinta) -valinnalla
              </p>
            </div>
          ) : null}
        </div>

        {!this.isValidExamination() ||
        this.isInvalid() ||
        this.getAmountOfChoosedAttendancesEnrolledAndPlanned() >=
          REQUIRED_AMOUNT_OF_ATTENDACNES ? (
          <div className="matriculation-container__state state-INFO">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>
                Ylioppilastutkintoon tulee sisältyä vähintään viisi eri
                kirjoitettua ainetta. Halutessasi voit hajauttaa kirjoitukset
                enintään kolmelle kirjoituskerralle.
                {` (Valittuna ${
                  this.getNonDuplicateAttendanceEnrolledAndPlannedExcludingNotSucceed()
                    .length
                })`}
              </p>
              <ul>
                <li>
                  yhden tulee olla äidinkieli / suomi toisena kielenä.
                  {this.getAmountOfFinnishAttendances() ==
                  REQUIRED_FINNISH_ATTENDANCES
                    ? ` (${
                        SUBJECT_MAP[this.getFinnishAttendance()[0]]
                      } valittu)`
                    : null}
                </li>
                <li>
                  neljä muuta ainetta kolmesta seuraavasta aineryhmästä:
                  <ul>
                    <li>vieras kieli</li>
                    <li>toinen kotimainen kieli</li>
                    <li>matematiikka</li>
                    <li>reaali</li>
                  </ul>
                </li>
                <li className="matriculation__hightlighted">
                  lisäksi yhden kokeen tulee olla A-tason koe
                  {this.getAmountOfAdvancedSubjectAttendances() > 0
                    ? ""
                    : ` (valittuna ${this.getAmountOfAdvancedSubjectAttendances()})`}
                </li>
              </ul>

              {compulsoryEducationEligible && (
                <p className="matriculation__hightlighted">
                  Merkitse, mitkä viisi koetta ovat sinulle maksuttomia ja mitkä
                  kokeista maksat itse.
                </p>
              )}
            </div>
          </div>
        ) : null}

        {this.isFundingsValid() &&
        !this.isIncompleteAttendances() &&
        this.isValidExamination() ? (
          <div className="matriculation-container__state state-SUCCESS">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>Näillä valinnoilla voit valmistua ylioppilaaksi!</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default MatriculationExaminationEnrollmentInformationNew;
