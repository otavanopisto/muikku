import * as React from "react";
import { WizardStep } from "..";

/**
 * UseWizardProps
 */
export interface UseWizardProps {
  preventNextIfInvalid: boolean;
  steps: WizardStep[];
  preventStepperNavigation?: boolean;
  onStepChange?: (step: WizardStep) => void;
}

const defaultUseWizardProps: Partial<UseWizardProps> = {
  preventStepperNavigation: false,
};

export type UseWizardType = ReturnType<typeof useWizard>;

/**
 * Use wizard custom hook. Handles wizard component functionalities and state
 *
 * @param props props
 * @returns wizard method and state values
 */
export const useWizard = (props: UseWizardProps) => {
  props = { ...defaultUseWizardProps, ...props };

  const {
    preventNextIfInvalid,
    onStepChange,
    preventStepperNavigation,
    steps,
  } = props;

  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
  // Track invalid states internally instead of mutating props
  const [stepInvalidStates, setStepInvalidStates] = React.useState<
    Record<number, boolean>
  >({});

  /**
   * Set the invalid state of a step. This will trigger a re-render of the wizard.
   * For example call method in the step components useEffect hook.
   *
   * @param value invalid state
   * @param index step index
   */
  const isInvalid = React.useCallback((value: boolean, index: number) => {
    setStepInvalidStates((prev) => {
      // Only update if the value actually changed
      if (prev[index] === value) {
        return prev;
      }
      return { ...prev, [index]: value };
    });
  }, []);

  // Merge invalid states with steps to create enhanced steps
  const enhancedSteps = React.useMemo(
    () =>
      steps.map((step, index) => ({
        ...step,
        isInvalid: stepInvalidStates[index] ?? step.isInvalid ?? false,
      })),
    [steps, stepInvalidStates]
  );

  /**
   * Go to the next step
   */
  const next = React.useCallback(() => {
    setCurrentStepIndex((i) => {
      if (i >= enhancedSteps.length - 1) {
        return i;
      }

      // When onStepChange is defined, call it with the new step
      onStepChange && onStepChange(enhancedSteps[i + 1]);
      return i + 1;
    });
  }, [onStepChange, enhancedSteps]);

  /**
   * Go to the previous step
   */
  const previous = React.useCallback(() => {
    setCurrentStepIndex((i) => {
      if (i <= 0) {
        return i;
      }

      // When onStepChange is defined, call it with the new step
      onStepChange && onStepChange(enhancedSteps[i - 1]);
      return i - 1;
    });
  }, [onStepChange, enhancedSteps]);

  /**
   * Go to a specific step
   */
  const goTo = React.useCallback(
    (step: number) => {
      if (step < 0 || step >= enhancedSteps.length) {
        throw new Error(`Invalid step index: ${step}`);
      }

      // When onStepChange is defined, call it with the new step
      onStepChange && onStepChange(enhancedSteps[step]);
      setCurrentStepIndex(step);
    },
    [onStepChange, enhancedSteps]
  );

  // List of disabled steps indexes. If any of the steps are invalid, all the following steps are disabled
  const disabledSteps = React.useMemo(() => {
    const disabledSteps: number[] = [];
    let invalidStepIndex = undefined;

    for (let i = 0; i < enhancedSteps.length; i++) {
      if (invalidStepIndex !== undefined) {
        disabledSteps.push(i);
      }

      if (enhancedSteps[i].isInvalid) {
        invalidStepIndex = i;
      }
    }
    return disabledSteps;
  }, [enhancedSteps]);

  return {
    step: enhancedSteps[currentStepIndex],
    steps: enhancedSteps,
    currentStepIndex,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === enhancedSteps.length - 1,
    next,
    previous,
    goTo,
    isInvalid,
    preventNextIfInvalid,
    disabledSteps,
    preventStepperNavigation,
  };
};
