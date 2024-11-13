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
import { StudentStudyActivity, WorkspaceSuggestion } from "~/generated/client";
import Button from "~/components/general/button";
import SuggestionList, {
  SuggestionItemContext,
} from "~/components/general/study-progress2/suggestion-list";
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
   * Render optional course item content
   * @param params params
   * @returns JSX.Element
   */
  const renderCourseItem = (params: RenderItemParams) => {
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
                  {course.mandatory
                    ? courseDropdownName
                    : `${courseDropdownName}*`}
                </div>
                {canBeSelected && suggestionList}
              </div>
            }
          >
            <span tabIndex={0} className="list__indicator-data-wapper">
              {course.mandatory
                ? course.courseNumber
                : `${course.courseNumber}*`}
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
      renderCourseItem={renderCourseItem}
    ></ProgressList>
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
   * Handles sign up behalf click
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

export default GuiderStateOfStudiesList;
