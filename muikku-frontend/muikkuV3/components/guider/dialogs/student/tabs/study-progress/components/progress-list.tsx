import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { ListItem, ListItemIndicator } from "~/components/general/list";
import {
  getCourseDropdownName,
  getCourseInfo,
} from "~/helper-functions/study-matrix";
import OPSCourseList, {
  OPSCourseListProps,
  RenderItemParams,
} from "~/components/general/OPS-matrix/OPS-course-list";
import { StudentStudyActivity, WorkspaceSuggestion } from "~/generated/client";
import Button from "~/components/general/button";
import SuggestionList, {
  SuggestionItemContext,
} from "~/components/general/suggestion-list/suggestion-list";
import { useTranslation } from "react-i18next";

/**
 * StateOfStudiesProgressListProps
 */
interface ProgressListProps
  extends Omit<
    OPSCourseListProps,
    "renderMandatoryCourseItemContent" | "renderOptionalCourseItemContent"
  > {
  onSignUpBehalf?: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * HopsPlanningList
 * @param props props
 * @returns JSX.Element
 */
const ProgressList: React.FC<ProgressListProps> = (props) => {
  const {
    matrix,
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    needSupplementationList,
    studentIdentifier,
    studentUserEntityId,
    onSignUpBehalf,
  } = props;
  const { t } = useTranslation(["studyMatrix"]);

  /**
   * Render optional course item content
   * @param params params
   * @returns JSX.Element
   */
  const renderCourseItem = (params: RenderItemParams) => {
    const { subject, course, listItemModifiers } = params;

    const {
      modifiers,
      courseSuggestions,
      canBeSelected,
      grade,
      needsSupplementation,
    } = getCourseInfo(
      listItemModifiers,
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
              suggestedCourses={courseSuggestions}
              suggestionContext={context}
              onSignUpBehalf={onSignUpBehalf}
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
      <ListItem
        key={`${subject.code}-${course.courseNumber}`}
        modifiers={["course"]}
      >
        <ListItemIndicator modifiers={modifiers}>
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
            <span tabIndex={0} className="list__indicator-data-wapper">
              {courseTdContent}
              {!course.mandatory ? <sup>*</sup> : null}
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

      {
        // In guider side, suggestion next is only avaiable if student has permissions to signup
        // but student can be signed up by guider even if they don't have permissions to signup themself
      }
      {suggestion.canSignup && (
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
      )}

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
    </div>
  );
};

export default ProgressList;
