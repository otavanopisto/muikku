import * as React from "react";
import { IconButton } from "~/components/general/button";

/**
 * PlannerControlsProps
 */
interface PlannerControlsProps {
  onViewChange: (view: "list" | "table") => void;
  onRefresh: () => void;
  onPeriodChange: (direction: "prev" | "next") => void;
  onFullScreen: () => void;
}

/**
 * PlannerControls
 * @param props props
 * @returns JSX.Element
 */
const PlannerControls: React.FC<PlannerControlsProps> = (props) => {
  const { onPeriodChange, onFullScreen } = props;

  return (
    <div className="study-planner__controls">
      <div className="study-planner__control-buttons">
        {/* <IconButton icon="profile" onClick={() => onViewChange("list")} />
      <IconButton icon="profile" onClick={() => onViewChange("table")} /> */}
        <IconButton icon="fullscreen" onClick={onFullScreen} />
      </div>
      <div className="study-planner__period-navigation">
        <IconButton icon="arrow-left" onClick={() => onPeriodChange("prev")} />
        <IconButton icon="arrow-right" onClick={() => onPeriodChange("next")} />
      </div>
    </div>
  );
};

export default PlannerControls;
