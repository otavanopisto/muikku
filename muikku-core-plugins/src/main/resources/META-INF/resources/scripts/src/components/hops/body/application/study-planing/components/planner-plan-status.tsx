import * as React from "react";
import AnimateHeight from "react-animate-height";

/**
 * PlannerPlanStatusProps
 */
interface PlannerPlanStatusProps {
  show: boolean;
}

/**
 * Planner plan status
 * @param props props
 * @returns JSX.Element
 */
const PlannerPlanStatus = (props: PlannerPlanStatusProps) => {
  const { show } = props;
  return (
    <AnimateHeight
      height={show ? "auto" : 0}
      contentClassName="study-planner__plan-status"
    >
      <div className="study-planner__plan-status-title">
        Opintojen suunnittelun tilanne
      </div>
      <div className="study-planner__plan-status-content">
        <div className="study-planner__plan-statistic-item">
          <h4 className="study-planner__plan-statistic-item-title">
            Opintojen suunnittelun tilanne
          </h4>
          <div className="study-planner__plan-statistic-item-value"></div>
        </div>

        <div className="study-planner__plan-statistic-item">
          <h4 className="study-planner__plan-statistic-item-title">
            Suunnitellut pakolliset opinnot
          </h4>
          <div className="study-planner__plan-statistic-item-value"></div>
        </div>

        <div className="study-planner__plan-statistic-item">
          <h4 className="study-planner__plan-statistic-item-title">
            Suunnitellut valinnaisopinnot
          </h4>
          <div className="study-planner__plan-statistic-item-value"></div>
        </div>
      </div>
    </AnimateHeight>
  );
};

export default PlannerPlanStatus;
