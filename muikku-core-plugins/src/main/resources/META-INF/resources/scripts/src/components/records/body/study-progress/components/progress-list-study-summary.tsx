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
import Button from "~/components/general/button";
import SuggestionList from "~/components/general/study-progress2/suggestion-list";
import { useTranslation } from "react-i18next";
import { WorkspaceSuggestion } from "~/generated/client";

/**
 * GuiderStateOfStudiesListProps
 */
interface ProgressListStudySummaryProps
  extends Omit<
    ProgressListProps,
    | "renderMandatoryCourseItemContent"
    | "renderOptionalCourseItemContent"
    | "matrix"
  > {
  onSignUp: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * HopsPlanningList
 * @param props props
 * @returns JSX.Element
 */
const ProgressListStudySummary: React.FC<ProgressListStudySummaryProps> = (
  props
) => {
  const {
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    studentIdentifier,
    studentUserEntityId,
    onSignUp,
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

    const { modifiers, canBeSelected } = getCourseInfo(
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
              onSignUp={onSignUp}
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
  onSignUp: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * SuggestionListContent
 * @param props props
 * @returns JSX.Element
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

export default ProgressListStudySummary;
