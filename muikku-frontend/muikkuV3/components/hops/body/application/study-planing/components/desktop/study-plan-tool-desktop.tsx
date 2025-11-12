import * as React from "react";
import { useCallback, useRef, useState } from "react";
import { PlannerControls } from "../planner-controls";
import { PlannedCourseWithIdentifier, PlannedPeriod } from "~/reducers/hops";
import { motion, Variants } from "framer-motion";
import PlannerCourseTray from "../planner-course-tray";
import { updateSelectedCourses } from "~/actions/main-function/hops";
import { Course } from "~/@types/shared";
import StudyPlannerDragLayer from "../react-dnd/planner-drag-layer";
import PlannerTimeline from "./planner-timeline";
import { StateType } from "~/reducers";
import { useDispatch, useSelector } from "react-redux";
import { ActivePeriodProvider } from "../../context/active-period-context";

/**
 * DesktopStudyPlannerProps
 */
interface DesktopStudyPlannerProps {
  plannedCourses: PlannedCourseWithIdentifier[];
  calculatedPeriods: PlannedPeriod[];
}

const variants: Variants = {
  fullScreen: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    height: "100vh",
  },
  default: {
    height: "900px",
  },
};

// Memoized components
const MemoizedPlannerControls = React.memo(PlannerControls);
const MemoizedPlannerCourseTray = React.memo(PlannerCourseTray);
const MemoizedPlannerTimeline = React.memo(PlannerTimeline);

/**
 * Desktop study planner
 * @param props props
 * @returns JSX.Element
 */
const DesktopStudyPlanner = (props: DesktopStudyPlannerProps) => {
  const { plannedCourses, calculatedPeriods } = props;

  const { selectedCoursesIds } = useSelector(
    (state: StateType) => state.hopsNew.hopsEditing
  );

  const disabled = useSelector(
    (state: StateType) => state.hopsNew.hopsMode === "READ"
  );

  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<"list" | "table">("list");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const memoizedCalculatedPeriods = React.useMemo(
    () => calculatedPeriods,
    [calculatedPeriods]
  );

  const memoizedPlannedCourses = React.useMemo(
    () => plannedCourses,
    [plannedCourses]
  );

  // Get the ref to the timeline component
  const timelineComponentRef = useRef<{
    scrollToAdjacentPeriod: (direction: "next" | "prev") => void;
  }>(null);

  /**
   * Handles course click
   * @param course course
   */
  const handleCourseSelectClick = useCallback(
    (course: Course & { subjectCode: string }) => {
      if (!disabled) {
        dispatch(
          updateSelectedCourses({ courseIdentifier: course.identifier })
        );
      }
    },
    [disabled, dispatch]
  );

  /**
   * Checks if a course is selected
   * @param course course
   * @returns boolean
   */
  const isSelected = useCallback(
    (course: Course & { subjectCode: string }) =>
      selectedCoursesIds.some(
        (courseIdentifier) => courseIdentifier === course.identifier
      ),
    [selectedCoursesIds]
  );

  /**
   * Handles view change
   * @param newView new view
   */
  const handleViewChange = useCallback((newView: "list" | "table") => {
    setView(newView);
  }, []);

  /**
   * Handles full screen
   */
  const handleFullScreen = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  /**
   * Handles period change
   * @param direction direction
   */
  const handlePeriodChange = useCallback((direction: "next" | "prev") => {
    // Call the timeline's scroll method
    timelineComponentRef.current?.scrollToAdjacentPeriod(direction);
  }, []);

  return (
    <ActivePeriodProvider calculatedPeriods={memoizedCalculatedPeriods}>
      <motion.div
        className={`study-planner ${isFullScreen ? "study-planner--full-screen" : ""}`}
        variants={variants}
        animate={isFullScreen ? "fullScreen" : "default"}
      >
        <StudyPlannerDragLayer />
        <MemoizedPlannerControls
          fullScreen={isFullScreen}
          onViewChange={handleViewChange}
          onPeriodChange={handlePeriodChange}
          onFullScreen={handleFullScreen}
        />
        <div className="study-planner__content">
          <div className="study-planner__sidebar">
            <MemoizedPlannerCourseTray
              plannedCourses={memoizedPlannedCourses}
              onCourseClick={handleCourseSelectClick}
              isCourseSelected={isSelected}
            />
          </div>

          <MemoizedPlannerTimeline
            ref={timelineComponentRef}
            calculatedPeriods={memoizedCalculatedPeriods}
          />
        </div>
      </motion.div>
    </ActivePeriodProvider>
  );
};

export default React.memo(DesktopStudyPlanner);
