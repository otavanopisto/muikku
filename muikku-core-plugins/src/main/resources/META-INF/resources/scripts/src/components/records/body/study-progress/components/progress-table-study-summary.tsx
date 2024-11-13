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
interface ProgressTableStudySummaryProps
  extends Omit<
    ProgressTableProps,
    | "renderMandatoryCourseCellContent"
    | "renderOptionalCourseCellContent"
    | "currentMaxCourses"
    | "matrix"
  > {
  onSignUp: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * GuiderStateOfStudiesTable
 * @param props props
 * @returns JSX.Element
 */
const ProgressTableStudySummary: React.FC<ProgressTableStudySummaryProps> = (
  props
) => {
  const {
    studentIdentifier,
    studentUserEntityId,
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    onSignUp,
  } = props;

  const { t } = useTranslation(["studyMatrix"]);

  const matrix = compulsoryOrUpperSecondary(
    props.studyProgrammeName,
    props.curriculumName
  );

  const currentMaxCourses = getHighestCourseNumber(matrix);

  /**
   * Handles sign up click
   * @param workspaceToSignUp workspaceToSignUp
   */
  const handleSignUpClick =
    (workspaceToSignUp: WorkspaceSuggestion) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onSignUp(workspaceToSignUp);
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

          const { modifiers, canBeSelected } = getCourseInfo(
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
                            onClick={handleSignUpClick(suggestion)}
                          >
                            {t("actions.signUp", { ns: "workspace" })}
                          </Button>
                        </>
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

          const { modifiers, canBeSelected } = getCourseInfo(
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
                            onClick={handleSignUpClick(suggestion)}
                          >
                            {t("actions.signUp", { ns: "workspace" })}
                          </Button>
                        </>
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

export default ProgressTableStudySummary;
