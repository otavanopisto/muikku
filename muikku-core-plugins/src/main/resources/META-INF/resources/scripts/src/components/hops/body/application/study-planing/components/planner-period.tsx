import * as React from "react";
import { PlannedPeriod } from "~/reducers/hops";
import PlannerPeriodMonth from "./desktop/planner-period-month";
import MobilePlannerPeriodMonth from "./mobile/planner-period-month";
import { AnimatePresence, motion, Variants } from "framer-motion";

// Animate period to collapse
const periodVariants: Variants = {
  expanded: {
    width: "350px",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeInOut",
    },
  },
  collapsed: {
    width: "36px",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeInOut",
    },
  },
};

// Update title variants for the flip animation
const titleVariants: Variants = {
  expanded: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  collapsed: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

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
export interface PlannerPeriodProps {
  period: PlannedPeriod;
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

    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const { period, renderMobile } = props;

    const { title, workload, type, year, plannedCourses } = period;

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
      <motion.div
        className="study-planner__period"
        ref={ref}
        variants={periodVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        style={{
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Collapsed state header */}
        <AnimatePresence>
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="study-planner__period-header study-planner__period-header--collapsed"
            >
              <PeriodButton
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
              <motion.div className="study-planner__period-title study-planner__period-title--collapsed">
                {title}
                {" - "}
                {workload && workload.displayValue}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded state content */}
        <AnimatePresence>
          {!isCollapsed && (
            <>
              <motion.div
                className="study-planner__period-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                <PeriodButton
                  isCollapsed={isCollapsed}
                  setIsCollapsed={setIsCollapsed}
                />
                <motion.div
                  className="study-planner__period-title"
                  variants={titleVariants}
                >
                  {title}
                  {" - "}
                  {workload && workload.displayValue}
                </motion.div>
              </motion.div>

              <motion.div
                className="study-planner__scrollable-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                <div className="study-planner__months-container">
                  {months.map((monthName, index) => {
                    const monthCourses = getCoursesByMonth(monthName);
                    const monthKey = `${monthName}-${year}-${type}`;

                    return renderMobile ? (
                      <MobilePlannerPeriodMonth
                        key={monthKey}
                        title={monthName}
                        monthIndex={index + (type === "AUTUMN" ? 7 : 0)}
                        year={year}
                        courses={monthCourses}
                      />
                    ) : (
                      <PlannerPeriodMonth
                        key={monthKey}
                        title={monthName}
                        monthIndex={index + (type === "AUTUMN" ? 7 : 0)}
                        year={year}
                        courses={monthCourses}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

/**
 * PeriodButtonProps
 */
interface PeriodButtonProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

/**
 * PeriodButton component
 * @param props props
 */
const PeriodButton = (props: PeriodButtonProps) => {
  const { isCollapsed, setIsCollapsed } = props;

  return (
    <motion.button
      className={`study-planner__collapse-button ${isCollapsed ? "icon-arrow-right" : "icon-arrow-left"}`}
      onClick={() => setIsCollapsed(!isCollapsed)}
    ></motion.button>
  );
};

PlannerPeriod.displayName = "PlannerPeriod";

export default PlannerPeriod;
