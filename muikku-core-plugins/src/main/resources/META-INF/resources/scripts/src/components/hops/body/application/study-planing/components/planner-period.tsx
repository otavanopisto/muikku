import * as React from "react";
import { PlannedPeriod } from "~/reducers/hops";
import PlannerPeriodMonth from "./desktop/planner-period-month";
import MobilePlannerPeriodMonth from "./mobile/planner-period-month";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getPeriodMonthNames } from "../helper";
import { PlannedCourse, StudentStudyActivity } from "~/generated/client";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";

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

/**
 * PeriodHasPlannedCourses
 * @param plannedCourses planned courses
 * @param studyActivity study activity
 * @returns true if the period has only planned courses
 */
const PeriodHasPlannedCourses = (
  plannedCourses: PlannedCourse[],
  studyActivity: StudentStudyActivity[]
) =>
  plannedCourses.some(
    (course) =>
      studyActivity.find(
        (sa) =>
          sa.courseNumber === course.courseNumber &&
          sa.subject === course.subjectCode
      ) === undefined
  );

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

    const { period, renderMobile } = props;
    const { workload, type, year, plannedCourses, isPastPeriod } = period;

    const { t } = useTranslation(["common"]);

    const studyActivity = useSelector(
      (state: StateType) => state.hopsNew.hopsStudyPlanState.studyActivity
    );
    const hopsMode = useSelector((state: StateType) => state.hopsNew.hopsMode);

    const [isUnlocked, setIsUnlocked] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const months = getPeriodMonthNames(type, t);

    // Check if the period has planned courses
    const hasPlannedCourses = React.useMemo(
      () => PeriodHasPlannedCourses(plannedCourses, studyActivity),
      [plannedCourses, studyActivity]
    );

    // Lock the period if there are no planned courses
    // anymore to edit or if the mode is read
    React.useEffect(() => {
      if (isPastPeriod && (!hasPlannedCourses || hopsMode === "READ")) {
        setIsUnlocked(false);
      }
    }, [isPastPeriod, hasPlannedCourses, hopsMode]);

    // Check if the period unlock button should be shown
    const showUnlockButton = React.useMemo(() => {
      if (
        isPastPeriod &&
        hasPlannedCourses &&
        hopsMode !== "READ" &&
        !isUnlocked
      ) {
        return true;
      }

      return false;
    }, [isPastPeriod, hasPlannedCourses, hopsMode, isUnlocked]);

    /**
     * Handles unlock
     */
    const handleUnlock = () => {
      setIsUnlocked(true);
    };

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
        className={`study-planner__period ${isPastPeriod && !isUnlocked ? "study-planner__period--past" : ""}`}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
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

              <AnimatePresence>
                {showUnlockButton && (
                  <motion.div
                    className="study-planner__past-period-unlock-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    onClick={handleUnlock}
                  >
                    <div className="study-planner__past-period-unlock">
                      <span className="study-planner__past-period-unlock-icon icon-lock" />
                      <span className="study-planner__past-period-unlock-label">
                        {t("labels.unblockPastPeriod", {
                          ns: "hops_new",
                        })}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                        isPast={isPastPeriod}
                      />
                    ) : (
                      <PlannerPeriodMonth
                        key={monthKey}
                        title={monthName}
                        monthIndex={index + (type === "AUTUMN" ? 7 : 0)}
                        year={year}
                        courses={monthCourses}
                        isPast={isPastPeriod}
                        disabled={isPastPeriod && !isUnlocked}
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
