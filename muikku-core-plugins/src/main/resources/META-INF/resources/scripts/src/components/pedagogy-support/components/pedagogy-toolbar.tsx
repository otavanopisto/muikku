import * as React from "react";
import SaveWithExtraDetailsDialog from "../dialogs/save-with-extra-details";
import WarningDialog from "../dialogs/warning";
import { usePedagogyContext } from "../context/pedagogy-context";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useMemo } from "react";
import {
  COMPULSORY_PEDAGOGYFORM,
  UPPERSECONDARY_PEDAGOGYFORM,
} from "../helpers";

/**
 * PedagogyToolbarProps
 */
interface PedagogyToolbarProps {
  showPDF: boolean;
  setShowPDF: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Render wizard toolbar
 *
 * @param props PedagogyToolbarProps
 * @returns JSX.Element
 */
const PedagogyToolbar = (props: PedagogyToolbarProps) => {
  const { showPDF, setShowPDF } = props;
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);

  const {
    loading,
    changedFields,
    editIsActive,
    editingDisabled,
    toggleEditIsActive,
    updatePedagogyFormExtraDetails,
    saveAllData,
    userRole,
    activatePedagogyForm,
    toolbarLogic,
    pedagogyForm,
    togglePublishPedagogyForm,
  } = usePedagogyToolbarLogic();

  /**
   * Handle PDF click. Toggles showPDF state.
   */
  const handlePDFClick = () => {
    setShowPDF(!showPDF);
  };

  /**
   * Handle edit click. Toggles editIsActive state.
   */
  const handleEditClick = () => toggleEditIsActive(!editIsActive);

  /**
   * Handle extra details change
   *
   * @param e e
   */
  const handleExtraDetailsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => updatePedagogyFormExtraDetails(e.target.value);

  /**
   * Handle save with extra details click. Updates all data to server.
   */
  const handleSave = () => saveAllData();

  /**
   * Handle cancel save with extra details click. Resets extra details.
   */
  const handleCancelSaveWithExtraDetailsClick = () =>
    updatePedagogyFormExtraDetails("");

  // If user role is STUDENT or STUDENT_PARENT, don't show the toolbar
  if (userRole === "STUDENT" || userRole === "STUDENT_PARENT") {
    return null;
  }

  // Form exists, show edit/save controls
  return (
    <div className="pedagogy-form__toolbar">
      <div className="pedagogy-form__toolbar-primary">
        {editIsActive ? (
          <>
            {toolbarLogic.hasAnyChanges ? (
              <WarningDialog
                onApproveClick={handleEditClick}
                title={t("labels.unsavedWarning", {
                  ns: "pedagogySupportPlan",
                })}
                content={
                  <p>
                    {t("content.unsavedWarning", {
                      ns: "pedagogySupportPlan",
                    })}
                  </p>
                }
              >
                <Button buttonModifiers={["cancel"]}>
                  {t("actions.cancel", { ns: "common" })}
                </Button>
              </WarningDialog>
            ) : (
              <Button buttonModifiers={["cancel"]} onClick={handleEditClick}>
                {t("actions.cancel", { ns: "common" })}
              </Button>
            )}

            {/* If form exists and there are changes, show save with extra details dialog */}
            {toolbarLogic.shouldShowSaveWithExtraDetails ? (
              <SaveWithExtraDetailsDialog
                changedFields={changedFields}
                onSaveClick={handleSave}
                onCancelClick={handleCancelSaveWithExtraDetailsClick}
                onExtraDetailsChange={handleExtraDetailsChange}
              >
                <Button
                  buttonModifiers={["success"]}
                  disabled={!toolbarLogic.hasAnyChanges}
                >
                  {t("actions.save", { ns: "common" })}
                </Button>
              </SaveWithExtraDetailsDialog>
            ) : (
              <Button
                onClick={handleSave}
                buttonModifiers={["success"]}
                disabled={!toolbarLogic.hasAnyChanges}
              >
                {t("actions.save", { ns: "common" })}
              </Button>
            )}
          </>
        ) : (
          <Button
            buttonModifiers={["fatal", "standard-ok"]}
            onClick={handleEditClick}
            disabled={editingDisabled}
          >
            {t("actions.edit", { ns: "common" })}
          </Button>
        )}
      </div>

      <div className="pedagogy-form__toolbar-secondary">
        {toolbarLogic.canTogglePDF ? (
          <Button
            buttonModifiers={["info"]}
            disabled={loading}
            onClick={handlePDFClick}
          >
            {showPDF
              ? t("actions.closePDF", { ns: "common" })
              : t("actions.openPDF", { ns: "common" })}
          </Button>
        ) : null}

        {toolbarLogic.canActivateForm && (
          <Button buttonModifiers={["success"]} onClick={activatePedagogyForm}>
            {t("actions.activate", { ns: "common" })}
          </Button>
        )}

        {toolbarLogic.canTogglePublishForm && pedagogyForm && (
          <Button
            buttonModifiers={["execute"]}
            disabled={editIsActive}
            onClick={togglePublishPedagogyForm}
          >
            {pedagogyForm.published
              ? t("actions.unpublish", {
                  ns: "pedagogySupportPlan",
                })
              : t("actions.publish", {
                  ns: "pedagogySupportPlan",
                })}
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * usePedagogyToolbarLogic
 *
 * Custom hook that provides logic for the pedagogy toolbar
 */
export const usePedagogyToolbarLogic = () => {
  const usePedagogyValues = usePedagogyContext();

  const {
    changedFields,
    editIsActive,
    userRole,
    implementedActionsHaveChanged,
    pedagogyFormExists,
    editingDisabled,
    studyProgrammeName,
  } = usePedagogyValues;

  const toolbarLogic = useMemo(() => {
    // Check if there are changes to the main form
    const hasMainFormChanges = changedFields.length > 0;

    return {
      // Can show PDF if:
      // 1. User role is SPECIAL_ED_TEACHER
      // 2. Form exists (either pedagogyForm or formData)
      // 3. Edit is not active
      canTogglePDF:
        userRole === "SPECIAL_ED_TEACHER" &&
        pedagogyFormExists &&
        !editIsActive,
      // If form doesn't exist and user role is SPECIAL_ED_TEACHER, show activate button
      canActivateForm:
        !pedagogyFormExists &&
        userRole === "SPECIAL_ED_TEACHER" &&
        [...UPPERSECONDARY_PEDAGOGYFORM, ...COMPULSORY_PEDAGOGYFORM].includes(
          studyProgrammeName
        ),
      // If form exists and user role is SPECIAL_ED_TEACHER, show toggle publish button
      canTogglePublishForm:
        pedagogyFormExists && userRole === "SPECIAL_ED_TEACHER",
      hasMainFormChanges,
      hasAnyChanges: hasMainFormChanges || implementedActionsHaveChanged,
      shouldShowSaveWithExtraDetails: pedagogyFormExists && hasMainFormChanges,
      editingDisabled,
    };
  }, [
    changedFields.length,
    userRole,
    pedagogyFormExists,
    editIsActive,
    studyProgrammeName,
    implementedActionsHaveChanged,
    editingDisabled,
  ]);

  return {
    toolbarLogic,
    ...usePedagogyValues,
  };
};

export default PedagogyToolbar;
