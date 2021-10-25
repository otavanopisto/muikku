import * as React from "react";
import {
  Course,
  StudentActivityCourse,
} from "../../../../../../../@types/shared";
import {
  useDimensions,
  useElementBoundings,
} from "../suggestion-list/hooks/useElementDimensions";
import SuggestionList from "../suggestion-list/suggested-list";
/**
 * TableDataContentProps
 */
interface TableDataContentProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  user: "supervisor" | "student";
  tableRef: React.MutableRefObject<HTMLTableElement>;
  modifiers?: string[];
  suggestedActivityCourses?: StudentActivityCourse[];
  subjectCode: string;
  course: Course;
  canBeSelected: boolean;
  canBeSuggestedForNextCourse: boolean;
  canBeSuggestedForOptionalCourse: boolean;
  onToggleCourseClick: (
    courseId: number
  ) => (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => void;
  updateSuggestion: (
    goal: "add" | "remove",
    courseNumber: number,
    subjectCode: string,
    suggestionId: number,
    studentId: string
  ) => void;
}

/**
 * Renders table data content inside table cell
 * with pop up width animation
 * @param props Component props
 * @returns JSX.Element
 */
export const TableDataContent: React.FC<TableDataContentProps> = (props) => {
  const {
    user,
    tableRef,
    modifiers,
    course,
    canBeSelected,
    onToggleCourseClick,
  } = props;

  /**
   * Default modifiers
   */
  let updatedModifiers = [...modifiers];

  const contentRef = React.useRef<HTMLDivElement>(null);
  const contenNameRef = React.useRef<HTMLDivElement>(null);
  const [animateDim, setAnimateDim] = React.useState<{
    width?: string | number;
    height?: string | number;
  }>({ width: undefined, height: undefined });
  const [expanded, setExpanded] = React.useState(false);
  const [loadedSuggestionList, setLoadedSuggestionList] = React.useState(false);

  // Element refs data
  const tableDimensions = useDimensions(tableRef);
  const tableBoundings = useElementBoundings(tableRef);
  const cellBoundings = useElementBoundings(contentRef);
  const contentNameDimensions = useDimensions(contenNameRef);

  React.useLayoutEffect(() => {
    if (expanded) {
      setAnimateDim({
        width: contenNameRef.current.offsetWidth + 25,
        height: contenNameRef.current.offsetHeight + 50,
      });
    } else {
      setAnimateDim({
        width: undefined,
        height: undefined,
      });
    }
  }, [contentRef, contenNameRef, expanded, loadedSuggestionList]);

  /**
   * Checking if table cell with animated width change will overflow over table
   * if so, change animation direction opposite direction
   * Element bounding left value - table bounding left value + animated width length
   */
  if (expanded) {
    updatedModifiers.push("course__hover");
  }

  if (
    cellBoundings.left +
      50 -
      tableBoundings.left +
      (contentNameDimensions.width + 25) >
    tableDimensions.width
  ) {
    updatedModifiers.push("from__right");
  } else {
    updatedModifiers.push("from__left");
  }

  if (tableBoundings.bottom - 50 - cellBoundings.bottom < 0) {
    updatedModifiers.push("from__bottom");
  }

  if (course.mandatory) {
    return canBeSelected ? (
      <div
        onMouseEnter={(e) => setExpanded(true)}
        onMouseLeave={(e) => setExpanded(false)}
        ref={contentRef}
        style={{ width: animateDim.width, height: animateDim.height }}
        className={`table-data-content ${
          modifiers
            ? updatedModifiers.map((m) => `table-data-content--${m}`).join(" ")
            : ""
        }`}
      >
        <span>{course.courseNumber}</span>
        <div ref={contenNameRef} className="table-data-content-course-content">
          <h4>{course.name}</h4>
          {expanded && props.user === "supervisor" ? (
            <SuggestionList
              suggestedActivityCourses={props.suggestedActivityCourses}
              subjectCode={props.subjectCode}
              course={props.course}
              onLoad={() => setLoadedSuggestionList(!loadedSuggestionList)}
              updateSuggestion={props.updateSuggestion}
            />
          ) : null}
        </div>
      </div>
    ) : (
      <div
        onMouseEnter={(e) => setExpanded(true)}
        onMouseLeave={(e) => setExpanded(false)}
        ref={contentRef}
        style={{ width: animateDim.width, height: animateDim.height }}
        className={`table-data-content ${
          modifiers
            ? updatedModifiers.map((m) => `table-data-content--${m}`).join(" ")
            : ""
        }`}
      >
        <span>{course.courseNumber}</span>
        <div ref={contenNameRef} className="table-data-content-course-content">
          <h4>{course.name}</h4>
        </div>
      </div>
    );
  } else {
    return canBeSelected ? (
      <div
        onMouseEnter={(e) => setExpanded(true)}
        onMouseLeave={(e) => setExpanded(false)}
        ref={contentRef}
        style={{ width: animateDim.width, height: animateDim.height }}
        className={`table-data-content ${
          modifiers
            ? updatedModifiers.map((m) => `table-data-content--${m}`).join(" ")
            : ""
        }`}
        onClick={
          user === "student" ? onToggleCourseClick(course.id) : undefined
        }
      >
        <span>{course.courseNumber}*</span>
        <div ref={contenNameRef} className="table-data-content-course-content">
          <h4>{course.name}</h4>
          {expanded && props.user === "supervisor" ? (
            <SuggestionList
              suggestedActivityCourses={props.suggestedActivityCourses}
              subjectCode={props.subjectCode}
              course={props.course}
              onLoad={() => setLoadedSuggestionList(true)}
              updateSuggestion={props.updateSuggestion}
            />
          ) : null}
        </div>
      </div>
    ) : null;
  }
};
