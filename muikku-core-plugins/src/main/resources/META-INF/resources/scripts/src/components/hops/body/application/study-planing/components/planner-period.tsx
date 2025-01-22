import * as React from "react";
import { PlannedPeriod } from "~/reducers/hops";
import PlannerPeriodMonth from "./desktop/planner-period-month";
import MobilePlannerPeriodMonth from "./mobile/planner-period-month";
import { AnimatePresence, LayoutGroup, motion, Variants } from "framer-motion";

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
    width: "48px",
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

const workloadVariants: Variants = {
  expanded: {
    opacity: 1,
    display: "inline",
  },
  collapsed: {
    opacity: 0,
    transitionEnd: {
      display: "none",
    },
  },
};

const periodMonthsVariants: Variants = {
  expanded: {
    opacity: 1,
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeInOut",
    },
  },
  collapsed: {
    opacity: 0,
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeInOut",
    },
  },
  initial: {
    opacity: 0,
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
        style={{ overflow: "hidden" }}
      >
        <AnimatePresence initial={false}>
          {isCollapsed && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.4,
                  type: "tween",
                  ease: "easeInOut",
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.4,
                  type: "tween",
                  ease: "easeInOut",
                },
              }}
              className="study-planner__period-header study-planner__period-header--collapsed"
            >
              <PeriodButton
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
              <motion.div className="study-planner__period-title study-planner__period-title--collapsed">
                {title}
                {workload && (
                  <motion.span
                    variants={workloadVariants}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    {workload.displayValue}
                  </motion.span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              className="study-planner__period-header"
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.4,
                  type: "tween",
                  ease: "easeInOut",
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.4,
                  type: "tween",
                  ease: "easeInOut",
                },
              }}
            >
              <PeriodButton
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
              <motion.div
                className="study-planner__period-title"
                variants={titleVariants}
                animate={isCollapsed ? "collapsed" : "expanded"}
              >
                {title}
                {workload && (
                  <motion.span
                    variants={workloadVariants}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    {workload.displayValue}
                  </motion.span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              className="study-planner__scrollable-container"
              variants={periodMonthsVariants}
              initial="initial"
              animate="expanded"
              exit="collapsed"
            >
              <LayoutGroup>
                <motion.div
                  layout="position"
                  className="study-planner__months-container"
                >
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
            </motion.div>
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
      className="study-planner__collapse-button"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 6L9 12L15 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
};

PlannerPeriod.displayName = "PlannerPeriod";

export default PlannerPeriod;
