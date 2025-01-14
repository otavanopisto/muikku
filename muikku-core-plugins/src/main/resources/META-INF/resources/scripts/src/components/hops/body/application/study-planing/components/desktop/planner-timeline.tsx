import * as React from "react";
import { useCallback, useImperativeHandle, useState, useEffect } from "react";
import { PlannedPeriod } from "~/reducers/hops";
import PlannerPeriod from "../planner-period";

const MemoizedPlannerPeriod = React.memo(PlannerPeriod);

/**
 * StudyPlanTimelineProps
 */
interface PlannerTimelineProps {
  calculatedPeriods: PlannedPeriod[];
}

/**
 * PlannerTimeline
 * @param props props
 * @returns JSX.Element
 */
const PlannerTimeline = React.forwardRef((props: PlannerTimelineProps, ref) => {
  const { calculatedPeriods } = props;

  // Add state for overlay width
  const [overlayWidth, setOverlayWidth] = useState(0);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);

  const timelineRef = React.useRef<HTMLDivElement>(null);
  const periodRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  // Add ref for the timeline content
  const timelineContentRef = React.useRef<HTMLDivElement>(null);

  // Replace state with refs
  const isMouseOverTimelineRef = React.useRef(false);
  const mousePositionRef = React.useRef({ x: 0 });

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

  // Clean up event listeners when component unmounts
  useEffect(
    () => () => {
      document.removeEventListener("mousemove", handleMouseMove);
    },
    [handleMouseMove]
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

  const scrollToAdjacentPeriod = useCallback((direction: "next" | "prev") => {
    const container = timelineRef.current;
    if (!container) return;

    const activeRefs = periodRefs.current;
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
  }, []);

  // Expose the scroll method via ref
  useImperativeHandle(
    ref,
    () => ({
      scrollToAdjacentPeriod,
    }),
    [scrollToAdjacentPeriod]
  );

  return (
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
          <MemoizedPlannerPeriod
            key={period.title}
            period={period}
            ref={(el) => {
              if (el) {
                periodRefs.current.set(period.title, el);
              } else {
                periodRefs.current.delete(period.title);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
});

PlannerTimeline.displayName = "PlannerTimeline";

export default PlannerTimeline;
