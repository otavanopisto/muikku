import * as React from "react";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import Tabs, { Tab } from "~/components/general/tabs";
import MatriculationEntrollment from "./matriculation-enrollment";
import MatriculationHistory from "./matriculation-history";
import MatriculationEligibility from "./matriculation-eligibility";
import MatriculationPlan from "./matriculation-plan";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation(["hops_new", "guider", "common"]);

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
      name: t("label.matriculationPlan", { ns: "hops_new" }),
      type: "plan",
      component: (
        <ApplicationPanelBody modifier="sub-tabs">
          <MatriculationPlan />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "ELIGIBILITY",
      name: t("label.matriculationParticipation", { ns: "hops_new" }),
      type: "eligibility",
      component: (
        <ApplicationPanelBody modifier="sub-tabs">
          <MatriculationEligibility />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "ENROLLMENT",
      name: t("label.matriculationEnrollment", { ns: "hops_new" }),
      type: "enrollment",
      component: (
        <ApplicationPanelBody modifier="sub-tabs">
          <MatriculationEntrollment />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "HISTORY",
      name: t("label.matriculationHistory", { ns: "hops_new" }),
      type: "history",
      component: (
        <ApplicationPanelBody modifier="sub-tabs">
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
