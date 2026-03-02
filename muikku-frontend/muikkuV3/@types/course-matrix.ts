import {
  CourseMatrix,
  CourseMatrixModule,
  CourseMatrixSubject,
} from "~/generated/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Enriched CourseMatrixModule with potential identifier
 */
export interface CourseMatrixModuleEnriched extends CourseMatrixModule {
  identifier?: string;
}

/**
 * Enriched CourseMatrixSubject with potential identifiers
 */
export interface CourseMatrixSubjectEnriched
  extends Omit<CourseMatrixSubject, "modules"> {
  modules: CourseMatrixModuleEnriched[];
}

/**
 * CourseMatrix with potential identifiers; same shape as API, plus frontend fields
 */
export interface CourseMatrixEnriched extends Omit<CourseMatrix, "subjects"> {
  curriculumName: string;
  subjects: CourseMatrixSubjectEnriched[];
}

/**
 * Enriches a CourseMatrix with potential identifiers
 * @param courseMatrix CourseMatrix
 * @param curriculumName Curriculum name
 * @returns CourseMatrixEnriched
 */
export function enrichCourseMatrixWithIdentifiers(
  courseMatrix: CourseMatrix,
  curriculumName: string
): CourseMatrixEnriched {
  return {
    ...courseMatrix,
    curriculumName,
    subjects: courseMatrix.subjects.map((subject) => ({
      ...subject,
      modules: subject.modules.map((module) => ({
        ...module,
        identifier: `ops-module-${uuidv4()}`,
      })),
    })),
  };
}
