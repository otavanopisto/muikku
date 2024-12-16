import { CourseFilter, SchoolSubject } from "~/@types/shared";
import { PlannedCourseWithIdentifier, PlannedPeriod } from "~/reducers/hops";
/**
 * Convert planned course to period
 * @param plannedCourses planned course
 * @returns period
 */
const createPeriods = (
  plannedCourses: PlannedCourseWithIdentifier[]
): PlannedPeriod[] => {
  // Get all unique years from planned courses
  const years = [
    ...new Set(
      plannedCourses.map((course) => new Date(course.startDate).getFullYear())
    ),
  ];

  const periods: PlannedPeriod[] = [];

  // Create spring and fall periods for each year
  years.forEach((year) => {
    // Spring period: January 1st - July 31st
    const springPeriod: PlannedPeriod = {
      type: "SPRING",
      year,
      title: `${year} Spring`,
      credits: 0,
      plannedCourses: [],
    };

    // Fall period: August 1st - December 31st
    const fallPeriod: PlannedPeriod = {
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
  plannedCourses: PlannedCourseWithIdentifier[]
): PlannedPeriod[] => {
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

/**
 * Filters subjects and courses
 * @param subjects subjects
 * @param searchTerm search term
 * @param selectedFilters selected filters
 * @returns filtered subjects and courses
 */
const filterSubjectsAndCourses = (
  subjects: SchoolSubject[],
  searchTerm: string,
  selectedFilters: CourseFilter[]
) =>
  subjects
    .map((subject) => {
      let filteredCourses = [...subject.availableCourses];

      const skipMandatoryChecking =
        selectedFilters.includes("mandatory") &&
        selectedFilters.includes("optional");

      // Apply filters
      if (!skipMandatoryChecking && selectedFilters.includes("mandatory")) {
        filteredCourses = filteredCourses.filter((course) => course.mandatory);
      }

      if (!skipMandatoryChecking && selectedFilters.includes("optional")) {
        filteredCourses = filteredCourses.filter((course) => !course.mandatory);
      }

      // Apply search term
      if (searchTerm !== "") {
        filteredCourses = filteredCourses.filter((course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return {
        ...subject,
        availableCourses: filteredCourses,
      };
    })
    .filter((subject) => subject.availableCourses.length > 0); // Remove subjects with no matching courses

export { createAndAllocateCoursesToPeriods, filterSubjectsAndCourses };
