import * as React from "react";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import {
  PlannerCardActions,
  PlannerCardContent,
  PlannerCardHeader,
  PlannerCardLabel,
} from "../planner-card";
import { PlannerCard } from "../planner-card";
import Button from "~/components/general/button";

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
    <PlannerCard modifiers={["planned-course-card", "preview"]}>
      <PlannerCardHeader modifiers={["planned-course-card"]}>
        <span className="study-planner__course-code">
          {`${course.subjectCode}-${course.courseNumber}`}
        </span>
        <span className="study-planner__course-name">{course.name}</span>
      </PlannerCardHeader>

      <PlannerCardContent modifiers={["planned-course-card"]}>
        <PlannerCardLabel
          modifiers={[course.mandatory ? "mandatory" : "optional"]}
        >
          {course.mandatory ? "PAKOLLINEN" : "VALINNAINEN"}
        </PlannerCardLabel>
        <PlannerCardLabel modifiers={["course-length"]}>
          {course.length} op
        </PlannerCardLabel>
        <span className="study-planner__course-dates">
          {calculatedEndDate ? (
            <>
              {course.startDate.toLocaleDateString()} -{" "}
              {calculatedEndDate.toLocaleDateString()}
            </>
          ) : (
            course.startDate.toLocaleDateString()
          )}
        </span>
      </PlannerCardContent>

      <PlannerCardActions modifiers={["planned-course-card"]}>
        <Button buttonModifiers={["primary"]}>Tarkenna</Button>
        <Button buttonModifiers={["danger"]}>Poista</Button>
      </PlannerCardActions>
    </PlannerCard>
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
