import * as React from "react";
import { useEffect, useRef } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { PlannedCourseWithIdentifier, PlannedPeriod } from "~/reducers/hops";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Button from "~/components/general/button";
import Portal from "~/components/general/portal";
import { Provider, ReactReduxContext } from "react-redux";
import { useDragDropManager } from "react-dnd";
import { DndProvider } from "react-dnd";
import "~/sass/elements/study-planner.scss";
import StudyPlannerDragLayer from "../react-dnd/planner-drag-layer";
import PlannerTimelineMobile from "./planner-timeline";
import { MobilePlannerControls } from "../planner-controls";
import { useTranslation } from "react-i18next";
import { ActivePeriodProvider } from "../../context/active-period-context";

// Memoized components
const MemoizedMobilePlannerControls = React.memo(MobilePlannerControls);
const MemoizedPlannerTimelineMobile = React.memo(PlannerTimelineMobile);

/**
 * DesktopStudyPlannerProps
 */
interface MobileStudyPlannerProps {
  plannedCourses: PlannedCourseWithIdentifier[];
  calculatedPeriods: PlannedPeriod[];
}

/**
 * Desktop study planner
 * @param props props
 * @returns JSX.Element
 */
const MobileStudyPlanner = (props: MobileStudyPlannerProps) => {
  const { calculatedPeriods } = props;

  const manager = useDragDropManager();

  const { t } = useTranslation(["hops_new"]);

  const [isOpen, setIsOpen] = useState(false);
  const [showPlanStatus, setShowPlanStatus] = useState(false);

  const timelineComponentRef = useRef<{
    scrollToAdjacentPeriod: (direction: "next" | "prev") => void;
  }>(null);

  const [shouldRenderPortal, setShouldRenderPortal] = useState(false);

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
                  <ActivePeriodProvider calculatedPeriods={calculatedPeriods}>
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

                          <div className="study-planner__content">
                            <MemoizedPlannerTimelineMobile
                              calculatedPeriods={calculatedPeriods}
                              ref={timelineComponentRef}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ActivePeriodProvider>
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
          buttonModifiers={["info"]}
          onClick={handleOpenPlanner}
          disabled={isOpen}
        >
          {t("actions.openStudyPlanner", {
            ns: "hops_new",
          })}
        </Button>
      </motion.div>
    </>
  );
};

export default MobileStudyPlanner;
