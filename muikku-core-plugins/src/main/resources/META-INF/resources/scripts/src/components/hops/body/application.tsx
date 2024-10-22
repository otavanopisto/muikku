import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import { Tab } from "~/components/general/tabs";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/journal.scss";
import "~/sass/elements/workspace-assessment.scss";
import { useTranslation } from "react-i18next";
import Matriculation from "./application/matriculation/matriculation";
import { UseCaseContextProvider } from "~/context/use-case-context";
import Background from "./application/background/background";
import { HopsState } from "~/reducers/hops";

/**
 * StudiesTab
 */
type HopsTab = "MATRICULATION" | "BACKGROUND";

/**
 * HopsApplicationProps
 */
interface HopsApplicationProps {
  hops: HopsState;
}

/**
 * HopsApplication
 * @param props props
 */
const HopsApplication = (props: HopsApplicationProps) => {
  const { hops } = props;
  const [activeTab, setActiveTab] = React.useState<HopsTab>("BACKGROUND");
  const { t } = useTranslation(["studies", "common", "hops_new"]);

  /**
   * onTabChange
   * @param id id
   * @param hash hash
   */
  const onTabChange = (id: "MATRICULATION", hash?: string | Tab) => {
    if (hash) {
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = hash as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = hash.hash;
      }
    }

    setActiveTab(id);
  };

  const panelTabs: Tab[] = [
    {
      id: "BACKGROUND",
      name: t("labels.hopsBackground", { ns: "hops_new" }),
      hash: "background",
      type: "background",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Background />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "MATRICULATION",
      name: t("labels.hopsMatriculation", { ns: "hops_new" }),
      hash: "matriculation",
      type: "matriculation",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Matriculation />
        </ApplicationPanelBody>
      ),
    },
  ];

  /**
   * isVisible
   * @param tab tab
   * @returns whether tab should be visible or not
   */
  const isVisible = (tab: Tab) => {
    switch (tab.id) {
      case "BACKGROUND":
        return true;
      case "MATRICULATION":
        return (
          hops.studentInfo &&
          hops.studentInfo.studyProgrammeEducationType === "lukio"
        );
    }
  };

  return (
    <UseCaseContextProvider value="STUDENT">
      <ApplicationPanel
        title="HOPS"
        onTabChange={onTabChange}
        activeTab={activeTab}
        panelTabs={panelTabs.filter(isVisible)}
      />
    </UseCaseContextProvider>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsApplication);
