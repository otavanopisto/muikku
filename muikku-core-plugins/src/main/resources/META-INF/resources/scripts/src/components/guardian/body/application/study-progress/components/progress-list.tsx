import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { ListItem, ListItemIndicator } from "~/components/general/list";
import {
  compulsoryOrUpperSecondary,
  getCourseDropdownName,
  getCourseInfo,
} from "~/helper-functions/study-matrix";
import OPSCourseList, {
  OPSCourseListProps,
  RenderItemParams,
} from "~/components/general/OPS-matrix/OPS-course-list";
import { useTranslation } from "react-i18next";

/**
 * Component that displays a summary of a student's study progress in a list format.
 * It shows courses with their status (ongoing, graded, transferred) and provides
 * signup options for available course implementations.
 */
interface ProgressListProps
  extends Omit<
    OPSCourseListProps,
    | "renderMandatoryCourseItemContent"
    | "renderOptionalCourseItemContent"
    | "matrix"
  > {}

/**
 * Component that renders a list of courses with their progress status and available
 * course implementations. Each course can be clicked to show a dropdown with more
 * details and signup options.
 *
 * @param props - Component properties
 */
const ProgressList: React.FC<ProgressListProps> = (props) => {
  const {
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    needSupplementationList,
  } = props;
  const { t } = useTranslation(["studyMatrix", "workspace"]);

  const matrix = compulsoryOrUpperSecondary(
    props.studyProgrammeName,
    props.curriculumName
  );

  /**
   * Render optional course item content
   * @param params params
   * @returns JSX.Element
   */
  const renderCourseItem = (params: RenderItemParams) => {
    const { subject, course, listItemModifiers } = params;

    const { modifiers, grade, needsSupplementation } = getCourseInfo(
      listItemModifiers,
      subject,
      course,
      suggestedNextList,
      transferedList,
      gradedList,
      onGoingList,
      needSupplementationList
    );

    // By default content is mandatory or option shorthand
    let courseTdContent = course.mandatory
      ? t("labels.mandatoryShorthand", { ns: "studyMatrix" })
      : t("labels.optionalShorthand", { ns: "studyMatrix" });

    // If needs supplementation, then replace default with supplementation request shorthand
    if (needsSupplementation) {
      courseTdContent = t("labels.supplementationRequestShorthand", {
        ns: "studyMatrix",
      });
    }

    // If grade is available, then replace content with that
    if (grade) {
      courseTdContent = grade;
    }

    return (
      <ListItem
        key={`${subject.subjectCode}-${course.courseNumber}`}
        modifiers={["course"]}
      >
        <ListItemIndicator modifiers={modifiers}>
          <Dropdown
            content={
              <div className="hops-container__study-tool-dropdown-container">
                <div className="hops-container__study-tool-dropdow-title">
                  {getCourseDropdownName(
                    subject,
                    course,
                    matrix.type === "uppersecondary"
                  )}
                </div>
              </div>
            }
          >
            <span tabIndex={0} className="list__indicator-data-wapper">
              {courseTdContent}
              {!course.mandatory ? <sup>*</sup> : null}
            </span>
          </Dropdown>
        </ListItemIndicator>
      </ListItem>
    );
  };

  return (
    <OPSCourseList
      {...props}
      matrix={matrix?.subjectsTable ?? null}
      renderCourseItem={renderCourseItem}
    ></OPSCourseList>
  );
};

export default ProgressList;
