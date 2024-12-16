import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import { Tab } from "~/components/general/tabs";
import { AnyActionType } from "~/actions";
import "~/sass/elements/hops.scss";
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
import { HopsState } from "~/reducers/hops";
import Button from "~/components/general/button";
import WebsocketWatcher from "./application/helper/websocket-watcher";
import _ from "lodash";
import PendingChangesWarningDialog from "../dialogs/pending-changes-warning";
import StudyPlan from "./application/study-planing/study-plan";

/**
 * Represents the available tabs in the HOPS application.
 * Currently only supports matriculation.
 */
type HopsTab = "MATRICULATION" | "STUDYPLAN";

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

  // Add new useEffect for handling initial URL hash
  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "matriculation") {
      setActiveTab("MATRICULATION");
    } else if (hash === "studyplan") {
      setActiveTab("STUDYPLAN");
    }
  }, []); // Run only on mount

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
      id: "STUDYPLAN",
      name: "Opintojen suunnittelu",
      hash: "studyplan",
      type: "studyplan",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <StudyPlan />
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
