import * as React from "react";
import {
  PlannerCard,
  PlannerCardContent,
  PlannerCardHeader,
  PlannerCardLabel,
} from "../planner-card";
import { useHopsBasicInfo } from "~/context/hops-basic-info-context";
import { CourseMatrixModuleEnriched } from "~/@types/course-matrix";
import { MANDATORITY_MANDATORY_VALUES } from "~/helper-functions/study-matrix";

/**
 * PlannerCourseTrayItemPreview props
 */
interface PlannerCourseTrayItemPreviewProps {
  course: CourseMatrixModuleEnriched;
  subjectCode: string;
}

/**
 * PlannerCourseTrayItemPreview component
 * @param props props
 */
const PlannerCourseTrayItemPreview: React.FC<
  PlannerCourseTrayItemPreviewProps
> = (props) => {
  const { course, subjectCode } = props;

  const { curriculumConfig } = useHopsBasicInfo();

  const isMandatory = MANDATORITY_MANDATORY_VALUES.includes(course.mandatority);

  const typeModifiers = isMandatory ? ["mandatory"] : ["optional"];

  return (
    <div className="study-planner__course-tray-item">
      <PlannerCard
        modifiers={["course-tray-item", "preview"]}
        innerContainerModifiers={typeModifiers}
      >
        <PlannerCardHeader modifiers={["course-tray-item"]}>
          <span className="planner-course-tray-item__name">
            <b>{`${subjectCode} ${course.courseNumber}. `}</b>
            {`${course.name}, ${curriculumConfig.strategy.getCourseDisplayedLength(course.length)}`}
          </span>
        </PlannerCardHeader>

        <PlannerCardContent>
          <div className="study-planner__card-labels">
            <PlannerCardLabel modifiers={typeModifiers}>
              {isMandatory ? "PAKOLLINEN" : "VALINNAINEN"}
            </PlannerCardLabel>
          </div>
        </PlannerCardContent>
      </PlannerCard>
    </div>
  );
};

export default PlannerCourseTrayItemPreview;
