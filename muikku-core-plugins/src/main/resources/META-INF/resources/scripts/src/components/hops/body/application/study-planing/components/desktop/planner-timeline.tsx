import * as React from "react";
import { useCallback, useImperativeHandle, useState, useEffect } from "react";
import { PlannedPeriod } from "~/reducers/hops";
import PlannerPeriod from "../planner-period";

// Scroll control constants
const SCROLL_CONTROLS = {
  // Initial velocity and immediate scrolling
  VELOCITY_MULTIPLIER: 5, // Controls how strong the momentum is based on mouse movement
  IMMEDIATE_SCROLL_SPEED: 4, // Controls how fast the timeline follows the mouse during drag

  // Momentum scrolling
  MOMENTUM_MULTIPLIER: 32, // Controls how fast the momentum scrolling moves
  MOMENTUM_DECAY: 0.97, // Controls how quickly the momentum dies off (closer to 1 = longer scroll)
  MOMENTUM_STOP_THRESHOLD: 0.01, // Controls when to stop the momentum scrolling
};

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

  // Add velocity tracking
  const velocityRef = React.useRef(0);
  const lastMouseXRef = React.useRef(0);
  const lastTimeRef = React.useRef(0);
  const animationFrameRef = React.useRef<number>();

  // Update dragStart to include timestamp
  const dragStart = React.useRef<{
    mouseX: number;
    scrollLeft: number;
    timestamp: number;
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
      if (
        isDraggingTimeline &&
        timelineContentRef.current &&
        dragStart.current
      ) {
        const deltaX = event.clientX - lastMouseXRef.current;
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTimeRef.current;

        if (deltaTime > 0) {
          velocityRef.current =
            (deltaX / deltaTime) * SCROLL_CONTROLS.VELOCITY_MULTIPLIER;
        }

        const dx = event.clientX - dragStart.current.mouseX;
        const newScrollLeft =
          dragStart.current.scrollLeft -
          dx * SCROLL_CONTROLS.IMMEDIATE_SCROLL_SPEED;
        timelineContentRef.current.scrollLeft = newScrollLeft;

        lastMouseXRef.current = event.clientX;
        lastTimeRef.current = currentTime;
      }
    },
    [isDraggingTimeline]
  );

  /**
   * Applies momentum
   */
  const applyMomentum = useCallback(() => {
    if (
      !timelineContentRef.current ||
      Math.abs(velocityRef.current) < SCROLL_CONTROLS.MOMENTUM_STOP_THRESHOLD
    ) {
      velocityRef.current = 0;
      return;
    }

    timelineContentRef.current.scrollLeft -=
      velocityRef.current * SCROLL_CONTROLS.MOMENTUM_MULTIPLIER;
    velocityRef.current *= SCROLL_CONTROLS.MOMENTUM_DECAY;

    animationFrameRef.current = requestAnimationFrame(applyMomentum);
  }, []);

  /**
   * Handles key down. Start dragging when space is pressed
   * @param event event
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isMouseOverTimelineRef.current && event.key === " ") {
      event.preventDefault();
      setIsDraggingTimeline(true);

      if (timelineContentRef.current) {
        dragStart.current = {
          mouseX: mousePositionRef.current.x,
          scrollLeft: timelineContentRef.current.scrollLeft,
          timestamp: Date.now(),
        };
        lastMouseXRef.current = mousePositionRef.current.x;
        lastTimeRef.current = Date.now();
        velocityRef.current = 0;

        // Cancel any ongoing momentum scrolling
        cancelAnimationFrame(animationFrameRef.current!);
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

      // Start momentum scrolling
      applyMomentum();
    }
  };

  /**
   * Scrolls to the adjacent period
   * @param direction direction
   */
  const scrollToAdjacentPeriod = useCallback((direction: "next" | "prev") => {
    const container = timelineContentRef.current;
    if (!container) return;

    const activeRefs = periodRefs.current;
    const currentScroll = container.scrollLeft;

    // Find the period closest to the left edge of the viewport
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
        // Scroll to align with the left edge
        container.scrollTo({
          left: targetPeriod.offsetLeft,
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

  // Clean up event listeners and animation frames when component unmounts
  useEffect(
    () => () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current!);
    },
    [handleMouseMove]
  );

  return (
    <div
      className="study-planner__timeline-container"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      ref={timelineContentRef}
      onMouseMove={handleMousePositionUpdate}
    >
      {isDraggingTimeline && (
        <div
          className="study-planner__timeline-overlay"
          style={{ width: `${overlayWidth}px` }}
        />
      )}
      <div className="study-planner__timeline" ref={timelineRef}>
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
