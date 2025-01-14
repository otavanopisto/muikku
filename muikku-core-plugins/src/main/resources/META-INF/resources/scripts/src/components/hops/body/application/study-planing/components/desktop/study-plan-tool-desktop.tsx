import * as React from "react";
import { useCallback, useRef, useState } from "react";
import { PlannerControls } from "../planner-controls";
import {
  isUnplannedCourse,
  PlannedCourseWithIdentifier,
  PlannedPeriod,
  SelectedCourse,
} from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import { motion, Variants } from "framer-motion";
import PlannerCourseTray from "../planner-course-tray";
import { UpdateSelectedCoursesTriggerType } from "~/actions/main-function/hops";
import { Course } from "~/@types/shared";
import StudyPlannerDragLayer from "../react-dnd/planner-drag-layer";
import PlannerPlanStatus from "../planner-plan-status";
import PlannerTimeline from "./planner-timeline";

/**
 * DesktopStudyPlannerProps
 */
interface DesktopStudyPlannerProps {
  curriculumConfig: CurriculumConfig;
  plannedCourses: PlannedCourseWithIdentifier[];
  calculatedPeriods: PlannedPeriod[];
  selectedCourses: SelectedCourse[];
  updateSelectedCourses: UpdateSelectedCoursesTriggerType;
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
    height: "750px",
  },
};

// Memoized components
const MemoizedPlannerPlanStatus = React.memo(PlannerPlanStatus);
const MemoizedPlannerControls = React.memo(PlannerControls);
const MemoizedPlannerCourseTray = React.memo(PlannerCourseTray);
const MemoizedPlannerTimeline = React.memo(PlannerTimeline);

/**
 * Desktop study planner
 * @param props props
 * @returns JSX.Element
 */
const DesktopStudyPlanner = (props: DesktopStudyPlannerProps) => {
  const {
    curriculumConfig,
    plannedCourses,
    calculatedPeriods,
    selectedCourses,
    updateSelectedCourses,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<"list" | "table">("list");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPlanStatus, setShowPlanStatus] = useState(false);

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
  const handleCourseClick = useCallback(
    (course: Course & { subjectCode: string }) => {
      updateSelectedCourses({ course });
    },
    [updateSelectedCourses]
  );

  /**
   * Checks if a course is selected
   * @param course course
   * @returns boolean
   */
  const isSelected = useCallback(
    (course: Course & { subjectCode: string }) =>
      selectedCourses.some(
        (c) =>
          isUnplannedCourse(c) &&
          c.subjectCode === course.subjectCode &&
          c.courseNumber === course.courseNumber
      ),
    [selectedCourses]
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
   * Handles show plan status
   */
  const handleShowPlanStatus = useCallback(() => {
    setShowPlanStatus((prev) => !prev);
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
    <motion.div
      className="study-planner"
      variants={variants}
      animate={isFullScreen ? "fullScreen" : "default"}
    >
      <StudyPlannerDragLayer />
      <MemoizedPlannerControls
        onViewChange={handleViewChange}
        onPeriodChange={handlePeriodChange}
        onFullScreen={handleFullScreen}
        onShowPlanStatus={handleShowPlanStatus}
      />
      <MemoizedPlannerPlanStatus show={showPlanStatus} />
      <div className="study-planner__content">
        <div className="study-planner__sidebar">
          <MemoizedPlannerCourseTray
            curriculumConfig={curriculumConfig}
            plannedCourses={memoizedPlannedCourses}
            onCourseClick={handleCourseClick}
            isSelected={isSelected}
          />
        </div>

        <MemoizedPlannerTimeline
          ref={timelineComponentRef}
          calculatedPeriods={memoizedCalculatedPeriods}
        />
      </div>
    </motion.div>
  );
};

export default React.memo(DesktopStudyPlanner);
