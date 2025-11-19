import * as React from "react";
import {
  ListContainer,
  ListHeader,
  ListItem,
  ListItemIndicator,
} from "~/components/general/list";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { StudentActivityByStatus } from "~/@types/shared";
import {
  CourseMatrix,
  CourseMatrixModule,
  CourseMatrixSubject,
} from "~/generated/client";

/**
 * Interface for parameters passed to the course item renderer
 */
export interface RenderItemParams {
  subject: CourseMatrixSubject;
  course: CourseMatrixModule;
  listItemModifiers: string[];
}

/**
 * Props for the OPSCourseList component
 */
export interface OPSCourseListProps extends StudentActivityByStatus {
  matrix: CourseMatrix | null;
  studentIdentifier: string;
  studentUserEntityId: number;
  curriculumName: string;
  studyProgrammeName: string;
  studentOptions: string[];
  renderCourseItem?: (params: RenderItemParams) => JSX.Element;
}

/**
 * OPS course list component - Displays a list of courses organized by subject
 * Supports both mandatory and optional courses with custom rendering capabilities
 * @param props - Component props
 * @returns Rendered list of courses
 */
export const OPSCourseList: React.FC<OPSCourseListProps> = (props) => {
  const { children, matrix, transferedList, renderCourseItem } = props;

  const { t } = useTranslation("studyMatrix");

  if (matrix === null) {
    return (
      <div className="empty">
        <span>{t("content.noSubjectTable")}</span>
      </div>
    );
  }

  const filteredMatrix = matrix.subjects;

  /**
   * renderRows
   */
  const renderRows = filteredMatrix.map((sSubject) => {
    const courses = sSubject.modules.map((course) => {
      const listItemIndicatormodifiers = ["course"];

      if (course.mandatory) {
        listItemIndicatormodifiers.push("MANDATORY");
        return renderCourseItem ? (
          renderCourseItem({
            subject: sSubject,
            course,
            listItemModifiers: listItemIndicatormodifiers,
          })
        ) : (
          <DefaultCourseItem
            key={`${sSubject.name}-${course.courseNumber}`}
            course={course}
            indicatorModifiers={listItemIndicatormodifiers}
          />
        );
      }

      listItemIndicatormodifiers.push("OPTIONAL");
      return renderCourseItem ? (
        renderCourseItem({
          subject: sSubject,
          course,
          listItemModifiers: listItemIndicatormodifiers,
        })
      ) : (
        <DefaultCourseItem
          key={`${sSubject.name}-${course.courseNumber}`}
          course={course}
          indicatorModifiers={listItemIndicatormodifiers}
        />
      );
    });

    return (
      <ListContainer key={sSubject.name} modifiers={["subject"]}>
        <ListContainer modifiers={["row"]}>
          <ListHeader
            modifiers={["subject-name"]}
          >{`${sSubject.name} (${sSubject.code})`}</ListHeader>
        </ListContainer>
        <ListContainer modifiers={["row"]}>{courses}</ListContainer>
      </ListContainer>
    );
  });

  /**
   * renderOtherSubjects
   * @returns Rendered other subjects
   */
  const renderOtherSubjects = () => {
    const otherSubjects = transferedList.filter(
      (tStudy) => tStudy.subject === "MUU"
    );

    if (otherSubjects.length === 0) {
      return null;
    }

    const renderRows = otherSubjects.map((tStudy) => {
      const listItemIndicatormodifiers = ["course"];

      if (tStudy.transferCreditMandatory) {
        listItemIndicatormodifiers.push("MANDATORY");
      } else {
        listItemIndicatormodifiers.push("OPTIONAL");
      }

      listItemIndicatormodifiers.push("APPROVAL");

      if (tStudy.passing) {
        listItemIndicatormodifiers.push("PASSED-GRADE");
      }

      return (
        <ListContainer key={tStudy.id} modifiers={["subject"]}>
          <ListContainer modifiers={["row"]}>
            <ListHeader modifiers={["subject-name"]}>
              {tStudy.courseName}
            </ListHeader>
          </ListContainer>
          <ListContainer modifiers={["row"]}>
            <ListItem modifiers={["course"]}>
              <ListItemIndicator modifiers={listItemIndicatormodifiers}>
                <Dropdown
                  content={
                    <div className="hops-container__study-tool-dropdown-container">
                      <div className="hops-container__study-tool-dropdow-title">
                        {tStudy.courseName}
                      </div>
                    </div>
                  }
                >
                  <span tabIndex={0} className="list__indicator-data-wapper">
                    {tStudy.grade}
                  </span>
                </Dropdown>
              </ListItemIndicator>
            </ListItem>
          </ListContainer>
        </ListContainer>
      );
    });

    return (
      <>
        <h3>MUUT opinnot</h3>

        {renderRows}
      </>
    );
  };

  return (
    <div className="list">
      <ListContainer modifiers={["section"]}>{renderRows}</ListContainer>

      {renderOtherSubjects()}
      {children && children}
    </div>
  );
};

/**
 * Props for the DefaultCourseItem component
 * @interface DefaultCourseItemProps
 * @property {CourseMatrixModule} course - The course to be displayed
 * @property {string[]} indicatorModifiers - Array of CSS modifiers for the course indicator
 */
interface DefaultCourseItemProps {
  course: CourseMatrixModule;
  indicatorModifiers: string[];
}

/**
 * Default implementation of a course item in the progress list
 * Displays course number and name with optional indicator for non-mandatory courses
 * @param props - Component props
 * @returns Rendered course item
 */
const DefaultCourseItem = (props: DefaultCourseItemProps) => {
  const { course, indicatorModifiers } = props;

  return (
    <ListItem modifiers={["course"]}>
      <ListItemIndicator modifiers={indicatorModifiers}>
        <Dropdown
          content={
            <div className="hops-container__study-tool-dropdown-container">
              <div className="hops-container__study-tool-dropdow-title">
                {course.mandatory ? course.name : `${course.name}*`}
              </div>
            </div>
          }
        >
          <span tabIndex={0} className="list__indicator-data-wapper">
            {course.mandatory ? course.courseNumber : `${course.courseNumber}*`}
          </span>
        </Dropdown>
      </ListItemIndicator>
    </ListItem>
  );
};

export default OPSCourseList;
