import {
  CourseMatrix,
  CourseMatrixType,
  StudyActivity,
} from "~/generated/client";
import {
  PlannedCourseWithIdentifier,
  PlannedPeriod,
  PlannerActivityItem,
} from "~/reducers/hops";
import { v4 as uuidv4 } from "uuid";
import { TFunction } from "i18next";
import {
  CourseMatrixEnriched,
  CourseMatrixModuleEnriched,
  enrichCourseMatrixWithIdentifiers,
} from "~/@types/course-matrix";

// Uppersecondary curriculum has 88 credits required
const UPPER_SECONDARY_TOTAL_REQUIRED_STUDIES = 88;

// Uppersecondary curriculum has 2 mandatory credits offset which is added to one of the required exception subjects (BI, FY, KE, GE)
const UPPER_SECONDARY_MANDATORY_OFFSET = 2;

// One of these subjects is required to have 2 + 2 credits, which is calculated as 4 mandatory credits
// when calculating total studies.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UPPER_SECONDARY_REQUIRED_EXCEPTION = ["BI", "FY", "KE", "GE"];

// Compulsory curriculum has 45 courses required
const COMPULSORY_TOTAL_REQUIRED_STUDIES = 46;

type WorkloadUnit = "credits" | "courses";

/**
 * Period workload
 */
export interface PeriodWorkload {
  displayValue: string;
  numericValue: number;
  unit: WorkloadUnit;
}

/**
 * Statistics
 */
export interface Statistics {
  mandatoryStudies: number;
  optionalStudies: number;
  totalStudies: number;
  unit: WorkloadUnit;
  requiredStudies: {
    mandatoryStudies: number;
    optionalStudies: number;
    totalStudies: number;
  };
}

/**
 * Plan statistics
 */
export interface PlanStatistics {
  plannedMandatoryStudies: number;
  plannedOptionalStudies: number;
  plannedTotalStudies: number;
  unit: WorkloadUnit;
  requiredStudies: {
    plannedMandatoryStudies: number;
    plannedOptionalStudies: number;
    plannedTotalStudies: number;
  };
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
  getCurriculumMatrix?: () => CourseMatrixEnriched;

  /**
   * Get current period
   * @returns current period
   */
  getCurrentPeriod?: () => PlannedPeriod;

  /**
   * Create planned course
   * @param course course
   * @param startDate start date
   * @returns planned course
   */
  createPlannedCourse?: (
    course: CourseMatrixModuleEnriched & { subjectCode: string },
    startDate: Date
  ) => PlannedCourseWithIdentifier;

  /**
   * Calculate workload
   * @param courses courses
   * @returns workload
   */
  calculatePeriodWorkload?: (
    courses: PlannedCourseWithIdentifier[],
    activityCourses: PlannerActivityItem[],
    t: TFunction
  ) => PeriodWorkload;

  /**
   * Calculate statistics
   * @param studyActivities study activities
   * @param options options
   * @returns statistics
   */
  calculateStatistics: (studyActivities?: StudyActivity) => Statistics;

  /**
   * Calculate estimated time to completion
   * @param hoursPerWeek hours per week
   * @param studyActivity study activity
   * @param options options
   * @returns estimated time to completion
   */
  calculateEstimatedTimeToCompletion?: (
    hoursPerWeek: number,
    studyActivity?: StudyActivity
  ) => number;

  /**
   * Get course displayed length
   * @param courseLength course length
   * @returns displayed length
   */
  getCourseDisplayedLength: (courseLength: number) => string;

  /**
   * Get empty period
   * @param type period type
   * @param year period year
   * @returns empty period
   */
  getEmptyPeriod?: (type: "SPRING" | "AUTUMN", year: number) => PlannedPeriod;

  /**
   * Find course by identifier
   * @param identifier course identifier
   * @returns course with subject code or undefined if not found
   */
  findCourseByIdentifier?: (
    identifier: string
  ) => (CourseMatrixModuleEnriched & { subjectCode: string }) | undefined;
}

/**
 * Curriculum config
 */
export interface CurriculumConfig {
  type: "uppersecondary" | "compulsory" | "unknown";
  isMatrixAvailable: boolean;
  strategy: CurriculumStrategy;
}

/**
 * Uppersecondary curriculum strategy
 */
class UppersecondaryCurriculum implements CurriculumStrategy {
  private matrix: CourseMatrixEnriched;

  /**
   * Constructor
   * @param courseMatrix course matrix
   */
  constructor(courseMatrix?: CourseMatrix) {
    // Initialize the base matrix with identifiers
    this.matrix = enrichCourseMatrixWithIdentifiers(courseMatrix);
  }

  /**
   * Get curriculum matrix
   * @returns curriculum matrix
   */
  getCurriculumMatrix(): CourseMatrixEnriched {
    return this.matrix;
  }

  /**
   * Find course by identifier
   * @param identifier course identifier
   * @returns course with subject code or undefined if not found
   */
  findCourseByIdentifier(
    identifier: string
  ): (CourseMatrixModuleEnriched & { subjectCode: string }) | undefined {
    for (const subject of this.matrix.subjects) {
      const course = subject.modules.find((c) => c.identifier === identifier);
      if (course) {
        return { ...course, subjectCode: subject.code };
      }
    }
    return undefined;
  }

  /**
   * Calculate estimated time to completion. Uppersecondary calculates credits
   * which are converted to hours using 19 hours per credit.
   * @param hoursPerWeek hours per week
   * @param studyActivity study activity
   * @returns estimated time to completion in months
   */
  calculateEstimatedTimeToCompletion(
    hoursPerWeek: number,
    studyActivity?: StudyActivity
  ): number {
    const statistics = this.calculateStatistics(studyActivity);

    // Calculate remaining credits needed
    const remainingCredits = Math.max(
      statistics.requiredStudies.totalStudies - statistics.totalStudies,
      0
    );

    // Convert remaining credits to hours
    const remainingHours = this.convertToHours(remainingCredits);

    // Calculate estimated months to completion
    const estimatedMonths = remainingHours / (hoursPerWeek * 4);

    return Math.ceil(estimatedMonths);
  }

  /**
   * Calculate workload
   * @param courses courses
   * @param activityCourses activity courses
   * @param t translation function
   * @returns workload
   */
  calculatePeriodWorkload(
    courses: PlannedCourseWithIdentifier[],
    activityCourses: PlannerActivityItem[],
    t: TFunction
  ): PeriodWorkload {
    const plannedCredits = courses.reduce(
      (sum, course) => sum + (course.length || 0),
      0
    );

    const activityCredits = activityCourses.reduce(
      (sum, course) => sum + (course.course.length || 0),
      0
    );

    const credits = plannedCredits + activityCredits;

    return {
      displayValue: `${credits} ${
        courses.length === 1
          ? t("labels.credit", {
              ns: "common",
            }).toLowerCase()
          : t("labels.credits", {
              ns: "common",
            }).toLowerCase()
      }`,
      numericValue: credits,
      unit: "credits",
    };
  }

  /**
   * Get required study values. Uppersecondary curriculum has 88 credits required.
   * @returns required study values in credits
   */
  getRequiredStudyValues(): {
    mandatoryStudies: number;
    optionalStudies: number;
    totalStudies: number;
  } {
    const matrix = this.getCurriculumMatrix();

    const requiredTotalStudies = UPPER_SECONDARY_TOTAL_REQUIRED_STUDIES;

    const mandatoryStudies =
      matrix.subjects.reduce(
        (sum, subject) =>
          sum +
          subject.modules
            .filter((module) => module.mandatory)
            .map((module) => module.length)
            .reduce((sum, length) => sum + length, 0),
        0
      ) + UPPER_SECONDARY_MANDATORY_OFFSET;

    const optionalStudies = requiredTotalStudies - mandatoryStudies;

    return {
      mandatoryStudies,
      optionalStudies,
      totalStudies: requiredTotalStudies,
    };
  }

  /**
   * Calculate statistics
   * @param studyActivity study activity
   * @returns statistics
   */
  calculateStatistics(studyActivity?: StudyActivity): Statistics {
    const requiredStudies = this.getRequiredStudyValues();

    // Values from study activity, with set default values if not present
    const completedCourseCredits = studyActivity?.completedCourseCredits ?? 0;
    const mandatoryCourseCredits = studyActivity?.mandatoryCourseCredits ?? 0;

    const mandatoryStudies = mandatoryCourseCredits;
    const optionalStudies = completedCourseCredits - mandatoryCourseCredits;

    return {
      mandatoryStudies,
      optionalStudies,
      totalStudies: mandatoryStudies + optionalStudies,
      unit: "credits",
      requiredStudies,
    };
  }

  /**
   * Get course displayed length
   * @param courseLength course length
   * @returns displayed length
   */
  getCourseDisplayedLength(courseLength: number): string {
    return `${courseLength} op`;
  }

  /**
   * Convert to hours
   * @param credits credits
   * @returns hours
   */
  convertToHours(credits: number): number {
    return credits * 19; // 1 credit = 19 hours
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
      items: [],
      isPastPeriod: false,
    };
  }

  /**
   * Get current period
   * @returns current period
   */
  getCurrentPeriod(): PlannedPeriod {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (currentMonth >= 0 && currentMonth <= 6) {
      return this.getEmptyPeriod("SPRING", currentYear);
    }

    return this.getEmptyPeriod("AUTUMN", currentYear);
  }

  /**
   * Create planned course
   * @param course course
   * @param startDate start date
   * @returns planned course
   */
  createPlannedCourse(
    course: CourseMatrixModuleEnriched & { subjectCode: string },
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
      startDate: startDate,
    };
  }
}

/**
 * Compulsory curriculum strategy
 */
class CompulsoryCurriculum implements CurriculumStrategy {
  private matrix: CourseMatrixEnriched;

  /**
   * Constructor
   * @param courseMatrix course matrix
   */
  constructor(courseMatrix?: CourseMatrix) {
    // Initialize the base matrix with identifiers
    this.matrix = enrichCourseMatrixWithIdentifiers(courseMatrix);
  }

  /**
   * Get curriculum matrix
   * @returns curriculum matrix
   */
  getCurriculumMatrix() {
    return this.matrix;
  }

  /**
   * Find course by identifier
   * @param identifier course identifier
   * @returns course with subject code or undefined if not found
   */
  findCourseByIdentifier(
    identifier: string
  ): (CourseMatrixModuleEnriched & { subjectCode: string }) | undefined {
    for (const subject of this.matrix.subjects) {
      const course = subject.modules.find((c) => c.identifier === identifier);
      if (course) {
        return { ...course, subjectCode: subject.code };
      }
    }
    return undefined;
  }

  /**
   * Calculate estimated time to completion. Compulsory calculates courses instead of credits which
   * are converted to hours using 38 hours per course.
   * @param hoursPerWeek hours per week
   * @param studyActivity study activity
   * @returns estimated time to completion in months
   */
  calculateEstimatedTimeToCompletion(
    hoursPerWeek: number,
    studyActivity?: StudyActivity
  ): number {
    const statistics = this.calculateStatistics(studyActivity);

    // Calculate remaining courses needed
    const remainingCourses = Math.max(
      statistics.requiredStudies.totalStudies - statistics.totalStudies,
      0
    );

    // Convert remaining courses to hours
    const remainingHours = this.convertToHours(remainingCourses);

    // Calculate estimated months to completion
    const estimatedMonths = remainingHours / (hoursPerWeek * 4);

    return Math.ceil(estimatedMonths);
  }

  /**
   * Calculate workload
   * @param courses courses
   * @param activityCourses activity courses
   * @param t translation function
   * @returns workload
   */
  calculatePeriodWorkload(
    courses: PlannedCourseWithIdentifier[],
    activityCourses: PlannerActivityItem[],
    t: TFunction
  ): PeriodWorkload {
    return {
      displayValue: `${courses.length + activityCourses.length} ${
        courses.length + activityCourses.length === 1
          ? t("labels.course", {
              ns: "common",
            }).toLowerCase()
          : t("labels.courses", {
              ns: "common",
            }).toLowerCase()
      }`,
      numericValue: courses.length,
      unit: "courses",
    };
  }

  /**
   * Get required study values
   * @returns required study values
   */
  getRequiredStudyValues(): {
    mandatoryStudies: number;
    optionalStudies: number;
    totalStudies: number;
  } {
    const matrix = this.getCurriculumMatrix();

    const requiredTotalStudies = COMPULSORY_TOTAL_REQUIRED_STUDIES;

    const mandatoryStudies = matrix.subjects.reduce(
      (sum, subject) =>
        sum + subject.modules.filter((module) => module.mandatory).length,
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
   * @param studyActivity study activity
   * @returns statistics
   */
  calculateStatistics(studyActivity?: StudyActivity): Statistics {
    const requiredStudies = this.getRequiredStudyValues();

    const completedCourses = studyActivity?.completedCourses ?? 0;
    const mandatoryCourses = studyActivity?.mandatoryCourses ?? 0;

    const mandatoryStudies = mandatoryCourses;
    const optionalStudies = completedCourses - mandatoryCourses;

    return {
      mandatoryStudies,
      optionalStudies,
      totalStudies: mandatoryStudies + optionalStudies,
      unit: "courses",
      requiredStudies: requiredStudies,
    };
  }

  /**
   * Get course displayed length
   * @param courseLength course length
   * @returns displayed length
   */
  getCourseDisplayedLength(courseLength: number): string {
    return `${courseLength} h`;
  }

  /**
   * Convert to hours
   * @param courses courses
   * @returns hours
   */
  convertToHours(courses: number): number {
    return courses * 28; // Example: 28 hours per course
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
      items: [],
      isPastPeriod: false,
    };
  }

  /**
   * Get current period
   * @returns current period
   */
  getCurrentPeriod(): PlannedPeriod {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (currentMonth >= 0 && currentMonth <= 6) {
      return this.getEmptyPeriod("SPRING", currentYear);
    }

    return this.getEmptyPeriod("AUTUMN", currentYear);
  }

  /**
   * Create planned course
   * @param course course
   * @param startDate start date
   * @returns planned course
   */
  createPlannedCourse(
    course: CourseMatrixModuleEnriched & { subjectCode: string },
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
      startDate: startDate,
    };
  }
}

/**
 * Matrix unavailable curriculum strategy
 */
class UpperSecondaryMatrixUnavailableCurriculum implements CurriculumStrategy {
  /**
   * Get required study values when no curriculum config is available
   * @returns required study values in credits
   */
  getRequiredStudyValues(): {
    mandatoryStudies: number | null;
    optionalStudies: number | null;
    totalStudies: number;
  } {
    return {
      mandatoryStudies: null,
      optionalStudies: null,
      totalStudies: UPPER_SECONDARY_TOTAL_REQUIRED_STUDIES,
    };
  }

  /**
   * Calculate statistics when no curriculum config is available
   * @param studyActivity study activity
   * @returns statistics
   */
  calculateStatistics(studyActivity?: StudyActivity): Statistics {
    const requiredStudies = this.getRequiredStudyValues();

    // Values from study activity, with set default values if not present
    const completedCourseCredits = studyActivity?.completedCourseCredits ?? 0;
    const mandatoryCourseCredits = studyActivity?.mandatoryCourseCredits ?? 0;

    const mandatoryStudies = mandatoryCourseCredits;
    const optionalStudies = completedCourseCredits - mandatoryCourseCredits;

    return {
      mandatoryStudies,
      optionalStudies,
      totalStudies: mandatoryStudies + optionalStudies,
      unit: "credits",
      requiredStudies,
    };
  }

  /**
   * Get course displayed length
   * @param courseLength course length
   * @returns displayed length
   */
  getCourseDisplayedLength(courseLength: number): string {
    return `${courseLength} op`;
  }
}

/**
 * Matrix unavailable curriculum strategy
 */
class CompulsoryMatrixUnavailableCurriculum implements CurriculumStrategy {
  /**
   * Get required study values when no curriculum config is available
   * @returns required study values
   */
  getRequiredStudyValues(): {
    mandatoryStudies: number | null;
    optionalStudies: number | null;
    totalStudies: number;
  } {
    return {
      mandatoryStudies: null,
      optionalStudies: null,
      totalStudies: COMPULSORY_TOTAL_REQUIRED_STUDIES,
    };
  }

  /**
   * Calculate statistics when no curriculum config is available
   * @param studyActivity study activity
   * @returns statistics
   */
  calculateStatistics(studyActivity?: StudyActivity): Statistics {
    const requiredStudies = this.getRequiredStudyValues();

    const completedCourses = studyActivity?.completedCourses ?? 0;
    const mandatoryCourses = studyActivity?.mandatoryCourses ?? 0;

    const mandatoryStudies = mandatoryCourses;
    const optionalStudies = completedCourses - mandatoryCourses;

    return {
      mandatoryStudies,
      optionalStudies,
      totalStudies: mandatoryStudies + optionalStudies,
      unit: "courses",
      requiredStudies: requiredStudies,
    };
  }

  /**
   * Get course displayed length
   * @param courseLength course length
   * @returns displayed length
   */
  getCourseDisplayedLength(courseLength: number): string {
    return `${courseLength} h`;
  }
}

/**
 * Unknown curriculum strategy
 */
class UnknownCurriculum implements CurriculumStrategy {
  /**
   * Calculate statistics when no curriculum config is available
   * @param studyActivity study activity
   * @returns statistics
   */
  calculateStatistics(studyActivity?: StudyActivity): Statistics {
    const completedCourses = studyActivity?.completedCourses ?? 0;
    const mandatoryCourses = studyActivity?.mandatoryCourses ?? 0;

    const mandatoryStudies = mandatoryCourses;
    const optionalStudies = completedCourses - mandatoryCourses;

    return {
      mandatoryStudies,
      optionalStudies,
      totalStudies: mandatoryStudies + optionalStudies,
      unit: "courses",
      requiredStudies: {
        mandatoryStudies: null,
        optionalStudies: null,
        totalStudies: null,
      },
    };
  }

  /**
   * Get course displayed length
   * @param courseLength course length
   * @returns displayed length
   */
  getCourseDisplayedLength(courseLength: number): string {
    return `${courseLength} h`;
  }
}

/**
 * Get curriculum config.
 * If no matching curriculum config is found, the default strategy will be set to "unknown".
 * @param courseMatrixType course matrix type
 * @param courseMatrix course matrix
 * @returns curriculum config
 */
function getCurriculumConfig(
  courseMatrixType: CourseMatrixType | null,
  courseMatrix: CourseMatrix
): CurriculumConfig {
  if (courseMatrixType === "UPPER_SECONDARY") {
    if (noCurriculumConfigAvailable(courseMatrix.problems)) {
      return {
        type: "uppersecondary",
        isMatrixAvailable: false,
        strategy: new UpperSecondaryMatrixUnavailableCurriculum(),
      };
    }
    return {
      type: "uppersecondary",
      isMatrixAvailable: true,
      strategy: new UppersecondaryCurriculum(courseMatrix),
    };
  }
  if (courseMatrixType === "COMPULSORY") {
    if (noCurriculumConfigAvailable(courseMatrix.problems)) {
      return {
        type: "compulsory",
        isMatrixAvailable: false,
        strategy: new CompulsoryMatrixUnavailableCurriculum(),
      };
    }
    return {
      type: "compulsory",
      isMatrixAvailable: true,
      strategy: new CompulsoryCurriculum(courseMatrix),
    };
  }
  return {
    type: "unknown",
    isMatrixAvailable: false,
    strategy: new UnknownCurriculum(),
  };
}

/**
 * Check if no curriculum config is available
 * @param courseMatrixProblems course matrix problems
 * @returns true if no curriculum config is available, false otherwise
 */
function noCurriculumConfigAvailable(
  courseMatrixProblems: CourseMatrix["problems"]
): boolean {
  return courseMatrixProblems.includes("INCOMPATIBLE_STUDENT");
}

export { UppersecondaryCurriculum, CompulsoryCurriculum, getCurriculumConfig };
