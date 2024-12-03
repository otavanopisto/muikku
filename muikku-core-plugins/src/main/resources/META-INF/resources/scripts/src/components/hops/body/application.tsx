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
  CancelEditingTriggerType,
  cancelEditing,
} from "~/actions/main-function/hops/";
import { useState, useCallback, useEffect } from "react";
import { HopsState } from "~/reducers/hops";
import Button from "~/components/general/button";
import WebsocketWatcher from "./application/helper/websocket-watcher";
import _ from "lodash";
import PendingChangesWarningDialog from "../dialogs/pending-changes-warning";
import Background from "./application/background/background";
import Postgraduate from "./application/postgraduate/postgraduate";

/**
 * Represents the available tabs in the HOPS application.
 * Currently only supports matriculation.
 */
type HopsTab = "MATRICULATION" | "BACKGROUND" | "POSTGRADUATE";

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
  /** Function to cancel editing */
  cancelEditing: CancelEditingTriggerType;
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
  const { showTitle, status, hops, startEditing, endEditing, cancelEditing } = {
    ...defaultProps,
    ...props,
  };
  const [activeTab, setActiveTab] = React.useState<HopsTab>("MATRICULATION");
  const [
    isPendingChangesWarningDialogOpen,
    setIsPendingChangesWarningDialogOpen,
  ] = React.useState(false);
  const { t } = useTranslation(["studies", "common", "hops_new"]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<{
    id: HopsTab;
    hash?: string | Tab;
  } | null>(null);

  // Add new useEffect for handling initial URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "matriculation") {
      setActiveTab("MATRICULATION");
    } else if (hash === "background") {
      setActiveTab("BACKGROUND");
    }
  }, []); // Run only on mount

  // Add useEffect to handle beforeunload event
  useEffect(() => {
    /**
     * Handles the beforeunload event to prevent the user from leaving the page
     * with unsaved changes.
     *
     * @param e - The beforeunload event
     * @returns - Returns an empty string to allow the user to leave the page
     */
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // For Chrome
        return ""; // For other browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  /**
   * Handles tab changes in the application panel.
   * Updates the URL hash and active tab state.
   * @param id - The ID of the tab to switch to
   * @param hash - Optional hash or Tab object for URL updating
   */
  const onTabChange = useCallback((id: HopsTab, hash?: string | Tab) => {
    if (hash) {
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = hash as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = hash.hash;
      }
      setActiveTab(id);
      setHasUnsavedChanges(false);
    }
  }, []);

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
        onTabChange(id, hash);
      }
    },
    [hasUnsavedChanges, onTabChange]
  );

  /**
   * Confirms the pending tab change and closes the warning dialog.
   */
  /* const handleConfirmTabChange = useCallback(() => {
    if (pendingTabChange) {
      handleContinueTabChange(pendingTabChange.id, pendingTabChange.hash);
    }
    setIsWarningDialogOpen(false);
    setPendingTabChange(null);
  }, [pendingTabChange, handleContinueTabChange]); */

  /**
   * Cancels the pending tab change and closes the warning dialog.
   */
  /* const handleCancelTabChange = useCallback(() => {
    setIsWarningDialogOpen(false);
    setPendingTabChange(null);
  }, []);
 */
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

  /**
   * Opens the pending changes warning dialog
   */
  const handleOpenPendingChangesWarningDialog = () => {
    setIsPendingChangesWarningDialogOpen(true);
  };

  /**
   * Handles the confirm button click in the pending changes warning dialog
   */
  const handlePendingChangesWarningDialogConfirm = () => {
    cancelEditing();
    setIsPendingChangesWarningDialogOpen(false);
  };

  /**
   * Handles the cancel button click in the pending changes warning dialog
   */
  const handlePendingChangesWarningDialogCancel = () => {
    setIsPendingChangesWarningDialogOpen(false);
  };

  /**
   * Cancels editing and returns to read mode
   */
  const handleCancelClick = () => {
    cancelEditing();
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
    {
      id: "POSTGRADUATE",
      name: t("labels.hopsPostgraduate", { ns: "hops_new" }),
      hash: "postgraduate",
      type: "postgraduate",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Postgraduate />
        </ApplicationPanelBody>
      ),
    },
  ];

  const updatedMatriculationPlan = {
    ...hops.hopsEditing.matriculationPlan,
    plannedSubjects: hops.hopsEditing.matriculationPlan.plannedSubjects.filter(
      (subject) => subject.subject
    ),
  };

  const hopsHasChanges = !_.isEqual(
    hops.hopsMatriculation.plan,
    updatedMatriculationPlan
  );

  let editingDisabled = false;

  if (
    status.userId !== hops.hopsLocked?.userEntityId &&
    hops.hopsLocked?.locked
  ) {
    editingDisabled = true;
  }

  return (
    <WebsocketWatcher studentIdentifier={status.userSchoolDataIdentifier}>
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
            <div className="hops-edit__button-row">
              {hops.hopsMode === "READ" ? (
                <Button
                  onClick={handleModeChangeClick}
                  disabled={editingDisabled}
                  buttonModifiers={[
                    "primary",
                    "standard-ok",
                    "standard-fit-content",
                  ]}
                >
                  {t("actions.editingStart", { ns: "hops_new" })}
                </Button>
              ) : (
                <Button
                  onClick={handleModeChangeClick}
                  disabled={!hopsHasChanges}
                  buttonModifiers={[
                    "primary",
                    "standard-ok",
                    "standard-fit-content",
                  ]}
                >
                  {t("actions.editingEnd", { ns: "hops_new" })}
                </Button>
              )}
              {hops.hopsMode === "EDIT" && (
                <Button
                  buttonModifiers={[
                    "cancel",
                    "standard-cancel",
                    "standard-fit-content",
                  ]}
                  onClick={
                    hopsHasChanges
                      ? handleOpenPendingChangesWarningDialog
                      : handleCancelClick
                  }
                >
                  {t("actions.cancel", { ns: "common" })}
                </Button>
              )}
            </div>
          }
          onTabChange={onTabChange}
          activeTab={activeTab}
          panelTabs={panelTabs}
        />
        <PendingChangesWarningDialog
          isOpen={isPendingChangesWarningDialogOpen}
          onConfirm={handlePendingChangesWarningDialogConfirm}
          onCancel={handlePendingChangesWarningDialogCancel}
        />
      </HopsBasicInfoProvider>
    </WebsocketWatcher>
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
      cancelEditing,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsApplication);
