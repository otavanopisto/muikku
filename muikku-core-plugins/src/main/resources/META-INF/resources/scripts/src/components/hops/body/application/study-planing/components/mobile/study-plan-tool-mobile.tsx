import * as React from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import PlannerSidebar from "../planner-sidebar";
import {
  isPeriodMonthSelection,
  PlannedCourseWithIdentifier,
  PlannedPeriod,
  Selection,
} from "~/reducers/hops";
import PlannerPeriod from "../planner-period";
import { CurriculumConfig } from "~/util/curriculum-config";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { IconButton } from "~/components/general/button";
import Portal from "~/components/general/portal";
import { Provider, ReactReduxContext } from "react-redux";
import { useDragDropManager } from "react-dnd";
import { DndProvider } from "react-dnd";
import "~/sass/elements/study-planner.scss";

/**
 * DesktopStudyPlannerProps
 */
interface MobileStudyPlannerProps {
  curriculumConfig: CurriculumConfig;
  plannedCourses: PlannedCourseWithIdentifier[];
  calculatedPeriods: PlannedPeriod[];
  selection: Selection;
}

/**
 * Desktop study planner
 * @param props props
 * @returns JSX.Element
 */
const MobileStudyPlanner = (props: MobileStudyPlannerProps) => {
  const { curriculumConfig, plannedCourses, calculatedPeriods, selection } =
    props;
  const manager = useDragDropManager();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<"list" | "table">("list");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const normalTimelineRef = React.useRef<HTMLDivElement>(null);
  const fullscreenTimelineRef = React.useRef<HTMLDivElement>(null);
  const normalViewPeriodRefs = React.useRef(new Map<string, HTMLDivElement>());
  const fullscreenPeriodRefs = React.useRef(new Map<string, HTMLDivElement>());

  const [shouldRenderPortal, setShouldRenderPortal] = useState(false);

  useEffect(() => {
    if (!selection) return;

    if (isPeriodMonthSelection(selection)) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [selection]);

  useEffect(() => {
    if (isFullScreen) {
      setShouldRenderPortal(true);
    } else {
      // Delay portal unmounting to allow exit animations to complete
      const timer = setTimeout(() => {
        setShouldRenderPortal(false);
      }, 300); // Match this with your exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isFullScreen]);

  /**
   * Gets active timeline ref based on current view
   */
  const getActiveTimelineRef = useCallback(
    () =>
      isFullScreen ? fullscreenTimelineRef.current : normalTimelineRef.current,
    [isFullScreen]
  );

  /**
   * Gets active refs
   */
  const getActiveRefs = useCallback(
    () =>
      isFullScreen
        ? fullscreenPeriodRefs.current
        : normalViewPeriodRefs.current,
    [isFullScreen]
  );

  /**
   * Scrolls to next/previous period
   * @param direction direction
   */
  const scrollToAdjacentPeriod = useCallback(
    (direction: "next" | "prev") => {
      const container = getActiveTimelineRef();

      if (!container) return;

      // Use the active refs map
      const activeRefs = getActiveRefs();
      const currentScroll = container.scrollLeft;
      const containerWidth = container.clientWidth;

      // Find the closest period to the current scroll position
      let closestPeriod: HTMLDivElement | null = null;
      let minDistance = Infinity;

      activeRefs.forEach((element) => {
        const distance = Math.abs(element.offsetLeft - currentScroll);
        if (distance < minDistance) {
          minDistance = distance;
          closestPeriod = element;
        }
      });

      if (closestPeriod) {
        const periods = Array.from(activeRefs.values());
        const currentIndex = periods.indexOf(closestPeriod);
        const targetIndex =
          direction === "next"
            ? Math.min(currentIndex + 1, periods.length - 1)
            : Math.max(currentIndex - 1, 0);

        const targetPeriod = periods[targetIndex];

        if (targetPeriod) {
          const scrollPosition =
            targetPeriod.offsetLeft -
            (containerWidth - targetPeriod.offsetWidth) / 2;
          container.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    },
    [getActiveRefs, getActiveTimelineRef]
  );

  return (
    <>
      {shouldRenderPortal && (
        <ReactReduxContext.Consumer>
          {({ store }) => (
            <Portal isOpen={true}>
              <Provider store={store}>
                <DndProvider manager={manager}>
                  <AnimatePresence>
                    {isFullScreen && (
                      <motion.div
                        key="study-planner-fullscreen"
                        className="study-planner study-planner--mobile study-planner--mobile-fullscreen swiper-no-swiping"
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
                        <MobilePlannerControls
                          onSidebarOpen={() => setIsSidebarOpen(!isSidebarOpen)}
                          onFullScreen={() => setIsFullScreen(!isFullScreen)}
                          onPeriodChange={(direction) =>
                            scrollToAdjacentPeriod(direction)
                          }
                        />
                        <div className="study-planner__content">
                          <MobileSidebar
                            isOpen={isSidebarOpen}
                            onClose={() => setIsSidebarOpen(false)}
                            curriculumConfig={curriculumConfig}
                            plannedCourses={plannedCourses}
                            selectedPeriod={undefined}
                          />
                          <div
                            className="study-planner__timeline-container"
                            tabIndex={0}
                            ref={fullscreenTimelineRef}
                          >
                            <div className="study-planner__timeline">
                              {calculatedPeriods.map((period) => (
                                <PlannerPeriod
                                  key={period.title}
                                  {...period}
                                  ref={(el) => {
                                    if (el) {
                                      fullscreenPeriodRefs.current.set(
                                        period.title,
                                        el
                                      );
                                    } else {
                                      fullscreenPeriodRefs.current.delete(
                                        period.title
                                      );
                                    }
                                  }}
                                />
                              ))}
                            </div>
                          </div>
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

      {!isFullScreen && (
        <motion.div
          key="study-planner"
          className="study-planner study-planner--mobile swiper-no-swiping"
        >
          <MobilePlannerControls
            onSidebarOpen={() => setIsSidebarOpen(!isSidebarOpen)}
            onFullScreen={() => setIsFullScreen(!isFullScreen)}
            onPeriodChange={(direction) => scrollToAdjacentPeriod(direction)}
          />
          <div className="study-planner__content">
            <MobileSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              curriculumConfig={curriculumConfig}
              plannedCourses={plannedCourses}
              selectedPeriod={undefined}
            />
            <div
              className="study-planner__timeline-container"
              tabIndex={0}
              ref={normalTimelineRef}
            >
              <div className="study-planner__timeline">
                {calculatedPeriods.map((period) => (
                  <PlannerPeriod
                    key={period.title}
                    {...period}
                    ref={(el) => {
                      if (el) {
                        // Element is being mounted - add to refs Map
                        normalViewPeriodRefs.current.set(period.title, el);
                      } else {
                        // Element is being unmounted - remove from refs Map
                        normalViewPeriodRefs.current.delete(period.title);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

/**
 * MobileSidebarProps
 */
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  curriculumConfig: CurriculumConfig;
  plannedCourses: PlannedCourseWithIdentifier[];
  selectedPeriod?: { monthIndex: number; year: number };
}

/**
 * Mobile sidebar
 * @param props props
 * @returns JSX.Element
 */
const MobileSidebar: React.FC<MobileSidebarProps> = (props) => {
  const { isOpen, onClose, curriculumConfig, plannedCourses, selectedPeriod } =
    props;
  const manager = useDragDropManager();
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

  if (!shouldRenderPortal) return null;

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <Portal isOpen={true}>
          <Provider store={store}>
            <DndProvider manager={manager}>
              <AnimatePresence>
                {isOpen && (
                  <>
                    <motion.div
                      key="study-planner__mobile-sidebar-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      onClick={onClose}
                      className="study-planner__mobile-sidebar-overlay"
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "#000",
                        zIndex: 1000,
                      }}
                    />

                    <motion.div
                      key="mobile-sidebar"
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ type: "tween", duration: 0.3 }}
                      className="study-planner__mobile-sidebar"
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: "80%",
                        maxWidth: "400px",
                        background: "white",
                        zIndex: 1001,
                        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Header */}
                      <div className="study-planner__mobile-sidebar-header">
                        <div className="study-planner__mobile-sidebar-header-actions">
                          <IconButton icon="cross" onClick={onClose} />
                        </div>
                      </div>

                      {/* Content */}
                      <PlannerSidebar
                        curriculumConfig={curriculumConfig}
                        plannedCourses={plannedCourses}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </DndProvider>
          </Provider>
        </Portal>
      )}
    </ReactReduxContext.Consumer>
  );
};

/**
 * MobilePlannerControlsProps
 */
interface MobilePlannerControlsProps {
  onSidebarOpen: () => void;
  onFullScreen: () => void;
  onPeriodChange: (direction: "prev" | "next") => void;
}

/**
 * Mobile planner controls
 * @param props props
 * @returns JSX.Element
 */
const MobilePlannerControls: React.FC<MobilePlannerControlsProps> = (props) => {
  const { onSidebarOpen, onFullScreen, onPeriodChange } = props;

  return (
    <div className="study-planner__controls">
      <div className="study-planner__control-buttons">
        <IconButton icon="navicon" onClick={onSidebarOpen} />
        <IconButton icon="fullscreen" onClick={onFullScreen} />
      </div>
      <div className="study-planner__period-navigation">
        <IconButton icon="arrow-left" onClick={() => onPeriodChange("prev")} />
        <IconButton icon="arrow-right" onClick={() => onPeriodChange("next")} />
      </div>
    </div>
  );
};

export default MobileStudyPlanner;
