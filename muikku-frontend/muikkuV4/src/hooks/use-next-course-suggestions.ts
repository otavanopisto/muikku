import { useCallback, useMemo } from "react";
import { useAtomValue } from "jotai";
import { studentStudyActivityDataAtom } from "~/src/atoms/hops";
import { type StudyActivityItem } from "~/generated/client";
import { getCoursepickerApi } from "~/api";
import { handleApiError } from "~/src/atoms/helpers/error";
import { notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

import {
  queryClient,
  STUDENT_STUDY_ACTIVITY_QUERY_KEY,
} from "~/src/queryClient";

type NextCourseSuggestion = StudyActivityItem & { courseId: number };

const isNextCourseSuggestion = (
  activity: StudyActivityItem
): activity is NextCourseSuggestion =>
  activity.state === "SUGGESTED_NEXT" && activity.courseId !== null;

const coursepickerApi = getCoursepickerApi();

/**
 * Next courses derived from the student's study activity items.
 */
export function useNextCourseSuggestions() {
  const studentStudyActivity = useAtomValue(studentStudyActivityDataAtom);
  /**
   * Sign up for a course.
   * @param courseId - The ID of the course to sign up for.
   * @param message - The message to send to the course.
   * @param onSuccess - The function to call when the course is signed up for.
   */
  const signUpForCourse = useCallback(
    async (courseId: number, message: string) => {
      try {
        await coursepickerApi.workspaceSignUp({
          workspaceId: courseId,
          workspaceSignUpRequest: {
            message,
          },
        });
        await queryClient.invalidateQueries({
          queryKey: STUDENT_STUDY_ACTIVITY_QUERY_KEY,
        });
        notifications.show({
          title: "Course signed up successfully",
          message: "You have been signed up for the course",
          color: "green",
        });
      } catch (error) {
        handleApiError(error, "Failed to sign up for course");
      }
    },
    []
  );

  const nextCourseSuggestions = useMemo(() => {
    if (!studentStudyActivity) return [];
    return studentStudyActivity.items.filter(isNextCourseSuggestion);
  }, [studentStudyActivity]);

  return { nextCourseSuggestions, signUpForCourse };
}
