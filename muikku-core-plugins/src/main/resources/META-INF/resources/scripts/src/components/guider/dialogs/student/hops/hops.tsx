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
  saveHops,
  SaveHopsTriggerType,
  CancelEditingTriggerType,
  cancelEditing,
  LoadStudentHopsFormTriggerType,
  loadStudentHopsForm,
  LoadHopsFormHistoryTriggerType,
  loadHopsFormHistory,
  LoadHopsLockedTriggerType,
  loadHopsLocked,
} from "~/actions/main-function/hops/";
import { HopsState } from "~/reducers/hops";
import { HopsBasicInfoProvider } from "~/context/hops-basic-info-context";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import WebsocketWatcher from "~/components/hops/body/application/helper/websocket-watcher";
import _ from "lodash";
import PendingChangesWarningDialog from "~/components/hops/dialogs/pending-changes-warning";
import { GuiderStudent } from "~/generated/client";
import Background from "~/components/hops/body/application/background/background";
import Postgraduate from "~/components/hops/body/application/postgraduate/postgraduate";
import {
  compulsoryStudiesFieldsTranslation,
  secondaryStudiesFieldsTranslation,
} from "~/components/hops/body/application/wizard/helpers";
import NewHopsEventDescriptionDialog from "~/components/hops/body/application/wizard/dialog/new-hops-event";
import { getEditedHopsFields } from "~/components/hops/body/application/wizard/helpers";
import { isCompulsoryStudiesHops } from "~/@types/hops";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { Textarea } from "~/components/hops/body/application/wizard/components/text-area";

/**
 * Represents the available tabs in the HOPS application
 * Currently only supports matriculation tab
 */
type HopsTab = "MATRICULATION" | "BACKGROUND" | "POSTGRADUATE";

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
  /** Function to load HOPS locked status */
  loadHopsLocked: LoadHopsLockedTriggerType;
  /** Function to load student HOPS form data */
  loadStudentHopsForm: LoadStudentHopsFormTriggerType;
  /** Function to load HOPS form history data */
  loadHopsFormHistory: LoadHopsFormHistoryTriggerType;
  /** Function to load matriculation data */
  loadMatriculationData: LoadMatriculationDataTriggerType;
  /** Function to enable editing mode */
  startEditing: StartEditingTriggerType;
  /** Function to disable editing mode */
  saveHops: SaveHopsTriggerType;
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
    loadStudentHopsForm,
    loadHopsFormHistory,
    startEditing,
    saveHops,
    cancelEditing,
    loadHopsLocked,
    hops,
    status,
    studentInfo,
  } = props;

  // Set the initial active tab based on the user's permissions
  const [activeTab, setActiveTab] = React.useState<HopsTab>(
    studentInfo.permissions.canViewDetails ? "BACKGROUND" : "MATRICULATION"
  );
  const [
    isPendingChangesWarningDialogOpen,
    setIsPendingChangesWarningDialogOpen,
  ] = React.useState(false);
  const [
    isPendingChangesDetailsDialogOpen,
    setIsPendingChangesDetailsDialogOpen,
  ] = React.useState(false);
  const [pendingDetailsContent, setPendingDetailsContent] = React.useState("");

  const { t } = useTranslation(["studies", "common", "hops_new"]);

  // Load data on demand depending on the active tab
  React.useEffect(() => {
    // Always load the locked status if it is not already loaded
    if (
      hops.hopsLockedStatus !== "LOADING" &&
      hops.hopsLockedStatus !== "READY"
    ) {
      loadHopsLocked({ userIdentifier: studentIdentifier });
    }

    // On background or postgraduate tabs,
    if (activeTab === "BACKGROUND" || activeTab === "POSTGRADUATE") {
      // Load the HOPS form history if it is not already loaded
      if (
        hops.hopsFormHistoryStatus !== "LOADING" &&
        hops.hopsFormHistoryStatus !== "READY"
      ) {
        loadHopsFormHistory({ userIdentifier: studentIdentifier });
      }

      // Load the HOPS form if it is not already loaded
      if (
        hops.hopsFormStatus !== "LOADING" &&
        hops.hopsFormStatus !== "READY"
      ) {
        loadStudentHopsForm({ userIdentifier: studentIdentifier });
      }
    }
    // On Matriculation tab,
    else if (
      activeTab === "MATRICULATION" &&
      hops.hopsMatriculationStatus !== "LOADING" &&
      hops.hopsMatriculationStatus !== "READY"
    ) {
      loadMatriculationData({
        userIdentifier: studentIdentifier,
      });
    }
  }, [
    activeTab,
    hops.hopsFormStatus,
    hops.hopsMatriculationStatus,
    loadMatriculationData,
    loadStudentHopsForm,
    loadHopsFormHistory,
    studentIdentifier,
    hops.hopsFormHistoryStatus,
    hops.hopsLockedStatus,
    loadHopsLocked,
  ]);

  /**
   * Handles tab changes in the application panel
   * @param {HopsTab} id - The ID of the tab to switch to
   */
  const onTabChange = (id: HopsTab) => {
    setActiveTab(id);
  };

  /**
   * Handles the start editing button click
   */
  const handleStartEditing = () => {
    startEditing();
    setPendingDetailsContent("");
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
  const handlePendingChangesDetailsDialogCancel = () => {
    setIsPendingChangesDetailsDialogOpen(false);
  };

  /**
   * Handles the save button click in the pending changes details dialog
   */
  const handleSaveHops = () => {
    saveHops({
      details: pendingDetailsContent,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onSuccess: () => {
        unstable_batchedUpdates(() => {
          // On success, reset the pending details content and close the dialog
          setPendingDetailsContent("");
          setIsPendingChangesDetailsDialogOpen(false);
        });
      },
    });
  };

  /**
   * Cancels editing and returns to read mode
   */
  const handleCancelClick = () => {
    cancelEditing();
  };

  /**
   * Opens the pending changes details dialog
   */
  const handleOpenPendingChangesDetailsDialog = () => {
    setIsPendingChangesDetailsDialogOpen(true);
  };

  // Note canViewDetails lets the user view other hops tabs than matriculation and study plan
  // These are not implemented yet, but this is reserved for future use
  const panelTabs: Tab[] = studentInfo.permissions.canViewDetails
    ? [
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

  // Check if the matriculation plan has changes
  const hopsMatriculationHasChanges = !_.isEqual(
    hops.hopsMatriculation.plan,
    updatedMatriculationPlan
  );

  // Check if the HOPS form has changes
  const hopsFormHasChanges = !_.isEqual(
    hops.hopsForm,
    hops.hopsEditing.hopsForm
  );

  const changedFields = hopsFormHasChanges
    ? getEditedHopsFields(hops.hopsForm, hops.hopsEditing.hopsForm)
    : [];

  // Check if any of the HOPS data has changes
  const hopsHasChanges = hopsMatriculationHasChanges || hopsFormHasChanges;

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
        useCase="GUIDER"
        studentInfo={{
          identifier: studentInfo.id,
          studyStartDate: studentInfo.studyStartDate,
        }}
      >
        {studentInfo.permissions.canEdit && (
          <div className="hops-edit__button-row">
            {hops.hopsMode === "READ" ? (
              <Button
                onClick={handleStartEditing}
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
                onClick={handleOpenPendingChangesDetailsDialog}
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
        <NewHopsEventDescriptionDialog
          isOpen={isPendingChangesDetailsDialogOpen}
          onSaveClick={handleSaveHops}
          onCancelClick={handlePendingChangesDetailsDialogCancel}
          content={
            <div className="hops-container__row">
              {changedFields.length > 0 && (
                <div className="hops__form-element-container">
                  <h4>
                    {t("labels.editedFields", { ns: "pedagogySupportPlan" })}
                  </h4>
                  <ul>
                    {changedFields.map((field) => (
                      <li key={field} style={{ display: "list-item" }}>
                        {isCompulsoryStudiesHops(hops.hopsForm)
                          ? compulsoryStudiesFieldsTranslation(t)[field]
                          : secondaryStudiesFieldsTranslation(t)[field]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="hops__form-element-container">
                <Textarea
                  id="pending-changes-details"
                  value={pendingDetailsContent}
                  onChange={(e) => setPendingDetailsContent(e.target.value)}
                  className="form-element__textarea form-element__textarea--resize__vertically"
                />
              </div>
            </div>
          }
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
      loadStudentHopsForm,
      loadHopsFormHistory,
      startEditing,
      saveHops,
      cancelEditing,
      loadHopsLocked,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsApplication);
