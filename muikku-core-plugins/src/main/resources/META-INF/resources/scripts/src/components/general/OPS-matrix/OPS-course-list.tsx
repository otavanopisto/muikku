import * as React from "react";
import {
  ListContainer,
  ListHeader,
  ListItem,
  ListItemIndicator,
} from "~/components/general/list";
import Dropdown from "~/components/general/dropdown";
import { filterMatrix, showSubject } from "~/helper-functions/study-matrix";
import { useTranslation } from "react-i18next";
import {
  Course,
  SchoolSubject,
  StudentActivityByStatus,
} from "~/@types/shared";

/**
 * Interface for parameters passed to the course item renderer
 */
export interface RenderItemParams {
  subject: SchoolSubject;
  course: Course;
  listItemModifiers: string[];
}

/**
 * Props for the OPSCourseList component
 */
export interface OPSCourseListProps extends StudentActivityByStatus {
  matrix: SchoolSubject[] | null;
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
  const {
    children,
    matrix,
    studyProgrammeName,
    studentOptions,
    renderCourseItem,
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
   */
  const renderRows = filteredMatrix.map((sSubject) => {
    const showSubjectRow = showSubject(props.studyProgrammeName, sSubject);

    const courses = sSubject.availableCourses.map((course) => {
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
            key={`${sSubject.subjectCode}-${course.courseNumber}`}
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
          key={`${sSubject.subjectCode}-${course.courseNumber}`}
          course={course}
          indicatorModifiers={listItemIndicatormodifiers}
        />
      );
    });

    return (
      showSubjectRow && (
        <ListContainer key={sSubject.name} modifiers={["subject"]}>
          <ListContainer modifiers={["row"]}>
            <ListHeader
              modifiers={["subject-name"]}
            >{`${sSubject.name} (${sSubject.subjectCode})`}</ListHeader>
          </ListContainer>
          <ListContainer modifiers={["row"]}>{courses}</ListContainer>
        </ListContainer>
      )
    );
  });

  return (
    <div className="list">
      <ListContainer modifiers={["section"]}>{renderRows}</ListContainer>

      {children && children}
    </div>
  );
};

/**
 * Props for the DefaultCourseItem component
 * @interface DefaultCourseItemProps
 * @property {Course} course - The course to be displayed
 * @property {string[]} indicatorModifiers - Array of CSS modifiers for the course indicator
 */
interface DefaultCourseItemProps {
  course: Course;
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
