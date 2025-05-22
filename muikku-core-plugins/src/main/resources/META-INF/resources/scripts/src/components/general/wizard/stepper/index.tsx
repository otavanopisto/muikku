/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";

/**
 * WizardStepperProps
 */
interface StepperProps {
  activeStepIndex: number;
  modifiers?: string[];
}

/**
 * Stepper
 * @param props props
 * @returns React.JSX.Element
 */
export const Stepper: React.FC<StepperProps> = (props) => {
  const { modifiers } = props;

  return (
    <ol
      className={`progtrckr ${
        modifiers ? modifiers.map((m) => `progtrckr--${m}`).join(" ") : ""
      }`}
    >
      {props.children}
    </ol>
  );
};

/**
 * WizardStepperItemProps
 */
interface StepperItemProps {
  index: number;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  completed?: boolean;
  validationError?: boolean;
}

/**
 * StepperItem
 * @param props props
 * @returns React.JSX.Element
 */
export const StepperItem = (props: StepperItemProps) => {
  const {
    index,
    label,
    onClick,
    disabled,
    active,
    completed,
    validationError,
  } = props;

  let className = "progtrckr-todo";

  if (completed) {
    className = "progtrckr-done";
  }

  if (active) {
    className = "progtrckr-doing";
  }

  if (validationError) {
    className = "progtrckr-error";
  }

  return (
    <li
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={!disabled ? onClick : undefined}
    >
      <em className="stepper-button">{index + 1}</em>
      {label && <span>{label}</span>}
    </li>
  );
};
