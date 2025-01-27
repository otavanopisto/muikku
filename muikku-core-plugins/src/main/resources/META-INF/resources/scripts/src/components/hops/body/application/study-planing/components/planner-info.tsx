import * as React from "react";

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

  // If estimated time to completion is Infinity, show info that the user has not filled in the hours per week
  if (estimatedTimeToCompletion === Infinity) {
    return (
      <PlannerInfoNotification variant="info">
        <p>
          Laskuri ei pysty laskemaan valmistumisajankohtaa, koska et ole
          syöttänyt tietoa, kuinka monta tuntia sinulla on viikottaisin
          käytössäsi opiskeluun.
        </p>
      </PlannerInfoNotification>
    );
  }

  // If graduation goal date is null, show only estimated time to completion
  if (graduationGoalDate === null) {
    return (
      <PlannerInfoNotification variant="info">
        <p>
          {`Arvioitu valmistumisaika on ${estimatedTimeToCompletion} kuukautta. Tarkentamalla valmistumistavoitetta voit saada paremman arvion.`}
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
          {`Valmistuminen tavoiteajassa ${graduationGoalDate.toLocaleDateString()} (${monthsUntilGoal} kk) on mahdollista. Arvioitu valmistumisaika on ${estimatedTimeToCompletion} kuukautta.`}
        </p>
      </PlannerInfoNotification>
    );
  }

  // If graduation is not possible, show info what are the requirements
  return (
    <PlannerInfoNotification variant="warning">
      <p>
        {`Valmistuminen ei ole mahdollista tavoiteajassa ${graduationGoalDate.toLocaleDateString()} (${monthsUntilGoal} kk). Tarvitset vähintään ${estimatedTimeToCompletion} kuukautta opintojen suorittamiseen.`}
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
