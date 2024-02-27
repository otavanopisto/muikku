import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { UpdateSuggestionParams } from "../../../hooks/useStudentActivity";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import Button from "~/components/general/button";
import { useSuggestionList } from "./hooks/useSuggestedList";
import { StudentStudyActivity, WorkspaceSuggestion } from "~/generated/client";
import { Course } from "~/@types/shared";
import { useTranslation } from "react-i18next";

/**
 * SuggestionListProps
 */
interface HopsSuggestionListProps {
  studentId: string;
  studentsUserEntityId: number;
  course: Course;
  subjectCode: string;
  suggestedActivityCourses?: StudentStudyActivity[];
  displayNotification: DisplayNotificationTriggerType;
  loadData?: boolean;
  /**
   * Handler for suggestion next click
   * Must be passed as a prop because portal is used
   */
  updateSuggestionNext?: (params: UpdateSuggestionParams) => void;
  openSignUpBehalfDialog: (
    studentEntityId: number,
    suggestion: WorkspaceSuggestion
  ) => void;
  onCloseSignUpBehalfDialog: () => void;
}

/**
 * defaultSuggestionListProps
 */
const defaultSuggestionListProps = {
  loadData: true,
};

/**
 * Suggestion list component
 *
 * @param props props
 * @returns JSX.Element
 */
const SuggestionList = (props: HopsSuggestionListProps) => {
  props = { ...defaultSuggestionListProps, ...props };

  const { t } = useTranslation("studyMatrix");

  const { isLoading, suggestionsList } = useSuggestionList(
    props.subjectCode,
    props.course,
    props.studentsUserEntityId,
    props.displayNotification,
    props.loadData
  );

  /**
   * Handles open sign up behalf dialog
   * @param studentEntityId studentEntityId
   * @param suggestion suggestion
   */
  const handleOpenSignUpBehalfDialog =
    (studentEntityId: number, suggestion: WorkspaceSuggestion) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      props.openSignUpBehalfDialog(studentEntityId, suggestion);
    };

  /**
   * Handles suggestion next click
   *
   * @param params params
   */
  const handleSuggestionNextClick =
    (params: UpdateSuggestionParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      props.updateSuggestionNext && props.updateSuggestionNext(params);
    };

  // list of suggestion items
  const listItems =
    suggestionsList.length > 0 ? (
      suggestionsList.map((suggestion) => {
        // By default action type is always add
        let suggestionNextActionType: "add" | "remove" = "add";

        // If there is suggested activity courses
        if (props.suggestedActivityCourses) {
          const suggestedCourse = props.suggestedActivityCourses.find(
            (item) => item.courseId === suggestion.id
          );

          // If any of these condition happens, changes respectivily action type
          if (suggestedCourse && suggestedCourse.status === "SUGGESTED_NEXT") {
            suggestionNextActionType = "remove";
          }
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

            {suggestion.canSignup && (
              <Button
                buttonModifiers={[
                  "guider-hops-studytool",
                  "guider-hops-studytool-next",
                ]}
                onClick={handleSuggestionNextClick({
                  actionType: suggestionNextActionType,
                  courseNumber: props.course.courseNumber,
                  subjectCode: props.subjectCode,
                  courseId: suggestion.id,
                  studentId: props.studentId,
                })}
              >
                {suggestionNextActionType === "remove"
                  ? t("actions.suggested")
                  : t("actions.suggestToNext")}
              </Button>
            )}

            <Button
              buttonModifiers={[
                "guider-hops-studytool",
                "guider-hops-studytool-next",
              ]}
              onClick={handleOpenSignUpBehalfDialog(
                props.studentsUserEntityId,
                suggestion
              )}
            >
              {t("actions.signupStudentToWorkspace")}
            </Button>
          </div>
        );
      })
    ) : (
      <div className="hops-container__study-tool-dropdow-suggestion-subsection">
        <div className="hops-container__study-tool-dropdow-title">
          {t("content.noSuggestionAvailable")}
        </div>
      </div>
    );

  return (
    <div className="hops-container__study-tool-dropdow-suggestion-container">
      {isLoading ? <div className="loader-empty" /> : listItems}
    </div>
  );
};

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return { displayNotification };
}

export default connect(null, mapDispatchToProps)(SuggestionList);
