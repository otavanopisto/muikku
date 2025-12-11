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
  getCourseDropdownName,
  getCourseInfo,
  getHighestCourseNumber,
} from "~/helper-functions/study-matrix";

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
  > {}

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

    const { modifiers, grade, needsSupplementation } = getCourseInfo(
      tdModifiers,
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
      <Td key={`${subject.code}-${course.courseNumber}`} modifiers={modifiers}>
        <Dropdown
          content={
            <div className="hops-container__study-tool-dropdown-container">
              <div className="hops-container__study-tool-dropdow-title">
                {getCourseDropdownName(
                  subject,
                  course,
                  matrix.type === "UPPER_SECONDARY"
                )}
              </div>
            </div>
          }
        >
          <span
            tabIndex={0}
            className="table__data-content-wrapper table__data-content-wrapper--course"
          >
            {courseTdContent}
            {!course.mandatory ? <sup>*</sup> : null}
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
