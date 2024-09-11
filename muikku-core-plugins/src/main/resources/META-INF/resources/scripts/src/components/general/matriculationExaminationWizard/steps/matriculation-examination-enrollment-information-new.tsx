import * as React from "react";
import "~/sass/elements/matriculation.scss";
import Button from "~/components/general/button";
import {
  getDefaultNextTerm,
  getDefaultPastTerm,
} from "~/helper-functions/matriculation-functions";

import { ExaminationInformation } from "~/@types/shared";

import {
  resolveCurrentTerm,
  getNextTermOptions,
  getPastTermOptions,
} from "~/helper-functions/matriculation-functions";
import { MatriculationExaminationEnrolledAttendesList } from "../matriculationExaminationSelectLists/matriculation-examination-enrolled-attendes-list";
import { MatriculationExaminationFinishedAttendesList } from "../matriculationExaminationSelectLists/matriculation-examination-finished-attendes-list";
import { MatriculationExaminationPlannedAttendesList } from "../matriculationExaminationSelectLists/matriculation-examination-planned-attendes-list";
import { TextField } from "../textfield";
import { useMatriculationContext } from "../context/matriculation-context";
import { SavingDraftError } from "../saving-draft-error";
import { SavingDraftInfo } from "../saving-draft-info";
import { useWizardContext } from "~/components/general/wizard/context/wizard-context";
import {
  MatriculationExamDegreeType,
  MatriculationExamEnrolledSubject,
  MatriculationExamFinishedSubject,
  MatriculationExamFundingType,
  MatriculationExamPlannedSubject,
  MatriculationExamSchoolType,
} from "~/generated/client";
import {
  ADVANCED_SUBJECTS,
  EXAMINATION_SUCCESS_GRADES_MAP,
  FINNISH_SUBJECTS,
} from "~/components/general/matriculationExaminationWizard/helper";
import { useTranslation } from "react-i18next";

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
//const REQUIRED_NUM_OF_COURSES = 20;

/**
 * CHANGE
 */
const REUIRED_NUMB_OF_COURSE_CREDITS = 40;

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
 * OptionType
 */
interface OptionType<T> {
  value: T;
  label: string;
}

/**
 * MatriculationExaminationEnrollmentInformationProps
 */
//interface MatriculationExaminationEnrollmentInformationNewProps {}

/**
 * MatriculationExaminationEnrollmentInformation
 */
export const MatriculationExaminationEnrollmentInformationNew = () => {
  const {
    matriculation,
    compulsoryEducationEligible,
    onExaminationInformationChange,
  } = useMatriculationContext();
  const { examinationInformation, studentInformation, saveState, errorMsg } =
    matriculation;

  const { t } = useTranslation(["hops_new", "common"]);

  const values = useWizardContext();

  /**
   * Returns list of finished subjects from finished attendances lists
   *
   * @returns list of finished subjects from finished attendances lists
   */
  const getFinishedSubjects = React.useCallback(
    () =>
      examinationInformation.finishedAttendances.map(
        (attendance) => attendance.subject
      ),
    [examinationInformation.finishedAttendances]
  );

  /**
   * getNonDuplicateAttendanceEnrolledAndPlanned
   */
  const getNonDuplicateAttendanceEnrolledAndPlanned = () => {
    const attendances = [].concat(
      examinationInformation.enrolledAttendances,
      examinationInformation.plannedAttendances
    );

    const attendedSubjects = attendances.map(
      (attendance) => attendance.subject
    );

    examinationInformation.finishedAttendances.forEach((finishedAttendance) => {
      if (attendedSubjects.indexOf(finishedAttendance.subject) === -1) {
        attendances.push(finishedAttendance);
      }
    });

    return attendances;
  };

  /**
   * getNonDuplicateAttendanceEnrolledAndPlanned
   */
  const getNonDuplicateAttendanceEnrolledAndPlannedExcludingNotSucceed = () => {
    const attendances = [
      ...examinationInformation.enrolledAttendances,
      ...examinationInformation.plannedAttendances,
    ];

    const succesfullyFinishedExams = getSuccesfulFinishedExams();

    const attendedSubjects = attendances
      .map((attendance) => attendance.subject)
      .filter((subject) => succesfullyFinishedExams.indexOf(subject) !== -1);

    examinationInformation.finishedAttendances
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
  const getFailedExamsBySomeOtherReason = () => {
    const failedExamsBySomeOtherReason: string[] = [];

    examinationInformation.finishedAttendances.forEach((item) => {
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
  const getSuccesfulFinishedExams = () => {
    const succesfulFinishedExams: string[] = [];

    examinationInformation.finishedAttendances.forEach((item) => {
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
  const getRenewableForFreeFinishedAttendances = () => {
    const renewableForFree: string[] = [];

    examinationInformation.finishedAttendances.forEach((item) => {
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
  const getNonRenewableForFreeFinishedAttendances = () => [
    ...getSuccesfulFinishedExams(),
    ...getFailedExamsBySomeOtherReason(),
  ];

  /**
   * getAmountOfChoosedAttendances
   * @returns number of choosed attendance including enrolled and finished excluding dublicated attendances
   */
  const getAmountOfChoosedAttendances = () =>
    getNonDuplicateAttendanceEnrolledAndPlanned().length;

  /**
   *getAmountOfChoosedAttendancesEnrolledAndPlanned
   */
  const getAmountOfChoosedAttendancesEnrolledAndPlanned = () =>
    getNonDuplicateAttendanceEnrolledAndPlanned().length;

  /**
   * Returns count of attendances in finnish courses.
   *
   * @returns count of attendances in finnish courses
   */
  const getAmountOfFinnishAttendances = () =>
    getNonDuplicateAttendanceEnrolledAndPlanned().filter(
      (attendance) => FINNISH_SUBJECTS.indexOf(attendance.subject) !== -1
    ).length;

  /**
   * getFinnishAttendance
   * @returns Array of finnish attendances
   */
  const getFinnishAttendance = () => {
    const array: string[] = [];

    getNonDuplicateAttendanceEnrolledAndPlanned().map((attendance) => {
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
  const getAmountOfAdvancedSubjectAttendances = () =>
    getNonDuplicateAttendanceEnrolledAndPlanned().filter(
      (attendance) => ADVANCED_SUBJECTS.indexOf(attendance.subject) !== -1
    ).length;

  /**
   * getAmountOfSucceedExams
   * @returns amount of succeed exams
   */
  const getAmountOfSucceedExams = () => {
    let amountOfExamsWithOtherThanImprobatur = 0;
    let amountOFailedForOtherReasons = 0;

    examinationInformation.finishedAttendances.map((item) => {
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
  const getAmountOfFreeAttendances = () => {
    const nonDublicatedAttendance:
      | MatriculationExamEnrolledSubject[]
      | MatriculationExamFinishedSubject[] =
      getNonDuplicateAttendanceEnrolledAndPlanned();

    let amountOfFreeAttendances = 0;

    [...nonDublicatedAttendance].map((item) => {
      if (
        item.funding === MatriculationExamFundingType.CompulsoryeducationFree
      ) {
        amountOfFreeAttendances++;
      }
    });

    return amountOfFreeAttendances;
  };

  /**
   * getAmountOfFreeRepeats
   * @returns amountOfFreeRepeats
   */
  const getAmountOfFreeRepeats = () => {
    const nonDublicatedAttendance:
      | MatriculationExamEnrolledSubject[]
      | MatriculationExamFinishedSubject[] =
      getNonDuplicateAttendanceEnrolledAndPlanned();

    let amountOfFreeRepeats = 0;

    const renewableForFreeExams = getRenewableForFreeFinishedAttendances();

    [...nonDublicatedAttendance].map((item) => {
      if (
        renewableForFreeExams.includes(item.subject) &&
        item.funding ===
          MatriculationExamFundingType.CompulsoryeducationFreeRetry
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
  const getAmountOfMandatoryAdvancedSubjectAttendances = () =>
    getNonDuplicateAttendanceEnrolledAndPlanned().filter(
      (attendance) => ADVANCED_SUBJECTS.indexOf(attendance.subject) !== -1
    ).length;

  /**
   * getAmountOfChoosedGroups
   */
  const getAmountOfChoosedGroups = () => {
    const nonDublicatedAttendaces =
      getNonDuplicateAttendanceEnrolledAndPlanned();

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
  const isValidExamination = () => {
    /**
     * Difference when finnish language or finnish as secondary language
     * is subracted from enrolled and succesfully finished exams and
     * planned exams
     */
    const difference =
      getSuccesfulFinishedExams().length +
      getNonDuplicateAttendanceEnrolledAndPlannedExcludingNotSucceed().length -
      getAmountOfFinnishAttendances();

    const sum =
      getAmountOfSucceedExams() +
      (getNonDuplicateAttendanceEnrolledAndPlannedExcludingNotSucceed().length -
        getAmountOfSucceedExams());

    return (
      getAmountOfFinnishAttendances() == REQUIRED_FINNISH_ATTENDANCES &&
      sum >= REQUIRED_AMOUNT_OF_ATTENDACNES &&
      getAmountOfMandatoryAdvancedSubjectAttendances() >=
        REQUIRED_AMOUNT_ADVANCED_SUBJECT &&
      getAmountOfChoosedGroups() >=
        REQUIRED_AMOUNT_DIFFERENT_ATTENDACE_GROUPS &&
      difference >= REQUIRED_AMOUNT_OTHER_ATTENDANCES
    );
  };

  /**
   * isConflictingAttendances
   * @returns list of subject groups where subject conflicted together
   */
  const isConflictingAttendances = React.useCallback((): string[][] => {
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
    for (const attendance of examinationInformation.enrolledAttendances) {
      subjectCodes.push(attendance.subject);
    }

    let conflictedGroups = [];

    /**
     * Creates list of conflicted group by subject that conflicts together
     * will create duplicated of same items to array that are removed later
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
  }, [examinationInformation.enrolledAttendances]);

  /**
   * Checks if any attendes has empty values
   * @returns boolean
   */
  const isIncompleteAttendances = React.useCallback((): boolean => {
    for (const attendance of examinationInformation.enrolledAttendances) {
      if (attendance.subject === "") {
        return true;
      }
    }
    for (const attendance of examinationInformation.finishedAttendances) {
      if (
        attendance.term === "" ||
        attendance.subject === "" ||
        attendance.grade === ""
      ) {
        return true;
      }
    }
    for (const attendance of examinationInformation.plannedAttendances) {
      if (attendance.term === "" || attendance.subject === "") {
        return true;
      }
    }
    return false;
  }, [
    examinationInformation.enrolledAttendances,
    examinationInformation.finishedAttendances,
    examinationInformation.plannedAttendances,
  ]);

  /**
   * Returns true if enrolled attendance is not a repeat but there is a
   * previous exam with the same subject.
   * @param attendance attendance
   */
  const isConflictingRepeat = (
    attendance: MatriculationExamEnrolledSubject
  ) => {
    if (attendance.repeat === false) {
      return getFinishedSubjects().indexOf(attendance.subject) != -1;
    } else {
      return false;
    }
  };

  /**
   * Returns true if there are any conflicting repeats; see isConflictingRepeat.
   */
  const hasConflictingRepeats = React.useCallback(() => {
    const finishedSubjects = getFinishedSubjects();

    return (
      examinationInformation.enrolledAttendances.filter(
        (attendance) =>
          attendance.repeat === false &&
          finishedSubjects.indexOf(attendance.subject) != -1
      ).length > 0
    );
  }, [examinationInformation.enrolledAttendances, getFinishedSubjects]);

  /**
   * Checks if any of choosed enrolled exams are renewable for free
   * @returns Boolean if renewable for free exams are chosed to be renewal for free
   */
  const isRenewableForFreeChosed = () => {
    const { enrolledAttendances } = examinationInformation;

    const nonRenewableForFree = getRenewableForFreeFinishedAttendances();

    for (const enrolledItem of enrolledAttendances) {
      if (nonRenewableForFree.includes(enrolledItem.subject)) {
        if (
          enrolledItem.funding !==
          MatriculationExamFundingType.CompulsoryeducationFreeRetry
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
  const isFundingsValid = () => {
    if (compulsoryEducationEligible) {
      const amountOfFreeAttendances = getAmountOfFreeAttendances();
      const amountOfFreeRepeats = getAmountOfFreeRepeats();

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
  const isInvalid = React.useCallback(
    () =>
      isConflictingAttendances().length > 0 ||
      hasConflictingRepeats() ||
      isIncompleteAttendances() ||
      examinationInformation.enrolledAttendances.length <= 0,
    [
      examinationInformation.enrolledAttendances.length,
      hasConflictingRepeats,
      isConflictingAttendances,
      isIncompleteAttendances,
    ]
  );

  /**
   * handles adding new enrolled attendes to list and passed modfied examination information to parent
   */
  const handleNewEnrolledAttendanceClick = () => {
    const { degreeType } = examinationInformation;

    const enrolledAttendances = examinationInformation.enrolledAttendances;

    const funding =
      compulsoryEducationEligible &&
      degreeType !== "MATRICULATIONEXAMINATIONSUPPLEMENT"
        ? getAmountOfChoosedAttendances() > REQUIRED_AMOUNT_OF_ATTENDACNES
          ? undefined
          : undefined
        : MatriculationExamFundingType.SelfFunded;

    enrolledAttendances.push({
      subject: "",
      mandatory: false,
      repeat: false,
      status: "ENROLLED",
      funding,
    });

    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      enrolledAttendances,
    };

    onExaminationInformationChange(modifiedExamination);
  };

  /**
   * handles adding new finished attendes to list and passed modfied examination information to parent
   */
  const handleNewFinishedAttendanceClick = () => {
    const { degreeType } = examinationInformation;

    const finishedAttendances = examinationInformation.finishedAttendances;

    const funding =
      compulsoryEducationEligible &&
      degreeType !== "MATRICULATIONEXAMINATIONSUPPLEMENT"
        ? getAmountOfChoosedAttendances() > REQUIRED_AMOUNT_OF_ATTENDACNES
          ? undefined
          : undefined
        : MatriculationExamFundingType.SelfFunded;

    finishedAttendances.push({
      term: getDefaultPastTerm().value,
      year: null,
      subject: "",
      mandatory: false,
      grade: "",
      status: "FINISHED",
      funding,
    });

    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      finishedAttendances,
    };

    onExaminationInformationChange(modifiedExamination);
  };

  /**
   * handles adding new planned attendes to list and passed modfied examination information to parent
   */
  const handleNewPlannedAttendanceClick = () => {
    const plannedAttendances = examinationInformation.plannedAttendances;

    plannedAttendances.push({
      term: getDefaultNextTerm().value,
      year: null,
      subject: "",
      mandatory: false,
      status: "PLANNED",
    });

    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      plannedAttendances,
    };

    onExaminationInformationChange(modifiedExamination);
  };

  /**
   * handles delete enrolled attendance and passes modified examination information to parent
   * @param i index of enrolled attendacen row which will be deleted
   */
  const handleDeleteEnrolledAttendanceRow = (i: number) => () => {
    const enrolledAttendances = examinationInformation.enrolledAttendances;

    enrolledAttendances.splice(i, 1);

    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      enrolledAttendances,
    };

    onExaminationInformationChange(modifiedExamination);
  };

  /**
   * handles delete finished attendance and passes modified examination information to parent
   * @param i index of finished attendance row which will be deleted
   */
  const handleDeleteFinishedAttendanceRow = (i: number) => () => {
    const finishedAttendances = examinationInformation.finishedAttendances;

    finishedAttendances.splice(i, 1);

    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      finishedAttendances,
    };

    onExaminationInformationChange(modifiedExamination);
  };

  /**
   * handles delete planned attendance and passes modified examination information to parent
   * @param i index of planned attendance row which will be deleted
   */
  const handleDeletePlannedAttendanceRow = (i: number) => () => {
    const plannedAttendances = examinationInformation.plannedAttendances;
    plannedAttendances.splice(i, 1);

    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      plannedAttendances,
    };

    onExaminationInformationChange(modifiedExamination);
  };

  /**
   * handles examination information changes and passes it to parent component
   * @param key key
   * @param value value
   */
  const handleExaminationInformationChange = <
    T extends keyof ExaminationInformation
  >(
    key: T,
    value: ExaminationInformation[T]
  ) => {
    const { degreeType } = examinationInformation;

    let modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
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
            funding: MatriculationExamFundingType.SelfFunded,
          })
        ),
        enrolledAttendances: modifiedExamination.enrolledAttendances.map(
          (eSubject) => ({
            ...eSubject,
            funding: MatriculationExamFundingType.SelfFunded,
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
            funding: undefined,
          })
        ),
        enrolledAttendances: modifiedExamination.enrolledAttendances.map(
          (eSubject) => ({
            ...eSubject,
            funding: undefined,
          })
        ),
      };
    }

    onExaminationInformationChange(modifiedExamination);
  };

  /**
   * handle enrolled attendes list change and passes it to parent component
   * @param examinationSubjectList examinationSubjectList
   */
  const handleExaminationEnrolledAttendSubjectListChange = (
    examinationSubjectList: MatriculationExamEnrolledSubject[]
  ) => {
    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      enrolledAttendances: examinationSubjectList,
    };

    onExaminationInformationChange(modifiedExamination);
  };

  /**
   * handles finished attendes list change and passes it to parent component
   * @param examinationSubjectList examinationSubjectList
   */
  const handleExaminationFinishedSubjectListChange = (
    examinationSubjectList: MatriculationExamFinishedSubject[]
  ) => {
    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      finishedAttendances: examinationSubjectList,
    };

    onExaminationInformationChange(modifiedExamination);
  };

  /**
   * handles planned attendes list change
   * @param examinationSubjectList examinationSubjectList
   */
  const handleExaminationPlannedSubjectListChange = (
    examinationSubjectList: MatriculationExamPlannedSubject[]
  ) => {
    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      plannedAttendances: examinationSubjectList,
    };
    onExaminationInformationChange(modifiedExamination);
  };

  React.useEffect(() => {
    values.isInvalid(isInvalid(), values.currentStepIndex);
  }, [isInvalid, values]);

  const currentTerm = resolveCurrentTerm();

  const addesiveTermLocale =
    currentTerm.value === "AUTUMN"
      ? t("matriculationTerms.AUTUMN", {
          ns: "hops_new",
          context: "adessive",
          year: currentTerm.year,
        })
      : t("matriculationTerms.SPRING", {
          ns: "hops_new",
          context: "adessive",
          year: currentTerm.year,
        });

  const enrollAsOptions: OptionType<MatriculationExamSchoolType>[] = [
    {
      value: "UPPERSECONDARY",
      label: t("enrollAsTypes.UPPERSECONDARY", {
        ns: "hops_new",
      }),
    },
    {
      value: "VOCATIONAL",
      label: t("enrollAsTypes.VOCATIONAL", {
        ns: "hops_new",
      }),
    },
    {
      value: "UNKNOWN",
      label: t("enrollAsTypes.UNKNOWN", {
        ns: "hops_new",
      }),
    },
  ];

  const degreeTypeOptions: OptionType<MatriculationExamDegreeType>[] = [
    {
      value: "MATRICULATIONEXAMINATION",
      label: t("degreeTypes.MATRICULATIONEXAMINATION", {
        ns: "hops_new",
      }),
    },
    {
      value: "MATRICULATIONEXAMINATIONSUPPLEMENT",
      label: t("degreeTypes.MATRICULATIONEXAMINATIONSUPPLEMENT", {
        ns: "hops_new",
      }),
    },
    {
      value: "SEPARATEEXAM",
      label: t("degreeTypes.SEPARATEEXAM", {
        ns: "hops_new",
      }),
    },
  ];

  return (
    <div className="matriculation-container">
      <SavingDraftError draftSaveErrorMsg={errorMsg} />
      <SavingDraftInfo saveState={saveState} />

      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          {t("labels.matriculationFormRegistrationSubTitle1", {
            ns: "hops_new",
          })}
        </legend>

        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container matriculation__form-element-container--single-row">
            <label className="matriculation__label">
              {t("labels.matriculationFormFieldRestart", {
                ns: "hops_new",
              })}
            </label>
            <input
              onChange={(e) =>
                handleExaminationInformationChange(
                  "restartExam",
                  e.target.checked
                )
              }
              checked={Boolean(examinationInformation.restartExam)}
              type="checkbox"
              className="matriculation__input"
            />
          </div>
        </div>

        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <label className="matriculation__label">
              {t("labels.matriculationFormFielRegistrationDone", {
                ns: "hops_new",
              })}
            </label>
            <select
              onChange={(e) =>
                handleExaminationInformationChange(
                  "enrollAs",
                  e.currentTarget.value as MatriculationExamSchoolType
                )
              }
              value={examinationInformation.enrollAs}
              className="matriculation__select"
            >
              {enrollAsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              type="number"
              readOnly
              label={t("labels.matriculationFormFieldMandotryCreditsDone", {
                ns: "hops_new",
              })}
              defaultValue={studentInformation.completedCreditPointsCount}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <label className="matriculation__label">
              {t("labels.matriculationFormFieldDegreeType", {
                ns: "hops_new",
              })}
            </label>
            <select
              onChange={(e) =>
                handleExaminationInformationChange(
                  "degreeType",
                  e.currentTarget.value as MatriculationExamDegreeType
                )
              }
              value={examinationInformation.degreeType}
              className="matriculation__select"
            >
              {degreeTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {examinationInformation.enrollAs === "UPPERSECONDARY" &&
        studentInformation.completedCreditPointsCount &&
        studentInformation.completedCreditPointsCount <
          REUIRED_NUMB_OF_COURSE_CREDITS ? (
          <div className="matriculation-container__state state-WARNING">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>
                {t("content.matriculationFormNotEnoughMandatoryStudies", {
                  ns: "hops_new",
                })}
              </p>
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="matriculation-container__fieldset">
        <div className="matriculation-container__state state-INFO">
          <div className="matriculation-container__state-icon icon-notification"></div>
          <div className="matriculation-container__state-text">
            {compulsoryEducationEligible ? (
              <p className="matriculation-container__info-item">
                {t("content.matriculationFormCompulsoryEligible", {
                  ns: "hops_new",
                })}
              </p>
            ) : (
              <p className="matriculation-container__info-item">
                {t("content.matriculationFormCompulsoryEligibleNot", {
                  ns: "hops_new",
                })}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {!examinationInformation.restartExam && (
        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            {t("labels.matriculationFormRegistrationSubTitle2", {
              ns: "hops_new",
            })}
          </legend>
          <MatriculationExaminationFinishedAttendesList
            enrolledAttendances={examinationInformation.enrolledAttendances}
            examinationFinishedList={examinationInformation.finishedAttendances}
            pastOptions={getPastTermOptions(t)}
            onChange={handleExaminationFinishedSubjectListChange}
            onDeleteRow={handleDeleteFinishedAttendanceRow}
            useMandatorySelect={false}
            useFundingSelect={
              examinationInformation.degreeType !==
                "MATRICULATIONEXAMINATIONSUPPLEMENT" &&
              compulsoryEducationEligible
            }
          />
          <div className="matriculation-container__row">
            <Button
              buttonModifiers={"add-matriculation-row"}
              onClick={handleNewFinishedAttendanceClick}
              icon="plus"
            >
              {t("actions.addNewRow", {
                ns: "hops_new",
              })}
            </Button>
          </div>
        </fieldset>
      )}

      <fieldset className="matriculation-container__fieldset">
        <legend
          className="matriculation-container__subheader"
          dangerouslySetInnerHTML={{
            __html: t("labels.matriculationFormRegistrationSubTitle3", {
              ns: "hops_new",
              term: addesiveTermLocale,
            }),
          }}
        />

        <MatriculationExaminationEnrolledAttendesList
          isConflictingRepeat={isConflictingRepeat}
          conflictingAttendancesGroup={isConflictingAttendances()}
          failedFinishedList={getRenewableForFreeFinishedAttendances()}
          succesFinishedList={getNonRenewableForFreeFinishedAttendances()}
          examinationEnrolledList={examinationInformation.enrolledAttendances}
          onChange={handleExaminationEnrolledAttendSubjectListChange}
          onDeleteRow={handleDeleteEnrolledAttendanceRow}
          useMandatorySelect={false}
          useFundingSelect={
            examinationInformation.degreeType !==
              "MATRICULATIONEXAMINATIONSUPPLEMENT" &&
            compulsoryEducationEligible
          }
        />
        <div className="matriculation-container__row">
          <Button
            buttonModifiers={"add-matriculation-row"}
            onClick={handleNewEnrolledAttendanceClick}
            icon="plus"
          >
            {t("actions.addNewRow", {
              ns: "hops_new",
            })}
          </Button>
        </div>

        {isConflictingAttendances().length > 0 ? (
          <div className="matriculation-container__state state-WARNING">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>
                {t("content.matriculationFormConflictingAttendances", {
                  ns: "hops_new",
                })}
              </p>
              <p>
                <b>
                  {t("labels.matriculationSubjects", {
                    ns: "hops_new",
                  })}
                </b>
              </p>
              {isConflictingAttendances().map((cGroup, index) => (
                <div key={index}>
                  <ul>
                    {cGroup.map((cSubject, index) => (
                      <li key={index}>
                        {t(`subjects.${cSubject}`, {
                          ns: "common",
                          defaultValue: cSubject,
                        })}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {!isFundingsValid() ? (
          <div className="matriculation-container__state state-WARNING">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>
                {t("content.matriculationFormFundingInvalid", {
                  ns: "hops_new",
                })}
              </p>
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          {t("labels.matriculationFormRegistrationSubTitle4", {
            ns: "hops_new",
          })}
        </legend>
        <MatriculationExaminationPlannedAttendesList
          examinationPlannedList={examinationInformation.plannedAttendances}
          nextOptions={getNextTermOptions(t)}
          onChange={handleExaminationPlannedSubjectListChange}
          onDeleteRow={handleDeletePlannedAttendanceRow}
          useMandatorySelect={false}
        />
        <div className="matriculation-container__row">
          <Button
            buttonModifiers={"add-matriculation-row"}
            onClick={handleNewPlannedAttendanceClick}
            icon="plus"
          >
            {t("actions.addNewRow", {
              ns: "hops_new",
            })}
          </Button>
        </div>

        {isIncompleteAttendances() ? (
          <div className="matriculation-container__state state-WARNING">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>
                {t("content.matriculationFormEmptyFields", {
                  ns: "hops_new",
                })}
              </p>
            </div>
          </div>
        ) : null}
      </fieldset>

      <div className="matriculation-container__indicator-examples">
        {hasConflictingRepeats() ? (
          <div className="matriculation-container__repeat-conflicts">
            <div className="matriculation-container__repeat-conflicts-indicator"></div>
            <p>
              {t("content.matriculationFormConflictingRepeats", {
                ns: "hops_new",
              })}
            </p>
          </div>
        ) : null}
        {compulsoryEducationEligible && !isRenewableForFreeChosed() ? (
          <div className="matriculation-container__repeatable-info">
            <div className="matriculation-container__repeatable-info-indicator"></div>
            <p>
              {t("content.matriculationFormCanRenewedForFree", {
                ns: "hops_new",
              })}
            </p>
          </div>
        ) : null}
      </div>

      {!isValidExamination() ||
      isInvalid() ||
      getAmountOfChoosedAttendancesEnrolledAndPlanned() >=
        REQUIRED_AMOUNT_OF_ATTENDACNES ? (
        <div className="matriculation-container__state state-INFO">
          <div className="matriculation-container__state-icon icon-notification"></div>
          <div className="matriculation-container__state-text">
            <p>
              {t("content.matriculationFormInfoBlock1", {
                ns: "hops_new",
                count:
                  getNonDuplicateAttendanceEnrolledAndPlannedExcludingNotSucceed()
                    .length,
              })}
            </p>

            <p
              dangerouslySetInnerHTML={{
                __html:
                  getAmountOfFinnishAttendances() ==
                  REQUIRED_FINNISH_ATTENDANCES
                    ? t("content.matriculationFormInfoBlock2", {
                        ns: "hops_new",
                        subject: t(`subjects.${getFinnishAttendance()[0]}`, {
                          ns: "common",
                          defaultValue: getFinnishAttendance()[0],
                        }),
                      })
                    : t("content.matriculationFormInfoBlock2", {
                        ns: "hops_new",
                      }),
              }}
            />

            <p>
              {t("content.matriculationFormInfoBlock3", {
                ns: "hops_new",
              })}
            </p>

            <ul>
              <li>
                {t("content.matriculationPlanGuideSubject1", {
                  ns: "hops_new",
                })}
              </li>
              <li>
                {t("content.matriculationPlanGuideSubject2", {
                  ns: "hops_new",
                })}
              </li>
              <li>
                {t("content.matriculationPlanGuideSubject3", {
                  ns: "hops_new",
                })}
              </li>
              <li>
                {t("content.matriculationPlanGuideSubject4", {
                  ns: "hops_new",
                })}
              </li>
            </ul>

            <p
              dangerouslySetInnerHTML={{
                __html:
                  getAmountOfAdvancedSubjectAttendances() > 0
                    ? t("content.matriculationFormInfoBlock4", {
                        ns: "hops_new",
                      })
                    : t("content.matriculationFormInfoBlock4", {
                        ns: "hops_new",
                        context: "noSelection",
                      }),
              }}
            />

            {compulsoryEducationEligible && (
              <p className="matriculation__hightlighted">
                {t("content.matriculationFormCompulsoryEligibleInfo", {
                  ns: "hops_new",
                })}
              </p>
            )}
          </div>
        </div>
      ) : null}

      {isFundingsValid() &&
      !isIncompleteAttendances() &&
      isValidExamination() ? (
        <div className="matriculation-container__state state-SUCCESS">
          <div className="matriculation-container__state-icon icon-notification"></div>
          <div className="matriculation-container__state-text">
            <p>
              {t("content.matriculationFormExaminationIsValid", {
                ns: "hops_new",
              })}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MatriculationExaminationEnrollmentInformationNew;
