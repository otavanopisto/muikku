import { Suggestion, Course } from "../../../../../../../../@types/shared";
import promisify from "../../../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import * as React from "react";

export interface UseSuggestion {
  isLoading: boolean;
  suggestionsList: Suggestion[];
}

const initialState: UseSuggestion = {
  isLoading: true,
  suggestionsList: [],
};

export const useSuggestionList = (subjectCode: string, course: Course) => {
  const [suggestions, setSuggestins] =
    React.useState<UseSuggestion>(initialState);

  React.useEffect(() => {
    const loadSuggestionListData = async (
      subjectCode: string,
      course: Course
    ) => {
      setSuggestins({ ...suggestions, isLoading: true });

      setTimeout(async () => {
        const suggestionListForSubject = (await promisify(
          mApi().hops.listWorkspaceSuggestions.read({
            subject: subjectCode,
            courseNumber: course.courseNumber,
          }),
          "callback"
        )()) as Suggestion[];

        setSuggestins({
          ...suggestions,
          isLoading: false,
          suggestionsList: suggestionListForSubject,
        });
      }, 3000);
    };

    loadSuggestionListData(subjectCode, course);
  }, [course, subjectCode]);

  return suggestions;
};
