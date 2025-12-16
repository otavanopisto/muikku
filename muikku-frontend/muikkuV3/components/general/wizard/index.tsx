import * as React from "react";
import { useWizardContext } from "./context/wizard-context";

/**
 * WizardStep
 */
export interface WizardStep {
  index: number;
  /**
   * Name of step
   */
  name?: string;
  /**
   * Namespace of the steps
   * shorcut for localization
   */
  namespace?: string;
  /**
   * Component to render
   */
  component: React.ReactElement;
  /**
   * If step is invalid. Used to show validation error in stepper.
   * Value is checked if in the step component WizardProviders
   * isInvalid method is called. Pass index value for the step as a prop
   * and use it in the isInvalid method to check if the step is invalid
   */
  isInvalid?: boolean;
}

/**
 * WizardProps
 */
interface WizardProps {
  /**
   * Modifiers to comonent
   */
  modifiers?: string[];
  /**
   * Custom header component. Use it under WizardProvider
   * to access the wizard context and its methods and values.
   * There is a default header component that can be used
   */
  header?: React.ReactNode;
  /**
   * Custom footer component. Use it under WizardProvider
   * to access the wizard context and its methods and values.
   * By default it could be a footer with next and previous buttons that
   * uses the WizardProviders methods to navigate between steps
   */
  footer?: React.ReactNode;
  /**
   * Wrapper component to wrap the active step component.
   * Can be used to add custom styles or animations to the active step
   */
  wrapper?: React.ReactElement;
}

/**
 * An utility function to create WizardSteps from array of JSX elements
 * @param steps Array of JSX elements
 * @param namespace A locale namespace for the steps
 * @returns Array of WizardSteps
 */
export const createWizardSteps = (
  steps: (() => JSX.Element)[],
  namespace: string
): WizardStep[] =>
  steps.map((step, index) => ({
    index,
    namespace,
    component: step(),
  }));
/**
 * Creates Wizard component
 *
 * @param props props
 */
const Wizard = (props: WizardProps) => {
  const { modifiers } = props;

  const { ...useWizardValues } = useWizardContext();

  const clonedChildren = React.useMemo(
    () =>
      React.cloneElement(useWizardValues.step.component, {
        key: `step-${useWizardValues.step.index}`,
      }),
    [useWizardValues.step.component, useWizardValues.step.index]
  );

  // Wrapper component to wrap the active step component
  const enhancedActiveStepContent = React.useMemo(
    () =>
      props.wrapper
        ? React.cloneElement(props.wrapper, {
            children: clonedChildren,
          })
        : clonedChildren,
    [clonedChildren, props.wrapper]
  );

  return (
    <div
      className={`wizard ${
        modifiers ? modifiers.map((m) => `wizard--${m}`).join(" ") : ""
      }`}
    >
      {(props?.header && (
        <div className="wizard__header">{props.header}</div>
      )) ||
        null}
      <div className="wizard__container">{enhancedActiveStepContent}</div>
      {(props?.footer && (
        <div className="wizard__footer">{props.footer}</div>
      )) ||
        null}
    </div>
  );
};

export default Wizard;
