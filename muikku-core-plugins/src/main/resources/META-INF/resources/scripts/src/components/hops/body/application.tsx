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
import { useState, useCallback } from "react";
import OngoingWarningDialog from "./application/wizard/dialog/ongoing-edit-warning";

/**
 * Represents the possible tabs in the HOPS application.
 */
type HopsTab = "MATRICULATION" | "BACKGROUND";

/**
 * Props for the HopsApplication component.
 */
interface HopsApplicationProps {
  hops: HopsState;
}

/**
 * HopsApplication component
 *
 * This component renders the main application panel for the HOPS.
 * It manages the tab navigation between Background and Matriculation sections, handles unsaved changes,
 * and provides a warning dialog when switching tabs with unsaved changes.
 *
 * @param props - The component props
 */
const HopsApplication = (props: HopsApplicationProps) => {
  const { hops } = props;
  const [activeTab, setActiveTab] = React.useState<HopsTab>("BACKGROUND");
  const { t } = useTranslation(["studies", "common", "hops_new"]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<{
    id: HopsTab;
    hash?: string | Tab;
  } | null>(null);

  /**
   * Handles the tab change after confirming unsaved changes.
   *
   * @param id - The ID of the tab to change to
   * @param hash - Optional hash or Tab object for URL updating
   */
  const handleContinueTabChange = useCallback(
    (id: HopsTab, hash?: string | Tab) => {
      if (hash) {
        if (typeof hash === "string" || hash instanceof String) {
          window.location.hash = hash as string;
        } else if (typeof hash === "object" && hash !== null) {
          window.location.hash = hash.hash;
        }
      }
      setActiveTab(id);
      setHasUnsavedChanges(false);
    },
    []
  );

  /**
   * Initiates the tab change process, checking for unsaved changes.
   *
   * @param id - The ID of the tab to change to
   * @param hash - Optional hash or Tab object for URL updating
   */
  const handleTabChange = useCallback(
    (id: HopsTab, hash?: string | Tab) => {
      if (hasUnsavedChanges) {
        setPendingTabChange({ id, hash });
        setIsWarningDialogOpen(true);
      } else {
        handleContinueTabChange(id, hash);
      }
    },
    [hasUnsavedChanges, handleContinueTabChange]
  );

  /**
   * Confirms the pending tab change and closes the warning dialog.
   */
  const handleConfirmTabChange = useCallback(() => {
    if (pendingTabChange) {
      handleTabChange(pendingTabChange.id, pendingTabChange.hash);
    }
    setIsWarningDialogOpen(false);
    setPendingTabChange(null);
  }, [pendingTabChange, handleTabChange]);

  /**
   * Cancels the pending tab change and closes the warning dialog.
   */
  const handleCancelTabChange = useCallback(() => {
    setIsWarningDialogOpen(false);
    setPendingTabChange(null);
  }, []);

  /**
   * Updates the unsaved changes state.
   *
   * @param hasUnsavedChanges - Boolean indicating whether there are unsaved changes
   */
  const handleHasUnsavedChanges = useCallback((hasUnsavedChanges: boolean) => {
    setHasUnsavedChanges(hasUnsavedChanges);
  }, []);

  /**
   * Defines the tabs for the application panel.
   */
  const panelTabs: Tab[] = [
    {
      id: "BACKGROUND",
      name: t("labels.hopsBackground", { ns: "hops_new" }),
      hash: "background",
      type: "background",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Background onHasUnsavedChanges={handleHasUnsavedChanges} />
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
   * Determines if a tab should be visible based on the current state.
   *
   * @param tab - The tab to check for visibility
   * @returns A boolean indicating whether the tab should be visible
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
        onTabChange={handleTabChange}
        activeTab={activeTab}
        panelTabs={panelTabs.filter(isVisible)}
      />
      <OngoingWarningDialog
        isOpen={isWarningDialogOpen}
        onConfirm={handleConfirmTabChange}
        onCancel={handleCancelTabChange}
      />
    </UseCaseContextProvider>
  );
};

/**
 * Maps the Redux state to component props
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
  };
}

/**
 * Maps dispatch functions to component props
 * @param dispatch - The Redux dispatch function
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsApplication);
