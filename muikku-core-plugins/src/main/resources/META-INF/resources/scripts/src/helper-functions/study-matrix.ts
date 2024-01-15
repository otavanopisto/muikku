import { SchoolCurriculumMatrix, SchoolSubject } from "~/@types/shared";
import {
  schoolCourseTableUppersecondary2021,
  schoolCourseTableCompulsory2018,
} from "~/mock/mock-data";

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
