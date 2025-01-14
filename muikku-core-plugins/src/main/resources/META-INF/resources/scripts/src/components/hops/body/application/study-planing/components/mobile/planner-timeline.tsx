import * as React from "react";
import { useImperativeHandle, useCallback } from "react";
import { PlannedPeriod } from "~/reducers/hops";
import PlannerPeriod from "../planner-period";

/**
 * PlannerTimelineProps
 */
interface PlannerTimelineMobileProps {
  calculatedPeriods: PlannedPeriod[];
}

/**
 * PlannerTimeline component
 * @param props props
 * @returns JSX.Element
 */
const PlannerTimelineMobile = React.forwardRef(
  (props: PlannerTimelineMobileProps, ref) => {
    const { calculatedPeriods } = props;

    const timelineRef = React.useRef<HTMLDivElement>(null);
    const periodRefs = React.useRef(new Map<string, HTMLDivElement>());

    /**
     * Scrolls to next/previous period
     * @param direction direction
     */
    const scrollToAdjacentPeriod = useCallback((direction: "next" | "prev") => {
      const container = timelineRef.current;

      if (!container) return;

      // Use the active refs map
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
        tabIndex={0}
        ref={timelineRef}
      >
        <div className="study-planner__timeline">
          {calculatedPeriods.map((period) => (
            <PlannerPeriod
              key={period.title}
              period={period}
              renderMobile={true}
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
  }
);

PlannerTimelineMobile.displayName = "PlannerTimelineMobile";
export default PlannerTimelineMobile;
