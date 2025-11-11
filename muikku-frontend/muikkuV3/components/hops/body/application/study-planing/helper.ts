import { TFunction } from "i18next";
import { Course, CourseFilter, SchoolSubject } from "~/@types/shared";
import { CourseStatus, StudentStudyActivity } from "~/generated/client";
import {
  PlannedCourseWithIdentifier,
  PlannedPeriod,
  PlannerActivityItem,
  StudentDateInfo,
} from "~/reducers/hops";
import { CurriculumStrategy } from "~/util/curriculum-config";

/**
 * Gets period type by month number
 * @param monthNumber month number
 * @returns period type
 */
const getPeriodTypeByMonthNumber = (monthNumber: number) => {
  if (monthNumber >= 0 && monthNumber <= 6) return "SPRING";
  if (monthNumber >= 7 && monthNumber <= 11) return "AUTUMN";
  return null;
};

/**
 * Gets period month names by type
 * @param type type of period
 * @param t translation function
 */
const getPeriodMonthNames = (type: "AUTUMN" | "SPRING", t: TFunction) => {
  const AUTUMN_MONTHS = [
    t("labels.month_august", { ns: "common" }),
    t("labels.month_september", { ns: "common" }),
    t("labels.month_october", { ns: "common" }),
    t("labels.month_november", { ns: "common" }),
    t("labels.month_december", { ns: "common" }),
  ];
  const SPRING_MONTHS = [
    t("labels.month_january", { ns: "common" }),
    t("labels.month_february", { ns: "common" }),
    t("labels.month_march", { ns: "common" }),
    t("labels.month_april", { ns: "common" }),
    t("labels.month_may", { ns: "common" }),
    t("labels.month_june", { ns: "common" }),
    t("labels.month_july", { ns: "common" }),
  ];

  return type === "AUTUMN" ? AUTUMN_MONTHS : SPRING_MONTHS;
};

/**
 * Checks if the period is in the past
 * @param period period
 * @returns true if the period is in the past
 */
const periodIsInThePast = (period: PlannedPeriod) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  const { year, type } = period;

  if (year < currentYear) return true;
  if (year > currentYear) return false;

  // For same year, check if we're past the period
  if (type === "AUTUMN") {
    return currentMonth > 11; // Past December
  } else {
    // SPRING
    return currentMonth > 6; // Past July
  }
};

/**
 * Convert planned course to period
 * @param studentDateInfo student date info
 * @param curriculumStrategy curriculum strategy
 * @returns period
 */
const createPeriods = (
  studentDateInfo: StudentDateInfo,
  curriculumStrategy: CurriculumStrategy
): PlannedPeriod[] => {
  // Calculate start and end years based on studentDateInfo
  const startYear = studentDateInfo.studyStartDate.getFullYear();

  let endYear: number;

  if (studentDateInfo.studyTimeEnd) {
    endYear = studentDateInfo.studyTimeEnd.getFullYear();
  } else {
    // Default to 4 years from start date if no end date provided
    endYear = startYear + 4;
  }

  // Generate array of years between start and end (inclusive)
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const periods: PlannedPeriod[] = [];

  // Create spring and fall periods for each year
  years.forEach((year) => {
    let springPeriod = curriculumStrategy.getEmptyPeriod("SPRING", year);
    let autumnPeriod = curriculumStrategy.getEmptyPeriod("AUTUMN", year);

    // Check if the period is in the past
    springPeriod = {
      ...springPeriod,
      isPastPeriod: periodIsInThePast(springPeriod),
    };
    autumnPeriod = {
      ...autumnPeriod,
      isPastPeriod: periodIsInThePast(autumnPeriod),
    };

    periods.push(springPeriod, autumnPeriod);
  });

  // Sort periods by years
  return periods.sort((a, b) => a.year - b.year);
};

/**
 * Creates and allocates planned courses to academic periods
 * @param studentDateInfo student date info
 * @param studyActivities study activities
 * @param plannedCourses List of planned courses to allocate
 * @param curriculumStrategy curriculum strategy
 * @returns List of periods with allocated courses and calculated credits
 */
const createAndAllocateCoursesToPeriods = (
  studentDateInfo: StudentDateInfo,
  studyActivities: StudentStudyActivity[],
  plannedCourses: PlannedCourseWithIdentifier[],
  curriculumStrategy: CurriculumStrategy
): PlannedPeriod[] => {
  // Convert all planned courses to periods to get date ranges
  const periods = createPeriods(studentDateInfo, curriculumStrategy);

  const plannedCourseKeys = new Set(
    plannedCourses.map((pc) => `${pc.subjectCode}-${pc.courseNumber}`)
  );

  // Allocate courses to periods
  plannedCourses.forEach((course) => {
    // Find possible study activity for the course
    const studyActivity = studyActivities.find(
      (sa) =>
        sa.courseNumber === course.courseNumber &&
        sa.subject === course.subjectCode
    );

    // If study activity is found, use the date of the study activity, otherwise use the start date of the planned course.
    // This is done because plan itself is baseline and study activity is overriding it based on how students actions
    // affect the plan.
    const useStudyActivityData =
      studyActivity &&
      (studyActivity.status === "GRADED" ||
        studyActivity.status === "SUPPLEMENTATIONREQUEST");

    const courseStartYear = useStudyActivityData
      ? new Date(studyActivity.date).getFullYear()
      : new Date(course.startDate).getFullYear();
    const courseStartMonth = useStudyActivityData
      ? new Date(studyActivity.date).getMonth()
      : new Date(course.startDate).getMonth();

    const period = periods.find(
      (p) =>
        courseStartYear === p.year &&
        ((p.type === "SPRING" &&
          courseStartMonth >= 0 &&
          courseStartMonth <= 6) ||
          (p.type === "AUTUMN" &&
            courseStartMonth >= 7 &&
            courseStartMonth <= 11))
    );

    if (period) {
      period.items.push(course);
    }
  });

  // Allocate graded activities that are NOT in planned courses
  // Only show in past periods
  studyActivities
    .filter(
      (activity) =>
        !plannedCourseKeys.has(
          `${activity.subject}-${activity.courseNumber}`
        ) &&
        (activity.status === "GRADED" ||
          activity.status === "SUPPLEMENTATIONREQUEST")
    )
    .forEach((activity) => {
      const activityItem = createActivityOnlyCourseItem(
        activity,
        curriculumStrategy
      );

      if (!activityItem) return;

      const activityDate = new Date(activity.date);
      const activityYear = activityDate.getFullYear();
      const activityMonth = activityDate.getMonth();

      const period = periods.find(
        (p) =>
          activityYear === p.year &&
          p.isPastPeriod && // Only in past periods
          ((p.type === "SPRING" && activityMonth >= 0 && activityMonth <= 6) ||
            (p.type === "AUTUMN" && activityMonth >= 7 && activityMonth <= 11))
      );

      if (period) {
        period.items.push(activityItem);
      }
    });

  // Only trim empty periods from the start
  const trimmedPeriods = [...periods];

  const currentPeriod = curriculumStrategy.getCurrentPeriod();

  // Trim from start if the period is empty
  while (
    trimmedPeriods.length > 0 &&
    !(
      trimmedPeriods[0].year === currentPeriod.year &&
      trimmedPeriods[0].type === currentPeriod.type
    ) &&
    trimmedPeriods[0].items.length === 0
  ) {
    trimmedPeriods.shift();
  }

  return trimmedPeriods;
};

/**
 * Creates an activity-only course item from study activity and matrix
 * @param studyActivity study activity
 * @param curriculumStrategy curriculum strategy
 * @returns activity-only course item
 */
const createActivityOnlyCourseItem = (
  studyActivity: StudentStudyActivity,
  curriculumStrategy: CurriculumStrategy
): PlannerActivityItem | null => {
  const matrix = curriculumStrategy.getCurriculumMatrix();
  // Find course in matrix
  const subject = matrix.subjectsTable.find(
    (s) => s.subjectCode === studyActivity.subject
  );

  if (!subject) return null;

  const course = subject.availableCourses.find(
    (c) => c.courseNumber === studyActivity.courseNumber
  );

  if (!course) return null;

  return {
    identifier: "activity-course-" + studyActivity.courseId,
    course: {
      ...course,
      subjectCode: subject.subjectCode,
    },
    studyActivity,
  };
};

/**
 * Filtered course
 */
interface FilteredCourse extends Course {
  state?: CourseStatus;
  planned: boolean;
  studyActivity?: StudentStudyActivity;
}

/**
 * Filters subjects and courses
 * @param subjects subjects
 * @param searchTerm search term
 * @param selectedFilters selected filters
 * @param availableOPSCoursesMap available OPS courses map
 * @param studyActivities study activities
 * @param plannedCourses planned courses
 * @returns filtered subjects and courses
 */
const filterSubjectsAndCourses = (
  subjects: SchoolSubject[],
  searchTerm: string,
  selectedFilters: CourseFilter[],
  availableOPSCoursesMap: Map<string, number[]>,
  studyActivities: StudentStudyActivity[],
  plannedCourses: PlannedCourseWithIdentifier[]
) =>
  subjects
    .map((subject, i) => {
      let filteredCoursesWithStudyActivity = [
        ...subject.availableCourses,
      ].map<FilteredCourse>((course) => {
        const studyActivity = studyActivities.find(
          (sa) =>
            sa.courseNumber === course.courseNumber &&
            sa.subject === subject.subjectCode
        );

        const plannedCourse = plannedCourses.find(
          (pc) =>
            pc.courseNumber === course.courseNumber &&
            pc.subjectCode === subject.subjectCode
        );

        let state: CourseStatus = undefined;

        if (studyActivity) {
          state = studyActivity.status;
        }

        return {
          ...course,
          studyActivity,
          state,
          planned: !!plannedCourse,
        };
      });

      const skipMandatoryChecking =
        selectedFilters.includes("mandatory") &&
        selectedFilters.includes("optional");

      // Apply filters
      if (!skipMandatoryChecking && selectedFilters.includes("mandatory")) {
        filteredCoursesWithStudyActivity =
          filteredCoursesWithStudyActivity.filter((course) => course.mandatory);
      }

      if (!skipMandatoryChecking && selectedFilters.includes("optional")) {
        filteredCoursesWithStudyActivity =
          filteredCoursesWithStudyActivity.filter(
            (course) => !course.mandatory
          );
      }

      // Filter available OPS courses
      if (selectedFilters.includes("available")) {
        filteredCoursesWithStudyActivity =
          filteredCoursesWithStudyActivity.filter((course) => {
            const availableCourseNumbers = availableOPSCoursesMap.get(
              subject.subjectCode
            );
            return (
              availableCourseNumbers?.includes(course.courseNumber) ?? false
            );
          });
      }

      filteredCoursesWithStudyActivity =
        filteredCoursesWithStudyActivity.filter(
          (course) =>
            course.state === undefined ||
            (selectedFilters.includes("planned") && course.planned) ||
            (selectedFilters.includes("GRADED") && course.state === "GRADED") ||
            (selectedFilters.includes("ONGOING") &&
              course.state === "ONGOING") ||
            (selectedFilters.includes("SUPPLEMENTATIONREQUEST") &&
              course.state === "SUPPLEMENTATIONREQUEST") ||
            (selectedFilters.includes("TRANSFERRED") &&
              course.state === "TRANSFERRED") ||
            (selectedFilters.includes("SUGGESTED_NEXT") &&
              course.state === "SUGGESTED_NEXT")
        );

      // Apply search term
      if (searchTerm !== "") {
        filteredCoursesWithStudyActivity =
          filteredCoursesWithStudyActivity.filter((course) =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
      }

      return {
        ...subject,
        availableCourses: filteredCoursesWithStudyActivity,
      };
    })
    .filter((subject) => subject.availableCourses.length > 0); // Remove subjects with no matching courses

/**
 * Gets the current active period
 * @param periods periods
 * @returns current active period
 */
export const getCurrentActivePeriod = (periods: PlannedPeriod[]) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return periods.find(
    (period) =>
      period.year === currentYear &&
      period.type === "AUTUMN" &&
      currentMonth >= 7 &&
      currentMonth <= 11
  );
};

/**
 * Gets the current active period date range
 * @param periods periods
 * @returns current active period date range
 */
export const getCurrentActivePeriodDateRange = (periods: PlannedPeriod[]) => {
  const currentActivePeriod = getCurrentActivePeriod(periods);

  if (!currentActivePeriod) {
    return new Date();
  }

  const { year, type } = currentActivePeriod;

  return type === "AUTUMN" ? new Date(year, 7, 1) : new Date(year, 0, 0);
};

/**
 * Checks if the course is a planned course
 * @param course course
 * @returns true if the course is a planned course
 */
const isPlannedCourse = (
  course: PlannedCourseWithIdentifier | Course
): course is PlannedCourseWithIdentifier => "identifier" in course;

/**
 * Checks if the selected course is a planned course
 * @param course selected course
 * @returns true if the selected course is a planned course
 */
const selectedIsPlannedCourse = (
  course: PlannedCourseWithIdentifier | (Course & { subjectCode: string })
): course is PlannedCourseWithIdentifier => "identifier" in course;

export {
  createAndAllocateCoursesToPeriods,
  filterSubjectsAndCourses,
  isPlannedCourse,
  selectedIsPlannedCourse,
  getPeriodMonthNames,
  getPeriodTypeByMonthNumber,
};
