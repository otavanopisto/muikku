import * as React from "react";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import Tabs, { Tab } from "~/components/general/tabs";
import { useTranslation } from "react-i18next";
import StudyPlanTool from "./study-plan-tool";
import { Action } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { StudentInfo } from "~/generated/client";
import { CurriculumConfig } from "~/util/curriculum-config";

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
  const { studentInfo, curriculumConfig } = props;
  const [activeTab, setActiveTab] = React.useState<string>("PLAN");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation(["hops_new", "common"]);

  /**
   * Handles tab change
   * @param id tab
   */
  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  if (!studentInfo || !curriculumConfig) {
    return null;
  }

  const panelTabs: Tab[] = [
    {
      id: "PLAN",
      name: "Opintojen suunnittelu",
      type: "plan",
      component: (
        <ApplicationPanelBody>
          <StudyPlanTool />
        </ApplicationPanelBody>
      ),
    },
  ];

  return (
    <div className="react-container">
      <Tabs
        onTabChange={handleTabChange}
        activeTab={activeTab}
        tabs={panelTabs}
      />
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    studentInfo: state.hopsNew.studentInfo,
    curriculumConfig: state.hopsNew.hopsCurriculumConfig,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyPlan);
