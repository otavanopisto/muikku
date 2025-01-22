import ProgressBar from "@ramonak/react-progress-bar";
import * as React from "react";
import AnimateHeight from "react-animate-height";
import { PlanStatistics } from "~/util/curriculum-config";

/**
 * PlannerPlanStatusProps
 */
interface PlannerPlanStatusProps {
  show: boolean;
  planStatistics: PlanStatistics;
}

/**
 * Planner plan status
 * @param props props
 * @returns JSX.Element
 */
const PlannerPlanStatus = (props: PlannerPlanStatusProps) => {
  const { show, planStatistics } = props;
  return (
    <AnimateHeight
      height={show ? "auto" : 0}
      contentClassName="study-planner__plan-status"
    >
      <h3 className="study-planner__plan-status-title">
        Opintojen suunnittelun tilanne
      </h3>
      <div className="study-planner__plan-statistics">
        <div className="study-planner__plan-statistic-item">
          <h4 className="study-planner__plan-statistic-item-title">
            Suoritetut pakolliset opintojaksot (op).
          </h4>
          <div className="study-planner__plan-statistic-item-bar-container">
            <ProgressBar
              className="study-planner__plan-statistic-item-bar"
              completed={10}
              maxCompleted={100}
              isLabelVisible={false}
              bgColor="#de3211"
              baseBgColor="#f5f5f5"
            />
            <div className="study-planner__plan-statistic-item-bar-label">
              {`${planStatistics.plannedMandatoryStudies} / ${planStatistics.requiredStudies.plannedMandatoryStudies}`}
            </div>
          </div>
        </div>
        <div className="study-planner__plan-statistic-item">
          <h4 className="study-planner__plan-statistic-item-title">
            Suoritetut valinnaisopinnot (op).
          </h4>
          <div className="study-planner__plan-statistic-item-bar-container">
            <ProgressBar
              className="study-planner__plan-statistic-item-bar"
              completed={10}
              maxCompleted={100}
              isLabelVisible={false}
              bgColor="#de3211"
              baseBgColor="#f5f5f5"
            />
            <div className="study-planner__plan-statistic-item-bar-label">
              {`${planStatistics.plannedOptionalStudies} / ${planStatistics.requiredStudies.plannedOptionalStudies}`}
            </div>
          </div>
        </div>
      </div>
    </AnimateHeight>
  );
};

export default PlannerPlanStatus;
