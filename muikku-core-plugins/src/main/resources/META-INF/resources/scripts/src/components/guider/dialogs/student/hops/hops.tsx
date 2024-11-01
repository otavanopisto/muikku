import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
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
import Matriculation from "~/components/hops/body/application/matriculation/matriculation";
import { UseCaseContextProvider } from "~/context/use-case-context";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  LoadMatriculationDataTriggerType,
  loadMatriculationData,
} from "~/actions/main-function/hops/";
import { HopsState } from "~/reducers/hops";

/**
 * StudiesTab
 */
type HopsTab = "MATRICULATION";

/**
 * HopsApplicationProps
 */
interface HopsApplicationProps {
  hops: HopsState;
  studentIdentifier: string;
  loadMatriculationData: LoadMatriculationDataTriggerType;
}

/**
 * HopsApplication
 * @param props props
 */
const HopsApplication = (props: HopsApplicationProps) => {
  const { studentIdentifier, loadMatriculationData, hops } = props;

  const [activeTab, setActiveTab] = React.useState<HopsTab>("MATRICULATION");
  const { t } = useTranslation(["studies", "common", "hops_new"]);

  // Load matriculation data if it is not already loaded
  React.useEffect(() => {
    if (
      hops.hopsMatriculationStatus !== "LOADING" &&
      hops.hopsMatriculationStatus !== "READY"
    ) {
      loadMatriculationData({
        userIdentifier: studentIdentifier,
      });
    }
  }, [hops.hopsMatriculationStatus, loadMatriculationData, studentIdentifier]);

  /**
   * onTabChange
   * @param id id
   */
  const onTabChange = (id: HopsTab) => {
    setActiveTab(id);
  };

  const panelTabs: Tab[] = [
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

  return (
    <UseCaseContextProvider value="GUIDANCE_COUNSELOR">
      <ApplicationPanel
        modifier="guider-student-hops"
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
    hops: state.hopsNew,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadMatriculationData,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsApplication);
