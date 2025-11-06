import * as React from "react";

/**
 * Interface for the PlannerCard component.
 */
interface PlannerCardProps {
  modifiers?: string[];
  innerContainerModifiers?: string[];
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  ref?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
  externalContent?: React.ReactNode;
}

/**
 * PlannerCard component.
 * @param props - The props for the PlannerCard component.
 * @returns The PlannerCard component.
 */
const PlannerCard = React.forwardRef<HTMLDivElement, PlannerCardProps>(
  (props, ref) => {
    const {
      modifiers = [],
      innerContainerModifiers = [],
      onClick,
      children,
      externalContent,
    } = props;
    return (
      <div
        className={`study-planner__card ${modifiers.map((modifier) => `study-planner__card--${modifier}`).join(" ")}`}
        onClick={onClick}
        ref={ref}
      >
        <div
          className={`study-planner__card-inner-container ${innerContainerModifiers
            .map(
              (modifier) => `study-planner__card-inner-container--${modifier}`
            )
            .join(" ")}`}
        >
          {children}
        </div>
        {externalContent}
      </div>
    );
  }
);

/**
 * Interface for the PlannerCardHeader component.
 */
interface PlannerCardHeaderProps {
  children: React.ReactNode;
  modifiers?: string[];
}

/**
 * PlannerCardHeader component.
 * @param props - The props for the PlannerCardHeader component.
 * @returns The PlannerCardHeader component.
 */
const PlannerCardHeader: React.FC<PlannerCardHeaderProps> = (props) => {
  const { children, modifiers = [] } = props;
  return (
    <div
      className={`study-planner__card-header ${modifiers
        .map((modifier) => `study-planner__card-header--${modifier}`)
        .join(" ")}`}
    >
      {children}
    </div>
  );
};

/**
 * Interface for the PlannerCardContent component.
 */
interface PlannerCardContentProps {
  children: React.ReactNode;
  modifiers?: string[];
}

/**
 * PlannerCardContent component.
 * @param props - The props for the PlannerCardContent component.
 * @returns The PlannerCardContent component.
 */
const PlannerCardContent: React.FC<PlannerCardContentProps> = (props) => {
  const { children, modifiers = [] } = props;
  return (
    <div
      className={`study-planner__card-content ${modifiers
        .map((modifier) => `study-planner__card-content--${modifier}`)
        .join(" ")}`}
    >
      {children}
    </div>
  );
};

/**
 * Interface for the PlannerCardActions component.
 */
interface PlannerCardActionsProps {
  children: React.ReactNode;
  modifiers?: string[];
}

/**
 * PlannerCardActions component.
 * @param props - The props for the PlannerCardActions component.
 * @returns The PlannerCardActions component.
 */
const PlannerCardActions: React.FC<PlannerCardActionsProps> = (props) => {
  const { children, modifiers = [] } = props;
  return (
    <div
      className={`study-planner__card-actions ${modifiers
        .map((modifier) => `study-planner__card-actions--${modifier}`)
        .join(" ")}`}
    >
      {children}
    </div>
  );
};

/**
 * Interface for the PlannerCardLabel component.
 */
interface PlannerCardLabelProps {
  modifiers: string[];
  children: React.ReactNode;
}

/**
 * PlannerCardLabel component.
 * @param props - The props for the PlannerCardLabel component.
 * @returns The PlannerCardLabel component.
 */
const PlannerCardLabel: React.FC<PlannerCardLabelProps> = (props) => {
  const { modifiers, children } = props;
  return (
    <span
      className={`study-planner__card-label ${modifiers
        .map((modifier) => `study-planner__card-label--${modifier}`)
        .join(" ")}`}
    >
      {children}
    </span>
  );
};

PlannerCard.displayName = "PlannerCard";

export {
  PlannerCard,
  PlannerCardHeader,
  PlannerCardLabel,
  PlannerCardContent,
  PlannerCardActions,
};
