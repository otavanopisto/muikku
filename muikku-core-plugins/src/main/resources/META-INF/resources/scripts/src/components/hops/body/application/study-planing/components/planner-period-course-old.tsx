import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useDrag } from "react-dnd";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import {
  CourseChangeAction,
  PlannedCourseWithIdentifier,
} from "~/reducers/hops";
import DatePicker from "react-datepicker";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { getEmptyImage } from "react-dnd-html5-backend";
import {
  PlannerCardActions,
  PlannerCardContent,
  PlannerCardLabel,
  PlannerCard,
  PlannerCardHeader,
} from "./planner-card";
import Button from "~/components/general/button";
import { CurriculumConfig } from "~/util/curriculum-config";
import moment from "moment";

/**
 * CourseCardProps
 */
interface PlannerPeriodCourseCardProps {
  course: PlannedCourseWithIdentifier;
  selected: boolean;
  hasChanges: boolean;
  curriculumConfig: CurriculumConfig;
  onCourseChange: (
    course: PlannedCourseWithIdentifier,
    action: CourseChangeAction
  ) => void;
  onSelectCourse: (course: PlannedCourseWithIdentifier) => void;
}

/**
 * PlannerPeriodCourseCard component
 * @param props props
 */
const PlannerPeriodCourseCard: React.FC<PlannerPeriodCourseCardProps> = (
  props
) => {
  const {
    course,
    selected,
    hasChanges,
    curriculumConfig,
    onCourseChange,
    onSelectCourse,
  } = props;

  const [specifyIsOpen, setSpecifyIsOpen] = React.useState(false);
  const [deleteWarningIsOpen, setDeleteWarningIsOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState(false);

  const [specifyCourse, setSpecifyCourse] = React.useState<{
    startDate: Date;
    endDate: Date;
    workspaceEntityId?: number;
  } | null>(null);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "planned-course-card",
      item: {
        info: course,
        type: "planned-course-card",
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      options: {
        dropEffect: "move",
      },
    }),
    []
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  /**
   * Handles specify
   * @param e event
   */
  const handleSpecifyOpen = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
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
   * Handles delete
   * @param e event
   */
  const handleDeleteOpen = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
    unstable_batchedUpdates(() => {
      setSpecifyIsOpen(false);
      setDeleteWarningIsOpen(true);
    });
  };

  /**
   * Handles specify start date
   * @param date start date
   */
  const handleSpecifyStartDate = (date: Date) => {
    setSpecifyCourse((prev) => ({ ...prev, startDate: date }));
  };

  /**
   * Handles specify end date
   * @param date end date
   */
  const handleSpecifyEndDate = (date: Date) => {
    setSpecifyCourse((prev) => ({
      ...prev,
      endDate: date,
    }));
  };

  /**
   * Handles confirm specify
   */
  const handleConfirmSpecify = () => {
    const startDate = moment(specifyCourse.startDate).format("YYYY-MM-DD");
    const duration = specifyCourse.endDate
      ? specifyCourse.endDate.getTime() - specifyCourse.startDate.getTime()
      : null;

    onCourseChange(
      {
        ...course,
        startDate,
        duration: duration ? duration : null,
      },
      "update"
    );
    unstable_batchedUpdates(() => {
      setSpecifyIsOpen(false);
      setSpecifyCourse(null);
    });
  };

  /**
   * Handles confirm delete
   */
  const handleConfirmDelete = () => {
    unstable_batchedUpdates(() => {
      setPendingDelete(true);
      setDeleteWarningIsOpen(false);
    });
  };

  /**
   * Handles actual delete after animation
   */
  const handleAnimationComplete = () => {
    if (pendingDelete && !deleteWarningIsOpen) {
      onCourseChange(course, "delete");
      setPendingDelete(false);
    }
  };

  /**
   * Handles course select. If the same course is clicked, clear the selection
   */
  const handleCourseSelect = () => {
    if (selected) {
      onSelectCourse(null);
    } else {
      onSelectCourse(course);
    }
  };

  const startDate = new Date(course.startDate);

  // Calculate the end date of the course from the start date and duration
  const calculatedEndDate = course.duration
    ? new Date(startDate.getTime() + course.duration)
    : null;

  const cardModifiers = [];
  isDragging && cardModifiers.push("is-dragging");
  selected && cardModifiers.push("selected");

  const type = course.mandatory ? "mandatory" : "optional";

  return (
    <>
      <PlannerCard
        modifiers={["planned-course-card", ...cardModifiers]}
        innerContainerModifiers={[type]}
        onClick={handleCourseSelect}
        ref={drag}
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
                {localize.date(startDate)} - {localize.date(calculatedEndDate)}
              </>
            ) : (
              localize.date(startDate)
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

      <AnimateHeight
        duration={500}
        height={specifyIsOpen ? "auto" : 0}
        className={`study-planner__extra-section-animate-height ${
          specifyIsOpen ? "open" : "close"
        }`}
        contentClassName="study-planner__extra-section study-planner__extra-section--specify"
      >
        <h4 className="study-planner__extra-section-title">
          Tarkenna suunnitelmaa
        </h4>

        <div className="study-planner__extra-section-content">
          <div className="study-planner__extra-section-input-group">
            <label className="study-planner__extra-section-input-group-label">
              Valitse kurssi-ilmentymä
            </label>
            <select className="study-planner__input">
              <option>{course.name}</option>
            </select>
          </div>

          <div className="study-planner__extra-section-input-group">
            <label className="study-planner__extra-section-input-group-label">
              Valitse ajankohta
            </label>
            <div className="study-planner__extra-section-date-inputs">
              <DatePicker
                className="study-planner__input"
                placeholderText="Alkaa"
                selected={specifyCourse && specifyCourse.startDate}
                onChange={handleSpecifyStartDate}
                locale={outputCorrectDatePickerLocale(localize.language)}
                dateFormat="P"
              />
              <DatePicker
                className="study-planner__input"
                placeholderText="Päättyy"
                selected={specifyCourse && specifyCourse.endDate}
                onChange={handleSpecifyEndDate}
                locale={outputCorrectDatePickerLocale(localize.language)}
                dateFormat="P"
              />
            </div>
          </div>

          <div className="study-planner__extra-section-button-group">
            <Button
              buttonModifiers={["secondary"]}
              onClick={() => setSpecifyIsOpen(false)}
            >
              PERUUTA
            </Button>
            <Button
              buttonModifiers={["primary"]}
              onClick={handleConfirmSpecify}
            >
              TARKENNA
            </Button>
          </div>
        </div>
      </AnimateHeight>

      <AnimateHeight
        duration={500}
        height={deleteWarningIsOpen ? "auto" : 0}
        className={`study-planner__extra-section-animate-height ${
          deleteWarningIsOpen ? "open" : "close"
        }`}
        contentClassName="study-planner__extra-section"
        onTransitionEnd={handleAnimationComplete}
      >
        <h4 className="study-planner__extra-section-title">
          Haluatko varmasti poistaa kurssin suunnitelmasta?
        </h4>
        <div className="study-planner__extra-section-button-group">
          <Button
            buttonModifiers={["secondary"]}
            onClick={() => setDeleteWarningIsOpen(false)}
          >
            PERUUTA
          </Button>
          <Button buttonModifiers={["primary"]} onClick={handleConfirmDelete}>
            POISTA KURSSI
          </Button>
        </div>
      </AnimateHeight>
    </>
  );
};

export default PlannerPeriodCourseCard;
