import ProgressBar from "@ramonak/react-progress-bar";
import * as React from "react";
import { localize } from "~/locales/i18n";
import { motion } from "framer-motion";

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
  effectiveEndDate: Date;
  estimatedCompletionFlagDate: Date | null;
  goalFlagDate: Date | null;
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

  // Determine which dates to use for end date and flags
  const { effectiveEndDate, estimatedCompletionFlagDate, goalFlagDate } =
    ((): TimelineDates => {
      // If we have both estimated and goal dates, compare them
      if (estimatedDate && graduationGoalDate) {
        if (estimatedDate > graduationGoalDate) {
          return {
            effectiveEndDate: estimatedDate,
            estimatedCompletionFlagDate: null,
            goalFlagDate: graduationGoalDate,
          };
        } else {
          return {
            effectiveEndDate: graduationGoalDate,
            goalFlagDate: null,
            estimatedCompletionFlagDate: estimatedDate,
          };
        }
      }

      // If we only have estimated date
      if (estimatedDate) {
        return {
          effectiveEndDate: estimatedDate,
          estimatedCompletionFlagDate: estimatedDate,
          goalFlagDate: null,
        };
      }

      // If we only have graduation goal date
      if (graduationGoalDate && graduationGoalDate > currentDate) {
        return {
          effectiveEndDate: graduationGoalDate,
          estimatedCompletionFlagDate: null,
          goalFlagDate: null,
        };
      }

      // If we have study end time date
      if (studyEndTimeDate && studyEndTimeDate > currentDate) {
        return {
          effectiveEndDate: studyEndTimeDate,
          estimatedCompletionFlagDate: null,
          goalFlagDate: null,
        };
      }

      // Fallback
      const defaultEndDate = new Date(studyStartDate);
      defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 4);
      return {
        effectiveEndDate: defaultEndDate,
        estimatedCompletionFlagDate: null,
        goalFlagDate: null,
      };
    })();

  return (
    <ProgressTimelineBar
      startDate={studyStartDate}
      endDate={effectiveEndDate}
      goalDate={goalFlagDate}
      estimatedCompletionDate={estimatedCompletionFlagDate}
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
        <div className="study-planner__timeline-progress-flag study-planner__timeline-progress-flag--start-date">
          <div className="study-planner__timeline-progress-flag-label">
            {localize.date(startDate)}
          </div>
          <div className="study-planner__timeline-progress-flag-line" />
        </div>
        <div className="study-planner__timeline-progress-flag study-planner__timeline-progress-flag--end-date">
          <div className="study-planner__timeline-progress-flag-label">
            {localize.date(endDate)}
          </div>
          <div className="study-planner__timeline-progress-flag-line" />
        </div>

        <Flag
          position={currentPosition}
          date={currentTime}
          variant="current"
          icon="location"
        />

        {goalPosition && (
          <Flag position={goalPosition} date={goalDate} variant="goal" />
        )}

        {estimatedPosition && (
          <Flag
            position={estimatedPosition}
            date={estimatedCompletionDate}
            variant="estimated"
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

/**
 * FlagProps
 */
interface FlagProps {
  position: number;
  date: Date;
  variant: "current" | "goal" | "estimated";
  icon?: string;
}

/**
 * Flag component
 * @param props props
 * @returns JSX.Element
 */
const Flag: React.FC<FlagProps> = (props) => {
  const { position, date, variant, icon } = props;

  return (
    <motion.div
      className={`study-planner__timeline-progress-flag study-planner__timeline-progress-flag--${variant}`}
      style={{ left: `${position}%` }}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={flagVariants}
      layout // This will animate position changes
      layoutId={`flag-${variant}`} // This helps with smooth transitions
    >
      <motion.div
        className="study-planner__timeline-progress-flag-label"
        layout
      >
        {icon ? <span className={`icon-${icon}`} /> : null}
        <span>{localize.date(date)}</span>
      </motion.div>
      <motion.div
        className="study-planner__timeline-progress-flag-line"
        layout
      />
    </motion.div>
  );
};

export default PlannerTimelineProgress;
