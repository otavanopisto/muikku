import * as React from "react";
import { Visibility } from "~/@types/pedagogy-form";
import VisibilityAndApprovalDialog from "./dialogs/visibility-and-approval";
import VisibilityDialog from "./dialogs/visibility";
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
    visibility,
    formIsApproved,
    changedFields,
    editIsActive,
    resetData,
    setVisibility,
    setFormIsApproved,
    setExtraDetails,
    setEditIsActive,
    approveForm,
    updateFormData,
    updateVisibility,
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
   * Handle visibility permissions change
   *
   * @param e e
   */
  const handleVisibilityPermissionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVisibility = [...visibility];

    const value = e.target.value as Visibility;

    if (newVisibility.includes(value)) {
      const index = newVisibility.indexOf(value);
      if (index > -1) {
        newVisibility.splice(index, 1);
      }
    } else {
      newVisibility.push(value);
    }

    setVisibility(newVisibility);
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
                  buttonModifiers={["wizard"]}
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
        return null;
    }
  }

  switch (data.state) {
    case "PENDING":
      return (
        <div className="pedagogy-form__toolbar">
          <VisibilityAndApprovalDialog
            formIsApproved={formIsApproved}
            visibility={visibility}
            saveButtonDisabled={!formIsApproved}
            onSaveClick={approveForm}
            onApproveChange={handleApproveValueChange}
            onVisibilityChange={handleVisibilityPermissionChange}
          >
            <Button buttonModifiers={["info"]}>Hyväksy lomake</Button>
          </VisibilityAndApprovalDialog>
        </div>
      );
    case "APPROVED":
      return (
        <div className="pedagogy-form__toolbar">
          <Button
            buttonModifiers={["cancel"]}
            disabled={loading}
            onClick={handlePDFClick}
          >
            {showPDF ? "Sulje PDF" : "PDF"}
          </Button>

          <div
            style={{
              borderLeft: "2px solid #00000038",
              height: "25px",
              margin: "0 5px",
            }}
          />

          <VisibilityDialog
            visibility={visibility}
            onVisibilityChange={handleVisibilityPermissionChange}
            onSaveClick={updateVisibility}
          >
            <Button buttonModifiers={["info"]} disabled={showPDF}>
              Muuta jako-oikeuksia
            </Button>
          </VisibilityDialog>
        </div>
      );

    default:
      return null;
  }
};

export default PedagogyToolbar;
