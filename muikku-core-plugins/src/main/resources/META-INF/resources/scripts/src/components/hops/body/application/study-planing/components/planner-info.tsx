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

  // If user hasn't filled hours per week but has set a graduation goal
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
  const monthsUntilGoal = graduationGoalDate
    ? Math.ceil(
        (graduationGoalDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      )
    : undefined;

  // Calculate estimated completion date from today
  const estimatedDate = new Date(today);
  estimatedDate.setMonth(today.getMonth() + estimatedTimeToCompletion);

  // Moment objects for the dates
  const estimatedMoment = localize.getLocalizedMoment(estimatedDate);
  const graduationGoalMoment = graduationGoalDate
    ? localize.getLocalizedMoment(graduationGoalDate)
    : null;
  const studyEndMoment = localize.getLocalizedMoment(studyEndTimeDate);

  // Impossible: estimated completion after graduation goal
  if (graduationGoalMoment && estimatedMoment.isAfter(graduationGoalMoment)) {
    return (
      <PlannerInfoNotification variant="danger">
        {t("content.studyPlannerInfoGraduationNotPossibleTooLowHours", {
          ns: "hops_new",
          graduationGoalDate: localize.date(graduationGoalDate),
          monthsUntilGoal,
          estimatedDateOfCompletion: localize.date(estimatedDate),
          estimatedTimeToCompletion,
        })}
      </PlannerInfoNotification>
    );
  }

  // Impossible: estimated completion after right to study period
  if (estimatedMoment.isAfter(studyEndMoment)) {
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

  // Possible: no graduation goal, but can finish before study end
  if (!graduationGoalDate && estimatedMoment.isSameOrBefore(studyEndMoment)) {
    return (
      <PlannerInfoNotification variant="success">
        {t("content.studyPlannerInfoGraduationPossibleWithoutGraduationGoal", {
          ns: "hops_new",
          estimatedDateOfCompletion: localize.date(estimatedDate),
          estimatedTimeToCompletion,
          studyEndTimeDate: localize.date(studyEndTimeDate),
        })}
      </PlannerInfoNotification>
    );
  }

  // Possible: can finish before both graduation goal and study end
  if (
    graduationGoalMoment &&
    estimatedMoment.isSameOrBefore(graduationGoalMoment) &&
    estimatedMoment.isSameOrBefore(studyEndMoment)
  ) {
    return (
      <PlannerInfoNotification variant="success">
        {t("content.studyPlannerInfoGraduationPossible", {
          ns: "hops_new",
          graduationGoalDate: localize.date(graduationGoalDate),
          monthsUntilGoal,
          estimatedDateOfCompletion: localize.date(estimatedDate),
          estimatedTimeToCompletion,
        })}
      </PlannerInfoNotification>
    );
  }

  // Default
  return (
    <PlannerInfoNotification variant="neutral">
      {t("content.studyPlannerInfoDefault", { ns: "hops_new" })}
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
