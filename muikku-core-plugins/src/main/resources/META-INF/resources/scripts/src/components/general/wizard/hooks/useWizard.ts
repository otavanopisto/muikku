import * as React from "react";
import { WizardStep } from "..";

/**
 * UseWizardProps
 */
export interface UseWizardProps {
  preventNextIfInvalid: boolean;
  steps: WizardStep[];
  onStepChange?: (step: WizardStep) => void;
}

export type UseWizardType = ReturnType<typeof useWizard>;

/**
 * Use wizard custom hook. Handles wizard component functionalities and state
 *
 * @param props props
 * @returns wizard method and state values
 */
export const useWizard = (props: UseWizardProps) => {
  const { preventNextIfInvalid, onStepChange } = props;

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
    console.log("isInvalid", value, index);
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

      // When onStepChange is defined, call it with the new step
      onStepChange && onStepChange(steps[i + 1]);
      return i + 1;
    });
  }, [onStepChange, steps]);

  /**
   * Go to the previous step
   */
  const previous = React.useCallback(() => {
    setCurrentStepIndex((i) => {
      if (i <= 0) {
        return i;
      }

      // When onStepChange is defined, call it with the new step
      onStepChange && onStepChange(steps[i - 1]);
      return i - 1;
    });
  }, [onStepChange, steps]);

  /**
   * Go to a specific step
   */
  const goTo = React.useCallback(
    (step: number) => {
      if (step < 0 || step >= steps.length) {
        throw new Error(`Invalid step index: ${step}`);
      }

      // When onStepChange is defined, call it with the new step
      onStepChange && onStepChange(steps[step]);
      setCurrentStepIndex(step);
    },
    [onStepChange, steps]
  );

  // List of disabled steps indexes. If any of the steps are invalid, all the following steps are disabled
  const disabledSteps = React.useMemo(() => {
    const disabledSteps: number[] = [];
    let invalidStepIndex = undefined;

    for (let i = 0; i < steps.length; i++) {
      if (invalidStepIndex !== undefined) {
        disabledSteps.push(i);
      }

      if (steps[i].isInvalid) {
        invalidStepIndex = i;
      }
    }
    return disabledSteps;
  }, [steps]);

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
    preventNextIfInvalid,
    disabledSteps,
  };
};
