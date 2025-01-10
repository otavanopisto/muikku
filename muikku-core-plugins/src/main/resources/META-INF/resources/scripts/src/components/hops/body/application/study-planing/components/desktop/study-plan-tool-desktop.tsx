import * as React from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import PlannerControls from "../planner-controls";
import {
  isUnplannedCourse,
  PlannedCourseWithIdentifier,
  PlannedPeriod,
  SelectedCourse,
} from "~/reducers/hops";
import PlannerPeriod from "../planner-period";
import { CurriculumConfig } from "~/util/curriculum-config";
import { motion, Variants } from "framer-motion";
import PlannerCourseTray from "../planner-course-tray";
import {
  UpdateSelectedCoursesTriggerType,
  updateSelectedCourses,
} from "~/actions/main-function/hops";
import { Course } from "~/@types/shared";

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
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<"list" | "table">("list");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const timelineRef = React.useRef<HTMLDivElement>(null);

  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);

  // Replace state with refs
  const isMouseOverTimelineRef = React.useRef(false);
  const mousePositionRef = React.useRef({ x: 0 });

  // Add ref for the timeline content
  const timelineContentRef = React.useRef<HTMLDivElement>(null);

  // Add state for overlay width
  const [overlayWidth, setOverlayWidth] = useState(0);

  // Update dragStart state to include initial mouse position
  const dragStart = React.useRef<{
    mouseX: number;
    scrollLeft: number;
  } | null>(null);

  // Add effect to update overlay width when content changes
  useEffect(() => {
    if (timelineContentRef.current) {
      setOverlayWidth(timelineContentRef.current.scrollWidth);
    }
  }, [calculatedPeriods.length]); // Update when periods change

  /**
   * Handles mouse move. Scroll timeline when dragging
   * @param event event
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDraggingTimeline && timelineRef.current && dragStart.current) {
        const dx = event.clientX - dragStart.current!.mouseX;
        const newScrollLeft = dragStart.current!.scrollLeft - dx;
        timelineRef.current!.scrollLeft = newScrollLeft;
      }
    },
    [isDraggingTimeline] // No dependencies needed now
  );

  /**
   * Handles key down. Start dragging when space is pressed
   * @param event event
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isMouseOverTimelineRef.current && event.key === " ") {
      event.preventDefault();
      setIsDraggingTimeline(true);

      if (timelineRef.current) {
        dragStart.current = {
          mouseX: mousePositionRef.current.x,
          scrollLeft: timelineRef.current.scrollLeft,
        };
      }

      document.addEventListener("mousemove", handleMouseMove);
    }
  };

  /**
   * Handles key up. Clear dragging state when space is released
   * @param event event
   */
  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " ") {
      setIsDraggingTimeline(false);
      dragStart.current = null;

      document.removeEventListener("mousemove", handleMouseMove);
    }
  };

  // Clean up event listeners when component unmounts
  useEffect(
    () => () => {
      document.removeEventListener("mousemove", handleMouseMove);
    },
    [handleMouseMove]
  );

  /**
   * Handles mouse leave
   */
  const handleMouseLeave = () => {
    isMouseOverTimelineRef.current = false;
    setIsDraggingTimeline(false);
  };

  /**
   * Handles mouse enter
   */
  const handleMouseEnter = () => {
    isMouseOverTimelineRef.current = true;
  };

  /**
   * Handles mouse position update
   * @param e event
   */
  const handleMousePositionUpdate = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      mousePositionRef.current.x = e.clientX;
    },
    []
  );

  /**
   * Handles course click
   * @param course course
   */
  const handleCourseClick = (course: Course & { subjectCode: string }) => {
    updateSelectedCourses({ course });
  };

  return (
    <motion.div
      className="study-planner"
      variants={variants}
      animate={isFullScreen ? "fullScreen" : "default"}
    >
      <PlannerControls
        onViewChange={setView}
        onRefresh={() => undefined}
        onPeriodChange={(direction) => undefined}
        onFullScreen={() => setIsFullScreen(!isFullScreen)}
      />
      <div className="study-planner__content">
        <div className="study-planner__sidebar">
          <PlannerCourseTray
            curriculumConfig={curriculumConfig}
            plannedCourses={plannedCourses}
            selectedCourses={selectedCourses}
            onCourseClick={handleCourseClick}
            isSelected={(course) =>
              isUnplannedCourse(course) &&
              selectedCourses.some(
                (c) =>
                  c.subjectCode === course.subjectCode &&
                  c.courseNumber === course.courseNumber
              )
            }
          />
        </div>

        <div
          className="study-planner__timeline-container"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          tabIndex={0}
          ref={timelineRef}
          onMouseMove={handleMousePositionUpdate}
        >
          {isDraggingTimeline && (
            <div
              className="study-planner__timeline-overlay"
              style={{ width: `${overlayWidth}px` }}
            />
          )}
          <div className="study-planner__timeline" ref={timelineContentRef}>
            {calculatedPeriods.map((period) => (
              <PlannerPeriod key={period.title} {...period} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopStudyPlanner;
