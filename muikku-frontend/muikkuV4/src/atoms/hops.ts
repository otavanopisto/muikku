import { atomWithQuery } from "jotai-tanstack-query";
import { atom } from "jotai";
import { getHopsApi } from "~/api";
import { userAtom } from "./auth";
import {
  STUDENT_COURSE_MATRIX_QUERY_KEY,
  STUDENT_STUDY_ACTIVITY_QUERY_KEY,
  WORKSPACE_SUGGESTIONS_QUERY_KEY,
} from "src/queryClient";
import { handleApiError } from "./helpers/error";
import i18n from "~/src/locales/i18n";

const hopsApi = getHopsApi();
const { t } = i18n;

export const studentCourseMatrixAtomWithQuery = atomWithQuery((get) => {
  const user = get(userAtom);
  const { identifier: studentIdentifier, profile } = user ?? {};
  const educationTypeCode = profile?.educationTypeCode;
  return {
    queryKey: [...STUDENT_COURSE_MATRIX_QUERY_KEY, studentIdentifier],
    enabled: !!studentIdentifier,
    queryFn: async () => {
      try {
        if (!studentIdentifier || !educationTypeCode) {
          throw new Error("Student identifier is required");
        }
        return hopsApi.getStudentCourseMatrix({
          studentIdentifier,
          educationTypeCode,
        });
      } catch (error) {
        handleApiError(
          error,
          t("errors.loadStudentCourseMatrix", { ns: "hops" })
        );
      }
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
      try {
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
      } catch (error) {
        handleApiError(error, t("errors.loadSuggestions", { ns: "hops" }));
      }
    },
  };
});

export const studentStudyActivityQueryAtom = atomWithQuery((get) => {
  const { identifier: studentIdentifier } = get(userAtom) ?? {};
  return {
    queryKey: STUDENT_STUDY_ACTIVITY_QUERY_KEY,
    enabled: !!studentIdentifier,
    queryFn: async () => {
      try {
        if (!studentIdentifier) {
          throw new Error(
            "Student identifier missing in studentActivityQueryAtom"
          );
        }
        return hopsApi.getStudyActivity({ studentIdentifier });
      } catch (error) {
        handleApiError(error, t("errors.loadStudyActivity", { ns: "hops" }));
      }
    },
  };
});

export const studentCourseMatrixDataAtom = atom(
  (get) => get(studentCourseMatrixAtomWithQuery).data
);

export const wokspaceSuggestionsDataAtom = atom(
  (get) => get(wokspaceSuggestionsQueryAtom).data
);

export const studentStudyActivityDataAtom = atom(
  (get) => get(studentStudyActivityQueryAtom).data
);
