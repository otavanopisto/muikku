import { SchoolSubject } from "~/@types/shared";
import { AlternativeStudyObject } from "~/hooks/useStudentAlternativeOptions";

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
