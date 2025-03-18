import { Course, CourseFilter, SchoolSubject } from "~/@types/shared";
import { CourseStatus, StudentStudyActivity } from "~/generated/client";
import {
  PlannedCourseWithIdentifier,
  PlannedPeriod,
  StudentDateInfo,
} from "~/reducers/hops";
import { CurriculumStrategy } from "~/util/curriculum-config";

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
 * @param studentDateInfo student date info
 * @param plannedCourses List of planned courses to allocate
 * @param curriculumStrategy curriculum strategy
 * @returns List of periods with allocated courses and calculated credits
 */
const createAndAllocateCoursesToPeriods = (
  studentDateInfo: StudentDateInfo,
  plannedCourses: PlannedCourseWithIdentifier[],
  curriculumStrategy: CurriculumStrategy
): PlannedPeriod[] => {
  // Convert all planned courses to periods to get date ranges
  const periods = createPeriods(studentDateInfo, curriculumStrategy);

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

  // Only trim empty periods from the start
  const trimmedPeriods = [...periods];

  // Trim from start
  while (
    trimmedPeriods.length > 0 &&
    trimmedPeriods[0].plannedCourses.length === 0
  ) {
    trimmedPeriods.shift();
  }

  return trimmedPeriods;
};

/**
 * Filtered course
 */
interface FilteredCourse extends Course {
  state?: CourseStatus | "PLANNED";
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

        let state: CourseStatus | "PLANNED" = undefined;

        if (plannedCourse) {
          state = "PLANNED";
        }

        if (studyActivity) {
          state = studyActivity.status;
        }

        return {
          ...course,
          studyActivity,
          state,
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
            (selectedFilters.includes("planned") &&
              course.state === "PLANNED") ||
            (selectedFilters.includes("GRADED") && course.state === "GRADED") ||
            (selectedFilters.includes("ONGOING") &&
              course.state === "ONGOING") ||
            (selectedFilters.includes("SUPPLEMENTATIONREQUEST") &&
              course.state === "SUPPLEMENTATIONREQUEST") ||
            (selectedFilters.includes("TRANSFERRED") &&
              course.state === "TRANSFERRED")
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
