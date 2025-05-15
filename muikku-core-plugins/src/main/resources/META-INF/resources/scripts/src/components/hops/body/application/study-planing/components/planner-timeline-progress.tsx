import ProgressBar from "@ramonak/react-progress-bar";
import * as React from "react";
import { localize } from "~/locales/i18n";
import { motion } from "framer-motion";
import Dropdown from "~/components/general/dropdown";
import { t } from "i18next";

/**
 * TimelineProgressProps
 */
interface PlannerTimelineProgressProps {
  studyStartDate: Date;
  studyEndTimeDate?: Date | null;
  graduationGoalDate?: Date | null;
  completedStudies: number;
  requiredStudies: number;
  estimatedTimeToCompletion: number | null;
}

/**
 * TimelineDates
 */
interface TimelineDates {
  date: Date;
  variant: FlagVariant;
  estimated: Date | null;
  goal: Date | null;
}

/**
 * TimelineProgress component
 * @param props props
 * @returns JSX.Element
 */
const PlannerTimelineProgress: React.FC<PlannerTimelineProgressProps> = (
  props
) => {
  const {
    studyStartDate,
    studyEndTimeDate,
    graduationGoalDate,
    completedStudies,
    requiredStudies,
    estimatedTimeToCompletion,
  } = props;

  const currentDate = new Date();

  /**
   * Calculate estimated completion date
   * @param months months
   * @returns estimated completion date
   */
  const calculateEstimatedCompletionDate = (months: number): Date => {
    const baseDate =
      currentDate > studyStartDate ? currentDate : studyStartDate;
    const estimatedDate = new Date(baseDate);
    estimatedDate.setMonth(estimatedDate.getMonth() + months);
    return estimatedDate;
  };

  // Calculate estimated date first so we can use it in comparisons
  const estimatedDate =
    estimatedTimeToCompletion &&
    estimatedTimeToCompletion !== Infinity &&
    estimatedTimeToCompletion > 0
      ? calculateEstimatedCompletionDate(estimatedTimeToCompletion)
      : null;

  /**
   * Determine timeline dates
   * @returns timeline dates
   */
  const determineTimelineDates = (): TimelineDates => {
    // Order dates by priority and use the first valid one
    const endDateOptions: TimelineDates[] = [
      {
        date:
          estimatedDate &&
          graduationGoalDate &&
          estimatedDate > graduationGoalDate
            ? estimatedDate
            : null,
        variant: "estimated",
        estimated: null,
        goal: graduationGoalDate,
      },
      {
        date:
          estimatedDate &&
          graduationGoalDate &&
          estimatedDate <= graduationGoalDate
            ? graduationGoalDate
            : null,
        variant: "goal",
        estimated: estimatedDate,
        goal: null,
      },
      {
        date: estimatedDate,
        variant: "estimated",
        estimated: null,
        goal: null,
      },
      {
        date:
          graduationGoalDate && graduationGoalDate > currentDate
            ? graduationGoalDate
            : null,
        variant: "goal",
        estimated: null,
        goal: null,
      },
      {
        date:
          studyEndTimeDate && studyEndTimeDate > currentDate
            ? studyEndTimeDate
            : null,
        variant: "end",
        estimated: null,
        goal: null,
      },
    ];

    const validOption = endDateOptions.find((option) => option.date !== null);

    if (validOption) {
      return validOption;
    }

    // Fallback case
    const defaultEndDate = new Date(studyStartDate);
    defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 4);
    return {
      date: defaultEndDate,
      variant: "end",
      estimated: null,
      goal: null,
    };
  };

  const {
    date: effectiveEndDate,
    variant: effectiveEndDateVariant,
    estimated,
    goal,
  } = determineTimelineDates();

  const startFlag = (
    <Flag position={0} date={studyStartDate} variant={"start"} />
  );

  const endFlag = (
    <Flag
      position={100}
      date={effectiveEndDate}
      variant={effectiveEndDateVariant}
    />
  );

  return (
    <ProgressTimelineBar
      startFlag={startFlag}
      endFlag={endFlag}
      startDate={studyStartDate}
      endDate={effectiveEndDate}
      goalDate={goal}
      estimatedCompletionDate={estimated}
      completedStudies={completedStudies}
      requiredStudies={requiredStudies}
    />
  );
};

/**
 * ProgressTimelineBarProps
 */
interface ProgressTimelineBarProps {
  startDate: Date;
  endDate: Date;
  startFlag: React.ReactNode;
  endFlag: React.ReactNode;
  goalDate?: Date | null;
  estimatedCompletionDate?: Date | null;
  completedStudies: number;
  requiredStudies: number;
}

/**
 * ProgressTimelineBar component
 * @param props props
 * @returns JSX.Element
 */
const ProgressTimelineBar = (props: ProgressTimelineBarProps) => {
  const {
    startFlag,
    endFlag,
    startDate,
    endDate,
    goalDate,
    estimatedCompletionDate,
    completedStudies,
    requiredStudies,
  } = props;

  const currentTime = new Date();

  /**
   * Get position percentage
   * @param time time
   * @returns position percentage
   */
  const getPositionPercentage = (time: Date) => {
    const total = endDate.getTime() - startDate.getTime();
    const position = time.getTime() - startDate.getTime();
    return Math.min(Math.max((position / total) * 100, 0), 100);
  };

  const currentPosition = getPositionPercentage(currentTime);

  const goalPosition = goalDate ? getPositionPercentage(goalDate) : undefined;

  const estimatedPosition = estimatedCompletionDate
    ? getPositionPercentage(estimatedCompletionDate)
    : undefined;

  return (
    <div className="study-planner__timeline-progress-container">
      <div className="study-planner__timeline-progress-flags">
        {startFlag}
        {endFlag}

        <Flag
          position={currentPosition}
          date={currentTime}
          variant={"current"}
        />

        {goalPosition && (
          <Flag position={goalPosition} date={goalDate} variant={"goal"} />
        )}

        {estimatedPosition && (
          <Flag
            position={estimatedPosition}
            date={estimatedCompletionDate}
            variant={"estimated"}
          />
        )}
      </div>

      <div className="study-planner__plan-status-bar-container">
        {/* Progress bar that acts as timeline */}
        <ProgressBar
          className="study-planner__plan-status-bar"
          completed={completedStudies}
          maxCompleted={requiredStudies}
          isLabelVisible={false}
          bgColor="#24c118"
          baseBgColor="#f5f5f5"
        />

        <div className="study-planner__plan-status-bar-label">
          {`${completedStudies} / ${requiredStudies}`}
        </div>
      </div>
    </div>
  );
};

const flagVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

type FlagVariant =
  | "start"
  | "end"
  | "current"
  | "goal"
  | "estimated"
  | "goal"
  | "estimated";

/**
 * FlagProps
 */
interface FlagProps {
  position: number;
  date: Date;
  variant: FlagVariant;
}

/**
 * Flag component
 * @param props props
 * @returns JSX.Element
 */
const Flag: React.FC<FlagProps> = (props) => {
  const { position, date, variant } = props;

  // Determine if the flag is closer to the left or right edge
  const isRightSide = position > 88;
  const isLeftSide = position < 12;

  const flagsToModifiers = [
    isRightSide ? "study-planner__timeline-progress-flag--on-right-side" : "",
    isLeftSide ? "study-planner__timeline-progress-flag--on-left-side" : "",
  ].join(" ");

  /**
   * Tooltip's text based on the flag variant
   * @returns locale string
   */
  const getTooltipForFlag = () => {
    if (variant) {
      switch (variant) {
        case "start":
          return t("labels.studyPlannerTooltipStartDate", {
            ns: "hops_new",
          });
        case "end":
          return t("labels.studyPlannerTooltipEndDate", {
            ns: "hops_new",
          });
        case "current":
          return t("labels.studyPlannerTooltipPrecentDate", {
            ns: "hops_new",
          });
        case "goal":
          return t("labels.studyPlannerTooltipGraduationGoalDate", {
            ns: "hops_new",
          });
        case "estimated":
          return t("labels.studyPlannerTooltipEstimatedDGraduationDate", {
            ns: "hops_new",
          });
        default:
          "";
      }
    }
  };

  return (
    <Dropdown
      alignSelfVertically="top"
      openByHover
      content={getTooltipForFlag()}
    >
      <motion.div
        className={`study-planner__timeline-progress-flag study-planner__timeline-progress-flag--${variant} ${flagsToModifiers}`}
        style={
          isRightSide
            ? { right: `${100 - position}%` }
            : { left: `${position}%` }
        }
        initial="initial"
        animate="animate"
        exit="exit"
        variants={flagVariants}
        layout
        layoutId={`flag-${variant}`}
      >
        <motion.div
          layout
          className="study-planner__timeline-progress-flag-label-container"
        >
          <motion.div
            layout
            className="study-planner__timeline-progress-flag-icon"
          />
          <motion.div
            layout
            className="study-planner__timeline-progress-flag-label"
          >
            {localize.date(date)}
          </motion.div>
        </motion.div>
        <motion.div
          className="study-planner__timeline-progress-flag-line"
          layout
        />
      </motion.div>
    </Dropdown>
  );
};

export default PlannerTimelineProgress;
