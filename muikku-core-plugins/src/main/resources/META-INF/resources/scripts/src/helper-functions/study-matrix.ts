import {
  Course,
  SchoolCurriculumMatrix,
  SchoolSubject,
  StudentActivityByStatus,
} from "~/@types/shared";
import { StudentStudyActivity } from "~/generated/client";
import {
  schoolCourseTableUppersecondary2021,
  schoolCourseTableCompulsory2018,
} from "~/mock/mock-data";

export const SKILL_AND_ART_SUBJECTS_CS: string[] = [
  "mu",
  "li",
  "ks",
  "ku",
  "ko",
];

export const OTHER_SUBJECT_OUTSIDE_HOPS_CS: string[] = ["MUU"];

export const LANGUAGE_SUBJECTS_CS: string[] = ["rab", "sab", "eab2", "lab"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RELIGION_SUBJECTS_CS = ["ue", "uo", "et"];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NATIVE_LANGUAGE_SUBJECTS_CS = ["äi", "s2"];

const RELIGION_SUBJECTS_US = ["UE", "UO", "UI", "UK", "UJ", "UX", "ET"];
const NATIVE_LANGUAGE_SUBJECTS_US = ["ÄI", "S2"];
const MATHEMATIC_SUBJECTS_US = ["MAA", "MAB"];
const LANGUAGE_SUBJECTS_A1_US = ["ENA", "RAA", "RUA", "SAA", "VEA"];
const LANGUAGE_SUBJECTS_B1_US = ["RUB1"];
const LANGUAGE_SUBJECTS_B2_US = ["EAB2", "IAB2", "RAB2", "SAB2", "VEB2"];
const LANGUAGE_SUBJECTS_B3_US = [
  "EAB3",
  "IAB3",
  "RAB3",
  "RUB3",
  "SAB3",
  "VEB3",
  "SMB3",
  "LAB3",
  "ARB3",
  "JPB3",
  "KOB3",
  "KXB3",
];

const SUBJECTS_NOT_INCLUDED = [
  "ÄIM",
  "EAA",
  "RAA",
  "RUA",
  "SAA",
  "VEA",
  "RAB2",
  "SAB2",
  "ARB3",
  "ENB3",
  "IAB3",
  "KIB3",
  "KXB3",
  "KOB3",
  "LAB3",
  "POB3",
  "RAB3",
  "RUB3",
  "SMB3",
  "UK",
  "UI",
  "UJ",
  "UX",
  "MU",
  "KT",
];

/**
 * Filters special subjects away depending options selected by student
 * or loaded from pyramus
 *
 * @param schoolCourseTable intial table that is altered depending options
 * @param options options for special subjects
 * @returns altered school course table with correct special subject included
 */
export const filterCompulsorySubjects = (
  schoolCourseTable: SchoolSubject[],
  options: string[]
) => {
  const subjectsToFilterOut: string[] = [
    ...RELIGION_SUBJECTS_CS,
    ...NATIVE_LANGUAGE_SUBJECTS_CS,
  ];

  options.forEach((option) => {
    const indexOf = subjectsToFilterOut.indexOf(option);

    indexOf !== -1 && subjectsToFilterOut.splice(indexOf, 1);
  });

  return schoolCourseTable.filter(
    (subject) => !subjectsToFilterOut.includes(subject.subjectCode)
  );
};

/**
 * Filters uppersecondary subject table based on options returned from backend
 *
 * @param schoolCourseTable Table to be filtered
 * @param options options returned from backend
 * @returns filtered table
 */
export const filterUpperSecondarySubjects = (
  schoolCourseTable: SchoolSubject[],
  options: string[]
) => {
  // Subjects to filter out by default
  const subjectsToFilterOut: string[] = [
    ...RELIGION_SUBJECTS_US,
    ...NATIVE_LANGUAGE_SUBJECTS_US,
    ...MATHEMATIC_SUBJECTS_US,
    ...LANGUAGE_SUBJECTS_A1_US,
    ...LANGUAGE_SUBJECTS_B1_US,
    ...LANGUAGE_SUBJECTS_B2_US,
    ...LANGUAGE_SUBJECTS_B3_US,
  ];

  // Remove subjects selected by student
  options.forEach((option) => {
    const indexOf = subjectsToFilterOut.indexOf(option);

    indexOf !== -1 && subjectsToFilterOut.splice(indexOf, 1);
  });

  // Return actual filtered table
  return schoolCourseTable.filter(
    (subject) => !subjectsToFilterOut.includes(subject.subjectCode)
  );
};

/**
 * Simple method to check if the subject should be shown by default.
 *
 * @param studyProgrammeName studyProgrammeName
 * @param subject subject
 * @returns boolean
 */
export const showSubject = (
  studyProgrammeName: string,
  subject: SchoolSubject
) => {
  switch (studyProgrammeName) {
    // Nettiperuskoulu shows all subjects without exceptions
    case "Nettiperuskoulu":
      return true;

    // Nettiperuskoulu shows all subjects that are not in the list (Not teaching in Otavia)
    case "Nettilukio":
    case "Aikuislukio":
    case "Nettilukio/yksityisopiskelu (aineopintoina)":
    case "Aineopiskelu/yo-tutkinto":
      return !SUBJECTS_NOT_INCLUDED.includes(subject.subjectCode);

    // Same as above but also removes OP (Opinto-ohjaus)
    case "Aineopiskelu/lukio":
    case "Aineopiskelu/lukio (oppivelvolliset)":
    case "Kahden tutkinnon opinnot":
      return ![...SUBJECTS_NOT_INCLUDED, "OP"].includes(subject.subjectCode);

    default:
      return true;
  }
};

/**
 * Selects the correct school course table based on the study programme name
 *
 * @param studyProgrammeName studyProgrammeName
 * @param curriculumName curriculumName
 */
export const compulsoryOrUpperSecondary = (
  studyProgrammeName: string,
  curriculumName: string
) => {
  const compulsoryMatrices = [schoolCourseTableCompulsory2018];
  const uppersecondaryMatrices = [schoolCourseTableUppersecondary2021];

  /**
   * Finds and returns OPS based matrix
   *
   * @param matrices list of matrices
   * @returns OPS based matrix or null if OPS based matrix is not found
   */
  const matrixTableBasedOnOPS = (matrices: SchoolCurriculumMatrix[]) => {
    const matrix = matrices.find(
      (matrix) => matrix.curriculumName === curriculumName
    );

    if (matrix) {
      return matrix.subjectsTable;
    }
    return null;
  };

  switch (studyProgrammeName) {
    case "Nettiperuskoulu":
    case "Nettiperuskoulu/yksityisopiskelu":
    case "Aineopiskelu/perusopetus":
    case "Aineopiskelu/perusopetus (oppilaitos ilmoittaa)":
    case "Aineopiskelu/oppivelvolliset/korottajat (pk)":
      return matrixTableBasedOnOPS(compulsoryMatrices);

    case "Nettilukio":
    case "Aineopiskelu/lukio":
    case "Aineopiskelu/lukio (oppivelvolliset)":
    case "Kahden tutkinnon opinnot":
    case "Aikuislukio":
    case "Nettilukio/yksityisopiskelu (aineopintoina)":
    case "Aineopiskelu/yo-tutkinto":
      return matrixTableBasedOnOPS(uppersecondaryMatrices);

    default:
      return null;
  }
};

/**
 * Filter matrix based on study programme name and selected course options
 *
 * @param studyProgrammeName studyProgrammeName of the student
 * @param matrix matrix to be filtered
 * @param options options selected by student
 * @returns filtered matrix
 */
export const filterMatrix = (
  studyProgrammeName: string,
  matrix: SchoolSubject[],
  options: string[]
) => {
  switch (studyProgrammeName) {
    case "Nettiperuskoulu":
      return filterCompulsorySubjects(matrix, options);

    case "Nettilukio":
    case "Aikuislukio":
    case "Nettilukio/yksityisopiskelu (aineopintoina)":
    case "Aineopiskelu/yo-tutkinto":
      return filterUpperSecondarySubjects(matrix, options);

    default:
      return matrix;
  }
};

/**
 * gets highest of course number available or if under 9, then default 9
 * @param schoolSubjects list of school sucjests
 * @returns number of highest course or default 9
 */
export const getHighestCourseNumber = (
  schoolSubjects: SchoolSubject[]
): number => {
  let highestCourseNumber = 1;

  for (const sSubject of schoolSubjects) {
    for (const aCourse of sSubject.availableCourses) {
      if (aCourse.courseNumber <= highestCourseNumber) {
        continue;
      } else {
        highestCourseNumber = aCourse.courseNumber;
      }
    }
  }

  if (highestCourseNumber > 9) {
    return highestCourseNumber;
  }

  return 9;
};

/**
 * filterActivity
 *
 * @param list of studentactivity courses
 * @returns Object containing lists filttered by status.
 * Lists are Ongoing, Suggested next, Suggested optional, Transfered and graded
 */
export const filterActivity = (
  list: StudentStudyActivity[]
): Omit<
  StudentActivityByStatus,
  "skillsAndArt" | "otherLanguageSubjects" | "otherSubjects"
> => {
  const onGoingList = list.filter((item) => item.status === "ONGOING");
  const suggestedNextList = list.filter(
    (item) => item.status === "SUGGESTED_NEXT"
  );

  const transferedList = list.filter((item) => item.status === "TRANSFERRED");
  const gradedList = list.filter((item) => item.status === "GRADED");
  const needSupplementationList = list.filter(
    (item) => item.status === "SUPPLEMENTATIONREQUEST"
  );

  return {
    onGoingList,
    suggestedNextList,
    transferedList,
    gradedList,
    needSupplementationList,
  };
};

/**
 * filterSkillAndArtSubject
 * @param subjectsList of studentactivity courses
 * @param list of studentactivity courses
 */
export const filterActivityBySubjects = (
  subjectsList: string[],
  list: StudentStudyActivity[]
) =>
  subjectsList.reduce(
    (a, v) => ({
      ...a,
      [v]: list
        .filter((c) => c.subject === v)
        .sort((a, b) => a.courseNumber - b.courseNumber),
    }),
    {}
  );

/**
 * getGetCourseInfo
 * @param modifiers modifiers
 * @param subject subject
 * @param course course
 * @param suggestedNextList suggestedNextList
 * @param transferedList transferedList
 * @param gradedList gradedList
 * @param onGoingList onGoingList
 * @param needSupplementationList needSupplementationList
 * @returns string[]
 */
export const getCourseInfo = (
  modifiers: string[],
  subject: SchoolSubject,
  course: Course,
  suggestedNextList: StudentStudyActivity[],
  transferedList: StudentStudyActivity[],
  gradedList: StudentStudyActivity[],
  onGoingList: StudentStudyActivity[],
  needSupplementationList: StudentStudyActivity[]
) => {
  const updatedModifiers = [...modifiers];

  let courseSuggestions: StudentStudyActivity[] = [];
  let canBeSelected = true;
  let needsSupplementation = false;
  let grade: string | undefined = undefined;

  if (
    suggestedNextList.find(
      (sCourse) =>
        sCourse.subject === subject.subjectCode &&
        sCourse.courseNumber === course.courseNumber
    )
  ) {
    const suggestedCourseDataNext = suggestedNextList.filter(
      (sCourse) => sCourse.subject === subject.subjectCode
    );

    courseSuggestions = courseSuggestions.concat(suggestedCourseDataNext);

    updatedModifiers.push("NEXT");
  } else if (
    transferedList.find(
      (tCourse) =>
        tCourse.subject === subject.subjectCode &&
        tCourse.courseNumber === course.courseNumber
    )
  ) {
    canBeSelected = false;
    updatedModifiers.push("APPROVAL");
  } else if (
    gradedList.find(
      (gCourse) =>
        gCourse.subject === subject.subjectCode &&
        gCourse.courseNumber === course.courseNumber
    )
  ) {
    canBeSelected = false;
    updatedModifiers.push("COMPLETED");
  } else if (
    needSupplementationList.find(
      (nCourse) =>
        nCourse.subject === subject.subjectCode &&
        nCourse.courseNumber === course.courseNumber
    )
  ) {
    canBeSelected = false;
    needsSupplementation = true;
    updatedModifiers.push("SUPPLEMENTATIONREQUEST");
  } else if (
    onGoingList.find(
      (oCourse) =>
        oCourse.subject === subject.subjectCode &&
        oCourse.courseNumber === course.courseNumber
    )
  ) {
    canBeSelected = false;
    updatedModifiers.push("INPROGRESS");
  }

  // Only graded list and transfered list are evaluated
  // and holds grade value
  const evaluatedCourse = [...gradedList, ...transferedList].find(
    (gCourse) =>
      gCourse.subject === subject.subjectCode &&
      gCourse.courseNumber === course.courseNumber
  );

  if (evaluatedCourse) {
    if (evaluatedCourse.passing) {
      updatedModifiers.push("PASSED-GRADE");
    } else {
      updatedModifiers.push("FAILED-GRADE");
    }

    grade = evaluatedCourse.grade;
  }

  return {
    modifiers: updatedModifiers,
    courseSuggestions,
    canBeSelected,
    grade,
    needsSupplementation,
  };
};
