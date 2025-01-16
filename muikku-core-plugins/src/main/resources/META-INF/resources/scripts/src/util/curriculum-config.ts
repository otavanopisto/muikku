import moment from "moment";
import { Course, SchoolCurriculumMatrix } from "~/@types/shared";
import { StudentInfo, StudentStudyActivity } from "~/generated/client";
import {
  schoolCourseTableCompulsory2018,
  schoolCourseTableUppersecondary2021,
} from "~/mock/mock-data";
import { PlannedCourseWithIdentifier, PlannedPeriod } from "~/reducers/hops";
import { v4 as uuidv4 } from "uuid";
import {
  filterCompulsorySubjects,
  filterUpperSecondarySubjects,
} from "~/helper-functions/study-matrix";

const COMPULSORY_TOTAL_REQUIRED_STUDIES = 45;

/**
 * Period workload
 */
export interface PeriodWorkload {
  displayValue: string;
  numericValue: number;
  unit: string;
}

/**
 * Statistics
 */
export interface Statistics {
  mandatoryStudies: number;
  optionalStudies: number;
  totalStudies: number;
  unit: string;
  requiredStudies: {
    mandatoryStudies: number;
    optionalStudies: number;
    totalStudies: number;
  };
}

/**
 * Curriculum matrix options
 */
interface CurriculumMatrixOptions {
  studyOptions: string[];
}

/**
 * Curriculum strategy
 */
export interface CurriculumStrategy {
  /**
   * Get curriculum matrix. Can be filtered with provided options parameter.
   * @param options options. Optional parameter to filter the matrix based on.
   * @returns curriculum matrix
   */
  getCurriculumMatrix: (
    options?: CurriculumMatrixOptions
  ) => SchoolCurriculumMatrix;
  /**
   * Create planned course
   * @param course course
   * @param startDate start date
   * @returns planned course
   */
  createPlannedCourse: (
    course: Course & { subjectCode: string },
    startDate: Date
  ) => PlannedCourseWithIdentifier;

  /**
   * Calculate workload
   * @param courses courses
   * @returns workload
   */
  calculatePeriodWorkload: (
    courses: PlannedCourseWithIdentifier[]
  ) => PeriodWorkload;

  /**
   * Calculate statistics
   * @param studyActivities study activities
   * @param options options
   * @returns statistics
   */
  calculateStatistics: (
    studyActivities: StudentStudyActivity[],
    options: string[]
  ) => Statistics;

  /**
   * Get course displayed length
   * @param course course
   * @returns displayed length
   */
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
   * @param options options. Optional parameter to filter the matrix based on.
   * @returns curriculum matrix
   */
  getCurriculumMatrix(
    options?: CurriculumMatrixOptions
  ): SchoolCurriculumMatrix {
    if (options?.studyOptions) {
      return {
        ...schoolCourseTableUppersecondary2021,
        subjectsTable: filterUpperSecondarySubjects(
          schoolCourseTableUppersecondary2021.subjectsTable,
          options.studyOptions
        ),
      };
    }

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
   * Calculate statistics
   * @param studyActivities study activities
   * @param options options
   * @returns statistics
   */
  calculateStatistics(
    studyActivities: StudentStudyActivity[],
    options: string[]
  ): Statistics {
    return {
      mandatoryStudies: 0,
      optionalStudies: 0,
      totalStudies: 0,
      unit: "credits",
      requiredStudies: {
        mandatoryStudies: 0,
        optionalStudies: 0,
        totalStudies: 0,
      },
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
      identifier: `planned-course-${uuidv4()}`,
      id: null,
      name: course.name,
      courseNumber: course.courseNumber,
      length: course.length,
      lengthSymbol: "op", // Credits for upper secondary
      subjectCode: course.subjectCode,
      mandatory: course.mandatory,
      startDate: moment(startDate).format("YYYY-MM-DD"),
    };
  }
}

/**
 * Compulsory curriculum strategy
 */
class CompulsoryCurriculum implements CurriculumStrategy {
  /**
   * Get curriculum matrix
   * @param options options. Optional parameter to filter the matrix based on.
   * @returns curriculum matrix
   */
  getCurriculumMatrix(
    options?: CurriculumMatrixOptions
  ): SchoolCurriculumMatrix {
    if (options?.studyOptions) {
      return {
        ...schoolCourseTableCompulsory2018,
        subjectsTable: filterCompulsorySubjects(
          schoolCourseTableCompulsory2018.subjectsTable,
          options.studyOptions
        ),
      };
    }
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
   * Get required study values
   * @param options options
   * @returns required study values
   */
  getRequiredStudyValues(options: string[]): {
    mandatoryStudies: number;
    optionalStudies: number;
    totalStudies: number;
  } {
    const matrix = this.getCurriculumMatrix({ studyOptions: options });

    const requiredTotalStudies = COMPULSORY_TOTAL_REQUIRED_STUDIES;

    const mandatoryStudies = matrix.subjectsTable.reduce(
      (sum, subject) =>
        sum +
        subject.availableCourses.filter((course) => course.mandatory).length,
      0
    );

    const optionalStudies = requiredTotalStudies - mandatoryStudies;

    return {
      mandatoryStudies,
      optionalStudies,
      totalStudies: requiredTotalStudies,
    };
  }

  /**
   * Calculate statistics
   * @param studyActivities study activities
   * @param options options
   * @returns statistics
   */
  calculateStatistics(
    studyActivities: StudentStudyActivity[],
    options: string[]
  ): Statistics {
    const matrix = this.getCurriculumMatrix({ studyOptions: options });
    const requiredStudies = this.getRequiredStudyValues(options);

    // Filter completed or transferred activities
    const completedActivities = studyActivities.filter(
      (activity) =>
        (activity.status === "GRADED" && activity.passing) ||
        activity.status === "TRANSFERRED"
    );

    let mandatoryCount = 0;
    let optionalCount = 0;

    // Go through each completed activity and match with matrix courses
    completedActivities.forEach((activity) => {
      // Find matching subject and course in matrix
      const subject = matrix.subjectsTable.find(
        (subject) => subject.subjectCode === activity.subject
      );

      if (subject) {
        const course = subject.availableCourses.find(
          (course) => course.courseNumber === activity.courseNumber
        );

        if (course) {
          // Increment appropriate counter based on whether the course is mandatory
          if (course.mandatory) {
            mandatoryCount++;
          } else {
            optionalCount++;
          }
        }
      }
    });

    // If optional studies are more than required, just show required amount
    const optionalStudies =
      optionalCount >= requiredStudies.optionalStudies
        ? requiredStudies.optionalStudies
        : optionalCount;

    return {
      mandatoryStudies: mandatoryCount,
      optionalStudies,
      totalStudies: mandatoryCount + optionalCount,
      unit: "courses",
      requiredStudies: requiredStudies,
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
      identifier: `planned-course-${uuidv4()}`,
      id: null,
      name: course.name,
      courseNumber: course.courseNumber,
      length: course.length,
      lengthSymbol: "h",
      subjectCode: course.subjectCode,
      mandatory: course.mandatory,
      startDate: moment(startDate).format("YYYY-MM-DD"),
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
