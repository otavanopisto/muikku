import React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import {
  ProgressTableContent,
  ProgressTableProps,
} from "~/components/general/study-progress2/progress-table";
import SuggestionList from "~/components/general/study-progress2/suggestion-list";
import { Table, TableHead, Td, Th, Tr } from "~/components/general/table";
import { WorkspaceSuggestion } from "~/generated/client";
import {
  compulsoryOrUpperSecondary,
  getCourseInfo,
  getHighestCourseNumber,
} from "~/helper-functions/study-matrix";

/**
 * GuiderStateOfStudiesTableProps
 */
interface GuiderStateOfStudiesTableProps
  extends Omit<
    ProgressTableProps,
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
const GuiderStateOfStudiesTable: React.FC<GuiderStateOfStudiesTableProps> = (
  props
) => {
  const {
    studentIdentifier,
    studentUserEntityId,
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    onSignUpBehalf,
  } = props;

  const { t } = useTranslation(["studyMatrix"]);

  const matrix = compulsoryOrUpperSecondary(
    props.studyProgrammeName,
    props.curriculumName
  );

  const currentMaxCourses = getHighestCourseNumber(matrix);

  /**
   * handleSignUpBehalf
   * @param workspaceToSignUp workspaceToSignUp
   */
  const handleSignUpBehalf =
    (workspaceToSignUp: WorkspaceSuggestion) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onSignUpBehalf && onSignUpBehalf(workspaceToSignUp);
    };

  return (
    <Table modifiers={["course"]}>
      <TableHead modifiers={["course", "sticky-inside-dialog"]}>
        <Tr modifiers={["course"]}>
          <Th modifiers={["subject"]}>
            {t("labels.schoolSubject", { ns: "studyMatrix" })}
          </Th>
          <Th colSpan={currentMaxCourses}>
            {t("labels.courses", { ns: "studyMatrix" })}
          </Th>
        </Tr>
      </TableHead>
      <ProgressTableContent
        {...props}
        matrix={matrix}
        currentMaxCourses={currentMaxCourses}
        renderMandatoryCourseCell={({ subject, course, tdModifiers }) => {
          const courseDropdownName =
            subject.subjectCode + course.courseNumber + " - " + course.name;

          const { modifiers, courseSuggestions, canBeSelected } = getCourseInfo(
            tdModifiers,
            subject,
            course,
            suggestedNextList,
            transferedList,
            gradedList,
            onGoingList
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

                return context.suggestionList.map((suggestion) => {
                  // By default "add" action
                  let suggestionNextActionType: "add" | "remove" = "add";

                  // Check if the suggestion is already in the courseSuggestions list
                  const suggestedCourse = courseSuggestions.find(
                    (sCourse) => sCourse.courseId === suggestion.id
                  );

                  // and the status is SUGGESTED_NEXT
                  if (
                    suggestedCourse &&
                    suggestedCourse.status === "SUGGESTED_NEXT"
                  ) {
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
                      <div className="hops-container__study-tool-dropdow-title">
                        {name}
                      </div>

                      <Button
                        buttonModifiers={[
                          "guider-hops-studytool",
                          "guider-hops-studytool-next",
                        ]}
                        onClick={context.handleSuggestionNextClick({
                          actionType: suggestionNextActionType,
                          courseNumber: course.courseNumber,
                          subjectCode: subject.subjectCode,
                          courseId: suggestion.id,
                          studentId: studentIdentifier,
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
                          onClick={handleSignUpBehalf(suggestion)}
                        >
                          {t("actions.signupStudentToWorkspace", {
                            ns: "studyMatrix",
                          })}
                        </Button>
                      )}
                    </div>
                  );
                });
              }}
            </SuggestionList>
          );

          return (
            <Td
              key={`${subject.subjectCode}-${course.courseNumber}`}
              modifiers={modifiers}
            >
              <Dropdown
                content={
                  <div className="hops-container__study-tool-dropdown-container">
                    <div className="hops-container__study-tool-dropdow-title">
                      {courseDropdownName}
                    </div>
                    {canBeSelected && suggestionList}
                  </div>
                }
              >
                <span
                  tabIndex={0}
                  className="table__data-content-wrapper table__data-content-wrapper--course"
                >
                  {course.courseNumber}
                </span>
              </Dropdown>
            </Td>
          );
        }}
        renderOptionalCourseCell={({ subject, course, tdModifiers }) => {
          const courseDropdownName =
            subject.subjectCode + course.courseNumber + " - " + course.name;

          const { modifiers, courseSuggestions, canBeSelected } = getCourseInfo(
            tdModifiers,
            subject,
            course,
            suggestedNextList,
            transferedList,
            gradedList,
            onGoingList
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

                return context.suggestionList.map((suggestion) => {
                  // By default "add" action
                  let suggestionNextActionType: "add" | "remove" = "add";

                  // Check if the suggestion is already in the courseSuggestions list
                  const suggestedCourse = courseSuggestions.find(
                    (sCourse) => sCourse.courseId === suggestion.id
                  );

                  // and the status is SUGGESTED_NEXT
                  if (
                    suggestedCourse &&
                    suggestedCourse.status === "SUGGESTED_NEXT"
                  ) {
                    // then the action is "remove"
                    suggestionNextActionType = "remove";
                  }

                  let name = suggestion.name;

                  if (suggestion.nameExtension) {
                    name += ` (${suggestion.nameExtension})`;
                  }

                  return (
                    <div
                      key={suggestion.id}
                      className="hops-container__study-tool-dropdow-suggestion-subsection"
                    >
                      <div className="hops-container__study-tool-dropdow-title">
                        {name}
                      </div>

                      <Button
                        buttonModifiers={[
                          "guider-hops-studytool",
                          "guider-hops-studytool-next",
                        ]}
                        onClick={context.handleSuggestionNextClick({
                          actionType: suggestionNextActionType,
                          courseNumber: course.courseNumber,
                          subjectCode: subject.subjectCode,
                          courseId: suggestion.id,
                          studentId: studentIdentifier,
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
                          onClick={handleSignUpBehalf(suggestion)}
                        >
                          {t("actions.signupStudentToWorkspace", {
                            ns: "studyMatrix",
                          })}
                        </Button>
                      )}
                    </div>
                  );
                });
              }}
            </SuggestionList>
          );

          return (
            <Td
              key={`${subject.subjectCode}-${course.courseNumber}`}
              modifiers={modifiers}
            >
              <Dropdown
                content={
                  <div className="hops-container__study-tool-dropdown-container">
                    <div className="hops-container__study-tool-dropdow-title">
                      {`${courseDropdownName}*`}
                    </div>
                    {canBeSelected && suggestionList}
                  </div>
                }
              >
                <span
                  tabIndex={0}
                  className="table__data-content-wrapper table__data-content-wrapper--course"
                >
                  {`${course.courseNumber}*`}
                </span>
              </Dropdown>
            </Td>
          );
        }}
      />
    </Table>
  );
};

export default GuiderStateOfStudiesTable;
