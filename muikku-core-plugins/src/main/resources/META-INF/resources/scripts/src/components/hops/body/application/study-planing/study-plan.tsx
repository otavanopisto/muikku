import * as React from "react";
import StudyPlanTool from "./study-plan-tool";
import { StateType } from "~/reducers";
import { StudentInfo } from "~/generated/client";
import { CurriculumConfig } from "~/util/curriculum-config";
import { useSelector } from "react-redux";
/**
 * StudyPlanProps
 */
interface StudyPlanProps {
  studentInfo: StudentInfo;
  curriculumConfig: CurriculumConfig | null;
}

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
