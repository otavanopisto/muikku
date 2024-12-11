import * as React from "react";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import Tabs, { Tab } from "~/components/general/tabs";
import { useTranslation } from "react-i18next";
import StudyPlanTool from "./study-plan-tool";

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

export default StudyPlan;
