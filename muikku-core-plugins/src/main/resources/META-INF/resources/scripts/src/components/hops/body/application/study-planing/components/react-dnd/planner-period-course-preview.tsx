import * as React from "react";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { connect } from "react-redux";

/**
 * CourseCardProps
 */
interface PlannerPeriodCourseCardPreviewProps {
  course: PlannedCourseWithIdentifier;
}

/**
 * PlannerPeriodCourseCard component
 * @param props props
 */
const PlannerPeriodCourseCardPreview: React.FC<
  PlannerPeriodCourseCardPreviewProps
> = (props) => {
  const { course } = props;

  // Calculate the end date of the course from the start date and duration
  const calculatedEndDate = course.duration
    ? new Date(course.startDate.getTime() + course.duration)
    : null;

  return (
    <div className={`hops-planner__course-card-preview`}>
      <div className="hops-planner__course-header">
        <span className="hops-planner__course-code">
          {`${course.subjectCode}-${course.courseNumber}`}
        </span>
        <span className="hops-planner__course-name">{course.name}</span>
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
        <button className="hops-planner__action-button">Tarkenna</button>
        <button className="hops-planner__action-button hops-planner__action-button--danger">
          Poista
        </button>
      </div>
    </div>
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
)(PlannerPeriodCourseCardPreview);
