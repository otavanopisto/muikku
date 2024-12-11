import { Period, PlannedCourse } from "~/@types/shared";
import { groupBy } from "lodash";

/**
 * Convert planned course to period
 * @param plannedCourses planned course
 * @returns period
 */
const createPeriods = (plannedCourses: PlannedCourse[]): Period[] => {
  // Get all unique years from planned courses
  const years = [
    ...new Set(
      plannedCourses.map((course) => new Date(course.startDate).getFullYear())
    ),
  ];

  const periods: Period[] = [];

  // Create spring and fall periods for each year
  years.forEach((year) => {
    // Spring period: January 1st - July 31st
    const springPeriod: Period = {
      type: "SPRING",
      year,
      title: `${year} Spring`,
      credits: 0,
      plannedCourses: [],
    };

    // Fall period: August 1st - December 31st
    const fallPeriod: Period = {
      type: "AUTUMN",
      year,
      title: `${year} Fall`,
      credits: 0,
      plannedCourses: [],
    };

    periods.push(springPeriod, fallPeriod);
  });

  // Sort periods by years
  return periods.sort((a, b) => a.year - b.year);
};

/**
 * Creates and allocates planned courses to academic periods
 * @param plannedCourses List of planned courses to allocate
 * @returns List of periods with allocated courses and calculated credits
 */
const createAndAllocateCoursesToPeriods = (
  plannedCourses: PlannedCourse[]
): Period[] => {
  // Convert all planned courses to periods to get date ranges
  const periods = createPeriods(plannedCourses);

  // Allocate courses to periods
  plannedCourses.forEach((course) => {
    const courseStartYear = new Date(course.startDate).getFullYear();
    const courseStartMonth = new Date(course.startDate).getMonth();

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
      period.plannedCourses.push(course);
      period.credits += course.length;
    }
  });

  // Remove empty periods and sort by date
  return periods
    .filter((period) => period.plannedCourses.length > 0)
    .sort((a, b) => a.year - b.year);
};

export { createAndAllocateCoursesToPeriods };
