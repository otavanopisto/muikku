import { AnimatePresence } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
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
import _ from "lodash";
import {
  SaveHopsFormTriggerType,
  saveHopsForm,
  LoadMoreHopsFormHistoryTriggerType,
  loadMoreHopsFormHistory,
} from "~/actions/main-function/hops/";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { compulsoryStudiesFieldsTranslation } from "../helpers";

/**
 * Props for the CompulsoryStudiesHopsWizard component
 */
interface CompulsoryStudiesHopsWizardProps {
  /** The form data for compulsory studies HOPS */
  form: CompulsoryStudiesHops;
  /** Information about the student */
  studentInfo: StudentInfo;
  /** Whether the HOPS form can load more history */
  hopsFormCanLoadMoreHistory: boolean;
  /** Function to handle unsaved changes */
  onHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
  /** Redux thunk function to save the HOPS form */
  saveHopsForm: SaveHopsFormTriggerType;
  /** Redux thunk function to load more Hops events */
  loadMoreHopsFormHistory: LoadMoreHopsFormHistoryTriggerType;
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
  const {
    form,
    studentInfo,
    hopsFormCanLoadMoreHistory,
    onHasUnsavedChanges,
    saveHopsForm,
    loadMoreHopsFormHistory,
  } = props;
  const previousStep = React.useRef<number>(0);

  const { t } = useTranslation(["common"]);

  const [localForm, setLocalForm] = useState<CompulsoryStudiesHops>(form);
  const [isFormSaveDialogOpen, setIsFormSaveDialogOpen] =
    useState<boolean>(false);
  const [hopsUpdateDetails, setHopsUpdateDetails] = useState<string>("");
  const [changedFields, setChangedFields] = useState<string[]>([]);

  React.useEffect(() => {
    if (_.isEqual(form, localForm)) {
      onHasUnsavedChanges(false);
    } else {
      onHasUnsavedChanges(true);
    }
  }, [form, localForm, onHasUnsavedChanges]);

  /**
   * Handles changes to the form data
   * @param updatedForm - The updated form data
   */
  const handleFormChange = React.useCallback(
    (updatedForm: CompulsoryStudiesHops) => {
      // Get old values from data
      const oldDataForm = {
        ...form,
      };

      const changedValuesComparedToPrevious = Object.keys(updatedForm).filter(
        (key: keyof CompulsoryStudiesHops) => {
          if (typeof updatedForm[key] !== "object") {
            return updatedForm[key] !== oldDataForm[key];
          }
        }
      );

      const previousStudiesHasChanged = !_.isEqual(
        updatedForm.previousLanguageExperience,
        oldDataForm.previousLanguageExperience
      );

      if (previousStudiesHasChanged) {
        changedValuesComparedToPrevious.push("previousLanguageExperience");
      }

      unstable_batchedUpdates(() => {
        setChangedFields(changedValuesComparedToPrevious);
        setLocalForm((previousForm) => ({ ...previousForm, ...updatedForm }));
      });
    },
    [form]
  );

  /**
   * Opens the save dialog
   */
  const handleOpenSaveDialog = () => {
    setIsFormSaveDialogOpen(true);
  };

  /**
   * Handles the form submission
   */
  const handleFormSubmitClick = () => {
    saveHopsForm({
      form: localForm,
      details: hopsUpdateDetails,
      fields: changedFields.length > 0 ? changedFields.join(",") : undefined,
    });
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

  // Define the wizard steps
  const steps: WizardStep[] = useMemo(
    () => [
      {
        index: 0,
        name: t("labels.hopsFormInfoTitle", { ns: "hops_new" }),
        component: (
          <AnimatedStep previousStep={previousStep}>
            <Step1
              studentName={`${studentInfo.firstName} ${studentInfo.lastName}`}
              educationalLevel={studentInfo.studyProgrammeEducationType}
              guidanceCounselors={studentInfo.counselorList}
              canLoadMoreHistory={hopsFormCanLoadMoreHistory}
              loadMoreHopsEvents={loadMoreHopsFormHistory}
            />
          </AnimatedStep>
        ),
      },
      {
        index: 1,
        name: t("labels.hopsFormEntryLevelAssessmentTitle", { ns: "hops_new" }),
        component: (
          <AnimatedStep previousStep={previousStep}>
            <Step2 form={localForm} onFormChange={handleFormChange} />
          </AnimatedStep>
        ),
      },
      {
        index: 2,
        name: t("labels.hopsFormStudySkillsAndMotivationTitle", {
          ns: "hops_new",
        }),
        component: (
          <AnimatedStep previousStep={previousStep}>
            <Step3 form={localForm} onFormChange={handleFormChange} />
          </AnimatedStep>
        ),
      },
    ],
    [
      t,
      studentInfo.firstName,
      studentInfo.lastName,
      studentInfo.studyProgrammeEducationType,
      studentInfo.counselorList,
      hopsFormCanLoadMoreHistory,
      loadMoreHopsFormHistory,
      localForm,
      handleFormChange,
    ]
  );

  const wizardValue = useWizard({
    steps,
    preventNextIfInvalid: false,
  });

  return (
    <WizardProvider value={wizardValue}>
      <div className="hops-form">
        <div className="hops-form__container">
          <Wizard
            header={<HopsWizardHeader />}
            footer={
              <HopsWizardFooter
                externalContentRight={
                  <Button
                    buttonModifiers={["info"]}
                    onClick={handleOpenSaveDialog}
                    disabled={_.isEqual(form, localForm)}
                  >
                    {t("actions.save", { ns: "common" })}
                  </Button>
                }
              />
            }
            wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
          />
        </div>
        <NewHopsEventDescriptionDialog
          isOpen={isFormSaveDialogOpen}
          content={
            <div className="hops-container__row">
              {changedFields.length > 0 && (
                <div className="hops__form-element-container">
                  <h4>
                    {t("labels.editedFields", {
                      ns: "pedagogySupportPlan",
                    })}
                  </h4>
                  <ul>
                    {changedFields.map((fieldKey, i) => (
                      <li key={fieldKey} style={{ display: "list-item" }}>
                        {compulsoryStudiesFieldsTranslation(t)[fieldKey]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
    hopsFormCanLoadMoreHistory: state.hopsNew.hopsFormCanLoadMoreHistory,
  };
}

/**
 * Maps dispatch functions to component props
 * @param dispatch - The Redux dispatch function
 * @returns An object with the mapped dispatch functions
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { saveHopsForm, loadMoreHopsFormHistory },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompulsoryStudiesHopsWizard);
