import moment from "moment";
import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import Button from "~/components/general/button";
import { StudentStudyActivity } from "~/generated/client";
import { localize } from "~/locales/i18n";
import {
  CourseChangeAction,
  PlannedCourseWithIdentifier,
} from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import {
  PlannerCard,
  PlannerCardActions,
  PlannerCardContent,
  PlannerCardHeader,
  PlannerCardLabel,
} from "./planner-card";

/**
 * Base planner period course props
 */
export interface BasePlannerPeriodCourseProps {
  course: PlannedCourseWithIdentifier;
  selected: boolean;
  isDragging?: boolean;
  hasChanges: boolean;
  curriculumConfig: CurriculumConfig;
  studyActivity?: StudentStudyActivity;
  onCourseChange: (
    course: PlannedCourseWithIdentifier,
    action: CourseChangeAction
  ) => void;
  onSelectCourse: (course: PlannedCourseWithIdentifier) => void;
  renderSpecifyContent: (props: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onChange: (startDate: Date, endDate: Date) => void;
    startDate: Date;
    endDate?: Date;
  }) => React.ReactNode;
  renderDeleteWarning: (props: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) => React.ReactNode;
}

/**
 * Specify course
 */
interface SpecifyCourse {
  startDate: Date;
  endDate: Date;
  workspaceEntityId?: number;
}

/**
 * Base planner period course component
 * @param props props
 */
const BasePlannerPeriodCourse = React.forwardRef<
  HTMLDivElement,
  BasePlannerPeriodCourseProps
>((props, ref) => {
  const {
    course,
    selected,
    isDragging = false,
    hasChanges,
    curriculumConfig,
    onCourseChange,
    onSelectCourse,
    renderSpecifyContent,
    renderDeleteWarning,
  } = props;

  const [specifyIsOpen, setSpecifyIsOpen] = React.useState(false);
  const [deleteWarningIsOpen, setDeleteWarningIsOpen] = React.useState(false);

  const [specifyCourse, setSpecifyCourse] =
    React.useState<SpecifyCourse | null>(null);

  /**
   * Handles specify open
   * @param e event
   */
  const handleSpecifyOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    unstable_batchedUpdates(() => {
      setSpecifyIsOpen(true);
      setSpecifyCourse(() => {
        const startDate = new Date(course.startDate);
        const endDate = course.duration
          ? new Date(startDate.getTime() + course.duration)
          : undefined;

        return {
          startDate,
          endDate,
          workspaceEntityId: course.workspaceEntityId,
        };
      });
      setDeleteWarningIsOpen(false);
    });
  };

  /**
   * Handles delete open
   * @param e event
   */
  const handleDeleteOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    unstable_batchedUpdates(() => {
      setSpecifyIsOpen(false);
      setDeleteWarningIsOpen(true);
    });
  };

  /**
   * Handles specify change
   * @param startDate start date
   * @param endDate end date
   */
  const handleSpecifyChange = (startDate: Date, endDate: Date) => {
    setSpecifyCourse({ startDate, endDate });
  };

  /**
   * Handles confirm specify
   */
  const handleConfirmSpecify = () => {
    const startDate = moment(specifyCourse.startDate).format("YYYY-MM-DD");

    onCourseChange(
      {
        ...course,
        startDate,
        duration: specifyCourse.endDate
          ? specifyCourse.endDate.getTime() - specifyCourse.startDate.getTime()
          : null,
      },
      "update"
    );
    setSpecifyIsOpen(false);
  };

  /**
   * Handles confirm delete
   */
  const handleConfirmDelete = () => {
    onCourseChange(course, "delete");
    setDeleteWarningIsOpen(false);
  };

  const startDate = new Date(course.startDate);

  /**
   * Calculates the end date
   */
  const calculatedEndDate = course.duration
    ? new Date(startDate.getTime() + course.duration)
    : null;

  const cardModifiers = [];
  isDragging && cardModifiers.push("is-dragging");
  selected && cardModifiers.push("selected");

  return (
    <>
      <PlannerCard
        ref={ref}
        modifiers={["planned-course-card", ...cardModifiers]}
        innerContainerModifiers={[course.mandatory ? "mandatory" : "optional"]}
        onClick={() => onSelectCourse(course)}
      >
        <PlannerCardHeader modifiers={["planned-course-card"]}>
          <span className="study-planner__course-code">
            {`${course.subjectCode} ${course.courseNumber}.`}
          </span>
          <span className="study-planner__course-name">{course.name}</span>
          {hasChanges && (
            <span className="study-planner__course-unsaved">*</span>
          )}
        </PlannerCardHeader>

        <PlannerCardContent modifiers={["planned-course-card"]}>
          <PlannerCardLabel
            modifiers={[course.mandatory ? "mandatory" : "optional"]}
          >
            {course.mandatory ? "PAKOLLINEN" : "VALINNAINEN"}
          </PlannerCardLabel>
          <PlannerCardLabel modifiers={["course-length"]}>
            {curriculumConfig.strategy.getCourseDisplayedLength(course)}
          </PlannerCardLabel>
          <span className="study-planner__course-dates">
            {calculatedEndDate ? (
              <>
                {localize.date(new Date(course.startDate))} -{" "}
                {localize.date(new Date(calculatedEndDate))}
              </>
            ) : (
              localize.date(new Date(course.startDate))
            )}
          </span>
        </PlannerCardContent>

        <PlannerCardActions modifiers={["planned-course-card"]}>
          <Button buttonModifiers={["primary"]} onClick={handleSpecifyOpen}>
            Tarkenna
          </Button>
          <Button buttonModifiers={["danger"]} onClick={handleDeleteOpen}>
            Poista
          </Button>
        </PlannerCardActions>
      </PlannerCard>

      {renderSpecifyContent({
        isOpen: specifyIsOpen,
        // eslint-disable-next-line jsdoc/require-jsdoc
        onClose: () => setSpecifyIsOpen(false),
        onConfirm: handleConfirmSpecify,
        onChange: handleSpecifyChange,
        startDate: specifyCourse && specifyCourse.startDate,
        endDate: specifyCourse && specifyCourse.endDate,
      })}

      {renderDeleteWarning({
        isOpen: deleteWarningIsOpen,
        // eslint-disable-next-line jsdoc/require-jsdoc
        onClose: () => setDeleteWarningIsOpen(false),
        onConfirm: handleConfirmDelete,
      })}
    </>
  );
});

BasePlannerPeriodCourse.displayName = "BasePlannerPeriodCourse";

export default BasePlannerPeriodCourse;
