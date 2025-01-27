import { Course, CourseFilter, SchoolSubject } from "~/@types/shared";
import { StudentStudyActivity } from "~/generated/client";
import { PlannedCourseWithIdentifier, PlannedPeriod } from "~/reducers/hops";
import { CurriculumStrategy } from "~/util/curriculum-config";

/**
 * Convert planned course to period
 * @param plannedCourses planned course
 * @param curriculumStrategy curriculum strategy
 * @returns period
 */
const createPeriods = (
  plannedCourses: PlannedCourseWithIdentifier[],
  curriculumStrategy: CurriculumStrategy
): PlannedPeriod[] => {
  // Get all unique years from planned courses
  /* const years = [
    ...new Set(
      plannedCourses.map((course) => new Date(course.startDate).getFullYear())
    ),
  ]; */

  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  const periods: PlannedPeriod[] = [];

  // Create spring and fall periods for each year
  years.forEach((year) => {
    periods.push(
      curriculumStrategy.getEmptyPeriod("SPRING", year),
      curriculumStrategy.getEmptyPeriod("AUTUMN", year)
    );
  });

  // Sort periods by years
  return periods.sort((a, b) => a.year - b.year);
};

/**
 * Creates and allocates planned courses to academic periods
 * @param plannedCourses List of planned courses to allocate
 * @param curriculumStrategy curriculum strategy
 * @returns List of periods with allocated courses and calculated credits
 */
const createAndAllocateCoursesToPeriods = (
  plannedCourses: PlannedCourseWithIdentifier[],
  curriculumStrategy: CurriculumStrategy
): PlannedPeriod[] => {
  // Convert all planned courses to periods to get date ranges
  const periods = createPeriods(plannedCourses, curriculumStrategy);

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
      // Update workload using strategy
      const workload = curriculumStrategy.calculatePeriodWorkload(
        period.plannedCourses
      );
      period.workload = workload;
    }
  });

  // Remove empty periods and sort by date
  /* return periods
    .filter((period) => period.plannedCourses.length > 0)
    .sort((a, b) => a.year - b.year); */

  return periods.sort((a, b) => a.year - b.year);
};

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
    .map((subject) => {
      let filteredCoursesWithStudyActivity = [...subject.availableCourses].map(
        (course) => {
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

          return { ...course, studyActivity, planned: !!plannedCourse };
        }
      );

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

      filteredCoursesWithStudyActivity =
        filteredCoursesWithStudyActivity.filter(
          (course) =>
            course.studyActivity === undefined ||
            (selectedFilters.includes("GRADED") &&
              course.studyActivity.status === "GRADED") ||
            (selectedFilters.includes("ONGOING") &&
              course.studyActivity.status === "ONGOING") ||
            (selectedFilters.includes("SUPPLEMENTATIONREQUEST") &&
              course.studyActivity.status === "SUPPLEMENTATIONREQUEST") ||
            (selectedFilters.includes("TRANSFERRED") &&
              course.studyActivity.status === "TRANSFERRED")
        );

      // By default filter out planned courses
      if (!selectedFilters.includes("planned")) {
        // Filter out planned courses
        filteredCoursesWithStudyActivity =
          filteredCoursesWithStudyActivity.filter((course) => !course.planned);
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
};
