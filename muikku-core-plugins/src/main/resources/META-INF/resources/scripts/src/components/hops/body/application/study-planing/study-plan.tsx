import * as React from "react";
import StudyPlanTool from "./study-plan-tool";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";
/**
 * StudyPlanProps
 */
interface StudyPlanProps {}

/**
 * StudyPlan component
 *
 * @param props props
 */
const StudyPlan = (props: StudyPlanProps) => {
  const { studentInfo, hopsCurriculumConfig } = useSelector(
    (state: StateType) => state.hopsNew
  );

  if (!studentInfo || !hopsCurriculumConfig) {
    return null;
  }

  return <StudyPlanTool />;
};

export default StudyPlan;
