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
  SaveHopsTriggerType,
  saveHops,
  CancelEditingTriggerType,
  cancelEditing,
} from "~/actions/main-function/hops/";
import { useState, useCallback, useEffect } from "react";
import { HopsState } from "~/reducers/hops";
import Button from "~/components/general/button";
import WebsocketWatcher from "./application/helper/websocket-watcher";
import _ from "lodash";
import PendingChangesWarningDialog from "../dialogs/pending-changes-warning";
import StudyPlan from "./application/study-planing/study-plan";
import Background from "./application/background/background";
import Postgraduate from "./application/postgraduate/postgraduate";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import NewHopsEventDescriptionDialog from "../dialogs/new-hops-event-description-dialog";
import {
  compulsoryStudiesFieldsTranslation,
  getEditedHopsFields,
  secondaryStudiesFieldsTranslation,
} from "./application/wizard/helpers";
import { Textarea } from "~/components/hops/body/application/wizard/components/text-area";
import { isCompulsoryStudiesHops } from "~/@types/hops";
import "~/sass/elements/react-datepicker-override.scss";

/**
 * Represents the available tabs in the HOPS application.
 * Currently only supports matriculation.
 */
type HopsTab = "MATRICULATION" | "BACKGROUND" | "POSTGRADUATE" | "STUDYPLAN";

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
  saveHops: SaveHopsTriggerType;
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
  const { showTitle, status, hops, startEditing, saveHops, cancelEditing } = {
    ...defaultProps,
    ...props,
  };
  const [activeTab, setActiveTab] = React.useState<HopsTab>("BACKGROUND");
  const [
    isPendingChangesWarningDialogOpen,
    setIsPendingChangesWarningDialogOpen,
  ] = React.useState(false);
  const { t } = useTranslation(["common", "hops_new"]);
  const [
    isPendingChangesDetailsDialogOpen,
    setIsPendingChangesDetailsDialogOpen,
  ] = React.useState(false);
  const [pendingDetailsContent, setPendingDetailsContent] = useState("");

  // Note that this component is used by student, thats why
  // we need to check the study programme name from profile
  const studyProgrammeName = status.profile.studyProgrammeName;

  // Check if the HOPS form has changes
  const hopsFormHasChanges = React.useMemo(
    () => !_.isEqual(hops.hopsForm, hops.hopsEditing.hopsForm),
    [hops.hopsForm, hops.hopsEditing.hopsForm]
  );

  // Check if the matriculation plan has changes
  const hopsMatriculationHasChanges = React.useMemo(() => {
    // If the student info is not loaded or the study programme is not upper secondary, return false by default
    if (
      !hops.studentInfo ||
      hops.studentInfo.studyProgrammeEducationType !== "lukio"
    ) {
      return false;
    }

    const updatedMatriculationPlan = {
      ...hops.hopsEditing.matriculationPlan,
      plannedSubjects:
        hops.hopsEditing.matriculationPlan.plannedSubjects.filter(
          (subject) => subject.subject
        ),
    };

    return !_.isEqual(hops.hopsMatriculation.plan, updatedMatriculationPlan);
  }, [
    hops.hopsEditing.matriculationPlan,
    hops.hopsMatriculation.plan,
    hops.studentInfo,
  ]);

  // Check if the study plan has changes
  const studyPlanHasChanges = React.useMemo(
    () =>
      !_.isEqual(
        hops.hopsEditing.plannedCourses,
        hops.hopsStudyPlanState.plannedCourses
      ) ||
      !_.isEqual(hops.hopsEditing.goals, hops.hopsStudyPlanState.goals) ||
      !_.isEqual(hops.hopsEditing.planNotes, hops.hopsStudyPlanState.planNotes),
    [
      hops.hopsEditing.goals,
      hops.hopsEditing.plannedCourses,
      hops.hopsStudyPlanState.goals,
      hops.hopsStudyPlanState.plannedCourses,
      hops.hopsEditing.planNotes,
      hops.hopsStudyPlanState.planNotes,
    ]
  );

  // Check if any of the HOPS data has changes
  const hopsHasChanges = React.useMemo(
    () =>
      hopsMatriculationHasChanges || hopsFormHasChanges || studyPlanHasChanges,
    [hopsFormHasChanges, hopsMatriculationHasChanges, studyPlanHasChanges]
  );

  // Add new useEffect for handling initial URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "matriculation") {
      setActiveTab("MATRICULATION");
    } else if (hash === "background") {
      setActiveTab("BACKGROUND");
    } else if (hash === "postgraduate") {
      setActiveTab("POSTGRADUATE");
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
      if (hopsHasChanges || hops.hopsMode === "EDIT") {
        e.preventDefault();
        e.returnValue = ""; // For Chrome
        return ""; // For other browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hops.hopsMode, hopsHasChanges]);

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
  const onTabChange = useCallback((id: HopsTab, hash?: string | Tab) => {
    if (hash) {
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = hash as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = hash.hash;
      }
      setActiveTab(id);
    }
  }, []);

  /**
   * Handles the start editing button click
   */
  const handleStartEditing = () => {
    startEditing();
    setPendingDetailsContent("");
  };

  /**
   * Handles the cancel editing button click
   */
  const handleCancelEditing = () => {
    cancelEditing();
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
   * Opens the pending changes details dialog
   */
  const handleOpenPendingChangesDetailsDialog = () => {
    setIsPendingChangesDetailsDialogOpen(true);
  };

  /**
   * Checks if the tab is visible.
   * - Background and Postgraduate tabs are visible for all students
   * - Matriculation tab is visible if the study programme name is included in the list
   * @param tab - The tab to check
   * @returns boolean
   */
  const isVisible = (tab: string) => {
    switch (tab) {
      case "BACKGROUND":
      case "POSTGRADUATE":
      case "STUDYPLAN":
        return true;
      case "MATRICULATION":
        return [
          "Nettilukio",
          "Aikuislukio",
          "Nettilukio/yksityisopiskelu (aineopintoina)",
          "Aineopiskelu/yo-tutkinto",
          "Aineopiskelu/lukio",
          "Aineopiskelu/lukio (oppivelvolliset)",
          "Aineopiskelu/valmistuneet",
          "Kahden tutkinnon opinnot",
        ].includes(studyProgrammeName);
      default:
        return false;
    }
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
      id: "STUDYPLAN",
      name: t("labels.hopsStudyPlanning", { ns: "hops_new" }),
      hash: "studyplan",
      type: "studyplan",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <StudyPlan />
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

  const changedFields = hopsFormHasChanges
    ? getEditedHopsFields(hops.hopsForm, hops.hopsEditing.hopsForm)
    : [];

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
                  onClick={handleStartEditing}
                  disabled={editingDisabled}
                  buttonModifiers={["info", "standard-ok"]}
                >
                  {t("actions.edit", { ns: "common" })}
                </Button>
              ) : (
                <Button
                  onClick={handleOpenPendingChangesDetailsDialog}
                  disabled={!hopsHasChanges}
                  buttonModifiers={["execute", "standard-ok"]}
                >
                  {t("actions.save", { ns: "common", context: "changes" })}
                </Button>
              )}
              {hops.hopsMode === "EDIT" && (
                <Button
                  buttonModifiers={["cancel", "standard-cancel"]}
                  onClick={
                    hopsHasChanges
                      ? handleOpenPendingChangesWarningDialog
                      : handleCancelEditing
                  }
                >
                  {t("actions.cancel", { ns: "common" })}
                </Button>
              )}
            </div>
          }
          onTabChange={onTabChange}
          activeTab={activeTab}
          panelTabs={panelTabs.filter((tab) => isVisible(tab.id))}
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
            <div>
              <div className="form-element dialog__content-row">
                <label>
                  {t("labels.editedFields", { ns: "pedagogySupportPlan" })}
                </label>
                {changedFields.length > 0 && (
                  <ul>
                    {changedFields.map((field) => (
                      <li key={field} style={{ display: "list-item" }}>
                        {isCompulsoryStudiesHops(hops.hopsForm)
                          ? compulsoryStudiesFieldsTranslation(t)[field]
                          : secondaryStudiesFieldsTranslation(t)[field]}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="form-element dialog__content-row">
                <label htmlFor="pendingChangesDetails">
                  {t("labels.description", { ns: "common" })}
                </label>
                <Textarea
                  id="pendingChangesDetails"
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
      saveHops,
      cancelEditing,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsApplication);
