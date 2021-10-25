import { Suggestion, Course } from "../../../../../../../../@types/shared";
import promisify from "../../../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import * as React from "react";
import { updateSuggestion } from "../handlers/handlers";

export interface UseSuggestion {
  isLoading: boolean;
  suggestionsList: Suggestion[];
}

const initialState: UseSuggestion = {
  isLoading: true,
  suggestionsList: [],
};

export const useSuggestionList = (
  subjectCode: string,
  course: Course,
  loadData?: boolean
) => {
  const [suggestions, setSuggestins] =
    React.useState<UseSuggestion>(initialState);

  React.useEffect(() => {
    const loadSuggestionListData = async (
      subjectCode: string,
      course: Course
    ) => {
      setSuggestins({ ...suggestions, isLoading: true });

      const suggestionListForSubject = (await promisify(
        mApi().hops.listWorkspaceSuggestions.read({
          subject: subjectCode,
          courseNumber: course.courseNumber,
        }),
        "callback"
      )()) as Suggestion[];

      setTimeout(() => {
        setSuggestins({
          ...suggestions,
          isLoading: false,
          suggestionsList: suggestionListForSubject,
        });
      }, 1000);
    };

    if (loadData) {
      loadSuggestionListData(subjectCode, course);
    }
  }, [course, subjectCode, loadData]);

  return suggestions;
};
