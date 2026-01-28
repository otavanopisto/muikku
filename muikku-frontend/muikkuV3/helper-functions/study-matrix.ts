import { SchoolSubject, StudentActivityByStatus } from "~/@types/shared";
import {
  CourseMatrix,
  CourseMatrixModule,
  CourseMatrixSubject,
  StudyActivityItem,
} from "~/generated/client";
import {} from "~/mock/mock-data";

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
const NATIVE_LANGUAGE_SUBJECTS_US = ["ÄI", "ÄIM", "S2"];
const MATHEMATIC_SUBJECTS_US = ["MAA", "MAB"];
const LANGUAGE_SUBJECTS_A1_US = ["ENA", "RAA", "RUA", "SAA", "VEA", "EAA"];
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
  "ENB3",
  "KIB3",
  "POB3",
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

  const table = schoolCourseTable.filter(
    (subject) => !subjectsToFilterOut.includes(subject.subjectCode)
  );

  // Return actual filtered table
  return table;
};

/**
 * Gets the course dropdown name
 * @param subject subject
 * @param course course
 * @param showCredits boolean
 */
export const getCourseDropdownName = (
  subject: CourseMatrixSubject,
  course: CourseMatrixModule,
  showCredits: boolean
) => {
  let courseDropdownName =
    subject.code + course.courseNumber + " - " + course.name;

  // Add asterisk to optional courses
  if (!course.mandatory) {
    courseDropdownName += "*";
  }

  // Add credits to uppersecondary courses
  if (showCredits) {
    courseDropdownName += ` (${course.length} op)`;
  }

  return courseDropdownName;
};

/**
 * gets highest of course number available or if under 9, then default 9
 * @param matrix list of school sucjests
 * @returns number of highest course or default 9
 */
export const getHighestCourseNumber = (
  matrix: CourseMatrix | null
): number | null => {
  if (matrix === null) {
    return null;
  }

  let highestCourseNumber = 1;

  for (const sSubject of matrix.subjects) {
    for (const aCourse of sSubject.modules) {
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
  list: StudyActivityItem[]
): Omit<
  StudentActivityByStatus,
  "skillsAndArt" | "otherLanguageSubjects" | "otherSubjects"
> => {
  const onGoingList = list.filter((item) => item.state === "ONGOING");
  const suggestedNextList = list.filter(
    (item) => item.state === "SUGGESTED_NEXT"
  );

  const transferedList = list.filter((item) => item.state === "TRANSFERRED");
  const gradedList = list.filter((item) => item.state === "GRADED");
  const needSupplementationList = list.filter(
    (item) => item.state === "SUPPLEMENTATIONREQUEST"
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
  list: StudyActivityItem[]
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
  subject: CourseMatrixSubject,
  course: CourseMatrixModule,
  suggestedNextList: StudyActivityItem[],
  transferedList: StudyActivityItem[],
  gradedList: StudyActivityItem[],
  onGoingList: StudyActivityItem[],
  needSupplementationList: StudyActivityItem[]
) => {
  const updatedModifiers = [...modifiers];

  let courseSuggestions: StudyActivityItem[] = [];
  let canBeSelected = true;
  let needsSupplementation = false;
  let grade: string | undefined = undefined;

  if (
    suggestedNextList.find(
      (sCourse) =>
        sCourse.subject === subject.code &&
        sCourse.courseNumber === course.courseNumber
    )
  ) {
    const suggestedCourseDataNext = suggestedNextList.filter(
      (sCourse) => sCourse.subject === subject.code
    );

    courseSuggestions = courseSuggestions.concat(suggestedCourseDataNext);

    updatedModifiers.push("NEXT");
  } else if (
    transferedList.find(
      (tCourse) =>
        tCourse.subject === subject.code &&
        tCourse.courseNumber === course.courseNumber
    )
  ) {
    canBeSelected = false;
    updatedModifiers.push("APPROVAL");
  } else if (
    gradedList.find(
      (gCourse) =>
        gCourse.subject === subject.code &&
        gCourse.courseNumber === course.courseNumber &&
        gCourse.grade !== "K"
    )
  ) {
    canBeSelected = false;
    updatedModifiers.push("COMPLETED");
  } else if (
    needSupplementationList.find(
      (nCourse) =>
        nCourse.subject === subject.code &&
        nCourse.courseNumber === course.courseNumber
    )
  ) {
    canBeSelected = false;
    needsSupplementation = true;
    updatedModifiers.push("SUPPLEMENTATIONREQUEST");
  } else if (
    onGoingList.find(
      (oCourse) =>
        oCourse.subject === subject.code &&
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
      gCourse.subject === subject.code &&
      gCourse.courseNumber === course.courseNumber
  );

  if (evaluatedCourse) {
    if (evaluatedCourse.passing) {
      updatedModifiers.push("PASSED-GRADE");
    } else {
      // If grade is K, then it is aborted, hard check as it is only
      // way to recognize aborted courses
      if (evaluatedCourse.grade === "K") {
        updatedModifiers.push("ABORTED");
      } else {
        updatedModifiers.push("FAILED-GRADE");
      }
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

/**
 * getNonOPSTransferedActivities
 * @param matrix matrix
 * @param transferedList transfered list
 * @returns non OPS transfered activities
 */
export const getNonOPSTransferedActivities = (
  matrix: CourseMatrix,
  transferedList: StudyActivityItem[]
) => {
  const allOPSSubjects = matrix.subjects.map((subject) => subject.code);

  const allTransferedSubjects = transferedList.map((item) => item.subject);

  // Joined list of non OPS transfered subjects
  const allNonOPSTransferedSubjects = allTransferedSubjects
    .filter((subject) => !allOPSSubjects.includes(subject))
    .join(",");

  // List of non OPS transfered subjects without duplicates
  const listOfallNonOPSTransferedSubjects = Array.from(
    new Set(allNonOPSTransferedSubjects.split(","))
  );

  return transferedList.filter((tStudies) =>
    listOfallNonOPSTransferedSubjects.includes(tStudies.subject)
  );
};
