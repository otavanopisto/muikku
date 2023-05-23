import { SchoolSubject } from "~/@types/shared";
import { StudyProgrammeName } from "~/components/general/study-progress";
import { AlternativeStudyObject } from "~/hooks/useStudentAlternativeOptions";
import {
  schoolCourseTable,
  schoolCourseTableUppersecondary,
  subjectsNotIncludedInNettilukio,
} from "~/mock/mock-data";

const MOCK_SELECTED_SUBJECTS = ["ÄI", "MAA", "UE", "ENA", "JPB3"];

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
/**
 * sleep
 * @param m milliseconds
 * @returns Promise
 */
export const sleep = (m: number) => new Promise((r) => setTimeout(r, m));

/**
 * Filters special subjects away depending options selected by student
 * or loaded from pyramus
 *
 * @param schoolCourseTable intial table that is altered depending options
 * @param options options for special subjects
 * @returns altered school course table with correct special subject included
 */
export const filterSpecialSubjects = (
  schoolCourseTable: SchoolSubject[],
  options: AlternativeStudyObject
) => {
  let alteredShoolCourseTable = schoolCourseTable;

  if (options.nativeLanguageSelection === "s2") {
    alteredShoolCourseTable = alteredShoolCourseTable.filter(
      (sSubject) => sSubject.subjectCode !== "äi"
    );
  } else if (options.nativeLanguageSelection === "äi") {
    alteredShoolCourseTable = alteredShoolCourseTable.filter(
      (sSubject) => sSubject.subjectCode !== "s2"
    );
  }

  if (options.religionSelection === "et") {
    alteredShoolCourseTable = alteredShoolCourseTable.filter(
      (sSubject) => sSubject.subjectCode !== "ue"
    );
  } else if (options.religionSelection === "ue") {
    alteredShoolCourseTable = alteredShoolCourseTable.filter(
      (sSubject) => sSubject.subjectCode !== "et"
    );
  }

  return alteredShoolCourseTable;
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
  const subjectsToFilterOut: string[] = [
    ...RELIGION_SUBJECTS_US,
    ...NATIVE_LANGUAGE_SUBJECTS_US,
    ...MATHEMATIC_SUBJECTS_US,
    ...LANGUAGE_SUBJECTS_A1_US,
    ...LANGUAGE_SUBJECTS_B1_US,
    ...LANGUAGE_SUBJECTS_B2_US,
    ...LANGUAGE_SUBJECTS_B3_US,
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
 * Simple method to check if the subject should be shown by default.
 *
 * @param studyProgrammeName studyProgrammeName
 * @param subject subject
 * @returns boolean
 */
export const showSubject = (
  studyProgrammeName: StudyProgrammeName,
  subject: SchoolSubject
) => {
  switch (studyProgrammeName) {
    case "Nettiperuskoulu":
      return true;

    case "Nettilukio":
      return !subjectsNotIncludedInNettilukio.includes(subject.subjectCode);

    default:
      return true;
  }
};

/**
 * Selects the correct school course table based on the study programme name
 * and returns it filtered by the options
 *
 * @param studyProgrammeName studyProgrammeName
 */
export const compulsoryOrUpperSecondary = (
  studyProgrammeName: StudyProgrammeName
) => {
  switch (studyProgrammeName) {
    case "Nettiperuskoulu":
      return schoolCourseTable;

    case "Nettilukio":
      return schoolCourseTableUppersecondary;

    default:
      return schoolCourseTableUppersecondary;
  }
};

/**
 * filterMatrix
 * @param studyProgrammeName studyProgrammeName
 * @param matrix matrix
 * @param options options
 * @returns filtered matrix
 */
export const filterMatrix = (
  studyProgrammeName: StudyProgrammeName,
  matrix: SchoolSubject[],
  options: AlternativeStudyObject
) => {
  switch (studyProgrammeName) {
    case "Nettiperuskoulu":
      return filterSpecialSubjects(matrix, options);

    case "Nettilukio":
      return filterUpperSecondarySubjects(matrix, MOCK_SELECTED_SUBJECTS);

    default:
      return matrix;
  }
};

/**
 * Checks if string is valid html
 * @param str str
 * @returns boolean
 */
export const isStringHTML = (str: string) => {
  // Creates div helper element and inserts checkable string inside of it
  const helperElement = document.createElement("div");
  helperElement.innerHTML = str;

  // Check if string is not empty/null/undefined and nodeType is 1.
  // Number 1 is elements like divs or p tags etc.
  // First nodeType tells if the str is not valid html
  return (
    str !== null &&
    str !== undefined &&
    str !== "" &&
    helperElement.childNodes[0].nodeType == 1
  );
};
