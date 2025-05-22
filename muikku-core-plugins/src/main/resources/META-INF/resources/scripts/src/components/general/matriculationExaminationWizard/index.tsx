import * as React from "react";
import { Step1, Step2, Step3, Step4, Step5 } from "./steps";
import { connect } from "react-redux";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/matriculation.scss";
import Wizard, { WizardStep } from "~/components/general/wizard";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { MatriculationProvider } from "./context/matriculation-context";
import { useMatriculation } from "./hooks/use-matriculation";
import MatriculationWizardHeader from "./matriculation-wizard-header";
import MatriculationWizardFooter from "./matriculation-wizard-footer";
import { MatriculationFormType } from "~/@types/shared";
import { HopsState } from "~/reducers/hops";
import Button from "../button";
import { bindActionCreators } from "redux";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import AnimatedStep from "../wizard/AnimateStep";
import { MatriculationExam } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * MatriculationExaminationWizardProps
 */
interface MatriculationExaminationWizardProps {
  hops: HopsState;
  exam: MatriculationExam;
  compulsoryEducationEligible: boolean;
  onClose?: () => void;
  onUpdateExam?: (examId: number) => void;
  formType: MatriculationFormType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * MatriculationExaminationWizard
 * @param props props
 */
const MatriculationExaminationWizard = (
  props: MatriculationExaminationWizardProps
) => {
  const {
    compulsoryEducationEligible,
    exam,
    hops,
    onClose,
    onUpdateExam,
    displayNotification,
    formType,
  } = props;

  const { t } = useTranslation(["common", "hops_new"]);

  const useMatriculationValues = useMatriculation(
    exam,
    hops.currentStudentIdentifier,
    compulsoryEducationEligible,
    displayNotification,
    formType
  );

  const previousStep = React.useRef<number>(0);

  /**
   * Handles step change. Fires submit if last step
   * @param step step
   */
  const handleStepChange = (step: WizardStep) => {
    if (step.index === steps.length - 1) {
      if (useMatriculationValues.matriculation.saveState === "IN_PROGRESS") {
        return;
      }

      // Submit form. On success, call onDone (close dialog) and update exam
      useMatriculationValues.onMatriculationFormSubmit();
    }
  };

  /**
   * StepZilla steps
   */
  const steps: WizardStep[] = [
    {
      index: 0,
      name: t("labels.matriculationFormStudentInfoTitle", { ns: "hops_new" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step1 />
        </AnimatedStep>
      ),
    },
    {
      index: 1,
      name: t("labels.matriculationFormRegistrationTitle", { ns: "hops_new" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step2 />
        </AnimatedStep>
      ),
    },
    {
      index: 2,
      name: t("labels.matriculationFormActTitle", { ns: "hops_new" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step3 />
        </AnimatedStep>
      ),
    },
    {
      index: 3,
      name: t("labels.matriculationFormSummaryTitle", { ns: "hops_new" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step4 />
        </AnimatedStep>
      ),
    },
    {
      index: 4,
      name: t("labels.matriculationFormCompleteTitle", { ns: "hops_new" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step5 formType={props.formType} />
        </AnimatedStep>
      ),
    },
  ];

  const { ...useWizardValues } = useWizard({
    preventNextIfInvalid: true,
    steps: steps,
    onStepChange: handleStepChange,
    preventStepperNavigation: true,
  });

  const footer = (
    <MatriculationWizardFooter
      secondLastButtonText={
        props.formType === "initial" ? t("actions.send") : t("actions.save")
      }
      lastStepButton={
        <Button
          onClick={() => {
            onUpdateExam(exam.id);
            onClose();
          }}
          buttonModifiers={["info"]}
          disabled={
            !(
              useMatriculationValues.matriculation.saveState === "SUCCESS" ||
              useMatriculationValues.matriculation.saveState === "FAILED"
            )
          }
        >
          Sulje
        </Button>
      }
    />
  );

  return (
    <MatriculationProvider value={useMatriculationValues}>
      <WizardProvider value={useWizardValues}>
        <Wizard
          modifiers={["matriculation-exam-form"]}
          header={<MatriculationWizardHeader />}
          footer={footer}
          wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
        />
      </WizardProvider>
    </MatriculationProvider>
  );
};

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationExaminationWizard);
