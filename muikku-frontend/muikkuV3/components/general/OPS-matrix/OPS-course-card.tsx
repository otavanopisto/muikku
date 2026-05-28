// PLEASE NOTE:
// This component is almost identical to PlannerCard component, with the only difference being the class names
// and without any additional functionality that PlannerCard may have related to planner tool. It is done this way even if it is code duplication, because
// there is not component to suit for both use cases without major refactoring. And as we are moving towards Muikku V4, this will do for now.
import * as React from "react";
import "~/sass/elements/ops-course-card.scss";

/**
 * Interface for the OPSCourseCard component.
 */
interface OPSCourseCardProps {
  modifiers?: string[];
  innerContainerModifiers?: string[];
  children: React.ReactNode;
}

/**
 * Composable card for OPS matrix dropdowns and related views.
 * @param props - The props for the OPSCourseCard component.
 * @returns The OPSCourseCard component.
 */
const OPSCourseCard = React.forwardRef<HTMLDivElement, OPSCourseCardProps>(
  (props, ref) => {
    const { modifiers = [], innerContainerModifiers = [], children } = props;
    return (
      <div
        className={`ops-course__card ${modifiers
          .map((modifier) => `ops-course__card--${modifier}`)
          .join(" ")}`}
        ref={ref}
      >
        <div
          className={`ops-course__card-inner-container ${innerContainerModifiers
            .map((modifier) => `ops-course__card-inner-container--${modifier}`)
            .join(" ")}`}
        >
          {children}
        </div>
      </div>
    );
  }
);

/**
 * Interface for the OPSCourseCardHeader component.
 */
interface OPSCourseCardHeaderProps {
  children: React.ReactNode;
  modifiers?: string[];
}

/**
 * OPSCourseCardHeader component.
 * @param props - The props for the OPSCourseCardHeader component.
 * @returns The OPSCourseCardHeader component.
 */
const OPSCourseCardHeader: React.FC<OPSCourseCardHeaderProps> = (props) => {
  const { children, modifiers = [] } = props;
  return (
    <div
      className={`ops-course__card-header ${modifiers
        .map((modifier) => `ops-course__card-header--${modifier}`)
        .join(" ")}`}
    >
      {children}
    </div>
  );
};

/**
 * Interface for the OPSCourseCardContent component.
 */
interface OPSCourseCardContentProps {
  children: React.ReactNode;
  modifiers?: string[];
}

/**
 * OPSCourseCardContent component.
 * @param props - The props for the OPSCourseCardContent component.
 * @returns The OPSCourseCardContent component.
 */
const OPSCourseCardContent: React.FC<OPSCourseCardContentProps> = (props) => {
  const { children, modifiers = [] } = props;
  return (
    <div
      className={`ops-course__card-content ${modifiers
        .map((modifier) => `ops-course__card-content--${modifier}`)
        .join(" ")}`}
    >
      {children}
    </div>
  );
};

/**
 * Interface for the OPSCourseCardActions component.
 */
interface OPSCourseCardActionsProps {
  children: React.ReactNode;
  modifiers?: string[];
}

/**
 * OPSCourseCardActions component.
 * @param props - The props for the OPSCourseCardActions component.
 * @returns The OPSCourseCardActions component.
 */
const OPSCourseCardActions: React.FC<OPSCourseCardActionsProps> = (props) => {
  const { children, modifiers = [] } = props;
  return (
    <div
      className={`ops-course__card-actions ${modifiers
        .map((modifier) => `ops-course__card-actions--${modifier}`)
        .join(" ")}`}
    >
      {children}
    </div>
  );
};

/**
 * Interface for the OPSCourseCardLabel component.
 */
interface OPSCourseCardLabelProps {
  modifiers: string[];
  children: React.ReactNode;
}

/**
 * OPSCourseCardLabel component.
 * @param props - The props for the OPSCourseCardLabel component.
 * @returns The OPSCourseCardLabel component.
 */
const OPSCourseCardLabel: React.FC<OPSCourseCardLabelProps> = (props) => {
  const { modifiers, children } = props;
  return (
    <span
      className={`ops-course__card-label ${modifiers
        .map((modifier) => `ops-course__card-label--${modifier}`)
        .join(" ")}`}
    >
      {children}
    </span>
  );
};

OPSCourseCard.displayName = "OPSCourseCard";

export {
  OPSCourseCard,
  OPSCourseCardHeader,
  OPSCourseCardLabel,
  OPSCourseCardContent,
  OPSCourseCardActions,
};
