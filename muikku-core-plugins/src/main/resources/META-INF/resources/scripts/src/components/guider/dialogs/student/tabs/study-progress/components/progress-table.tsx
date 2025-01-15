import React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import {
  OPSCourseTableContent,
  OPSCourseTableProps,
  RenderItemParams,
} from "~/components/general/OPS-matrix/OPS-course-table";
import SuggestionList, {
  SuggestionItemContext,
} from "~/components/general/suggestion-list/suggestion-list";
import { Table, TableHead, Td, Th, Tr } from "~/components/general/table";
import { StudentStudyActivity, WorkspaceSuggestion } from "~/generated/client";
import {
  compulsoryOrUpperSecondary,
  getCourseInfo,
  getHighestCourseNumber,
} from "~/helper-functions/study-matrix";

/**
 * GuiderStateOfStudiesTableProps
 */
interface ProgressTableProps
  extends Omit<
    OPSCourseTableProps,
    | "renderMandatoryCourseCellContent"
    | "renderOptionalCourseCellContent"
    | "currentMaxCourses"
    | "matrix"
  > {
  onSignUpBehalf?: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * GuiderStateOfStudiesTable
 * @param props props
 * @returns JSX.Element
 */
const ProgressTable: React.FC<ProgressTableProps> = (props) => {
  const {
    studentIdentifier,
    studentUserEntityId,
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    needSupplementationList,
    onSignUpBehalf,
  } = props;

  const { t } = useTranslation(["studyMatrix"]);

  const matrix = compulsoryOrUpperSecondary(
    props.studyProgrammeName,
    props.curriculumName
  );

  const currentMaxCourses = getHighestCourseNumber(matrix);

  /**
   * renderCourseCell
   * @param params params
   * @returns JSX.Element
   */
  const renderCourseCell = (params: RenderItemParams) => {
    const { subject, course, tdModifiers } = params;

    const {
      modifiers,
      courseSuggestions,
      canBeSelected,
      grade,
      needsSupplementation,
    } = getCourseInfo(
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
        subjectCode={subject.subjectCode}
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
              suggestedCourses={courseSuggestions}
              suggestionContext={context}
              onSignUpBehalf={onSignUpBehalf}
            />
          ));
        }}
      </SuggestionList>
    );

    const courseDropdownName =
      subject.subjectCode + course.courseNumber + " - " + course.name;

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
      <Td
        key={`${subject.subjectCode}-${course.courseNumber}`}
        modifiers={modifiers}
      >
        <Dropdown
          content={
            <div className="hops-container__study-tool-dropdown-container">
              <div className="hops-container__study-tool-dropdow-title">
                {course.mandatory
                  ? courseDropdownName
                  : `${courseDropdownName}*`}
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
        <TableHead modifiers={["course", "sticky-inside-dialog"]}>
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
 * SuggestionListContentProps
 */
interface SuggestionListContentProps {
  suggestion: WorkspaceSuggestion;
  suggestedCourses: StudentStudyActivity[];
  suggestionContext: SuggestionItemContext;
  onSignUpBehalf: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * SuggestionListContent
 * @param props props
 * @returns JSX.Element
 */
const SuggestionListContent = (props: SuggestionListContentProps) => {
  const { suggestion, suggestedCourses, suggestionContext, onSignUpBehalf } =
    props;

  const { t } = useTranslation(["studyMatrix"]);

  /**
   * handleSignUpBehalf
   * @param e e
   */
  const handleSignUpBehalf = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onSignUpBehalf && onSignUpBehalf(suggestion);
  };

  // By default "add" action
  let suggestionNextActionType: "add" | "remove" = "add";

  // Check if the suggestion is already in the courseSuggestions list
  const suggestedCourse = suggestedCourses.find(
    (sCourse) => sCourse.courseId === suggestion.id
  );

  // and the status is SUGGESTED_NEXT
  if (suggestedCourse && suggestedCourse.status === "SUGGESTED_NEXT") {
    // then the action is "remove"
    suggestionNextActionType = "remove";
  }

  let name = suggestion.name;

  // Add name extension if it exists
  if (suggestion.nameExtension) {
    name += ` (${suggestion.nameExtension})`;
  }

  return (
    <div
      key={suggestion.id}
      className="hops-container__study-tool-dropdow-suggestion-subsection"
    >
      <div className="hops-container__study-tool-dropdow-title">{name}</div>

      <Button
        buttonModifiers={[
          "guider-hops-studytool",
          "guider-hops-studytool-next",
        ]}
        onClick={suggestionContext.handleSuggestionNextClick({
          actionType: suggestionNextActionType,
          courseNumber: suggestionContext.course.courseNumber,
          subjectCode: suggestionContext.subjectCode,
          courseId: suggestion.id,
          studentId: suggestionContext.studentId,
        })}
      >
        {suggestionNextActionType === "remove"
          ? t("actions.suggested", { ns: "studyMatrix" })
          : t("actions.suggestToNext", { ns: "studyMatrix" })}
      </Button>

      {suggestion.canSignup && (
        <Button
          buttonModifiers={[
            "guider-hops-studytool",
            "guider-hops-studytool-next",
          ]}
          onClick={handleSignUpBehalf}
        >
          {t("actions.signupStudentToWorkspace", {
            ns: "studyMatrix",
          })}
        </Button>
      )}
    </div>
  );
};

export default ProgressTable;
