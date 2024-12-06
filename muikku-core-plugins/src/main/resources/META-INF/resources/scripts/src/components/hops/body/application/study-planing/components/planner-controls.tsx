import * as React from "react";

interface PlannerControlsProps {
  onViewChange: (view: "list" | "table") => void;
  onRefresh: () => void;
  onPeriodChange: (direction: "prev" | "next") => void;
}

const PlannerControls: React.FC<PlannerControlsProps> = ({
  onViewChange,
  onRefresh,
  onPeriodChange,
}) => (
  <div className="hops-planner__controls">
    <div className="hops-planner__control-buttons">
      <button
        className="hops-planner__control-button"
        onClick={() => onViewChange("list")}
      >
        <i className="muikku-icon-list" />
      </button>
      <button
        className="hops-planner__control-button"
        onClick={() => onViewChange("table")}
      >
        <i className="muikku-icon-table" />
      </button>
      <button className="hops-planner__control-button" onClick={onRefresh}>
        <i className="muikku-icon-refresh" />
      </button>
    </div>
    <div className="hops-planner__period-navigation">
      <button
        className="hops-planner__nav-button"
        onClick={() => onPeriodChange("prev")}
      >
        <i className="muikku-icon-arrow-left" />
      </button>
      <button
        className="hops-planner__nav-button"
        onClick={() => onPeriodChange("next")}
      >
        <i className="muikku-icon-arrow-right" />
      </button>
    </div>
  </div>
);

export default PlannerControls;
