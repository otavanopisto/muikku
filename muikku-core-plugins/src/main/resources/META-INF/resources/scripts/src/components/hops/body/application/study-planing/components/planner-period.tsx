import * as React from "react";
import { PlannedPeriod } from "~/reducers/hops";
import PlannerPeriodMonth from "./desktop/planner-period-month";
import MobilePlannerPeriodMonth from "./mobile/planner-period-month";
import { LayoutGroup, motion } from "framer-motion";

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
  renderMobile?: boolean;
}

const defaultProps: Partial<PlannerPeriodProps> = {
  renderMobile: false,
};

/**
 * PlannerPeriod component
 * @param props props
 */
const PlannerPeriod = React.forwardRef<HTMLDivElement, PlannerPeriodProps>(
  (props, ref) => {
    props = { ...defaultProps, ...props };

    const { title, workload, type, year, plannedCourses, renderMobile } = props;

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
      <div className="study-planner__period" ref={ref}>
        <h3 className="study-planner__period-title">
          {title}
          {workload && ` - ${workload.displayValue}`}
        </h3>
        <LayoutGroup>
          <motion.div layout="position" className="study-planner__months">
            {months.map((monthName, index) => {
              const monthCourses = getCoursesByMonth(monthName);

              if (renderMobile) {
                return (
                  <MobilePlannerPeriodMonth
                    key={`${monthName}-${year}`}
                    title={monthName}
                    monthIndex={index + (type === "AUTUMN" ? 7 : 0)}
                    year={year}
                    courses={monthCourses}
                  />
                );
              }

              return (
                <PlannerPeriodMonth
                  key={`${monthName}-${year}`}
                  title={monthName}
                  // Get month index from months array
                  monthIndex={index + (type === "AUTUMN" ? 7 : 0)}
                  year={year}
                  courses={monthCourses}
                />
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>
    );
  }
);

PlannerPeriod.displayName = "PlannerPeriod";

export default PlannerPeriod;
