import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useDrag } from "react-dnd";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { PlannerPeriodProps } from "./planner-period";
import DatePicker from "react-datepicker";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import _ from "lodash";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";

/**
 * CourseCardProps
 */
interface PlannerPeriodCourseCardProps {
  course: PlannedCourseWithIdentifier;
  onCourseChange: PlannerPeriodProps["onCourseChange"];

  plannedCourses: PlannedCourseWithIdentifier[];
}

/**
 * PlannerPeriodCourseCard component
 * @param props props
 */
const PlannerPeriodCourseCard: React.FC<PlannerPeriodCourseCardProps> = (
  props
) => {
  const { course, onCourseChange, plannedCourses } = props;

  const [specifyIsOpen, setSpecifyIsOpen] = React.useState(false);
  const [deleteWarningIsOpen, setDeleteWarningIsOpen] = React.useState(false);

  const [specifyCourse, setSpecifyCourse] = React.useState<{
    startDate: Date;
    endDate: Date;
    workspaceEntityId?: number;
  } | null>(null);

  const [{ isDragging }, drag] = useDrag(
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
    }),
    []
  );

  /**
   * Handles specify
   */
  const handleSpecifyOpen = () => {
    unstable_batchedUpdates(() => {
      setSpecifyIsOpen(true);
      setSpecifyCourse({
        startDate: course.startDate,
        endDate: new Date(course.startDate.getTime() + course.duration),
        workspaceEntityId: course.workspaceEntityId,
      });
      setDeleteWarningIsOpen(false);
    });
  };

  /**
   * Handles delete
   */
  const handleDeleteOpen = () => {
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
    onCourseChange(
      {
        ...course,
        startDate: specifyCourse.startDate,
        duration: specifyCourse.endDate
          ? specifyCourse.endDate.getTime() - specifyCourse.startDate.getTime()
          : null,
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
    onCourseChange(course, "delete");
    setDeleteWarningIsOpen(false);
  };

  // Calculate the end date of the course from the start date and duration
  const calculatedEndDate = course.duration
    ? new Date(course.startDate.getTime() + course.duration)
    : null;

  // Find the current course info from the plannedCourses array
  const currentInfo = plannedCourses.find(
    (c) => c.identifier === course.identifier
  );

  // And check if there are any unsaved changes
  const hasUnsavedChanges = currentInfo && !_.isEqual(currentInfo, course);

  return (
    <>
      <div
        ref={drag}
        className={`hops-planner__course-card ${isDragging ? "is-dragging" : ""}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className="hops-planner__course-header">
          <span className="hops-planner__course-code">
            {`${course.subjectCode}-${course.courseNumber}`}
          </span>
          <span className="hops-planner__course-name">{course.name}</span>
          {hasUnsavedChanges && (
            <span className="hops-planner__course-unsaved">*</span>
          )}
        </div>

        <div className="hops-planner__course-content">
          <span
            className={`hops-planner__course-type hops-planner__course-type--${course.mandatory ? "mandatory" : "optional"}`}
          >
            {course.mandatory ? "PAKOLLINEN" : "VALINNAINEN"}
          </span>
          <span className="hops-planner__course-dates">
            {calculatedEndDate ? (
              <>
                {course.startDate.toLocaleDateString()} -{" "}
                {calculatedEndDate.toLocaleDateString()}
              </>
            ) : (
              course.startDate.toLocaleDateString()
            )}
          </span>
        </div>

        <div className="hops-planner__course-actions">
          <button
            className="hops-planner__action-button"
            onClick={handleSpecifyOpen}
          >
            Tarkenna
          </button>
          <button
            className="hops-planner__action-button hops-planner__action-button--danger"
            onClick={handleDeleteOpen}
          >
            Poista
          </button>
        </div>
      </div>

      <AnimateHeight
        duration={500}
        height={specifyIsOpen ? "auto" : 0}
        className={`hops-planner__course-item-animate-height ${
          specifyIsOpen ? "open" : "close"
        }`}
        contentClassName="hops-planner__course-item-specify"
      >
        <h4>Tarkenna suunnitelmaa</h4>

        <div className="specify-section">
          <div className="input-group">
            <label>Valitse kurssi-ilmentymä</label>
            <select className="hops__input">
              <option>{course.name}</option>
            </select>
          </div>

          <div className="input-group">
            <label>Valitse ajankohta</label>
            <div className="date-inputs">
              <DatePicker
                className="hops__input"
                placeholderText="Alkaa"
                selected={specifyCourse?.startDate}
                onChange={handleSpecifyStartDate}
                locale={outputCorrectDatePickerLocale(localize.language)}
                dateFormat="P"
              />
              <DatePicker
                className="hops__input"
                placeholderText="Päättyy"
                selected={specifyCourse?.endDate}
                onChange={handleSpecifyEndDate}
                locale={outputCorrectDatePickerLocale(localize.language)}
                dateFormat="P"
              />
            </div>
          </div>

          <div className="button-group">
            <button
              className="hops__button hops__button--secondary"
              onClick={() => setSpecifyIsOpen(false)}
            >
              PERUUTA
            </button>
            <button
              className="hops__button hops__button--primary"
              onClick={handleConfirmSpecify}
            >
              TARKENNA
            </button>
          </div>
        </div>
      </AnimateHeight>

      <AnimateHeight
        duration={500}
        height={deleteWarningIsOpen ? "auto" : 0}
        className={`hops-planner__course-item-animate-height ${
          deleteWarningIsOpen ? "open" : "close"
        }`}
        contentClassName="hops-planner__course-item-delete-warning"
      >
        <h4>Haluatko varmasti poistaa kurssin suunnitelmasta?</h4>
        <div className="button-group">
          <button
            className="hops__button hops__button--secondary"
            onClick={() => setDeleteWarningIsOpen(false)}
          >
            PERUUTA
          </button>
          <button
            className="hops__button hops__button--primary"
            onClick={handleConfirmDelete}
          >
            POISTA KURSSI
          </button>
        </div>
      </AnimateHeight>
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    plannedCourses: state.hopsNew.hopsStudyPlanState.plannedCourses,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlannerPeriodCourseCard);
