import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { ListItem, ListItemIndicator } from "~/components/general/list";
import {
  getCourseInfo,
  getCourseStateLabel,
  MANDATORITY_MANDATORY_VALUES,
  MANDATORITY_OPTIONAL_VALUES,
} from "~/helper-functions/study-matrix";
import OPSCourseList, {
  OPSCourseListProps,
  RenderItemParams,
} from "~/components/general/OPS-matrix/OPS-course-list";
import { useTranslation } from "react-i18next";
import { CurriculumConfig } from "~/util/curriculum-config";
import {
  OPSCourseCard,
  OPSCourseCardContent,
  OPSCourseCardHeader,
  OPSCourseCardLabel,
} from "~/components/general/OPS-matrix/OPS-course-card";

/**
 * Component that displays a summary of a student's study progress in a list format.
 * It shows courses with their status (ongoing, graded, transferred) and provides
 * signup options for available course implementations.
 */
interface ProgressListProps
  extends Omit<
    OPSCourseListProps,
    "renderMandatoryCourseItemContent" | "renderOptionalCourseItemContent"
  > {
  curriculumConfig: CurriculumConfig;
}

/**
 * Component that renders a list of courses with their progress status and available
 * course implementations. Each course can be clicked to show a dropdown with more
 * details and signup options.
 *
 * @param props - Component properties
 */
const ProgressList: React.FC<ProgressListProps> = (props) => {
  const {
    matrix,
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    needSupplementationList,
    curriculumConfig,
  } = props;
  const { t } = useTranslation(["studyMatrix", "workspace"]);

  /**
   * Render optional course item content
   * @param params params
   * @returns JSX.Element
   */
  const renderCourseItem = (params: RenderItemParams) => {
    const { subject, course, listItemModifiers } = params;

    const { modifiers, grade, needsSupplementation, currentActivityItem } =
      getCourseInfo(
        listItemModifiers,
        subject,
        course,
        suggestedNextList,
        transferedList,
        gradedList,
        onGoingList,
        needSupplementationList
      );

    const currentActivityItemLabel = getCourseStateLabel(
      currentActivityItem,
      t
    );

    const isMandatory = MANDATORITY_MANDATORY_VALUES.includes(
      course.mandatority
    );

    // By default content is mandatory or option shorthand
    let courseTdContent = isMandatory
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
        key={`${subject.code}-${course.courseNumber}`}
        modifiers={["course"]}
      >
        <ListItemIndicator modifiers={modifiers}>
          <Dropdown
            content={
              <div className="hops-container__study-tool-dropdown-container">
                <OPSCourseCard
                  innerContainerModifiers={
                    isMandatory ? ["mandatory"] : ["optional"]
                  }
                >
                  <OPSCourseCardHeader>
                    <span className="ops-course__card-title">
                      <b>{`${subject.code}${course.courseNumber}`}</b>{" "}
                      {curriculumConfig
                        ? `${course.name}, ${curriculumConfig.strategy.getCourseDisplayedLength(course.length)}`
                        : `${course.name}`}
                    </span>
                  </OPSCourseCardHeader>
                  <OPSCourseCardContent>
                    <div className="ops-course__card-labels">
                      <OPSCourseCardLabel
                        modifiers={[isMandatory ? "mandatory" : "optional"]}
                      >
                        {isMandatory
                          ? t("labels.mandatory", { ns: "common" })
                          : t("labels.optional", { ns: "common" })}
                      </OPSCourseCardLabel>

                      {currentActivityItemLabel && (
                        <OPSCourseCardLabel
                          modifiers={[currentActivityItemLabel.state]}
                        >
                          {currentActivityItemLabel.label}
                        </OPSCourseCardLabel>
                      )}
                    </div>
                  </OPSCourseCardContent>
                </OPSCourseCard>
              </div>
            }
          >
            <span tabIndex={0} className="list__indicator-data-wapper">
              {courseTdContent}
              {MANDATORITY_OPTIONAL_VALUES.includes(course.mandatority) ? (
                <sup>*</sup>
              ) : null}
            </span>
          </Dropdown>
        </ListItemIndicator>
      </ListItem>
    );
  };

  return (
    <OPSCourseList
      {...props}
      matrix={matrix}
      renderCourseItem={renderCourseItem}
    ></OPSCourseList>
  );
};

export default ProgressList;
