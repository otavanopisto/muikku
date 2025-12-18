import React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import {
  OPSCourseTableContent,
  OPSCourseTableProps,
  RenderItemParams,
} from "~/components/general/OPS-matrix/OPS-course-table";
import SuggestionList from "~/components/general/suggestion-list/suggestion-list";
import { Table, TableHead, Td, Th, Tr } from "~/components/general/table";
import { WorkspaceSuggestion } from "~/generated/client";
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
  > {
  /** Callback function to handle student sign-up for a workspace */
  onSignUp: (workspaceToSignUp: WorkspaceSuggestion) => void;
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
    studentIdentifier,
    studentUserEntityId,
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    needSupplementationList,
    onSignUp,
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

    const { modifiers, canBeSelected, grade, needsSupplementation } =
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

    const suggestionList = (
      <SuggestionList
        studentId={studentIdentifier}
        studentsUserEntityId={studentUserEntityId}
        subjectCode={subject.code}
        course={course}
      >
        {(context) => {
          if (context.suggestionList.length === 0) {
            return (
              <div className="hops-container__study-tool-dropdow-suggestion-subsection">
                <div className="hops-container__study-tool-dropdow-title">
                  {t("content.noSuggestionAvailable", {
                    context: "staff",
                    ns: "studyMatrix",
                  })}
                </div>
              </div>
            );
          }

          return context.suggestionList.map((suggestion) => (
            <SuggestionListContent
              key={suggestion.id}
              suggestion={suggestion}
              onSignUp={onSignUp}
            />
          ));
        }}
      </SuggestionList>
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
              {canBeSelected && suggestionList}
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

/**
 * Props interface for the SuggestionListContent component
 * @interface SuggestionListContentProps
 */
interface SuggestionListContentProps {
  /** Workspace suggestion data */
  suggestion: WorkspaceSuggestion;
  /** Callback function when user signs up for a workspace */
  onSignUp: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * Component that renders the content of a workspace suggestion including name and action buttons.
 *
 * @param props - Component properties
 */
const SuggestionListContent = (props: SuggestionListContentProps) => {
  const { suggestion, onSignUp } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * Handles sign up click
   * @param e e
   */
  const handleSignUpClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onSignUp(suggestion);
  };

  let name = suggestion.name;
  if (suggestion.nameExtension) {
    name += ` (${suggestion.nameExtension})`;
  }

  return (
    <div
      key={suggestion.id}
      className="hops-container__study-tool-dropdow-suggestion-subsection"
    >
      <div className="hops-container__study-tool-dropdow-title">{name}</div>
      {suggestion.canSignup && (
        <>
          <Button
            buttonModifiers={[
              "guider-hops-studytool",
              "guider-hops-studytool-next",
            ]}
            href={`/workspace/${suggestion.urlName}`}
            openInNewTab="_blank"
          >
            {t("actions.checkOut", { ns: "workspace" })}
          </Button>
          <Button
            buttonModifiers={[
              "guider-hops-studytool",
              "guider-hops-studytool-next",
            ]}
            onClick={handleSignUpClick}
          >
            {t("actions.signUp", { ns: "workspace" })}
          </Button>
        </>
      )}
    </div>
  );
};

export default ProgressTable;
