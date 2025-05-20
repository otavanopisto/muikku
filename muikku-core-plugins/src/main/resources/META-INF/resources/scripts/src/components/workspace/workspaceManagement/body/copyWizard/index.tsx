import * as React from "react";
import { Step1, Step2 } from "./steps";
import Wizard, { WizardStep } from "~/components/general/wizard";
import "~/sass/elements/wizard.scss";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { useTranslation } from "react-i18next";
import {
  useWizardContext,
  WizardProvider,
} from "~/components/general/wizard/context/wizard-context";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import {
  useCopyWorkspaceWizardState,
  useCopyWorkspaceWizardLogic,
} from "./hooks/useCopyWorkspace";
import { Stepper, StepperItem } from "~/components/general/wizard/stepper";
import Button from "~/components/general/button";
import { AnimatePresence } from "framer-motion";
import AnimatedStep from "~/components/general/wizard/AnimateStep";

/**
 * CopyWorkspaceWizardProps
 */
interface CopyWorkspaceWizardProps {
  onDone: () => void;
}

/**
 * CopyWorkspaceWizard. Workspace copy wizard with predefined steps that
 * guides user through the process of copying a workspace.
 * @param props props
 */
const CopyWorkspaceWizard: React.FC<CopyWorkspaceWizardProps> = (props) => {
  const workspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );

  const { state, updateState } = useCopyWorkspaceWizardState(workspace);
  const { copyWorkspace } = useCopyWorkspaceWizardLogic(state, updateState);

  const { t } = useTranslation(["workspace", "common"]);

  const stepProps = {
    state,
    updateState,
    onDone: props.onDone,
  };

  const previousStep = React.useRef<number>(0);

  const steps: WizardStep[] = [
    {
      index: 0,
      name: t("labels.step1", { ns: "workspace" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step1 {...stepProps} />
        </AnimatedStep>
      ),
    },
    {
      index: 1,
      name: t("labels.step6", { ns: "workspace" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step2 {...stepProps} />
        </AnimatedStep>
      ),
    },
    {
      index: 2,
      name: t("labels.stepLast", { ns: "workspace" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step2 {...stepProps} />
        </AnimatedStep>
      ),
    },
  ];

  /**
   * handleStepChange
   * @param currentStep currentStep
   */
  const handleStepChange = React.useCallback(
    (currentStep: WizardStep) => {
      // If last step, copy workspace
      if (currentStep.index === steps.length - 1) {
        copyWorkspace();
      }
    },
    [copyWorkspace, steps.length]
  );

  const { ...useWizardValues } = useWizard({
    steps: steps,
    preventNextIfInvalid: false,
    onStepChange: handleStepChange,
  });

  return (
    <WizardProvider value={useWizardValues}>
      <Wizard
        modifiers={["copy-workspace"]}
        header={<CopyWizardHeader disabled />}
        footer={<CopyWizardFooter locked={state.locked} />}
        wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
      />
    </WizardProvider>
  );
};

/**
 * StepWizardHeaderProps
 */
interface CopyWizardHeaderProps {
  disabled?: boolean;
}

/**
 * CopyWizardHeader
 * @param props props
 * @returns JSX.Element
 */
const CopyWizardHeader = (props: CopyWizardHeaderProps) => {
  const { disabled = true } = props;
  const { goTo, currentStepIndex, steps } = useWizardContext();

  /**
   * handleStepClick
   * @param index index
   */
  const handleStepClick = (index: number) => () => goTo(index);

  return (
    <Stepper activeStepIndex={currentStepIndex}>
      {steps.map((step, index) => (
        <StepperItem
          key={index}
          index={index}
          label={step.name}
          onClick={handleStepClick(index)}
          disabled={disabled}
          active={currentStepIndex === index}
          completed={index < currentStepIndex}
          validationError={step.isInvalid}
        />
      ))}
    </Stepper>
  );
};

/**
 * CopyWizardFooter
 */
interface CopyWizardFooterProps {
  locked: boolean;
}

/**
 * CopyWizardFooter
 *
 * @param props props
 * @returns JSX.Element
 */
const CopyWizardFooter = (props: CopyWizardFooterProps) => {
  const { locked } = props;
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
  const { previous, next, isFirstStep, isLastStep, currentStepIndex, steps } =
    useWizardContext();

  /**
   * handleNextStep
   */
  const handleNextStep = () => {
    next();
  };

  /**
   * handlePreviousStep
   */
  const handlePreviousStep = () => {
    previous();
  };

  const isSecondLastStep = currentStepIndex === steps.length - 2;

  return (
    <>
      {!isFirstStep && (
        <Button
          buttonModifiers={["info"]}
          onClick={handlePreviousStep}
          disabled={isFirstStep || locked}
        >
          {t("actions.previous", { ns: "common" })}
        </Button>
      )}

      {!isLastStep && (
        <Button
          onClick={handleNextStep}
          buttonModifiers={["info"]}
          disabled={isLastStep || locked}
        >
          {isSecondLastStep
            ? t("actions.copy", { ns: "workspace" })
            : t("actions.next", { ns: "common" })}
        </Button>
      )}
    </>
  );
};

export default CopyWorkspaceWizard;
