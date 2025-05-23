import * as React from "react";
import { IconButton } from "~/components/general/button";

/**
 * PlannerControlsProps
 */
interface PlannerControlsProps {
  fullScreen: boolean;
  onViewChange: (view: "list" | "table") => void;
  onPeriodChange: (direction: "prev" | "next") => void;
  onFullScreen: () => void;
  onShowPlanStatus?: () => void;
}

/**
 * PlannerControls
 * @param props props
 * @returns JSX.Element
 */
export const PlannerControls: React.FC<PlannerControlsProps> = (props) => {
  const { fullScreen, onPeriodChange, onFullScreen } = props;

  return (
    <div className="study-planner__controls">
      <div className="study-planner__control-buttons">
        <IconButton
          icon={fullScreen ? "fullscreen-exit" : "fullscreen"}
          onClick={onFullScreen}
        />
      </div>
      <div className="study-planner__period-navigation">
        <IconButton icon="arrow-left" onClick={() => onPeriodChange("prev")} />
        <IconButton icon="arrow-right" onClick={() => onPeriodChange("next")} />
      </div>
    </div>
  );
};

/**
 * MobilePlannerControlsProps
 */
interface MobilePlannerControlsProps {
  onPeriodChange: (direction: "prev" | "next") => void;
  onShowPlanStatus: () => void;
  onClose: () => void;
}

/**
 * Mobile planner controls
 * @param props props
 * @returns JSX.Element
 */
export const MobilePlannerControls: React.FC<MobilePlannerControlsProps> = (
  props
) => {
  const { onPeriodChange, onClose } = props;

  return (
    <div className="study-planner__controls">
      <div className="study-planner__period-navigation">
        <IconButton icon="arrow-left" onClick={() => onPeriodChange("prev")} />
        <IconButton icon="arrow-right" onClick={() => onPeriodChange("next")} />
      </div>
      {onClose && (
        <div className="study-planner__control-buttons">
          <IconButton icon="cross" onClick={onClose} />
        </div>
      )}
    </div>
  );
};
