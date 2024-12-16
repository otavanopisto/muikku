import * as React from "react";
import {
  CourseChangeAction,
  PlannedCourseWithIdentifier,
  PlannedPeriod,
} from "~/reducers/hops";
import PlannerPeriodMonth from "./planner-perioud-month";

const AUTUMN_MONTHS = ["Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];
const SPRING_MONTHS = [
  "Tammikuu",
  "Helmikuu",
  "Maaliskuu",
  "Huhtikuu",
  "Toukokuu",
  "Kesäkuu",
  "Heinäkuu",
];

/**
 * PlannerPeriodProps
 */
export interface PlannerPeriodProps extends PlannedPeriod {
  onCourseChange?: (
    course: PlannedCourseWithIdentifier,
    action: CourseChangeAction
  ) => void;
}

/**
 * PlannerPeriod component
 * @param props props
 */
const PlannerPeriod: React.FC<PlannerPeriodProps> = (props) => {
  const { title, credits, type, year, plannedCourses, onCourseChange } = props;

  const months = type === "AUTUMN" ? AUTUMN_MONTHS : SPRING_MONTHS;

  /**
   * Gets courses by month
   * @param monthName month name
   */
  const getCoursesByMonth = (monthName: string) =>
    plannedCourses.filter((course) => {
      const startDate = new Date(course.startDate);
      const monthIndex = startDate.getMonth();
      return months[monthIndex - (type === "AUTUMN" ? 7 : 0)] === monthName;
    });

  return (
    <div className="hops-planner__period">
      <h3 className="hops-planner__period-title">
        {title} - {credits} op
      </h3>
      <div className="hops-planner__months">
        {months.map((monthName, index) => {
          const monthCourses = getCoursesByMonth(monthName);

          return (
            <PlannerPeriodMonth
              key={monthName}
              title={monthName}
              // Get month index from months array
              monthIndex={index + (type === "AUTUMN" ? 7 : 0)}
              year={year}
              courses={monthCourses}
              onCourseChange={onCourseChange}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlannerPeriod;
