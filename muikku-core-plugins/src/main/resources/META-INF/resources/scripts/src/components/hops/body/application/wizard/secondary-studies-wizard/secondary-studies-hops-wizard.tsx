import { AnimatePresence } from "framer-motion";
import React, { useCallback, useMemo } from "react";
import Wizard, { WizardStep } from "~/components/general/wizard";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { Step1, Step2, Step3, Step4, Step6, Step5 } from "./steps";
import HopsWizardFooter from "../hops-wizard-footer";
import HopsWizardHeader from "../hops-wizard-header";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import { SecondaryStudiesHops } from "~/@types/hops";
import AnimatedStep from "~/components/general/wizard/AnimateStep";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  LoadMoreHopsFormHistoryTriggerType,
  loadMoreHopsFormHistory,
  updateHopsEditing,
  UpdateHopsEditingTriggerType,
} from "~/actions/main-function/hops/";
// eslint-disable-next-line camelcase
import { HopsState } from "~/reducers/hops";
import { AppDispatch } from "~/reducers/configureStore";

type FormType = "BACKGROUND" | "POST_GRADUATE_PLAN";

/**
 * Props for the CompulsoryStudiesHopsWizard component
 */
interface SecondaryStudiesHopsWizardProps {
  hops: HopsState;
  /** The form data for secondary studies HOPS */
  formType: FormType;
  /** Whether the HOPS form can load more history */
  hopsFormCanLoadMoreHistory: boolean;
  /** Function to handle unsaved changes */
  onHasUnsavedChanges?: (hasUnsavedChanges: boolean) => void;
  /** Function to update the HOPS editing state */
  updateHopsEditing: UpdateHopsEditingTriggerType;
  /** Redux thunk function to load more HOPS form history */
  loadMoreHopsFormHistory: LoadMoreHopsFormHistoryTriggerType;
}

/**
 * SecondaryStudiesHopsWizard
 *
 * @param props - The props for the component
 * @returns JSX.Element
 */
const SecondaryStudiesHopsWizard: React.FC<SecondaryStudiesHopsWizardProps> = (
  props
) => {
  const {
    hops,
    formType,
    hopsFormCanLoadMoreHistory,
    updateHopsEditing,
    loadMoreHopsFormHistory,
  } = props;
  const previousStep = React.useRef<number>(0);

  const { t } = useTranslation(["common"]);

  const formData = useMemo(() => {
    if (!hops.hopsForm || !hops.hopsEditing.hopsForm) {
      return null;
    }

    if (hops.hopsMode === "READ") {
      return hops.hopsForm as SecondaryStudiesHops;
    }

    return hops.hopsEditing.hopsForm as SecondaryStudiesHops;
  }, [hops]);

  /**
   * Handles changes to the form data
   * @param updatedForm - The updated form data
   */
  const handleFormChange = useCallback(
    (updatedForm: SecondaryStudiesHops) => {
      updateHopsEditing({
        updates: {
          hopsForm: updatedForm,
        },
      });
    },
    [updateHopsEditing]
  );

  const steps: WizardStep[] = useMemo(
    () =>
      formType === "BACKGROUND"
        ? [
            {
              index: 0,
              name: t("labels.hopsFormInfoTitle", { ns: "hops_new" }),
              component: (
                <AnimatedStep previousStep={previousStep}>
                  <Step1
                    studentName={`${hops.studentInfo.firstName} ${hops.studentInfo.lastName}`}
                    educationalLevel={
                      hops.studentInfo.studyProgrammeEducationType
                    }
                    guidanceCounselors={hops.studentInfo.counselorList}
                    canLoadMoreHistory={hopsFormCanLoadMoreHistory}
                    loadMoreHopsEvents={loadMoreHopsFormHistory}
                  />
                </AnimatedStep>
              ),
            },
            {
              index: 1,
              name: t("labels.hopsFormEntryLevelAssessmentTitle", {
                ns: "hops_new",
              }),
              component: (
                <AnimatedStep previousStep={previousStep}>
                  <Step2
                    disabled={hops.hopsMode === "READ"}
                    form={formData}
                    onFormChange={handleFormChange}
                  />
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
                  <Step3
                    disabled={hops.hopsMode === "READ"}
                    form={formData}
                    onFormChange={handleFormChange}
                  />
                </AnimatedStep>
              ),
            },
          ]
        : [
            {
              index: 0,
              name: t("labels.hopsFormPostgraduateFuturePlansTitle", {
                ns: "hops_new",
              }),
              component: (
                <AnimatedStep previousStep={previousStep}>
                  <Step4
                    disabled={hops.hopsMode === "READ"}
                    form={formData}
                    onFormChange={handleFormChange}
                  />
                </AnimatedStep>
              ),
            },
            {
              index: 1,
              name: t("labels.hopsFormPostgraduateStrengthsAndGoalsTitle", {
                ns: "hops_new",
              }),
              component: (
                <AnimatedStep previousStep={previousStep}>
                  <Step5
                    disabled={hops.hopsMode === "READ"}
                    form={formData}
                    onFormChange={handleFormChange}
                  />
                </AnimatedStep>
              ),
            },
            {
              index: 2,
              name: t("labels.hopsFormPostgraduateFurtherStudies", {
                ns: "hops_new",
              }),
              component: (
                <AnimatedStep previousStep={previousStep}>
                  <Step6
                    disabled={hops.hopsMode === "READ"}
                    form={formData}
                    onFormChange={handleFormChange}
                  />
                </AnimatedStep>
              ),
            },
          ],
    [
      formType,
      t,
      hops,
      hopsFormCanLoadMoreHistory,
      loadMoreHopsFormHistory,
      formData,
      handleFormChange,
    ]
  );

  const wizardValue = useWizard({ steps, preventNextIfInvalid: false });

  return (
    <WizardProvider value={wizardValue}>
      <div className="hops-form">
        <div className="hops-form__container">
          <Wizard
            header={<HopsWizardHeader />}
            footer={<HopsWizardFooter />}
            wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
          />
        </div>
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
    hops: state.hopsNew,
    form: state.hopsNew.hopsForm,
    editingForm: state.hopsNew.hopsEditing.hopsForm,
    studentInfo: state.hopsNew.studentInfo,
    hopsFormCanLoadMoreHistory: state.hopsNew.hopsFormCanLoadMoreHistory,
  };
}

/**
 * Maps dispatch functions to component props
 * @param dispatch - The Redux dispatch function
 * @returns An object with the mapped dispatch functions
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { updateHopsEditing, loadMoreHopsFormHistory },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecondaryStudiesHopsWizard);
