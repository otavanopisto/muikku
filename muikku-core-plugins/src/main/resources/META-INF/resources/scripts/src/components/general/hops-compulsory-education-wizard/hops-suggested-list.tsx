import * as React from "react";
import { useSuggestionList } from "./hooks/useSuggestedList";
import { connect, Dispatch } from "react-redux";
import { Course } from "~/@types/shared";
import { UpdateSuggestionParams } from "../../../hooks/useStudentActivity";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import Button from "~/components/general/button";
import { StudentStudyActivity } from "~/generated/client";

/**
 * SuggestionListProps
 */
interface HopsSuggestionListProps {
  subjectCode: string;
  suggestedActivityCourses?: StudentStudyActivity[];
  course: Course;
  studentId: string;
  studentsUserEntityId: number;
  displayNotification: DisplayNotificationTriggerType;
  loadData?: boolean;
  canSuggestForNext: boolean;
  onLoad?: () => void;
  updateSuggestionNext?: (params: UpdateSuggestionParams) => void;
  updateSuggestionOptional?: (params: UpdateSuggestionParams) => void;
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
    props.studentsUserEntityId,
    props.displayNotification,
    props.loadData
  );

  React.useEffect(() => {
    if (!isLoading && onLoad) {
      onLoad();
    }
  }, [isLoading, onLoad]);

  /**
   * handleSuggestionNextClick
   * @param params params
   */
  const handleSuggestionNextClick =
    (params: UpdateSuggestionParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      props.updateSuggestionNext && props.updateSuggestionNext(params);
    };

  /**
   * list of suggestion items
   */
  const listItems =
    suggestionsList.length > 0 ? (
      suggestionsList.map((suggestion) => {
        // By default action type is always add
        let suggestionNextActionType: "add" | "remove" = "add";

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
          }
        }

        return (
          <div
            key={suggestion.id}
            className="hops-container__study-tool-dropdow-suggestion-subsection"
          >
            <div className="hops-container__study-tool-dropdow-title">
              {suggestion.name} ({suggestion.nameExtension})
            </div>
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
                ? "Ehdotettu"
                : "Ehdota seuraavaksi"}
            </Button>
          </div>
        );
      })
    ) : (
      <div className="hops-container__study-tool-dropdow-suggestion-subsection">
        <div className="hops-container__study-tool-dropdow-title">
          Ei kursseja. Tarkista kurssitarjonta!
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

export default connect(null, mapDispatchToProps)(HopsSuggestionList);
