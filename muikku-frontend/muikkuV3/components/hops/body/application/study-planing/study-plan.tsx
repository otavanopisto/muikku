import * as React from "react";
import StudyPlanTool from "./study-plan-tool";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";
import { useHopsBasicInfo } from "~/context/hops-basic-info-context";
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
  const { studentInfo } = useSelector((state: StateType) => state.hopsNew);

  const { curriculumConfig } = useHopsBasicInfo();

  if (!studentInfo || !curriculumConfig) {
    return null;
  }

  return <StudyPlanTool />;
};

export default StudyPlan;
