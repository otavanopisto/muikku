import React from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/general/dropdown";
import {
  OPSCourseTableContent,
  OPSCourseTableProps,
  RenderItemParams,
} from "~/components/general/OPS-matrix/OPS-course-table";
import { Table, TableHead, Td, Th, Tr } from "~/components/general/table";
import {
  getCourseInfo,
  getCourseStateLabel,
  getHighestCourseNumber,
  MANDATORITY_MANDATORY_VALUES,
  MANDATORITY_OPTIONAL_VALUES,
} from "~/helper-functions/study-matrix";
import { CurriculumConfig } from "~/util/curriculum-config";
import {
  OPSCourseCard,
  OPSCourseCardHeader,
  OPSCourseCardContent,
  OPSCourseCardLabel,
} from "~/components/general/OPS-matrix/OPS-course-card";
/**
 * Props interface for the ProgressTableStudySummary component.
 * Extends ProgressTableProps but omits specific properties while adding onSignUp functionality.
 */
interface ProgressTableProps
  extends Omit<
    OPSCourseTableProps,
    | "renderMandatoryCourseCellContent"
    | "renderOptionalCourseCellContent"
    | "currentMaxCourses"
  > {
  curriculumConfig: CurriculumConfig;
}

/**
 * Component that displays a summary table of a student's study progress.
 * Shows courses, their status, and available workspace suggestions for enrollment.
 *
 * @param props - Component properties
 */
const ProgressTable: React.FC<ProgressTableProps> = (props) => {
  const {
    matrix,
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    needSupplementationList,
    curriculumConfig,
  } = props;

  const { t } = useTranslation(["studyMatrix"]);

  const currentMaxCourses = getHighestCourseNumber(matrix);

  /**
   * renderCourseCell
   * @param params params
   * @returns JSX.Element
   */
  const renderCourseCell = (params: RenderItemParams) => {
    const { subject, course, tdModifiers } = params;

    const { modifiers, grade, needsSupplementation, currentActivityItem } =
      getCourseInfo(
        tdModifiers,
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
      <Td key={`${subject.code}-${course.courseNumber}`} modifiers={modifiers}>
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
          <span
            tabIndex={0}
            className="table__data-content-wrapper table__data-content-wrapper--course"
          >
            {courseTdContent}
            {MANDATORITY_OPTIONAL_VALUES.includes(course.mandatority) ? (
              <sup>*</sup>
            ) : null}
          </span>
        </Dropdown>
      </Td>
    );
  };

  return (
    <Table modifiers={["course"]}>
      {currentMaxCourses && (
        <TableHead modifiers={["course", "sticky"]}>
          <Tr modifiers={["course"]}>
            <Th modifiers={["subject"]}>
              {t("labels.schoolSubject", { ns: "studyMatrix" })}
            </Th>
            {Array.from({ length: currentMaxCourses }).map((_, index) => (
              <Th key={index} modifiers={["course"]}>
                {index + 1}
              </Th>
            ))}
          </Tr>
        </TableHead>
      )}
      <OPSCourseTableContent
        {...props}
        matrix={matrix}
        currentMaxCourses={currentMaxCourses}
        renderCourseCell={renderCourseCell}
      />
    </Table>
  );
};

export default ProgressTable;
