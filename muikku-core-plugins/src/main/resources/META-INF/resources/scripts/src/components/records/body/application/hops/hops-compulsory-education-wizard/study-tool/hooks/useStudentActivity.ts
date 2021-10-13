import * as React from "react";
import promisify from "../../../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import {
  CourseStatus,
  StudentActivityByStatus,
  StudentActivityCourse,
} from "~/@types/shared";

interface UseStudentActivityState extends StudentActivityByStatus {
  isLoading: boolean;
}

/**
 * useStudentActivity
 * Custom hook to return student activity data
 */
export const useStudentActivity = (studentId: string) => {
  const [studentActivity, setStudentActivity] =
    React.useState<UseStudentActivityState>(undefined);

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
          suggestedList: studentActivityByStatus.suggestedList,
          onGoingList: studentActivityByStatus.onGoingList,
          gradedList: studentActivityByStatus.gradedList,
          transferedList: studentActivityByStatus.transferedList,
        });
      }, 3000);
    };

    loadStudentActivityListData(studentId);
  }, [studentId]);

  return studentActivity;
};

const filterActivity = (
  list: StudentActivityCourse[]
): StudentActivityByStatus => {
  const onGoingList = list.filter(
    (item) => item.status === CourseStatus.ONGOING
  );
  const suggestedList = list.filter(
    (item) => item.status === CourseStatus.SUGGESTED
  );
  const transferedList = list.filter(
    (item) => item.status === CourseStatus.TRANSFERRED
  );
  const gradedList = list.filter((item) => item.status === CourseStatus.GRADED);

  return {
    onGoingList,
    suggestedList,
    transferedList,
    gradedList,
  };
};
