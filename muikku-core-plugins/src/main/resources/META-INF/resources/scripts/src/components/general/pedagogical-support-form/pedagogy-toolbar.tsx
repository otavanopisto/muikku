import * as React from "react";
import ApprovalDialog from "./dialogs/approval";
import SaveWithExtraDetailsDialog from "./dialogs/save-with-extra-details";
import WarningDialog from "./dialogs/warning";
import Button from "../button";
import { usePedagogyContext } from "./context/pedagogy-context";

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

  const usePedagogyValues = usePedagogyContext();

  const {
    data,
    loading,
    formIsApproved,
    changedFields,
    editIsActive,
    resetData,
    setFormIsApproved,
    setExtraDetails,
    setEditIsActive,
    approveForm,
    updateFormData,
    userRole,
    activateForm,
  } = usePedagogyValues;

  if (!data) {
    return null;
  }

  /**
   * Handle PDF click. Toggles showPDF state.
   */
  const handlePDFClick = () => {
    setShowPDF(!showPDF);
  };

  /**
   * Handle edit click. Toggles editIsActive state.
   */
  const handleEditClick = () => setEditIsActive(!editIsActive);

  /**
   * Handle form approve value change
   *
   * @param e e
   */
  const handleApproveValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setFormIsApproved(value);
  };

  /**
   * Handle extra details change
   *
   * @param e e
   */
  const handleExtraDetailsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => setExtraDetails(e.target.value);

  /**
   * Handle save with extra details click. Updates form data to server.
   */
  const handleSaveWithExtraDetailsClick = () => updateFormData();

  /**
   * Handle cancel save with extra details click. Resets extra details.
   */
  const handleCancelSaveWithExtraDetailsClick = () => setExtraDetails("");

  if (userRole !== "STUDENT") {
    switch (data.state) {
      case "INACTIVE":
        return userRole === "SPECIAL_ED_TEACHER" ? (
          <div className="pedagogy-form__toolbar">
            <Button buttonModifiers={["success"]} onClick={activateForm}>
              Aktivoi
            </Button>
          </div>
        ) : null;
      case "ACTIVE":
      case "PENDING":
      case "APPROVED":
        return (
          <div className="pedagogy-form__toolbar">
            <div className="pedagogy-form__toolbar-primary">
              {editIsActive ? (
                <>
                  {changedFields.length > 0 ? (
                    <WarningDialog
                      onApproveClick={resetData}
                      title="Tallentamattomat muutokset"
                      content={
                        <p>
                          Sinulla on tallentamattomia muutoksia. Haluatko
                          varmasti peruuttaa muokkauksen
                        </p>
                      }
                    >
                      <Button buttonModifiers={["cancel"]}>Peruuta</Button>
                    </WarningDialog>
                  ) : (
                    <Button
                      buttonModifiers={["cancel"]}
                      onClick={handleEditClick}
                    >
                      Peruuta
                    </Button>
                  )}

                  <SaveWithExtraDetailsDialog
                    changedFields={changedFields}
                    onSaveClick={handleSaveWithExtraDetailsClick}
                    onCancelClick={handleCancelSaveWithExtraDetailsClick}
                    onExtraDetailsChange={handleExtraDetailsChange}
                  >
                    <Button
                      buttonModifiers={["success"]}
                      disabled={!editIsActive && changedFields.length === 0}
                    >
                      Tallenna
                    </Button>
                  </SaveWithExtraDetailsDialog>
                </>
              ) : (
                <Button
                  buttonModifiers={["fatal", "standard-ok"]}
                  onClick={handleEditClick}
                >
                  Muokkaa
                </Button>
              )}
            </div>

            {userRole === "SPECIAL_ED_TEACHER" ? (
              <div className="pedagogy-form__toolbar-secondary">
                <Button
                  buttonModifiers={["info"]}
                  disabled={loading}
                  onClick={handlePDFClick}
                >
                  {showPDF ? "Sulje PDF" : "PDF"}
                </Button>
              </div>
            ) : null}
          </div>
        );

      default:
        return <></>;
    }
  }

  switch (data.state) {
    case "PENDING":
      return (
        <div className="pedagogy-form__toolbar">
          <ApprovalDialog
            formIsApproved={formIsApproved}
            saveButtonDisabled={!formIsApproved}
            onSaveClick={approveForm}
            onApproveChange={handleApproveValueChange}
          >
            <Button buttonModifiers={["info"]}>Hyväksy lomake</Button>
          </ApprovalDialog>
        </div>
      );

    default:
      return <></>;
  }
};

export default PedagogyToolbar;
