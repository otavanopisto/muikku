import * as React from "react";
import { useEffect, useRef } from "react";
import { useCallback } from "react";
import { useState } from "react";
import {
  PlannedCourseWithIdentifier,
  PlannedPeriod,
  SelectedCourse,
  TimeContextSelection,
} from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Button from "~/components/general/button";
import Portal from "~/components/general/portal";
import { Provider, ReactReduxContext } from "react-redux";
import { useDragDropManager } from "react-dnd";
import { DndProvider } from "react-dnd";
import "~/sass/elements/study-planner.scss";
import StudyPlannerDragLayer from "../react-dnd/planner-drag-layer";
import PlannerPlanStatus from "../planner-plan-status";
import PlannerTimelineMobile from "./planner-timeline";
import { MobilePlannerControls } from "../planner-controls";
import { StudentStudyActivity } from "~/generated/client";

// Memoized components
const MemoizedMobilePlannerControls = React.memo(MobilePlannerControls);
const MemoizedPlannerPlanStatus = React.memo(PlannerPlanStatus);
const MemoizedPlannerTimelineMobile = React.memo(PlannerTimelineMobile);

/**
 * DesktopStudyPlannerProps
 */
interface MobileStudyPlannerProps {
  curriculumConfig: CurriculumConfig;
  plannedCourses: PlannedCourseWithIdentifier[];
  calculatedPeriods: PlannedPeriod[];
  timeContextSelection: TimeContextSelection;
  selectedCourses: SelectedCourse[];
  studyActivity: StudentStudyActivity[];
  studyOptions: string[];
}

/**
 * Desktop study planner
 * @param props props
 * @returns JSX.Element
 */
const MobileStudyPlanner = (props: MobileStudyPlannerProps) => {
  const {
    calculatedPeriods,
    curriculumConfig,
    plannedCourses,
    studyActivity,
    studyOptions,
  } = props;
  const manager = useDragDropManager();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<"list" | "table">("list");
  const [isOpen, setIsOpen] = useState(false);
  const [showPlanStatus, setShowPlanStatus] = useState(false);

  const timelineComponentRef = useRef<{
    scrollToAdjacentPeriod: (direction: "next" | "prev") => void;
  }>(null);

  const [shouldRenderPortal, setShouldRenderPortal] = useState(false);

  const memoizedPlanStatistics = React.useMemo(
    () =>
      curriculumConfig.strategy.calculatePlanStatistics(
        plannedCourses,
        studyActivity,
        studyOptions
      ),
    [curriculumConfig, plannedCourses, studyActivity, studyOptions]
  );

  useEffect(() => {
    if (isOpen) {
      setShouldRenderPortal(true);
    } else {
      // Delay portal unmounting to allow exit animations to complete
      const timer = setTimeout(() => {
        setShouldRenderPortal(false);
      }, 300); // Match this with your exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /**
   * Handles opening the planner
   */
  const handleOpenPlanner = () => {
    setIsOpen(true);
  };

  /**
   * Handles period change
   * @param direction direction
   */
  const handlePeriodChange = useCallback((direction: "next" | "prev") => {
    timelineComponentRef.current?.scrollToAdjacentPeriod(direction);
  }, []);

  return (
    <>
      {shouldRenderPortal && (
        <ReactReduxContext.Consumer>
          {({ store }) => (
            <Portal isOpen={true}>
              <Provider store={store}>
                <DndProvider manager={manager}>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="study-planner-fullscreen"
                        className="study-planner study-planner--mobile-open swiper-no-swiping"
                        initial={{
                          height: "100vh",
                          width: "100%",
                          position: "fixed",
                          inset: 0,
                          zIndex: 1000,
                          scale: 0.8,
                          opacity: 0,
                        }}
                        animate={{
                          height: "100vh",
                          width: "100%",
                          position: "fixed",
                          inset: 0,
                          zIndex: 1000,
                          scale: 1,
                          opacity: 1,
                        }}
                        exit={{
                          height: "100vh",
                          width: "100%",
                          position: "fixed",
                          inset: 0,
                          zIndex: 1000,
                          scale: 0.8,
                          opacity: 0,
                        }}
                        transition={{
                          type: "tween",
                          duration: 0.3,
                        }}
                        style={{
                          transformOrigin: "center center",
                          margin: "auto",
                        }}
                      >
                        <StudyPlannerDragLayer />

                        <MemoizedMobilePlannerControls
                          onPeriodChange={handlePeriodChange}
                          onClose={() => setIsOpen(false)}
                          onShowPlanStatus={() =>
                            setShowPlanStatus(!showPlanStatus)
                          }
                        />
                        <MemoizedPlannerPlanStatus
                          show={showPlanStatus}
                          planStatistics={memoizedPlanStatistics}
                        />
                        <div className="study-planner__content">
                          <MemoizedPlannerTimelineMobile
                            calculatedPeriods={calculatedPeriods}
                            ref={timelineComponentRef}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </DndProvider>
              </Provider>
            </Portal>
          )}
        </ReactReduxContext.Consumer>
      )}

      <motion.div
        key="study-planner"
        className="study-planner study-planner--mobile-not-open swiper-no-swiping"
      >
        <Button
          buttonModifiers={["primary"]}
          onClick={handleOpenPlanner}
          disabled={isOpen}
        >
          Avaa suunnittelmatyökalu
        </Button>
      </motion.div>
    </>
  );
};

export default MobileStudyPlanner;
