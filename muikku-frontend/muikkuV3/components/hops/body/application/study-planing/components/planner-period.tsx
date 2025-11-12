import * as React from "react";
import {
  isPeriodCourseItemActivityCourse,
  isPeriodCourseItemPlannedCourse,
  PlannedCourseWithIdentifier,
  PlannedPeriod,
} from "~/reducers/hops";
import PlannerPeriodMonth from "./desktop/planner-period-month";
import MobilePlannerPeriodMonth from "./mobile/planner-period-month";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getPeriodMonthNames } from "../helper";
import { StudentStudyActivity } from "~/generated/client";
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
 * Checks if the period has movable planned courses.
 * Movable planned courses are planned courses that have no activity or have an ongoing activity.
 * @param plannedCourses planned courses
 * @param studyActivity study activity
 * @returns true if the period has movable planned courses
 */
const hasPlannedCoursesOrOngoingActivities = (
  plannedCourses: PlannedCourseWithIdentifier[],
  studyActivity: StudentStudyActivity[]
) =>
  plannedCourses.some((course) => {
    const activity = studyActivity.find(
      (sa) =>
        sa.courseNumber === course.courseNumber &&
        sa.subject === course.subjectCode
    );

    return activity === undefined || activity.status === "ONGOING";
  });

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
    const { type, year, items, isPastPeriod } = period;

    const { t } = useTranslation(["common"]);

    const curriculumStrategy = useSelector(
      (state: StateType) => state.hopsNew.hopsCurriculumConfig.strategy
    );

    const studyActivities = useSelector(
      (state: StateType) => state.hopsNew.hopsStudyPlanState.studyActivity
    );
    const hopsMode = useSelector((state: StateType) => state.hopsNew.hopsMode);

    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const months = getPeriodMonthNames(type, t);

    const plannedCourses = React.useMemo(
      () => items.filter(isPeriodCourseItemPlannedCourse),
      [items]
    );

    const activityCourses = React.useMemo(
      () => items.filter(isPeriodCourseItemActivityCourse),
      [items]
    );

    // Check if the period has planned courses
    const hasMovablePlannedCourses = React.useMemo(
      () =>
        hasPlannedCoursesOrOngoingActivities(plannedCourses, studyActivities),
      [plannedCourses, studyActivities]
    );

    /**
     * Gets courses by month
     * @param monthName month name
     */
    const getPlannedCoursesByMonth = (monthName: string) =>
      plannedCourses.filter((course) => {
        const studyActivity = studyActivities.find(
          (sa) =>
            sa.courseNumber === course.courseNumber &&
            sa.subject === course.subjectCode
        );

        const useStudyActivityData =
          studyActivity &&
          (studyActivity.status === "GRADED" ||
            studyActivity.status === "SUPPLEMENTATIONREQUEST");

        const startDate = useStudyActivityData
          ? new Date(studyActivity.date)
          : new Date(course.startDate);
        const monthIndex = startDate.getMonth();
        return months[monthIndex - (type === "AUTUMN" ? 7 : 0)] === monthName;
      });

    /**
     * Gets activity courses by month
     * @param monthName month name
     * @returns activity courses by month
     */
    const getActivityCoursesByMonth = (monthName: string) =>
      activityCourses.filter((aCourse) => {
        const activityDate = new Date(aCourse.studyActivity.date);
        const monthIndex = activityDate.getMonth();
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

    // Calculate workload
    const workload = curriculumStrategy.calculatePeriodWorkload(
      plannedCourses,
      activityCourses,
      t
    );

    return (
      <motion.div
        className={`study-planner__period ${isPastPeriod && !hasMovablePlannedCourses ? "study-planner__period--past" : ""}`}
        ref={ref}
        variants={periodVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
      >
        {/* Collapsed state header */}
        <AnimatePresence initial={false}>
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
                {` - ${workload.displayValue}`}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded state content */}
        <AnimatePresence initial={false}>
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
                  {` - ${workload.displayValue}`}
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
                    const monthPlannedCourses =
                      getPlannedCoursesByMonth(monthName);
                    const monthActivityCourses =
                      getActivityCoursesByMonth(monthName);

                    const monthKey = `${monthName}-${year}-${type}`;

                    return renderMobile ? (
                      <MobilePlannerPeriodMonth
                        key={monthKey}
                        title={monthName}
                        monthIndex={index + (type === "AUTUMN" ? 7 : 0)}
                        year={year}
                        courses={monthPlannedCourses}
                        activities={monthActivityCourses}
                        isPast={isPastPeriod}
                      />
                    ) : (
                      <PlannerPeriodMonth
                        key={monthKey}
                        title={monthName}
                        monthIndex={index + (type === "AUTUMN" ? 7 : 0)}
                        year={year}
                        courses={monthPlannedCourses}
                        activities={monthActivityCourses}
                        isPast={isPastPeriod}
                        disabled={
                          (isPastPeriod && !hasMovablePlannedCourses) ||
                          hopsMode === "READ"
                        }
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
