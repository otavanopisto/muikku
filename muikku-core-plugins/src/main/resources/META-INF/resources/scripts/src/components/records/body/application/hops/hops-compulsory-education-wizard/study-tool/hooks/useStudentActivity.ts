import * as React from "react";
import promisify from "../../../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import { updateSuggestion } from "../../suggestion-list/handlers/handlers";
import { WebsocketStateType } from "../../../../../../../../reducers/util/websocket";
import {
  CourseStatus,
  StudentActivityByStatus,
  StudentActivityCourse,
} from "~/@types/shared";

export interface UseStudentActivityState extends StudentActivityByStatus {
  isLoading: boolean;
}

/**
 * useStudentActivity
 * Custom hook to return student activity data
 */
export const useStudentActivity = (
  studentId: string,
  websocketState: WebsocketStateType
) => {
  const [studentActivity, setStudentActivity] =
    React.useState<UseStudentActivityState>({
      isLoading: true,
      onGoingList: [],
      transferedList: [],
      gradedList: [],
      suggestedNextList: [],
      suggestedOptionalList: [],
    });

  React.useEffect(() => {
    websocketState.websocket.addEventCallback(
      "hops:workspace-suggested",
      onAnswerSavedAtServer
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:workspace-suggested",
        onAnswerSavedAtServer
      );
    };
  }, []);

  React.useEffect(() => {
    const loadStudentActivityListData = async (studentId: string) => {
      setStudentActivity({ ...studentActivity, isLoading: true });

      setTimeout(async () => {
        const studentActivityList = (await promisify(
          mApi().hops.student.studyActivity.read(studentId),
          "callback"
        )()) as StudentActivityCourse[];

        const studentActivityByStatus = filterActivity(studentActivityList);

        setStudentActivity({
          ...studentActivity,
          isLoading: false,
          suggestedNextList: studentActivityByStatus.suggestedNextList,
          suggestedOptionalList: studentActivityByStatus.suggestedOptionalList,
          onGoingList: studentActivityByStatus.onGoingList,
          gradedList: studentActivityByStatus.gradedList,
          transferedList: studentActivityByStatus.transferedList,
        });
      }, 3000);
    };

    loadStudentActivityListData(studentId);
  }, [studentId]);

  const onAnswerSavedAtServer = (data: StudentActivityCourse) => {
    console.log(data);

    /*  let actualData = JSON.parse(data);

    console.log(actualData); */
  };

  return {
    studentActivity,
    updateSuggestion: (
      goal: "add" | "remove",
      courseNumber: number,
      subjectCode: string,
      suggestionId: number,
      studentId: string,
      type: "NEXT" | "OPTIONAL"
    ) =>
      updateSuggestion(
        setStudentActivity,
        goal,
        courseNumber,
        subjectCode,
        suggestionId,
        studentId,
        type
      ),
  };
};

const filterActivity = (
  list: StudentActivityCourse[]
): StudentActivityByStatus => {
  const onGoingList = list.filter(
    (item) => item.status === CourseStatus.ONGOING
  );
  const suggestedNextList = list.filter(
    (item) => item.status === CourseStatus.SUGGESTED_NEXT
  );
  const suggestedOptionalList = list.filter(
    (item) => item.status === CourseStatus.SUGGESTED_OPTIONAL
  );

  const transferedList = list.filter(
    (item) => item.status === CourseStatus.TRANSFERRED
  );
  const gradedList = list.filter((item) => item.status === CourseStatus.GRADED);

  return {
    onGoingList,
    suggestedNextList,
    suggestedOptionalList,
    transferedList,
    gradedList,
  };
};
