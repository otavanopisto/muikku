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

  renderCourseState?: (props: {
    isOpen: boolean;
    onClose: () => void;
    courseState: StudentStudyActivity;
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
    studyActivity,
    curriculumConfig,
    onCourseChange,
    onSelectCourse,
    renderSpecifyContent,
    renderDeleteWarning,
    renderCourseState,
  } = props;

  const [specifyIsOpen, setSpecifyIsOpen] = React.useState(false);
  const [deleteWarningIsOpen, setDeleteWarningIsOpen] = React.useState(false);
  const [courseStateIsOpen, setCourseStateIsOpen] = React.useState(false);

  const [specifyCourse, setSpecifyCourse] =
    React.useState<SpecifyCourse | null>(null);

  /**
   * Gets course state
   * @returns course state
   */
  const getCourseState = () => {
    if (studyActivity) {
      switch (studyActivity.status) {
        case "GRADED":
          return studyActivity.passing
            ? { disabled: true, state: "completed", label: "Suoritettu" }
            : { disabled: false, state: "failed", label: "Hylätty" };
        case "TRANSFERRED":
          return {
            disabled: true,
            state: "transferred",
            label: "Hyväksiluettu",
          };
        case "ONGOING":
          return { disabled: true, state: "inprogress", label: "Työnalla" };
        case "SUPPLEMENTATIONREQUEST":
          return {
            disabled: true,
            state: "supplementation-request",
            label: "Täydennettävä",
          };
        default:
          return { disabled: false, state: null, label: null };
      }
    }

    return { disabled: false, state: null, label: null };
  };

  const courseState = getCourseState();

  /**
   * Handles course state open
   */
  const handleCourseStateOpen = () => {
    setCourseStateIsOpen(!courseStateIsOpen);
  };

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

  /**
   * Handles select course
   */
  const handleSelectCourse = () => {
    if (courseState.disabled) {
      return;
    }

    onSelectCourse(course);
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
    <PlannerCard
      ref={ref}
      modifiers={["planned-course", ...cardModifiers]}
      innerContainerModifiers={[course.mandatory ? "mandatory" : "optional"]}
      onClick={handleSelectCourse}
      externalContent={
        <>
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

          {renderCourseState({
            isOpen: courseStateIsOpen,
            // eslint-disable-next-line jsdoc/require-jsdoc
            onClose: () => setCourseStateIsOpen(false),
            courseState: studyActivity,
          })}
        </>
      }
    >
      <PlannerCardHeader modifiers={["planned-course-card"]}>
        <span className="study-planner__course-name">
          <b>{`${course.subjectCode} ${course.courseNumber}. `}</b>
          {`${course.name}, ${curriculumConfig.strategy.getCourseDisplayedLength(course)}`}
        </span>
        {hasChanges && <span className="study-planner__course-unsaved">*</span>}
      </PlannerCardHeader>

      <PlannerCardContent modifiers={["planned-course-card"]}>
        <PlannerCardLabel
          modifiers={[course.mandatory ? "mandatory" : "optional"]}
        >
          {course.mandatory ? "PAKOLLINEN" : "VALINNAINEN"}
        </PlannerCardLabel>

        {courseState.state && (
          <PlannerCardLabel modifiers={["course-state", courseState.state]}>
            {courseState.label}
          </PlannerCardLabel>
        )}

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

      {!studyActivity ? (
        <PlannerCardActions>
          <Button
            onClick={handleSpecifyOpen}
            disabled={
              courseState.disabled || specifyIsOpen || deleteWarningIsOpen
            }
            buttonModifiers={["study-planner-specify"]}
          >
            Tarkenna
          </Button>
          <Button
            onClick={handleDeleteOpen}
            disabled={
              courseState.disabled || specifyIsOpen || deleteWarningIsOpen
            }
            buttonModifiers={["study-planner-delete"]}
          >
            Poista
          </Button>
        </PlannerCardActions>
      ) : (
        <PlannerCardActions modifiers={["planned-course-card"]}>
          <Button
            icon="arrow-down"
            iconPosition="left"
            onClick={handleCourseStateOpen}
            buttonModifiers={["study-planner-extra-info-toggle"]}
          >
            Lisätietoa
          </Button>
        </PlannerCardActions>
      )}
    </PlannerCard>
  );
});

BasePlannerPeriodCourse.displayName = "BasePlannerPeriodCourse";

export default BasePlannerPeriodCourse;
