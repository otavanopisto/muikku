import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * Props of the planner info
 */
interface PlannerInfoProps {
  /**
   * Graduation goal date
   */
  graduationGoalDate: Date | null;
  /**
   * Estimated time to completion. Value of Infinity means that the user has not filled in the hours per week.
   */
  estimatedTimeToCompletion: number;
}

/**
 * Planner info component
 * @param props - Props of the info
 * @returns Planner info component
 */
export function PlannerInfo(props: PlannerInfoProps) {
  const { graduationGoalDate, estimatedTimeToCompletion } = props;
  const { t } = useTranslation(["hops_new"]);

  // If estimated time to completion is Infinity, show info that the user has not filled in the hours per week
  if (estimatedTimeToCompletion === Infinity) {
    return (
      <PlannerInfoNotification variant="info">
        <p>
          {t("content.studyPlannerInfoCannotCalculate", {
            ns: "hops_new",
          })}
        </p>
      </PlannerInfoNotification>
    );
  }

  // If graduation goal date is null, show only estimated time to completion
  if (graduationGoalDate === null) {
    return (
      <PlannerInfoNotification variant="info">
        <p>
          {t("content.studyPlannerInfoBeMoreSpecific", {
            ns: "hops_new",
            estimatedTimeToCompletion: estimatedTimeToCompletion,
          })}
        </p>
      </PlannerInfoNotification>
    );
  }

  // Calculate if graduation is possible by the goal date
  const today = new Date();
  const monthsUntilGoal = Math.ceil(
    (graduationGoalDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );
  const isGraduationPossible = monthsUntilGoal >= estimatedTimeToCompletion;

  // If graduation is possible, show info with info about it
  if (isGraduationPossible) {
    return (
      <PlannerInfoNotification variant="info">
        <p>
          {t("content.studyPlannerInfoGraduationPossible", {
            ns: "hops_new",
            graduationGoalDate: graduationGoalDate.toLocaleDateString("fi-Fi"),
            monthsUntilGoal: monthsUntilGoal,
            estimatedTimeToCompletion: estimatedTimeToCompletion,
          })}
        </p>
      </PlannerInfoNotification>
    );
  }

  // If graduation is not possible, show info what are the requirements
  return (
    <PlannerInfoNotification variant="warning">
      <p>
        {t("content.studyPlannerInfoGraduationNotPossible", {
          ns: "hops_new",
          graduationGoalDate: graduationGoalDate.toLocaleDateString("fi-Fi"),
          monthsUntilGoal: monthsUntilGoal,
          estimatedTimeToCompletion: estimatedTimeToCompletion,
        })}
      </p>
    </PlannerInfoNotification>
  );
}

type PlannerInfoVariant = "warning" | "info" | "danger" | "neutral";

/**
 * Props of the planner info
 */
interface PlannerInfoNotificationProps {
  /**
   * Variant of the info
   */
  variant?: PlannerInfoVariant;
  /**
   * Content of the info
   */
  children: React.ReactNode;
}

// Icon variants for the notification. Can be changed to use different icons.
const variantStyles = {
  warning: {
    icon: "notification",
  },
  info: {
    icon: "notification",
  },
  danger: {
    icon: "notification",
  },
  neutral: {
    icon: "notification",
  },
};

/**
 * Planner info component
 * @param props - Props of the info
 * @returns Planner info component
 */
export function PlannerInfoNotification(props: PlannerInfoNotificationProps) {
  const { variant = "neutral", children } = props;

  const icon = variantStyles[variant].icon;

  return (
    <div className={`study-planner__info study-planner__info--${variant}`}>
      <div className={`study-planner__info-icon icon-${icon}`} />
      <div className="study-planner__info-content">{children}</div>
    </div>
  );
}
