import * as React from "react";
import { PlannedPeriod } from "~/reducers/hops";
import PlannerPeriodMonth from "./desktop/planner-period-month";
import MobilePlannerPeriodMonth from "./mobile/planner-period-month";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getPeriodMonthNames } from "../helper";

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

    const { t } = useTranslation(["common"]);

    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const { period, renderMobile } = props;

    const { workload, type, year, plannedCourses, isPastPeriod } = period;

    const months = getPeriodMonthNames(type, t);

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

    const title =
      type === "AUTUMN"
        ? t("labels.autumn", {
            year: year,
          })
        : t("labels.spring", {
            year: year,
          });

    return (
      <motion.div
        className={`study-planner__period ${isPastPeriod ? "study-planner__period--past" : ""}`}
        ref={ref}
        variants={periodVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
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
                {title}{" "}
                {isPastPeriod && (
                  <span className="study-planner__period-past-label">
                    {t("labels.pastPeriodLabel", {
                      ns: "hops_new",
                    })}
                  </span>
                )}
                {workload && ` - ${workload.displayValue}`}
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
                  {title}{" "}
                  {isPastPeriod && (
                    <span className="study-planner__period-past-label">
                      {t("labels.pastPeriodLabel", {
                        ns: "hops_new",
                      })}
                    </span>
                  )}
                  {workload && ` - ${workload.displayValue}`}
                </motion.div>
              </motion.div>

              {isPastPeriod && (
                <div className="study-planner__past-period-unlock-wrapper">
                  <div className="study-planner__past-period-unlock">
                    <span className="study-planner__past-period-unlock-icon icon-lock" />
                    <span className="study-planner__past-period-unlock-label">
                      {t("labels.unblockPastPeriod", {
                        ns: "hops_new",
                      })}
                    </span>
                  </div>
                </div>
              )}

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
