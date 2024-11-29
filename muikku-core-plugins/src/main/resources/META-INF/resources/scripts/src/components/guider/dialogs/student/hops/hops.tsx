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
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  LoadMatriculationDataTriggerType,
  loadMatriculationData,
  StartEditingTriggerType,
  startEditing,
  endEditing,
  EndEditingTriggerType,
  CancelEditingTriggerType,
  cancelEditing,
} from "~/actions/main-function/hops/";
import { HopsState } from "~/reducers/hops";
import { HopsBasicInfoProvider } from "~/context/hops-basic-info-context";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import WebsocketWatcher from "~/components/hops/body/application/helper/websocket-watcher";
import _ from "lodash";
import PendingChangesWarningDialog from "~/components/hops/dialogs/pending-changes-warning";
import { GuiderStudent } from "~/generated/client";

/**
 * Represents the available tabs in the HOPS application
 * Currently only supports matriculation tab
 */
type HopsTab = "MATRICULATION";

/**
 * Props interface for the HopsApplication component
 */
interface HopsApplicationProps {
  /** The current state of the HOPS application */
  hops: HopsState;
  /** The current state of the status application */
  status: StatusType;
  /** Information about the current student */
  studentInfo: GuiderStudent;
  /** Unique identifier for the student */
  studentIdentifier: string;
  /** Function to load matriculation data */
  loadMatriculationData: LoadMatriculationDataTriggerType;
  /** Function to enable editing mode */
  startEditing: StartEditingTriggerType;
  /** Function to disable editing mode */
  endEditing: EndEditingTriggerType;
  /** Function to cancel editing */
  cancelEditing: CancelEditingTriggerType;
}

/**
 * HopsApplication component handles the display and management of HOPS (Personal Study Plan) information
 * for a student, including matriculation data and editing capabilities.
 *
 * @param props - Component props
 * @returns  Rendered HopsApplication component
 */
const HopsApplication = (props: HopsApplicationProps) => {
  const {
    studentIdentifier,
    loadMatriculationData,
    startEditing,
    endEditing,
    cancelEditing,
    hops,
    status,
    studentInfo,
  } = props;

  const [activeTab, setActiveTab] = React.useState<HopsTab>("MATRICULATION");
  const [
    isPendingChangesWarningDialogOpen,
    setIsPendingChangesWarningDialogOpen,
  ] = React.useState(false);
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
   * Handles tab changes in the application panel
   * @param {HopsTab} id - The ID of the tab to switch to
   */
  const onTabChange = (id: HopsTab) => {
    setActiveTab(id);
  };

  /**
   * Toggles between read and edit modes for the HOPS application
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

  // Note canViewDetails lets the user view other hops tabs than matriculation and study plan
  // These are not implemented yet, but this is reserved for future use
  const panelTabs: Tab[] = studentInfo.permissions.canViewDetails
    ? [
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
      ]
    : [
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
    <WebsocketWatcher studentIdentifier={studentIdentifier}>
      <HopsBasicInfoProvider
        useCase="GUIDANCE_COUNSELOR"
        studentInfo={{
          identifier: studentInfo.id,
          studyStartDate: studentInfo.studyStartDate,
        }}
      >
        {studentInfo.permissions.canEdit && (
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
        )}
        <ApplicationPanel
          modifier="guider-student-hops"
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
 * Maps Redux state to component props
 * @param state - The current Redux state
 * @returns Mapped props
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
    status: state.status,
    studentInfo: state.guider.currentStudent.basic,
  };
}

/**
 * Maps Redux dispatch actions to component props
 * @param dispatch - The Redux dispatch function
 * @returns Mapped action creators
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadMatriculationData,
      startEditing,
      endEditing,
      cancelEditing,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsApplication);
