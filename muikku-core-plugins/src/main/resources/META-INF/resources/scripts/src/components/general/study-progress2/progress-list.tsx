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
 * RenderItemParams
 */
export interface RenderItemParams {
  subject: SchoolSubject;
  course: Course;
  listItemModifiers: string[];
}

/**
 * ProgressListProps
 */
export interface ProgressListProps extends StudentActivityByStatus {
  matrix: SchoolSubject[] | null;
  studentIdentifier: string;
  studentUserEntityId: number;
  curriculumName: string;
  studyProgrammeName: string;
  studentOptions: string[];
  renderMandatoryCourseItem?: (params: RenderItemParams) => JSX.Element;
  renderOptionalCourseItem?: (params: RenderItemParams) => JSX.Element;
}

/**
 * ProgressListContentProps
 */
interface ProgressListContentProps extends ProgressListProps {}

/**
 * ProgressList. Renders courses as a list
 * @param props props
 * @returns JSX.Element
 */
export const ProgressList: React.FC<ProgressListContentProps> = (props) => {
  const {
    children,
    matrix,
    studyProgrammeName,
    studentOptions,
    renderMandatoryCourseItem,
    renderOptionalCourseItem,
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
        return renderMandatoryCourseItem ? (
          renderMandatoryCourseItem({
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
      return renderOptionalCourseItem ? (
        renderOptionalCourseItem({
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
 * DefaultCourseItemProps
 */
interface DefaultCourseItemProps {
  course: Course;
  indicatorModifiers: string[];
}

/**
 * Default course item implementation
 * @param props props
 * @returns JSX.Element
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

export default ProgressList;
