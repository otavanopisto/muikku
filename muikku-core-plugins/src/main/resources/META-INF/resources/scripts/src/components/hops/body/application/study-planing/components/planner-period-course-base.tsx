import moment from "moment";
import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import Button from "~/components/general/button";
import {
  PlannerCourseWorkspaceInstance,
  StudentStudyActivity,
} from "~/generated/client";
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
  disabled: boolean;
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
    onChange: (
      startDate: Date,
      endDate: Date,
      workspaceInstance?: PlannerCourseWorkspaceInstance
    ) => void;
    startDate: Date;
    endDate?: Date;
    workspaceInstance?: PlannerCourseWorkspaceInstance;
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
  workspaceInstance?: PlannerCourseWorkspaceInstance;
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
    disabled,
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
            ? { state: "completed", label: "Suoritettu" }
            : { state: "failed", label: "Hylätty" };
        case "TRANSFERRED":
          return {
            state: "transferred",
            label: "Hyväksiluettu",
          };
        case "ONGOING":
          return { state: "inprogress", label: "Työnalla" };
        case "SUPPLEMENTATIONREQUEST":
          return {
            state: "supplementation-request",
            label: "Täydennettävä",
          };
        default:
          return { state: null, label: null };
      }
    }

    return { state: null, label: null };
  };

  const courseState = getCourseState();

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
          workspaceInstance: {
            ...course.workspaceInstance,
          },
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
   * @param workspaceInstance workspace instance
   */
  const handleSpecifyChange = (
    startDate: Date,
    endDate: Date,
    workspaceInstance?: PlannerCourseWorkspaceInstance
  ) => {
    setSpecifyCourse({ startDate, endDate, workspaceInstance });
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
        workspaceInstance: specifyCourse.workspaceInstance,
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
   * @param e event
   */
  const handleSelectCourse = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (disabled || specifyIsOpen || deleteWarningIsOpen) {
      return;
    }

    onSelectCourse(course);
  };

  /**
   * Renders workspace instance not available
   * @returns workspace instance not available
   */
  const renderWorkspaceInstanceNotAvailable = () => {
    // Hide message if user is selecting a new workspace instance
    const isSelectingNewInstance =
      specifyCourse &&
      specifyCourse.workspaceInstance?.id !== course.workspaceInstance?.id;

    if (
      course.workspaceInstance?.instanceExists === false &&
      !isSelectingNewInstance
    ) {
      return (
        <span className="study-planner__course-workspace-instance-not-available">
          Valittu kurssi-ilmentymä ei ole enään saatavilla. Valitse uusi
          kurssi-ilmentymä ja päivitä suunnitelma.
        </span>
      );
    }

    return null;
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

  const innerContainerModifiers = course.mandatory
    ? ["mandatory"]
    : ["optional"];

  return (
    <PlannerCard
      ref={ref}
      modifiers={["planned-course", ...cardModifiers]}
      innerContainerModifiers={innerContainerModifiers}
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
            workspaceInstance: specifyCourse && specifyCourse.workspaceInstance,
          })}

          {renderDeleteWarning({
            isOpen: deleteWarningIsOpen,
            // eslint-disable-next-line jsdoc/require-jsdoc
            onClose: () => setDeleteWarningIsOpen(false),
            onConfirm: handleConfirmDelete,
          })}

          {renderCourseState &&
            renderCourseState({
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

        {renderWorkspaceInstanceNotAvailable()}
      </PlannerCardContent>

      {!disabled && !studyActivity && (
        <PlannerCardActions>
          <Button
            onClick={handleSpecifyOpen}
            disabled={specifyIsOpen || deleteWarningIsOpen}
            buttonModifiers={["study-planner-specify"]}
          >
            Tarkenna
          </Button>
          <Button
            onClick={handleDeleteOpen}
            disabled={specifyIsOpen || deleteWarningIsOpen}
            buttonModifiers={["study-planner-delete"]}
          >
            Poista
          </Button>
        </PlannerCardActions>
      )}
    </PlannerCard>
  );
});

BasePlannerPeriodCourse.displayName = "BasePlannerPeriodCourse";

export default BasePlannerPeriodCourse;
