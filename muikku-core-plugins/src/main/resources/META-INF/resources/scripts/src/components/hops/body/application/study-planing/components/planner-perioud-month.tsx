import * as React from "react";
import AnimateHeight from "react-animate-height";
import { Course } from "~/@types/shared";
import Button from "~/components/general/button";
import {
  CourseChangeAction,
  PlannedCourseWithIdentifier,
} from "~/reducers/hops";
import Droppable from "./droppable";
import { PlannerPeriodProps } from "./planner-period";
import PlannerPeriodCourseCard from "./planner-perioud-course";

/**
 * Checks if the course is a planned course
 * @param course course
 * @returns true if the course is a planned course
 */
const isPlannedCourse = (
  course: PlannedCourseWithIdentifier | Course
): course is PlannedCourseWithIdentifier => "identifier" in course;

/**
 * PlannerPeriodMonthProps
 */
interface PlannerPeriodMonthProps {
  title: string;
  monthIndex: number;
  year: number;
  courses: PlannedCourseWithIdentifier[];
  onCourseChange: PlannerPeriodProps["onCourseChange"];
}

/**
 * PlannerPeriodMonth component
 * @param props props
 */
const PlannerPeriodMonth: React.FC<PlannerPeriodMonthProps> = (props) => {
  const { monthIndex, title, year, courses, onCourseChange } = props;

  const [isExpanded, setIsExpanded] = React.useState(true);

  /**
   * Handles month toggle
   */
  const handleMonthToggle = () => {
    setIsExpanded(!isExpanded);
  };

  /**
   * Handles drop
   * @param course course
   * @param type type
   */
  const handleDrop = (
    course: PlannedCourseWithIdentifier | (Course & { subjectCode: string }),
    type: string
  ) => {
    let updatedCourse: PlannedCourseWithIdentifier;

    let action: CourseChangeAction = "add";

    if (isPlannedCourse(course)) {
      // Set start date to the month number and year
      const updatedStartDate = new Date(course.startDate);
      updatedStartDate.setMonth(monthIndex);
      updatedStartDate.setFullYear(year);

      updatedCourse = {
        ...course,
        startDate: updatedStartDate,
      };

      action = "update";
    } else {
      updatedCourse = {
        identifier: "planned-course-" + new Date().getTime(),
        id: new Date().getTime(),
        name: course.name,
        courseNumber: course.courseNumber,
        length: course.length,
        lengthSymbol: "op",
        subjectCode: course.subjectCode,
        mandatory: course.mandatory,
        startDate: new Date(year, monthIndex, 1),
      };

      action = "add";
    }

    onCourseChange(updatedCourse, action);
  };

  return (
    <div className="hops-planner__month">
      <Button
        iconPosition="left"
        icon={isExpanded ? "arrow-down" : "arrow-right"}
        buttonModifiers={["planner-month-toggle"]}
        onClick={handleMonthToggle}
      >
        {title}
      </Button>

      <AnimateHeight height={isExpanded ? "auto" : 0}>
        <div className="hops-planner__month-content">
          {courses.length > 0 ? (
            <Droppable<
              PlannedCourseWithIdentifier | (Course & { subjectCode: string })
            >
              accept={["planned-course-card", "new-course-card"]}
              onDrop={handleDrop}
              className="hops-planner__courses"
            >
              {courses.map((course) => (
                <PlannerPeriodCourseCard
                  key={course.id}
                  course={course}
                  onCourseChange={onCourseChange}
                />
              ))}
            </Droppable>
          ) : (
            <Droppable<
              PlannedCourseWithIdentifier | (Course & { subjectCode: string })
            >
              accept={["planned-course-card", "new-course-card"]}
              onDrop={handleDrop}
              className="hops-planner__empty-month"
            >
              <div className="hops-planner__dropzone">
                <i className="muikku-icon-drag-handle" />
                <span>Raahaa kursseja tähän</span>
              </div>
            </Droppable>
          )}
        </div>
      </AnimateHeight>
    </div>
  );
};

export default PlannerPeriodMonth;
