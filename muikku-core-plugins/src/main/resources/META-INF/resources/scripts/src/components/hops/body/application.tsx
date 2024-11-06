import * as React from "react";
import { connect } from "react-redux";
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
import { Action, bindActionCreators, Dispatch } from "redux";
import { HopsBasicInfoProvider } from "~/context/hops-basic-info-context";
import { StatusType } from "~/reducers/base/status";
import {
  StartEditingTriggerType,
  startEditing,
  EndEditingTriggerType,
  endEditing,
} from "~/actions/main-function/hops/";
import { HopsState } from "~/reducers/hops";
import Button from "~/components/general/button";

/**
 * Represents the available tabs in the HOPS application.
 * Currently only supports matriculation.
 */
type HopsTab = "MATRICULATION";

/**
 * Props for the HopsApplication component.
 */
interface HopsApplicationProps {
  /** The current state of the HOPS application */
  hops: HopsState;
  /** The current status information including user data */
  status: StatusType;
  /** Whether to show the HOPS title in the panel */
  showTitle?: boolean;
  /** Function to trigger edit mode */
  startEditing: StartEditingTriggerType;
  /** Function to exit edit mode */
  endEditing: EndEditingTriggerType;
}

const defaultProps: Partial<HopsApplicationProps> = {
  showTitle: true,
};

/**
 * Renders the HOPS (Personal Study Plan) application interface.
 * Provides functionality to view and edit matriculation details.
 * @param props - Component props
 * @returns The rendered HopsApplication component
 */
const HopsApplication = (props: HopsApplicationProps) => {
  const { showTitle, status, hops, startEditing, endEditing } = {
    ...defaultProps,
    ...props,
  };
  const [activeTab, setActiveTab] = React.useState<HopsTab>("MATRICULATION");
  const { t } = useTranslation(["studies", "common", "hops_new"]);

  /**
   * Handles tab changes in the application panel.
   * Updates the URL hash and active tab state.
   * @param id - The ID of the tab to switch to
   * @param hash - Optional hash or Tab object for URL updating
   */
  const onTabChange = (id: HopsTab, hash?: string | Tab) => {
    if (hash) {
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = hash as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = hash.hash;
      }
    }

    setActiveTab(id);
  };

  /**
   * Toggles between read and edit modes.
   */
  const handleModeChangeClick = () => {
    if (hops.hopsMode === "READ") {
      startEditing();
    } else {
      endEditing();
    }
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
    <HopsBasicInfoProvider
      useCase="STUDENT"
      studentInfo={{
        identifier: status.userSchoolDataIdentifier,
        studyStartDate: new Date(status.profile.studyStartDate),
      }}
    >
      <ApplicationPanel
        title={showTitle ? "HOPS" : undefined}
        panelOptions={
          <div className="button-row">
            <Button
              className={`button ${hops.hopsMode === "READ" ? "button--primary" : "button--primary active"}`}
              onClick={handleModeChangeClick}
            >
              {hops.hopsMode === "READ"
                ? t("actions.editingStart", { ns: "hops_new" })
                : t("actions.editingEnd", { ns: "hops_new" })}
            </Button>
          </div>
        }
        onTabChange={onTabChange}
        activeTab={activeTab}
        panelTabs={panelTabs}
      />
    </HopsBasicInfoProvider>
  );
};

/**
 * Maps Redux state to component props.
 * @param state - The Redux state
 * @returns The props derived from state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
    status: state.status,
  };
}

/**
 * Maps Redux dispatch actions to component props.
 * @param dispatch - The Redux dispatch function
 * @returns The mapped action creators
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      startEditing,
      endEditing,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsApplication);
