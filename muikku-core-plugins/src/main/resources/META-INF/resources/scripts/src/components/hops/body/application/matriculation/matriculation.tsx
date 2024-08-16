import * as React from "react";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import Tabs, { Tab } from "~/components/general/tabs";
import MatriculationEntrollment from "./matriculation-enrollment";
import MatriculationHistory from "./matriculation-history";
import MatriculationEligibility from "./matriculation-eligibility";
import MatriculationPlan from "./matriculation-plan";

/**
 * Type for MatriculationTab
 */
//type MatriculationTab = "PLAN" | "PARTICIPATION" | "ENROLLMENT" | "HISTORY";

/**
 * MatriculationProps
 */
interface MatriculationProps {}

/**
 * Matriculation component
 *
 * @param props props
 */
const Matriculation = (props: MatriculationProps) => {
  const [activeTab, setActiveTab] = React.useState<string>("PLAN");

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
      name: "Suunnitelma",
      type: "plan",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <MatriculationPlan />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "ELIGIBILITY",
      name: "Osallistumisoikeus",
      type: "eligibility",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <MatriculationEligibility />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "ENROLLMENT",
      name: "Ilmoittautuminen",
      type: "enrollment",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <MatriculationEntrollment />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "HISTORY",
      name: "Yo-historia",
      type: "history",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <MatriculationHistory />
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

export default Matriculation;
