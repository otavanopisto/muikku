import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import { HOPSState } from "../../../reducers/main-function/hops";
import { StatusType } from "../../../reducers/base/status";
import { Tab } from "~/components/general/tabs";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/journal.scss";
import "~/sass/elements/workspace-assessment.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import Matriculation from "./application/matriculation/matriculation";
import { UseCaseContextProvider } from "~/context/use-case-context";

/**
 * StudiesApplicationProps
 */
interface HopsApplicationProps extends WithTranslation {
  hops: HOPSState;
}

/**
 * StudiesTab
 */
type HopsTab = "MATRICULATION";

/**
 * HopsApplicationProps
 */
interface HopsApplicationProps extends WithTranslation {
  hops: HOPSState;
  status: StatusType;
}

/**
 * HopsApplication
 * @param props props
 */
const HopsApplication = (props: HopsApplicationProps) => {
  const [activeTab, setActiveTab] = React.useState<HopsTab>("MATRICULATION");

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
      id: "MATRICULATION",
      name: "Ylioppilastutkinto",
      hash: "matriculation",
      type: "matriculation",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Matriculation />
        </ApplicationPanelBody>
      ),
    },
  ];

  return (
    <UseCaseContextProvider value="STUDENT">
      <ApplicationPanel
        title="HOPS"
        onTabChange={onTabChange}
        activeTab={activeTab}
        panelTabs={panelTabs}
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
    hops: state.hops,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation(["studies", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(HopsApplication)
);
