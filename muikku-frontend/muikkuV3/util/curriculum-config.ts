import {
  CourseMatrix,
  CourseMatrixType,
  StudyActivityItem,
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
  ) => CourseMatrixEnriched;

  /**
   * Get current period
   * @returns current period
   */
  getCurrentPeriod: () => PlannedPeriod;

  /**
   * Create planned course
   * @param course course
   * @param startDate start date
   * @returns planned course
   */
  createPlannedCourse: (
    course: CourseMatrixModuleEnriched & { subjectCode: string },
    startDate: Date
  ) => PlannedCourseWithIdentifier;

  /**
   * Calculate workload
   * @param courses courses
   * @returns workload
   */
  calculatePeriodWorkload: (
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
  calculateStatistics: (
    studyActivities: StudyActivityItem[],
    options: string[]
  ) => Statistics;

  /**
   * Calculate plan statistics
   * @param plannedCourses planned courses
   * @param studyActivities study activities
   * @param options options
   * @returns statistics
   */
  calculatePlanStatistics: (
    plannedCourses: PlannedCourseWithIdentifier[],
    studyActivities: StudyActivityItem[],
    options: string[]
  ) => PlanStatistics;

  /**
   * Calculate estimated time to completion
   * @param hoursPerWeek hours per week
   * @param studyActivities study activities
   * @param options options
   * @returns estimated time to completion
   */
  calculateEstimatedTimeToCompletion: (
    hoursPerWeek: number,
    studyActivities: StudyActivityItem[],
    options: string[]
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
  getEmptyPeriod: (type: "SPRING" | "AUTUMN", year: number) => PlannedPeriod;

  /**
   * Find course by identifier
   * @param identifier course identifier
   * @returns course with subject code or undefined if not found
   */
  findCourseByIdentifier: (
    identifier: string
  ) => (CourseMatrixModuleEnriched & { subjectCode: string }) | undefined;
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
  private matrix: CourseMatrixEnriched;

  /**
   * Constructor
   * @param courseMatrix course matrix
   * @param curriculumName curriculum name
   */
  constructor(courseMatrix?: CourseMatrix, curriculumName?: string) {
    // Initialize the base matrix with identifiers
    this.matrix = enrichCourseMatrixWithIdentifiers(
      courseMatrix,
      curriculumName
    );
  }

  /**
   * Get curriculum matrix
   * @param options options. Optional parameter to filter the matrix based on.
   * @returns curriculum matrix
   */
  getCurriculumMatrix(options?: CurriculumMatrixOptions): CourseMatrixEnriched {
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
   * @param studyActivities study activities
   * @param options options
   * @returns estimated time to completion in months
   */
  calculateEstimatedTimeToCompletion(
    hoursPerWeek: number,
    studyActivities: StudyActivityItem[],
    options: string[]
  ): number {
    const statistics = this.calculateStatistics(studyActivities, options);

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
   * Calculate plan statistics
   * @param plannedCourses planned courses
   * @param studyActivities study activities
   * @param options options
   * @returns statistics
   */
  calculatePlanStatistics(
    plannedCourses: PlannedCourseWithIdentifier[],
    studyActivities: StudyActivityItem[],
    options: string[]
  ): PlanStatistics {
    const completedStats = this.calculateStatistics(studyActivities, options);

    // Calculate planned studies (excluding completed ones)
    let plannedMandatory = 0;
    let plannedOptional = 0;

    plannedCourses.forEach((planned) => {
      // Skip if this course is already completed
      const isCompleted = studyActivities.some(
        (activity) =>
          activity.subject === planned.subjectCode &&
          activity.courseNumber === planned.courseNumber &&
          ((activity.state === "GRADED" && activity.passing) ||
            activity.state === "TRANSFERRED")
      );

      if (!isCompleted) {
        if (planned.mandatory) {
          plannedMandatory += 1;
        } else {
          plannedOptional += 1;
        }
      }
    });

    // Calculate remaining required studies
    const remainingMandatory = Math.max(
      completedStats.requiredStudies.mandatoryStudies -
        (completedStats.mandatoryStudies + plannedMandatory),
      0
    );

    const remainingOptional = Math.max(
      completedStats.requiredStudies.optionalStudies -
        (completedStats.optionalStudies + plannedOptional),
      0
    );

    return {
      plannedMandatoryStudies: plannedMandatory,
      plannedOptionalStudies: plannedOptional,
      plannedTotalStudies: plannedMandatory + plannedOptional,
      unit: "credits",
      requiredStudies: {
        plannedMandatoryStudies: remainingMandatory,
        plannedOptionalStudies: remainingOptional,
        plannedTotalStudies: remainingMandatory + remainingOptional,
      },
    };
  }

  /**
   * Get required study values. Uppersecondary curriculum has 88 credits required.
   * @param options options
   * @returns required study values in credits
   */
  getRequiredStudyValues(options: string[]): {
    mandatoryStudies: number;
    optionalStudies: number;
    totalStudies: number;
  } {
    const matrix = this.getCurriculumMatrix({ studyOptions: options });

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
   * @param studyActivities study activities
   * @param options options
   * @returns statistics
   */
  calculateStatistics(
    studyActivities: StudyActivityItem[],
    options: string[]
  ): Statistics {
    const matrix = this.getCurriculumMatrix({ studyOptions: options });

    const requiredStudies = this.getRequiredStudyValues(options);

    const completedActivities = studyActivities.filter(
      (activity) =>
        (activity.state === "GRADED" && activity.passing) ||
        activity.state === "TRANSFERRED"
    );

    let mandatoryStudies = 0;
    let optionalStudies = 0;
    let exceptionRuleApplied = false; // Track if we've already applied the 2+2 rule

    // Track credits for exception subjects
    const exceptionSubjectCredits: Record<
      string,
      { mandatory: number; optional: number }
    > = {};

    completedActivities.forEach((activity) => {
      const subject = matrix.subjects.find(
        (subject) => subject.code === activity.subject
      );

      if (subject) {
        const course = subject.modules.find(
          (module) => module.courseNumber === activity.courseNumber
        );

        if (course) {
          if (UPPER_SECONDARY_REQUIRED_EXCEPTION.includes(activity.subject)) {
            // Initialize tracking for this exception subject if needed
            if (!exceptionSubjectCredits[activity.subject]) {
              exceptionSubjectCredits[activity.subject] = {
                mandatory: 0,
                optional: 0,
              };
            }

            // Track credits for this exception subject
            if (course.mandatory) {
              exceptionSubjectCredits[activity.subject].mandatory +=
                course.length;
            } else {
              exceptionSubjectCredits[activity.subject].optional +=
                course.length;
            }
          }

          // Normal credit calculation
          if (course.mandatory) {
            mandatoryStudies += course.length;
          } else {
            optionalStudies += course.length;
          }
        }
      }
    });

    // Check if any exception subject has 2 mandatory + 2 optional credits
    if (!exceptionRuleApplied) {
      for (const subject of UPPER_SECONDARY_REQUIRED_EXCEPTION) {
        const credits = exceptionSubjectCredits[subject];
        if (credits && credits.mandatory >= 2 && credits.optional >= 2) {
          // Move 4 credits to mandatory studies (2 were already there, so add 2 more)
          mandatoryStudies += 2;
          optionalStudies -= 2;
          exceptionRuleApplied = true;
          break;
        }
      }
    }

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
   * @param curriculumName curriculum name
   */
  constructor(courseMatrix?: CourseMatrix, curriculumName?: string) {
    // Initialize the base matrix with identifiers
    this.matrix = enrichCourseMatrixWithIdentifiers(
      courseMatrix,
      curriculumName
    );
  }

  /**
   * Get curriculum matrix
   * @param options options. Optional parameter to filter the matrix based on.
   * @returns curriculum matrix
   */
  getCurriculumMatrix(options?: CurriculumMatrixOptions) {
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
   * @param studyActivities study activities
   * @param options options
   * @returns estimated time to completion in months
   */
  calculateEstimatedTimeToCompletion(
    hoursPerWeek: number,
    studyActivities: StudyActivityItem[],
    options: string[]
  ): number {
    const statistics = this.calculateStatistics(studyActivities, options);

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
   * Calculate plan statistics
   * @param plannedCourses planned courses
   * @param studyActivities study activities
   * @param options options
   * @returns statistics
   */
  calculatePlanStatistics(
    plannedCourses: PlannedCourseWithIdentifier[],
    studyActivities: StudyActivityItem[],
    options: string[]
  ): PlanStatistics {
    const completedStats = this.calculateStatistics(studyActivities, options);

    // Calculate planned studies (excluding completed ones)
    let plannedMandatory = 0;
    let plannedOptional = 0;

    plannedCourses.forEach((planned) => {
      // Skip if this course is already completed
      const isCompleted = studyActivities.some(
        (activity) =>
          activity.subject === planned.subjectCode &&
          activity.courseNumber === planned.courseNumber &&
          ((activity.state === "GRADED" && activity.passing) ||
            activity.state === "TRANSFERRED")
      );

      if (!isCompleted) {
        if (planned.mandatory) {
          plannedMandatory += 1;
        } else {
          plannedOptional += 1;
        }
      }
    });

    // Calculate remaining required studies
    const remainingMandatory = Math.max(
      completedStats.requiredStudies.mandatoryStudies -
        completedStats.mandatoryStudies,
      0
    );

    const remainingOptional = Math.max(
      completedStats.requiredStudies.optionalStudies -
        completedStats.optionalStudies,
      0
    );

    return {
      plannedMandatoryStudies: plannedMandatory,
      plannedOptionalStudies: plannedOptional,
      plannedTotalStudies: plannedMandatory + plannedOptional,
      unit: "courses",
      requiredStudies: {
        plannedMandatoryStudies: remainingMandatory,
        plannedOptionalStudies: remainingOptional,
        plannedTotalStudies: remainingMandatory + remainingOptional,
      },
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
   * @param studyActivities study activities
   * @param options options
   * @returns statistics
   */
  calculateStatistics(
    studyActivities: StudyActivityItem[],
    options: string[]
  ): Statistics {
    const matrix = this.getCurriculumMatrix({ studyOptions: options });
    const requiredStudies = this.getRequiredStudyValues(options);

    // Filter completed or transferred activities
    const completedActivities = studyActivities.filter(
      (activity) =>
        (activity.state === "GRADED" && activity.passing) ||
        activity.state === "TRANSFERRED"
    );

    let mandatoryCount = 0;
    let optionalCount = 0;

    // Go through each completed activity and match with matrix courses
    completedActivities.forEach((activity) => {
      // Find matching subject and course in matrix
      const subject = matrix.subjects.find(
        (subject) => subject.code === activity.subject
      );

      if (subject) {
        const course = subject.modules.find(
          (module) => module.courseNumber === activity.courseNumber
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
 * Get curriculum config
 * @param courseMatrixType course matrix type
 * @param courseMatrix course matrix
 * @param curriculumName curriculum name
 * @returns curriculum config
 */
function getCurriculumConfig(
  courseMatrixType: CourseMatrixType,
  courseMatrix?: CourseMatrix,
  curriculumName?: string
): CurriculumConfig {
  if (courseMatrixType === "UPPER_SECONDARY") {
    return {
      type: "uppersecondary",
      strategy: new UppersecondaryCurriculum(courseMatrix, curriculumName),
    };
  }
  return {
    type: "compulsory",
    strategy: new CompulsoryCurriculum(courseMatrix, curriculumName),
  };
}

export { UppersecondaryCurriculum, CompulsoryCurriculum, getCurriculumConfig };
