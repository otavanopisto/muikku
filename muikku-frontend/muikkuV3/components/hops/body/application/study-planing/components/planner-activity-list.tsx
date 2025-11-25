import * as React from "react";
import { PlannerActivityItem } from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import PlannerActivityCard from "./planner-activity-card";

/**
 * PlannerPlannedList props
 */
interface PlannerActivityListProps {
  activities: PlannerActivityItem[];
  curriculumConfig: CurriculumConfig;
}

/**
 * PlannerPlannedList component to handle the rendering of course cards
 * @param props props
 */
const PlannerActivityList = (props: PlannerActivityListProps) => {
  const { activities, curriculumConfig } = props;

  return (
    <ul className="study-planner__planned-list">
      {activities.map((activity) => (
        <li
          key={activity.identifier}
          className="study-planner__planned-list-item"
        >
          <PlannerActivityCard
            item={activity}
            curriculumConfig={curriculumConfig}
          />
        </li>
      ))}
    </ul>
  );
};

export default PlannerActivityList;
