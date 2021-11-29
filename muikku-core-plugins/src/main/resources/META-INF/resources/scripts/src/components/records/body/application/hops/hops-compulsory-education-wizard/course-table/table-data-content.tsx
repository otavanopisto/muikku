import * as React from "react";
import {
  Course,
  StudentActivityCourse,
} from "../../../../../../../@types/shared";
import { HopsUser } from "../hops-compulsory-education-wizard";
import { UpdateSuggestionParams } from "../study-tool/hooks/use-student-activity";
import { UpdateStudentChoicesParams } from "../study-tool/hooks/use-student-choices";
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
  user: HopsUser;
  superVisorModifies: boolean;
  tableRef: React.MutableRefObject<HTMLTableElement>;
  modifiers?: string[];
  suggestedActivityCourses?: StudentActivityCourse[];
  subjectCode: string;
  studentId: string;
  course: Course;
  selectedByStudent: boolean;
  disabled: boolean;
  canBeSelected: boolean;
  canBeSuggestedForNextCourse: boolean;
  canBeSuggestedForOptionalCourse: boolean;
  updateSuggestion: (params: UpdateSuggestionParams) => void;
  updateStudentChoice: (params: UpdateStudentChoicesParams) => void;
}

/**
 * Renders table data content inside table cell
 * with pop up width animation
 * @param props Component props
 * @returns JSX.Element
 */
export const TableDataContent: React.FC<TableDataContentProps> = (props) => {
  const { user, tableRef, modifiers, course, canBeSelected } = props;

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
   * handleToggleChoiceClick
   */
  const handleToggleChoiceClick =
    (choiceParams: UpdateStudentChoicesParams) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      props.updateStudentChoice(choiceParams);
    };

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

  if (props.disabled) {
    updatedModifiers.push("disabled");
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
          {!props.disabled && expanded && user === "supervisor" ? (
            <SuggestionList
              studentId={props.studentId}
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
      >
        <span>{course.courseNumber}*</span>

        <div ref={contenNameRef} className="table-data-content-course-content">
          <h4>{course.name}</h4>
          {user === "supervisor" && props.superVisorModifies && expanded ? (
            <button
              onClick={handleToggleChoiceClick({
                studentId: props.studentId,
                courseNumber: course.courseNumber,
                subject: props.subjectCode,
              })}
              style={{ zIndex: 2 }}
            >
              {props.selectedByStudent
                ? "Peru valinta"
                : "Valitse osaksi hopsia"}
            </button>
          ) : undefined}
          {!props.disabled && expanded && user === "supervisor" ? (
            <SuggestionList
              studentId={props.studentId}
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
