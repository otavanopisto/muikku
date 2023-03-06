import * as React from "react";
import Button from "../button";
import { usePedagogy } from "./hooks/usePedagogy";
import { Step1, Step2, Step3, Step4, Step5, Step6 } from "./steps";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import VisibilityAndApprovalDialog from "./dialogs/visibility-and-approval";
import VisibilityDialog from "./dialogs/visibility";
import { FormData, Visibility } from "./types/index";
import SaveWithExtraDetailsDialog from "./dialogs/save-with-extra-details";
import WarningDialog from "./dialogs/warning";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StepZilla = require("react-stepzilla").default;

/**
 * The props for the UpperSecondaryPedagogicalSupportForm component.
 */
interface UpperSecondaryPedagogicalSupportFormProps {
  useCase: "STUDENT" | "GUIDER";
  studentId: string;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

export const PedagogyContext = React.createContext<{
  useCase: "STUDENT" | "GUIDER";
  editIsActive: boolean;
}>({ useCase: "STUDENT", editIsActive: false });

/**
 * UpperSecondaryPedagogicalSupportForm
 * @param props props
 * @returns JSX.Element
 */
const UpperSecondaryPedagogicalSupportForm: React.FC<
  UpperSecondaryPedagogicalSupportFormProps
> = (props) => {
  const {
    loading,
    data,
    formData,
    visibility,
    formIsApproved,
    changedFields,
    resetData,
    setUpdatedFormData,
    setVisibilityValue,
    setFormApproveValue,
    setExtraDetailsValue,
    activateForm,
    sendToStudent,
    approveForm,
    updateFormData,
    updateVisibility,
  } = usePedagogy(props.studentId, props.displayNotification);
  const [editIsActive, setEditIsActive] = React.useState(false);

  /**
   * Handle edit click
   */
  const handleEditClick = () => {
    setEditIsActive(!editIsActive);
  };

  /**
   * Handle form data change
   *
   * @param updatedFormData updatedFormData
   */
  const handleFormDataChange = (updatedFormData: FormData) => {
    setUpdatedFormData(updatedFormData);
  };

  /**
   * Handle form approve value change
   *
   * @param e e
   */
  const handleApproveValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setFormApproveValue(value);
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

    setVisibilityValue(newVisibility);
  };

  /**
   * Handle extra details change
   *
   * @param e e
   */
  const handleExtraDetailsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    setExtraDetailsValue(value);
  };

  /**
   * Handle update form data click
   */
  const handleSaveWithExtraDetailsClick = () => {
    unstable_batchedUpdates(() => {
      setEditIsActive(false);
      updateFormData();
    });
  };

  /**
   * Handle cancel save with extra details click
   */
  const handleCancelSaveWithExtraDetailsClick = () => {
    setExtraDetailsValue("");
  };

  /**
   * Default steps
   */
  const steps = [
    {
      name: "Perustiedot",
      component: <Step1 pedagogyData={data} status={props.status} />,
    },
    {
      name: "Asiakirja",
      component: (
        <Step2
          pedagogyData={data}
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      name: "Pedagogisen tuen tarve",
      component: (
        <Step3
          pedagogyData={data}
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      name: "Toteutetut tukitoimet",
      component: (
        <Step4
          pedagogyData={data}
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      name: "Tuen seuranta ja arviointi",
      component: (
        <Step5
          pedagogyData={data}
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      ),
    },
    {
      name: "Luvat ja hyväksyminen",
      component: (
        <Step6 formIsApproved={formIsApproved} visibility={visibility} />
      ),
    },
  ];

  // Remove last step if use case is student
  if (props.useCase === "STUDENT") {
    steps.pop();
  }

  /**
   * renderWizardToolbar
   * @returns JSX.Element
   */
  const renderWizardToolbar = () => {
    if (props.useCase === "GUIDER" && data) {
      switch (data.state) {
        case "ACTIVE":
          return (
            <div
              className="wizard__toolbar"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button buttonModifiers={["execute"]} onClick={sendToStudent}>
                Lähetä
              </Button>
            </div>
          );
        case "PENDING":
        case "APPROVED":
          return (
            <div
              className="wizard__toolbar"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                  Tallenna muokkaukset
                </Button>
              </SaveWithExtraDetailsDialog>

              {editIsActive ? (
                changedFields.length > 0 ? (
                  <WarningDialog
                    onApproveClick={resetData}
                    title="Tallentamattomat muutokset"
                    content={
                      <p>
                        Sinulla on tallentamattomia muutoksia. Haluatko varmasti
                        peruuttaa muokkauksen
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
                )
              ) : (
                <Button
                  buttonModifiers={["fatal", "standard-ok"]}
                  onClick={handleEditClick}
                >
                  Muokkaa
                </Button>
              )}
            </div>
          );

        default:
          return null;
      }
    } else if (props.useCase === "STUDENT" && data) {
      switch (data.state) {
        case "PENDING":
          return (
            <div
              className="wizard__toolbar"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
            <div
              className="wizard__toolbar"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VisibilityDialog
                visibility={visibility}
                onVisibilityChange={handleVisibilityPermissionChange}
                onSaveClick={updateVisibility}
              >
                <Button buttonModifiers={["info"]}>Muuta jako-oikeuksia</Button>
              </VisibilityDialog>
            </div>
          );

        default:
          return null;
      }
    }
    return null;
  };

  return (
    <PedagogyContext.Provider value={{ useCase: props.useCase, editIsActive }}>
      <div className="wizard">
        {renderWizardToolbar()}

        <div className="wizard_container">
          {loading ? (
            <OverlayComponent>
              <div style={{ height: "fit-content" }}>
                <div className="loader-empty" />
              </div>
            </OverlayComponent>
          ) : null}

          {data && data.state === "INACTIVE" ? (
            <OverlayComponent>
              <div style={{ height: "fit-content" }}>
                {props.useCase === "STUDENT" ? (
                  <p>
                    Tukilomaketta ei ole aktivoitu, ole yhteydessä
                    erityisopettajaasi
                  </p>
                ) : (
                  <Button onClick={activateForm}>Aktivoi</Button>
                )}
              </div>
            </OverlayComponent>
          ) : null}

          <StepZilla
            steps={steps}
            dontValidate={false}
            preventEnterSubmission={true}
            showNavigation={true}
            showSteps={true}
            prevBtnOnLastStep={true}
            nextButtonCls="button button--wizard"
            backButtonCls="button button--wizard"
            nextButtonText="Seuraava"
            backButtonText="Edellinen"
          />
        </div>
      </div>
    </PedagogyContext.Provider>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {
    displayNotification,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpperSecondaryPedagogicalSupportForm);

/**
 * OverlayComponentProsp
 */
interface OverlayComponentProsp {}

/**
 * OverlayComponent
 * @param props props
 * @returns JSX.Element
 */
const OverlayComponent: React.FC<OverlayComponentProsp> = (props) => (
  <div
    style={{
      position: "absolute",
      height: "100%",
      top: 0,
      backgroundColor: "#ffffffbd",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {props.children}
  </div>
);

export const formFieldsWithTranslation: { [key: string]: string } = {
  authorOfDocument: "Asiakirjan laatija",
  documentParticipants: "Asiakirjan laatimiseen osallistuneet",
  cooperativePartners: "Yhteistyötahot",
  studentStrengths: "Opiskelijan vahvuudet",
  supportReasonsOptions: "Pedagogisen tuen perusteet",
  supportReasonOther: "Pedagogisen tuen perusteet - Muu peruste?",
  supportActions: "Suunniteltut tukitoimet",
  supportActionOther: "Suunniteltut tukitoimet - Muu toimenpide?",
  matriculationExaminationSupport:
    "Ennakko suunnitelma ylioppilaskirjoituksiin",
  matriculationExaminationSupportOther:
    "Ennakko suunnitelma ylioppilaskirjoituksiin - Muu toimenpide?",
  studentOpinionOfSupport: "Opiskelijan näkemys",
  schoolOpinionOfSupport: "Lukion näkemys tuen vaikuttavuudesta",
};
