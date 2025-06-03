import * as React from "react";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import Tabs, { Tab } from "~/components/general/tabs";
import MatriculationEntrollment from "./matriculation-enrollment";
import MatriculationHistory from "./matriculation-history";
import MatriculationEligibility from "./matriculation-eligibility";
import MatriculationPlan from "./matriculation-plan";
import { useTranslation } from "react-i18next";

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
      name: t("labels.matriculationPlan", { ns: "hops_new" }),
      type: "plan",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <MatriculationPlan />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "ELIGIBILITY",
      name: t("labels.matriculationParticipation", { ns: "hops_new" }),
      type: "eligibility",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <MatriculationEligibility />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "ENROLLMENT",
      name: t("labels.matriculationEnrollment", { ns: "hops_new" }),
      type: "enrollment",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <MatriculationEntrollment />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "HISTORY",
      name: t("labels.matriculationHistory", { ns: "hops_new" }),
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
