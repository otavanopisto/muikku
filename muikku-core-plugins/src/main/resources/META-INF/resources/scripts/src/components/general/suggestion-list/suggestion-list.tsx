import * as React from "react";
import { connect } from "react-redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import {
  UpdateSuggestionParams,
  useSuggestionList,
} from "./hooks/useSuggestedList";
import { WorkspaceSuggestion } from "~/generated/client";
import { Course } from "~/@types/shared";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * SuggestionItemContext
 */
export interface SuggestionItemContext {
  suggestionList: WorkspaceSuggestion[];
  handleSuggestionNextClick: (
    params: UpdateSuggestionParams
  ) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  course: Course;
  subjectCode: string;
  studentId: string;
}

/**
 * SuggestionListProps
 */
interface HopsSuggestionListProps {
  studentId: string;
  studentsUserEntityId: number;
  course: Course;
  subjectCode: string;
  displayNotification: DisplayNotificationTriggerType;
  loadData?: boolean;
  children: (context: SuggestionItemContext) => React.ReactNode;
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

  const {
    subjectCode,
    course,
    studentsUserEntityId,
    displayNotification,
    loadData,
  } = props;

  const { isLoading, suggestionList, updateSuggestionForNext } =
    useSuggestionList(
      subjectCode,
      course,
      studentsUserEntityId,
      displayNotification,
      loadData
    );

  /**
   * Handles suggestion next click
   *
   * @param params params
   */
  const handleSuggestionNextClick =
    (params: UpdateSuggestionParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      updateSuggestionForNext(params);
    };

  const context: SuggestionItemContext = {
    suggestionList,
    handleSuggestionNextClick,
    course: props.course,
    subjectCode: props.subjectCode,
    studentId: props.studentId,
  };

  return (
    <div className="hops-container__study-tool-dropdow-suggestion-container">
      {isLoading ? <div className="loader-empty" /> : props.children(context)}
    </div>
  );
};

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return { displayNotification };
}

export default connect(null, mapDispatchToProps)(SuggestionList);
