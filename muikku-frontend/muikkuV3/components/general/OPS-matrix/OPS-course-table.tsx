import * as React from "react";
import { Tbody, Td, Tr } from "~/components/general/table";
import Dropdown from "~/components/general/dropdown";
import { StudentActivityByStatus } from "~/@types/shared";
import { useTranslation } from "react-i18next";
import {
  CourseMatrix,
  CourseMatrixModule,
  CourseMatrixSubject,
} from "~/generated/client";
import { getNonOPSTransferedActivities } from "~/helper-functions/study-matrix";

/**
 * Interface for parameters used when rendering individual course items in the progress table
 */
export interface RenderItemParams {
  subject: CourseMatrixSubject;
  course: CourseMatrixModule;
  tdModifiers: string[];
}

/**
 * Props for the Progress Table component
 */
export interface OPSCourseTableProps extends StudentActivityByStatus {
  matrix: CourseMatrix | null;
  studentIdentifier: string;
  studentUserEntityId: number;
  currentMaxCourses: number | null;
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
 * OPS course table content component - Renders a table showing course progress
 * This component displays courses in a matrix format, with subjects as rows
 * and course numbers as columns. Each cell can represent either a mandatory
 * or optional course, or be empty.
 *
 * @param props - Component props
 * @returns Rendered table content or empty state message
 */
export const OPSCourseTableContent: React.FC<OPSCourseTableProps> = (props) => {
  const {
    matrix,
    currentMaxCourses,
    transferedList,
    renderCourseCell,
    renderEmptyCell,
  } = props;

  const { t } = useTranslation("studyMatrix");

  if (matrix === null || currentMaxCourses === null) {
    return (
      <div className="empty">
        <span>{t("content.noSubjectTable")}</span>
      </div>
    );
  }

  const nonOPSTransferedActivities = getNonOPSTransferedActivities(
    matrix,
    transferedList
  );

  /**
   * renderRows
   * !!--USES list of mock objects currently--!!
   */
  const renderRows = matrix.subjects.map((sSubject, i) => {
    /**
     * Render courses based on possible max number of courses
     * So subject with less courses have their rows same amount of table cells but as empty
     */
    const courses = Array(currentMaxCourses)
      .fill(1)
      .map((c, index) => {
        const modifiers = ["centered", "course"];

        const course = sSubject.modules.find(
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
          sSubject.code + course.courseNumber + " - " + course.name;

        if (course.mandatory) {
          modifiers.push("MANDATORY");
          !course.available && modifiers.push("NOT-AVAILABLE");
          return renderCourseCell ? (
            renderCourseCell({
              subject: sSubject,
              course,
              tdModifiers: modifiers,
            })
          ) : (
            <Td
              key={`${sSubject.code}-${course.courseNumber}`}
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
        !course.available && modifiers.push("NOT-AVAILABLE");

        return renderCourseCell ? (
          renderCourseCell({
            subject: sSubject,
            course,
            tdModifiers: modifiers,
          })
        ) : (
          <Td
            key={`${sSubject.code}-${course.courseNumber}`}
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
      <Tr key={sSubject.name} modifiers={["course"]}>
        <Td modifiers={["subject"]}>
          <div>{`${sSubject.name} (${sSubject.code})`}</div>
        </Td>
        {courses}
      </Tr>
    );
  });

  /**
   * renderOtherSubjects
   */
  const renderOtherSubjects = () => {
    if (nonOPSTransferedActivities.length === 0) {
      return null;
    }

    const renderRows = nonOPSTransferedActivities.map((tStudy, i) => {
      let courseName = tStudy.courseName;

      const modifiers = ["centered", "course"];

      if (tStudy.mandatority === "MANDATORY") {
        modifiers.push("MANDATORY");
      } else if (tStudy.mandatority === "UNSPECIFIED_OPTIONAL") {
        courseName = `${courseName}*`;
        modifiers.push("OPTIONAL");
      }

      modifiers.push("APPROVAL");

      if (tStudy.passing) {
        modifiers.push("PASSED-GRADE");
      }

      return (
        <Tr key={i} modifiers={["course"]}>
          <Td modifiers={["subject"]}>{courseName}</Td>
          <Td modifiers={modifiers}>
            <Dropdown
              content={
                <div className="hops-container__study-tool-dropdown-container">
                  <div className="hops-container__study-tool-dropdow-title">
                    {courseName}
                  </div>
                </div>
              }
            >
              <span
                tabIndex={0}
                className="table__data-content-wrapper table__data-content-wrapper--course"
              >
                {tStudy.grade}
              </span>
            </Dropdown>
          </Td>
          <Td colSpan={currentMaxCourses - 1}></Td>
        </Tr>
      );
    });

    return (
      <OPSCourseTableBody
        currentMaxCourses={currentMaxCourses}
        title={t("labels.otherStudies")}
      >
        {renderRows}
      </OPSCourseTableBody>
    );
  };

  return (
    <>
      <OPSCourseTableBody>{renderRows}</OPSCourseTableBody>
      {renderOtherSubjects()}
    </>
  );
};

/**
 * Props for the OPS Course Table Body component
 */
interface OPSCourseTableBodyProps {
  /** Optional title for the table body section */
  title?: string;
  /** Maximum number of courses to display */
  currentMaxCourses?: number;
  /** Child elements to render within the table body */
  children: React.ReactNode;
}

/**
 * OPS Course Table Body component - Renders the body section of the OPS course table
 * Provides structure for the table content and optionally displays a title row
 *
 * @param props - Component props
 * @returns Rendered table body
 */
export const OPSCourseTableBody: React.FC<OPSCourseTableBodyProps> = (
  props
) => {
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
