import * as React from "react";
import { Tbody, Td, Tr } from "~/components/general/table";
import Dropdown from "~/components/general/dropdown";
import {
  Course,
  SchoolSubject,
  StudentActivityByStatus,
} from "~/@types/shared";
import { filterMatrix, showSubject } from "~/helper-functions/study-matrix";
import { useTranslation } from "react-i18next";

/**
 * RenderItemParams
 */
export interface RenderItemParams {
  subject: SchoolSubject;
  course: Course;
  tdModifiers: string[];
}

/**
 * CourseTableProps
 */
export interface ProgressTableProps extends StudentActivityByStatus {
  matrix: SchoolSubject[] | null;
  studentIdentifier: string;
  studentUserEntityId: number;
  currentMaxCourses: number;
  curriculumName: string;
  studyProgrammeName: string;
  studentOptions: string[];
  renderCourseCell?: (params: RenderItemParams) => JSX.Element;
  renderEmptyCell?: (params: {
    index: number;
    modifiers: string[];
  }) => JSX.Element;
}

/**
 * ProgressTableContentProps
 */
interface ProgressTableContentProps extends ProgressTableProps {}

/**
 * CourseTable. Renders courses as table
 *
 * @param props props
 * @returns JSX.Element
 */
export const ProgressTableContent: React.FC<ProgressTableContentProps> = (
  props
) => {
  const {
    matrix,
    currentMaxCourses,
    studyProgrammeName,
    studentOptions,
    renderCourseCell,
    renderEmptyCell,
  } = props;

  const { t } = useTranslation("studyMatrix");

  if (matrix === null) {
    return (
      <div className="empty">
        <span>{t("content.noSubjectTable")}</span>
      </div>
    );
  }

  const filteredMatrix = filterMatrix(
    studyProgrammeName,
    matrix,
    studentOptions
  );

  /**
   * renderRows
   * !!--USES list of mock objects currently--!!
   */
  const renderRows = filteredMatrix.map((sSubject, i) => {
    const showSubjectRow = showSubject(props.studyProgrammeName, sSubject);

    /**
     * Render courses based on possible max number of courses
     * So subject with less courses have their rows same amount of table cells but as empty
     */
    const courses = Array(currentMaxCourses)
      .fill(1)
      .map((c, index) => {
        const modifiers = ["centered", "course"];

        const course = sSubject.availableCourses.find(
          (aCourse) => aCourse.courseNumber === index + 1
        );

        if (course === undefined) {
          return renderEmptyCell ? (
            renderEmptyCell({ index, modifiers })
          ) : (
            <Td key={`empty-${index + 1}`} modifiers={modifiers}>
              <div className="table-data-content table-data-content-centered table-data-content--empty">
                -
              </div>
            </Td>
          );
        }

        const courseDropdownName =
          sSubject.subjectCode + course.courseNumber + " - " + course.name;

        if (course.mandatory) {
          modifiers.push("MANDATORY");
          return renderCourseCell ? (
            renderCourseCell({
              subject: sSubject,
              course,
              tdModifiers: modifiers,
            })
          ) : (
            <Td
              key={`${sSubject.subjectCode}-${course.courseNumber}`}
              modifiers={modifiers}
            >
              <Dropdown
                content={
                  <div className="hops-container__study-tool-dropdown-container">
                    <div className="hops-container__study-tool-dropdow-title">
                      {courseDropdownName}
                    </div>
                  </div>
                }
              >
                <span
                  tabIndex={0}
                  className="table__data-content-wrapper table__data-content-wrapper--course"
                >
                  {course.courseNumber}
                </span>
              </Dropdown>
            </Td>
          );
        }

        modifiers.push("OPTIONAL");
        return renderCourseCell ? (
          renderCourseCell({
            subject: sSubject,
            course,
            tdModifiers: modifiers,
          })
        ) : (
          <Td
            key={`${sSubject.subjectCode}-${course.courseNumber}`}
            modifiers={modifiers}
          >
            <Dropdown
              content={
                <div className="hops-container__study-tool-dropdown-container">
                  <div className="hops-container__study-tool-dropdow-title">
                    {`${courseDropdownName}*`}
                  </div>
                </div>
              }
            >
              <span
                tabIndex={0}
                className="table__data-content-wrapper table__data-content-wrapper--course"
              >
                {course.courseNumber}
              </span>
            </Dropdown>
          </Td>
        );
      });

    return (
      showSubjectRow && (
        <Tr key={sSubject.name} modifiers={["course"]}>
          <Td modifiers={["subject"]}>
            <div>{`${sSubject.name} (${sSubject.subjectCode})`}</div>
          </Td>
          {courses}
        </Tr>
      )
    );
  });

  return (
    <>
      <ProgressTableBody>{renderRows}</ProgressTableBody>
    </>
  );
};

/**
 * ProgressTableBodyProps
 */
interface ProgressTableBodyProps {
  title?: string;
  currentMaxCourses?: number;
  children: React.ReactNode;
}

/**
 * ProgressTableBody
 * @param props props
 * @returns JSX.Element
 */
export const ProgressTableBody: React.FC<ProgressTableBodyProps> = (props) => {
  const { currentMaxCourses, title, children } = props;
  return (
    <Tbody>
      {title && (
        <Tr>
          <Td
            modifiers={["subtitle"]}
            colSpan={currentMaxCourses && currentMaxCourses + 1}
          >
            {title}
          </Td>
        </Tr>
      )}
      {children}
    </Tbody>
  );
};
