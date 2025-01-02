import { Course, SchoolCurriculumMatrix } from "~/@types/shared";
import { StudentInfo } from "~/generated/client";
import {
  schoolCourseTableCompulsory2018,
  schoolCourseTableUppersecondary2021,
} from "~/mock/mock-data";
import { PlannedCourseWithIdentifier, PlannedPeriod } from "~/reducers/hops";

/**
 * Period workload
 */
export interface PeriodWorkload {
  displayValue: string;
  numericValue: number;
  unit: string;
}

/**
 * Curriculum strategy
 */
export interface CurriculumStrategy {
  getCurriculumMatrix: () => SchoolCurriculumMatrix;
  createPlannedCourse: (
    course: Course & { subjectCode: string },
    startDate: Date
  ) => PlannedCourseWithIdentifier;
  calculatePeriodWorkload: (
    courses: PlannedCourseWithIdentifier[]
  ) => PeriodWorkload;
  getCourseDisplayedLength: (course: Course) => string;
  /* calculateTotalWorkload: (
    courses: PlannedCourseWithIdentifier[]
  ) => PeriodWorkload; */
  getEmptyPeriod: (type: "SPRING" | "AUTUMN", year: number) => PlannedPeriod;
}

/**
 * Curriculum config
 */
export interface CurriculumConfig {
  type: "uppersecondary" | "compulsory";
  strategy: CurriculumStrategy;
}

/**
 * Uppersecondary curriculum strategy
 */
class UppersecondaryCurriculum implements CurriculumStrategy {
  /**
   * Get curriculum matrix
   * @returns curriculum matrix
   */
  getCurriculumMatrix(): SchoolCurriculumMatrix {
    return schoolCourseTableUppersecondary2021;
  }

  /**
   * Calculate workload
   * @param courses courses
   * @returns workload
   */
  calculatePeriodWorkload(
    courses: PlannedCourseWithIdentifier[]
  ): PeriodWorkload {
    const credits = courses.reduce(
      (sum, course) => sum + (course.length || 0),
      0
    );
    return {
      displayValue: `${credits} op`,
      numericValue: credits,
      unit: "credits",
    };
  }

  /**
   * Get course displayed length
   * @param course course
   * @returns displayed length
   */
  getCourseDisplayedLength(course: Course): string {
    return `${course.length} op`;
  }

  /**
   * Convert to hours
   * @param credits credits
   * @returns hours
   */
  convertToHours(credits: number): number {
    return credits * 28; // 1 credit = 28 hours
  }

  /**
   * Get average time per course
   * @returns average time per course
   */
  getAverageTimePerCourse(): number {
    return 28; // Average hours per course
  }

  /**
   * Get empty period
   * - Spring period: January 1st - July 31st
   * - Fall period: August 1st - December 31st
   * @param type period type
   * @param year period year
   * @returns empty period
   */
  getEmptyPeriod(type: "SPRING" | "AUTUMN", year: number): PlannedPeriod {
    return {
      type,
      year,
      title: `${year} ${type === "SPRING" ? "Spring" : "Fall"}`,
      plannedCourses: [],
      workloadType: "credits",
    };
  }

  /**
   * Create planned course
   * @param course course
   * @param startDate start date
   * @returns planned course
   */
  createPlannedCourse(
    course: Course & { subjectCode: string },
    startDate: Date
  ): PlannedCourseWithIdentifier {
    return {
      identifier: `planned-course-${new Date().getTime()}`,
      id: new Date().getTime(),
      name: course.name,
      courseNumber: course.courseNumber,
      length: course.length,
      lengthSymbol: "op", // Credits for upper secondary
      subjectCode: course.subjectCode,
      mandatory: course.mandatory,
      startDate: startDate,
    };
  }
}

/**
 * Compulsory curriculum strategy
 */
class CompulsoryCurriculum implements CurriculumStrategy {
  /**
   * Get curriculum matrix
   * @returns curriculum matrix
   */
  getCurriculumMatrix(): SchoolCurriculumMatrix {
    return schoolCourseTableCompulsory2018;
  }

  /**
   * Calculate workload
   * @param courses courses
   * @returns workload
   */
  calculatePeriodWorkload(
    courses: PlannedCourseWithIdentifier[]
  ): PeriodWorkload {
    return {
      displayValue: `${courses.length} courses`,
      numericValue: courses.length,
      unit: "courses",
    };
  }

  /**
   * Get course displayed length
   * @param course course
   * @returns displayed length
   */
  getCourseDisplayedLength(course: Course): string {
    return `${course.length} h`;
  }

  /**
   * Convert to hours
   * @param courses courses
   * @returns hours
   */
  convertToHours(courses: number): number {
    return courses * 38; // Example: 38 hours per course
  }

  /**
   * Get average time per course
   * @returns average time per course
   */
  getAverageTimePerCourse(): number {
    return 38; // Average hours per course
  }

  /**
   * Get empty period
   * - Spring period: January 1st - July 31st
   * - Fall period: August 1st - December 31st
   * @param type period type
   * @param year period year
   * @returns empty period
   */
  getEmptyPeriod(type: "SPRING" | "AUTUMN", year: number): PlannedPeriod {
    return {
      type,
      year,
      title: `${year} ${type === "SPRING" ? "Spring" : "Fall"}`,
      plannedCourses: [],
      workloadType: "courses",
    };
  }

  /**
   * Create planned course
   * @param course course
   * @param startDate start date
   * @returns planned course
   */
  createPlannedCourse(
    course: Course & { subjectCode: string },
    startDate: Date
  ): PlannedCourseWithIdentifier {
    return {
      identifier: `planned-course-${new Date().getTime()}`,
      id: new Date().getTime(),
      name: course.name,
      courseNumber: course.courseNumber,
      length: course.length,
      lengthSymbol: "h",
      subjectCode: course.subjectCode,
      mandatory: course.mandatory,
      startDate: startDate,
    };
  }
}

/**
 * Get curriculum config
 * @param studentInfo student info
 * @returns curriculum config
 */
function getCurriculumConfig(studentInfo: StudentInfo): CurriculumConfig {
  if (studentInfo.studyProgrammeEducationType === "lukio") {
    return {
      type: "uppersecondary",
      strategy: new UppersecondaryCurriculum(),
    };
  }
  return {
    type: "compulsory",
    strategy: new CompulsoryCurriculum(),
  };
}

export { UppersecondaryCurriculum, CompulsoryCurriculum, getCurriculumConfig };
