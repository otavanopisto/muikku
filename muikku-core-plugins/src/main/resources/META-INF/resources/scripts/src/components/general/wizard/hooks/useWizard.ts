import * as React from "react";
import { WizardStep } from "..";

/**
 * UseWizardProps
 */
export interface UseWizardProps {
  preventNextIfInvalid: boolean;
  steps: WizardStep[];
}

export type UseWizardType = ReturnType<typeof useWizard>;

/**
 * Use wizard custom hook. Handles wizard component functionalities and state
 *
 * @param props props
 * @returns wizard method and state values
 */
export const useWizard = (props: UseWizardProps) => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
  const [steps, setSteps] = React.useState<WizardStep[]>(props.steps);

  /**
   * Set the invalid state of a step. This will trigger a re-render of the wizard.
   * For example call method in the step components useEffect hook.
   *
   * @param value invalid state
   * @param index step index
   */
  const isInvalid = React.useCallback((value: boolean, index: number) => {
    setSteps((oldValues) => {
      if (value !== oldValues[index].isInvalid) {
        const newValues = [...oldValues];
        newValues[index].isInvalid = value;
        return newValues;
      }
      return oldValues;
    });
  }, []);

  /**
   * Go to the next step
   */
  const next = React.useCallback(() => {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) {
        return i;
      }
      return i + 1;
    });
  }, [steps.length]);

  /**
   * Go to the previous step
   */
  const previous = React.useCallback(() => {
    setCurrentStepIndex((i) => {
      if (i <= 0) {
        return i;
      }
      return i - 1;
    });
  }, []);

  /**
   * Go to a specific step
   */
  const goTo = React.useCallback(
    (step: number) => {
      if (step < 0 || step >= steps.length) {
        throw new Error(`Invalid step index: ${step}`);
      }

      setCurrentStepIndex(step);
    },
    [steps.length]
  );

  return {
    step: steps[currentStepIndex],
    steps: steps,
    currentStepIndex,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    next,
    previous,
    goTo,
    isInvalid,
    preventNextIfInvalid: props.preventNextIfInvalid,
  };
};
