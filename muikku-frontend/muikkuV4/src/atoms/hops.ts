import { atomWithQuery } from "jotai-tanstack-query";
import { atom } from "jotai";
import { getHopsApi } from "~/api";
import { userAtom } from "./auth";
import {
  STUDENT_COURSE_MATRIX_QUERY_KEY,
  WORKSPACE_SUGGESTIONS_QUERY_KEY,
} from "src/queryClient";

const hopsApi = getHopsApi();

export const studentCourseMatrixAtomWithQuery = atomWithQuery((get) => {
  const user = get(userAtom);
  const { identifier: studentIdentifier, profile } = user ?? {};
  const educationTypeCode = profile?.educationTypeCode;
  return {
    queryKey: [...STUDENT_COURSE_MATRIX_QUERY_KEY, studentIdentifier],
    enabled: !!studentIdentifier,
    queryFn: async () => {
      if (!studentIdentifier || !educationTypeCode) {
        throw new Error("Student identifier is required");
      }
      return hopsApi.getStudentCourseMatrix({
        studentIdentifier,
        educationTypeCode,
      });
    },
  };
});

export const wokspaceSuggestionsQueryAtom = atomWithQuery((get) => {
  const { id: userEntityId } = get(userAtom) ?? {};
  const { subjects } = get(studentCourseMatrixDataAtom) ?? {};

  return {
    queryKey: WORKSPACE_SUGGESTIONS_QUERY_KEY,
    enabled: !!userEntityId && !!subjects,
    queryFn: async () => {
      if (!userEntityId || !subjects) {
        throw new Error("User entity ID and subjects are required");
      }
      const courses = subjects.flatMap((subject) =>
        subject.modules.map((courseModule) => ({
          subjectCode: subject.code,
          courseNumber: courseModule.courseNumber,
        }))
      );

      const suggestions = await Promise.all(
        courses.map((course) =>
          hopsApi.listWorkspaceSuggestions({
            subject: course.subjectCode,
            courseNumber: course.courseNumber,
            userEntityId,
          })
        )
      );
      return suggestions.flat();
    },
  };
});

export const studentCourseMatrixDataAtom = atom(
  (get) => get(studentCourseMatrixAtomWithQuery).data
);

export const wokspaceSuggestionsDataAtom = atom(
  (get) => get(wokspaceSuggestionsQueryAtom).data
);
