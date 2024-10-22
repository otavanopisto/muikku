import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import Button from "~/components/general/button";
import { Textarea } from "~/components/general/hops-compulsory-education-wizard/text-area";
import Wizard, { WizardStep } from "~/components/general/wizard";
import AnimatedStep from "~/components/general/wizard/AnimateStep";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { StudentInfo } from "~/generated/client";
import { StateType } from "~/reducers";

// Import your step components here
import { Step1, Step2, Step3 } from "./steps";
import HopsWizardFooter from "../hops-wizard-footer";
import HopsWizardHeader from "../hops-wizard-header";
import NewHopsEventDescriptionDialog from "../dialog/new-hops-event";
import { CompulsoryStudiesHops } from "~/@types/hops";

/**
 * Props for the CompulsoryStudiesHopsWizard component
 */
interface CompulsoryStudiesHopsWizardProps {
  /** The form data for compulsory studies HOPS */
  form: CompulsoryStudiesHops;
  /** Information about the student */
  studentInfo: StudentInfo;
}

/**
 * CompulsoryStudiesHopsWizard component
 *
 * This component renders a wizard for managing compulsory studies HOPS (Personal Study Plan).
 * It includes steps for basic information, skill assessment, and study motivation.
 *
 * @param props - The component props
 * @returns A React functional component
 */
const CompulsoryStudiesHopsWizard: React.FC<
  CompulsoryStudiesHopsWizardProps
> = (props) => {
  const { form, studentInfo } = props;
  const previousStep = React.useRef<number>(0);

  const { t } = useTranslation(["common"]);

  const [localForm, setLocalForm] = useState<CompulsoryStudiesHops>(form);
  const [isFormSaveDialogOpen, setIsFormSaveDialogOpen] =
    useState<boolean>(false);
  const [hopsUpdateDetails, setHopsUpdateDetails] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  /**
   * Handles changes to the form data
   * @param updatedForm - The updated form data
   */
  const handleFormChange = (updatedForm: CompulsoryStudiesHops) => {
    setLocalForm(updatedForm);
  };

  /**
   * Handles the form submission
   */
  const handleFormSubmitClick = () => {
    setIsFormSaveDialogOpen(true);
    setIsEditing(false);
  };

  /**
   * Opens the save dialog
   */
  const handleOpenSaveDialog = () => {
    setIsFormSaveDialogOpen(true);
  };

  /**
   * Cancels the save operation and closes the dialog
   */
  const handleCancelSaveClick = () => {
    setIsFormSaveDialogOpen(false);
  };

  /**
   * Handles changes to the HOPS update details
   * @param event - The change event from the textarea
   */
  const handleHopsUpdateDetailsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setHopsUpdateDetails(event.target.value);
  };

  /**
   * Toggles the editing mode
   */
  const handleToggleEditing = () => {
    setIsEditing((editing) => !editing);
  };

  // Define the wizard steps
  const steps: WizardStep[] = [
    {
      index: 0,
      name: "Perustiedot",
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step1
            studentName={`${studentInfo.firstName} ${studentInfo.lastName}`}
            educationalLevel={studentInfo.studyProgrammeEducationType}
            guidanceCounselors={studentInfo.counselorList}
          />
        </AnimatedStep>
      ),
    },
    {
      index: 1,
      name: "Osaamisen ja lähtötason arvointi",
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step2 form={localForm} onStartingLevelChange={handleFormChange} />
        </AnimatedStep>
      ),
    },
    {
      index: 2,
      name: "Opiskelutaidot ja motivaatio",
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step3
            form={localForm}
            onMotivationAndStudyChange={handleFormChange}
          />
        </AnimatedStep>
      ),
    },
  ];

  const wizardValue = useWizard({
    steps,
    preventNextIfInvalid: false,
  });

  return (
    <WizardProvider value={wizardValue}>
      <div className="hops-form">
        <div className="hops-form__toolbar">
          <Button buttonModifiers={["info"]} onClick={handleToggleEditing}>
            {isEditing ? "Peruuta" : "Muokkaa"}
          </Button>
          <Button
            buttonModifiers={["success"]}
            disabled={!isEditing}
            onClick={handleOpenSaveDialog}
          >
            {t("actions.save", { ns: "common" })}
          </Button>
        </div>
        <div className="hops-form__container">
          <Wizard
            header={<HopsWizardHeader />}
            footer={<HopsWizardFooter />}
            wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
          />
        </div>
        <NewHopsEventDescriptionDialog
          isOpen={isFormSaveDialogOpen}
          content={
            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <Textarea
                  id="hopsUpdateDetailsExplanation"
                  label="Vapaa kuvaus tapahtuman muutoksista"
                  className="form-element__textarea form-element__textarea--resize__vertically"
                  onChange={handleHopsUpdateDetailsChange}
                  value={hopsUpdateDetails}
                />
              </div>
            </div>
          }
          onSaveClick={handleFormSubmitClick}
          onCancelClick={handleCancelSaveClick}
        />
      </div>
    </WizardProvider>
  );
};

/**
 * Maps the Redux state to component props
 * @param state - The Redux state
 * @returns An object with the mapped props
 */
function mapStateToProps(state: StateType) {
  return {
    form: state.hopsNew.hopsForm,
    studentInfo: state.hopsNew.studentInfo,
  };
}

/**
 * Maps dispatch functions to component props
 * @param dispatch - The Redux dispatch function
 * @returns An object with the mapped dispatch functions
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompulsoryStudiesHopsWizard);
