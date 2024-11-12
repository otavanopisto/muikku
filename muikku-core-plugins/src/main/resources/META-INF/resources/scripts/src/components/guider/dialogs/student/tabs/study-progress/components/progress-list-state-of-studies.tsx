import * as React from "react";
//import { useTranslation } from "react-i18next";
import Dropdown from "~/components/general/dropdown";
import { ListItem, ListItemIndicator } from "~/components/general/list";
import {
  compulsoryOrUpperSecondary,
  getCourseInfo,
} from "~/helper-functions/study-matrix";
import ProgressList, {
  ProgressListProps,
  RenderItemParams,
} from "~/components/general/study-progress2/progress-list";
import { WorkspaceSuggestion } from "~/generated/client";
import Button from "~/components/general/button";
import SuggestionList from "~/components/general/study-progress2/suggestion-list";
import { useTranslation } from "react-i18next";

/**
 * GuiderStateOfStudiesListProps
 */
interface GuiderStateOfStudiesListProps
  extends Omit<
    ProgressListProps,
    | "renderMandatoryCourseItemContent"
    | "renderOptionalCourseItemContent"
    | "matrix"
  > {
  onSignUpBehalf?: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * HopsPlanningList
 * @param props props
 * @returns JSX.Element
 */
const GuiderStateOfStudiesList: React.FC<GuiderStateOfStudiesListProps> = (
  props
) => {
  const {
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    studentIdentifier,
    studentUserEntityId,
    onSignUpBehalf,
  } = props;
  const { t } = useTranslation(["studyMatrix"]);

  const matrix = compulsoryOrUpperSecondary(
    props.studyProgrammeName,
    props.curriculumName
  );

  /**
   * handleSignUpBehalf
   * @param workspaceToSignUp workspaceToSignUp
   */
  const handleSignUpBehalf =
    (workspaceToSignUp: WorkspaceSuggestion) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onSignUpBehalf && onSignUpBehalf(workspaceToSignUp);
    };

  /**
   * Render mandatory course item content
   * @param params params
   * @returns JSX.Element
   */
  const renderMandatoryCourseItem = (params: RenderItemParams) => {
    const { subject, course, listItemModifiers } = params;

    const { modifiers, courseSuggestions, canBeSelected } = getCourseInfo(
      listItemModifiers,
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
      <ListItem
        key={`${subject.subjectCode}-${course.courseNumber}`}
        modifiers={["course"]}
      >
        <ListItemIndicator modifiers={modifiers}>
          <Dropdown
            content={
              <div className="hops-container__study-tool-dropdown-container">
                <div className="hops-container__study-tool-dropdow-title">
                  {course.name}
                </div>
                {canBeSelected && suggestionList}
              </div>
            }
          >
            <span tabIndex={0} className="list__indicator-data-wapper">
              {course.courseNumber}
            </span>
          </Dropdown>
        </ListItemIndicator>
      </ListItem>
    );
  };

  /**
   * Render optional course item content
   * @param params params
   * @returns JSX.Element
   */
  const renderOptionalCourseItem = (params: RenderItemParams) => {
    const { subject, course, listItemModifiers } = params;

    const { modifiers, courseSuggestions, canBeSelected } = getCourseInfo(
      listItemModifiers,
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
      <ListItem
        key={`${subject.subjectCode}-${course.courseNumber}`}
        modifiers={["course"]}
      >
        <ListItemIndicator modifiers={modifiers}>
          <Dropdown
            content={
              <div className="hops-container__study-tool-dropdown-container">
                <div className="hops-container__study-tool-dropdow-title">
                  {`${course.name}*`}
                </div>
                {canBeSelected && suggestionList}
              </div>
            }
          >
            <span tabIndex={0} className="list__indicator-data-wapper">
              {`${course.courseNumber}*`}
            </span>
          </Dropdown>
        </ListItemIndicator>
      </ListItem>
    );
  };

  return (
    <ProgressList
      {...props}
      matrix={matrix}
      renderMandatoryCourseItem={renderMandatoryCourseItem}
      renderOptionalCourseItem={renderOptionalCourseItem}
    ></ProgressList>
  );
};

export default GuiderStateOfStudiesList;
