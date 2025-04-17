import * as React from "react";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";

/**
 * Props of the planner info
 */
interface PlannerInfoProps {
  /**
   * Study end time date
   */
  studyEndTimeDate: Date | null;
  /**
   * Graduation goal date
   */
  graduationGoalDate: Date | null;
  /**
   * Estimated time to completion. Value of Infinity means that the user has not filled the hours per week field.
   */
  estimatedTimeToCompletion: number;
}

/**
 * Planner info component
 * @param props - Props of the info
 * @returns Planner info component
 */
export function PlannerInfo(props: PlannerInfoProps) {
  const { graduationGoalDate, estimatedTimeToCompletion, studyEndTimeDate } =
    props;
  const { t } = useTranslation(["hops_new"]);

  // Only Graduation goal is set
  if (estimatedTimeToCompletion === Infinity && graduationGoalDate) {
    return (
      <PlannerInfoNotification variant="info">
        {t("content.studyPlannerInfoOnlyGraduationGoalSet", {
          ns: "hops_new",
          graduationGoalDate: localize.date(graduationGoalDate),
        })}
      </PlannerInfoNotification>
    );
  }

  const today = new Date();
  const monthsUntilGoal = Math.ceil(
    (graduationGoalDate?.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );

  const estimatedDate = new Date(today);
  estimatedDate.setMonth(today.getMonth() + estimatedTimeToCompletion);

  // Calculate if graduation is possible by the goal date and estimated date
  // and to not exceed end date of right to study
  const isGraduationPossible =
    monthsUntilGoal >= estimatedTimeToCompletion &&
    estimatedDate <= studyEndTimeDate &&
    graduationGoalDate >= estimatedDate;

  // Calculate if graduation is possible only by the estimated hours
  const isGraduationPossibleWithoutGraduationGoal =
    studyEndTimeDate >= estimatedDate;

  // Calculated estimated graduation date based on estimated
  // hours exceeds end date of right to study period
  if (localize.getLocalizedMoment(estimatedDate).isAfter(graduationGoalDate)) {
    return (
      <PlannerInfoNotification variant="danger">
        {t("content.studyPlannerInfoGraduationNotPossibleTooLowHours", {
          ns: "hops_new",
          graduationGoalDate: localize.date(graduationGoalDate),
          monthsUntilGoal: monthsUntilGoal,
          estimatedDateOfCompletion: localize.date(estimatedDate),
          estimatedTimeToCompletion: estimatedTimeToCompletion,
        })}
      </PlannerInfoNotification>
    );
  }

  // Date of graduation goal exceeds the right to study date
  if (localize.getLocalizedMoment(estimatedDate).isAfter(studyEndTimeDate)) {
    return (
      <PlannerInfoNotification variant="danger">
        {t("content.studyPlannerInfoGraduationNotPossibleExceedsRightToStudy", {
          ns: "hops_new",
          estimatedDateOfCompletion: localize.date(estimatedDate),
          studyEndTimeDate: localize.date(studyEndTimeDate),
        })}
      </PlannerInfoNotification>
    );
  }

  // Graduation is possible when calculated graduation date based on estimated hours
  // are within the right to study period
  if (isGraduationPossibleWithoutGraduationGoal && !graduationGoalDate) {
    return (
      <PlannerInfoNotification variant="success">
        {t("content.studyPlannerInfoGraduationPossibleWithoutGraduationGoal", {
          ns: "hops_new",
          estimatedDateOfCompletion: localize.date(estimatedDate),
          estimatedTimeToCompletion: estimatedTimeToCompletion,
          studyEndTimeDate: localize.date(studyEndTimeDate),
        })}
      </PlannerInfoNotification>
    );
  }

  // Graduation is possible when calculated dates of graduation goal and
  // estimated hours are within the right to study period
  if (isGraduationPossible) {
    return (
      <PlannerInfoNotification variant="success">
        {t("content.studyPlannerInfoGraduationPossible", {
          ns: "hops_new",
          graduationGoalDate: localize.date(graduationGoalDate),
          monthsUntilGoal: monthsUntilGoal,
          estimatedDateOfCompletion: localize.date(estimatedDate),
          estimatedTimeToCompletion: estimatedTimeToCompletion,
        })}
      </PlannerInfoNotification>
    );
  }

  // Default
  return (
    <PlannerInfoNotification variant="neutral">
      {t("content.studyPlannerInfoDefault", {
        ns: "hops_new",
      })}
    </PlannerInfoNotification>
  );
}

type PlannerInfoVariant = "neutral" | "info" | "danger" | "success";

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
  neutral: {
    icon: "notification",
  },
  info: {
    icon: "notification",
  },
  danger: {
    icon: "notification",
  },
  success: {
    icon: "thumb-up",
  },
};

/**
 * Planner info component
 * @param props - Props of the info
 * @returns Planner info component
 */
export function PlannerInfoNotification(props: PlannerInfoNotificationProps) {
  const { variant = "info", children } = props;

  const icon = variantStyles[variant].icon;

  return (
    <div className={`study-planner__info study-planner__info--${variant}`}>
      <div className={`study-planner__info-icon icon-${icon}`} />
      <div className="study-planner__info-content">{children}</div>
    </div>
  );
}
