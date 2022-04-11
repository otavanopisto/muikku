import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useSuggestionList } from "./hooks/useSuggestedList";
import { connect, Dispatch } from "react-redux";
import { Course, StudentActivityCourse } from "~/@types/shared";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { UpdateSuggestionParams } from "../../../hooks/useStudentActivity";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import Button from "~/components/general/button";

/**
 * SuggestionListProps
 */
interface HopsSuggestionListProps {
  subjectCode: string;
  suggestedActivityCourses?: StudentActivityCourse[];
  course: Course;
  i18n: i18nType;
  studentId: string;
  displayNotification: DisplayNotificationTriggerType;
  loadData?: boolean;
  canSuggestForNext: boolean;
  canSuggestForOptional: boolean;
  onLoad?: () => void;
  updateSuggestion: (params: UpdateSuggestionParams) => void;
}

/**
 * defaultSuggestionListProps
 */
const defaultSuggestionListProps = {
  loadData: true,
};

/**
 * SuggestionList
 * @param props props
 * @returns JSX.Element
 */
const HopsSuggestionList = (props: HopsSuggestionListProps) => {
  props = { ...defaultSuggestionListProps, ...props };

  const { onLoad } = props;

  const { isLoading, suggestionsList } = useSuggestionList(
    props.subjectCode,
    props.course,
    props.displayNotification,
    props.loadData
  );

  React.useEffect(() => {
    if (!isLoading && onLoad) {
      onLoad();
    }
  }, [isLoading, onLoad]);

  /**
   * handleSuggestionClick
   * @param type Suggestion type
   * @param actionType Action type aka "delete" or "add"
   * @param suggestionId Suggestion id
   */
  const handleSuggestionClick =
    (
      type: "NEXT" | "OPTIONAL",
      actionType: "remove" | "add",
      suggestionId: number
    ) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      props.updateSuggestion({
        goal: actionType,
        courseNumber: props.course.courseNumber,
        subjectCode: props.subjectCode,
        suggestionId: suggestionId,
        studentId: props.studentId,
        type: type,
      });
    };

  /**
   * list of suggestion items
   */
  const listItems =
    suggestionsList.length > 0 ? (
      suggestionsList.map((suggestion) => {
        // By default action type is always add
        let suggestionNextActionType: "add" | "remove" = "add";
        let suggestionOptionalActionType: "add" | "remove" = "add";

        /**
         * If there is suggested activity courses
         */
        if (props.suggestedActivityCourses) {
          const suggestedCourse = props.suggestedActivityCourses.find(
            (item) => item.courseId === suggestion.id
          );

          /**
           * If any of these condition happens, changes respectivily action type
           */
          if (suggestedCourse && suggestedCourse.status === "SUGGESTED_NEXT") {
            suggestionNextActionType = "remove";
          } else if (
            suggestedCourse &&
            suggestedCourse.status === "SUGGESTED_OPTIONAL"
          ) {
            suggestionOptionalActionType = "remove";
          }
        }

        return (
          <div key={suggestion.id}>
            {isLoading ? (
              <div className="loader-empty" />
            ) : (
              <>
                <div className="hops-container__study-tool-dropdow-subsection">
                  <div className="hops-container__study-tool-dropdow-title">
                    Ehdota:
                  </div>
                  <Button
                    buttonModifiers={[
                      "guider-hops-studytool",
                      "guider-hops-studytool-next",
                    ]}
                    onClick={handleSuggestionClick(
                      "NEXT",
                      suggestionNextActionType,
                      suggestion.id
                    )}
                  >
                    {suggestionNextActionType === "remove"
                      ? "Ehdotettu"
                      : "Seuraavaksi?"}
                  </Button>
                  {props.canSuggestForOptional && !props.course.mandatory && (
                    <Button
                      buttonModifiers={[
                        "guider-hops-studytool",
                        "guider-hops-studytool-suggested",
                      ]}
                      onClick={handleSuggestionClick(
                        "OPTIONAL",
                        suggestionOptionalActionType,
                        suggestion.id
                      )}
                    >
                      {suggestionOptionalActionType === "remove"
                        ? "Ehdotettu"
                        : "Valinnaiseksi?"}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })
    ) : (
      <div className="hops-container__study-tool-dropdow-subsection">
        <div className="hops-container__study-tool-dropdow-title">
          Ei kursseja. Tarkista kurssitarjonta!
        </div>
      </div>
    );

  return (
    <AnimateHeight height="auto">
      {isLoading ? <div className="loader-empty" /> : listItems}
    </AnimateHeight>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return { displayNotification };
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsSuggestionList);
