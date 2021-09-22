import * as React from "react";
import { SchoolSubject } from "~/@types/shared";
import { Table, Tbody, Td, Tr } from "~/components/general/table";
import { mockSchoolSubjects } from "~/mock/mock-data";
import { Course } from "../../../../../@types/shared";

interface CourseTableProps {
  selectedSubjects?: SchoolSubject[];
  user: "supervisor" | "student";
  selectNextIsActive: boolean;
  selectOptionalIsActive: boolean;
  ethicsSelected: boolean;
  finnishAsSecondLanguage: boolean;
  selectedSubjectListOfIds?: number[];
  completedSubjectListOfIds?: number[];
  approvedSubjectListOfIds?: number[];
  inprogressSubjectListOfIds?: number[];
  selectedOptionalListOfIds?: number[];
  supervisorSuggestedNextListOfIds?: number[];
  supervisorSuggestedOptionalListOfIds?: number[];
  supervisorSugestedSubjectListOfIds?: number[];
  onChange?: (schoolSubjects: SchoolSubject[]) => void;
  onChangeSelectSubjectList?: (selectSubjects: number[]) => void;
  onChangeSuggestedForNextList?: (selectedSubjects: number[]) => void;
}

/**
 * CourseTable
 * Renders courses as table
 * @returns
 */
const CourseTable: React.FC<CourseTableProps> = (props) => {
  React.useEffect(() => {}, [
    props.supervisorSuggestedNextListOfIds,
    props.supervisorSugestedSubjectListOfIds,
  ]);

  /**
   * Table ref
   */
  const tableRef = React.useRef(null);

  /**
   * handleTableDataChange
   */
  const handleToggleCourseClick =
    (courseId: number) =>
    (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
      const selectedSubjects = [...props.selectedSubjects];

      if (
        props.onChangeSelectSubjectList &&
        props.selectedSubjectListOfIds &&
        selectedSubjects
      ) {
        /**
         * Old values
         */
        const selectedOptionalCourseListOfIds = [
          ...props.selectedSubjectListOfIds,
        ];

        /**
         * Find index
         */
        const index = selectedOptionalCourseListOfIds.findIndex(
          (sCourseId) => sCourseId === courseId
        );

        /**
         * If index is found, then splice it away, otherwise push id to updated list
         */
        if (index !== -1) {
          selectedOptionalCourseListOfIds.splice(index, 1);
        } else {
          selectedOptionalCourseListOfIds.push(courseId);
        }

        /**
         * Handle it to onChange method
         */
        props.onChangeSelectSubjectList &&
          props.onChangeSelectSubjectList(selectedOptionalCourseListOfIds);
      }
    };

  /**
   * handleSuggestedForNextCheckboxChange
   * @param e
   */
  const handleSuggestedForNextCheckboxChange =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        props.onChangeSuggestedForNextList &&
        props.supervisorSuggestedNextListOfIds
      ) {
        /**
         * Old values
         */
        const updatedSuggestedForNextListIds = [
          ...props.supervisorSuggestedNextListOfIds,
        ];

        /**
         * Find index
         */
        const index = updatedSuggestedForNextListIds.findIndex(
          (courseId) => courseId === id
        );

        /**
         * If index is found, then splice it away, otherwise push id to updated list
         */
        if (index !== -1) {
          updatedSuggestedForNextListIds.splice(index, 1);
        } else {
          updatedSuggestedForNextListIds.push(id);
        }

        /**
         * Handle it to onChange method
         */
        props.onChangeSuggestedForNextList &&
          props.onChangeSuggestedForNextList(updatedSuggestedForNextListIds);
      }
    };

  /**
   * handleSuggestedForOptionalCheckboxChange
   * @param id
   * @returns
   */
  const handleSuggestedForOptionalCheckboxChange =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        props.onChangeSuggestedForNextList &&
        props.supervisorSugestedSubjectListOfIds
      ) {
        /**
         * Old values
         */
        const updatedSuggestedForOptionalListIds = [
          ...props.supervisorSugestedSubjectListOfIds,
        ];

        /**
         * Find index
         */
        const index = updatedSuggestedForOptionalListIds.findIndex(
          (courseId) => courseId === id
        );

        /**
         * If index is found, then splice it away, otherwise push id to updated list
         */
        if (index !== -1) {
          updatedSuggestedForOptionalListIds.splice(index, 1);
        } else {
          updatedSuggestedForOptionalListIds.push(id);
        }

        /**
         * Handle it to onChange method
         */
        props.onChangeSuggestedForNextList &&
          props.onChangeSuggestedForNextList(
            updatedSuggestedForOptionalListIds
          );
      }
    };

  /**
   * currentMaxCourses
   */
  const currentMaxCourses = getHighestCourseNumber(mockSchoolSubjects);

  /**
   * renderRows
   * !!--USES list of mock objects currently--!!
   */
  const renderRows = mockSchoolSubjects.map((sSubject, i) => {
    const { selectNextIsActive, selectOptionalIsActive } = props;

    /**
     * If any of these options happens
     * just return; so skipping that subject
     */
    if (props.ethicsSelected) {
      if (sSubject.subjectCode === "ua") {
        return;
      }
    } else {
      if (sSubject.subjectCode === "ea") {
        return;
      }
    }
    if (props.finnishAsSecondLanguage) {
      if (sSubject.subjectCode === "ai") {
        return;
      }
    } else {
      if (sSubject.subjectCode === "s2") {
        return;
      }
    }

    /**
     * Render courses based on possible max number of courses
     * So subject with less courses have their rows same amount of table cells but as empty
     */
    const courses = Array(currentMaxCourses)
      .fill(1)
      .map((c, index) => {
        let modifiers = [];

        /**
         * If courses is available with current index
         */
        const course = sSubject.availableCourses.find(
          (aCourse) => aCourse.courseNumber === index + 1
        );

        /**
         * If no, then just empty table cell "placeholder"
         */
        if (course === undefined) {
          modifiers = ["centered"];

          return (
            <Td key={`empty-${index + 1}`}>
              <div
                className={`table-data-content table-data-content-centered table-data-content--empty`}
              >
                -
              </div>
            </Td>
          );
        }

        /**
         * Default modifiers is always course
         */
        modifiers.push("course");

        if (course.mandatory) {
          modifiers.push("MANDATORY");
        } else {
          modifiers.push("OPTIONAL");
        }

        // Table data content options with default values
        let canBeSelected = true;
        let canBeSuggestedForNextCourse = true;
        let canBeSuggestedForOptionalCourse = true;
        let suggestedForNext = false;
        let suggestedForOptional = false;

        /**
         * If any of these list are given, check whether course id is in
         * and push another modifier or change table data content options values
         */
        if (
          props.approvedSubjectListOfIds &&
          props.approvedSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("APPROVAL");
        } else if (
          props.selectedOptionalListOfIds &&
          props.selectedOptionalListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          modifiers.push("SELECTED_OPTIONAL");
        } else if (
          props.completedSubjectListOfIds &&
          props.completedSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          canBeSuggestedForOptionalCourse = true;
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("COMPLETED");
        } else if (
          props.inprogressSubjectListOfIds &&
          props.inprogressSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          canBeSuggestedForOptionalCourse = true;
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("INPROGRESS");
        } else if (
          props.supervisorSugestedSubjectListOfIds &&
          props.supervisorSugestedSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          suggestedForOptional = true;
          !props.selectOptionalIsActive && modifiers.push("SUGGESTED");
        }

        if (
          props.selectedSubjectListOfIds &&
          props.selectedSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          modifiers.push("SELECTED");
        }

        if (
          props.supervisorSuggestedNextListOfIds &&
          props.supervisorSuggestedNextListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          suggestedForNext = true;

          !props.selectNextIsActive && modifiers.push("NEXT");
        }

        return (
          <Td key={course.id} modifiers={modifiers}>
            <TableDataContent
              user={props.user}
              modifiers={modifiers}
              tableRef={tableRef}
              course={course}
              canBeSelected={canBeSelected}
              selectNextIsActive={selectNextIsActive}
              selectOptionalIsActive={selectOptionalIsActive}
              canBeSuggestedForNextCourse={canBeSuggestedForNextCourse}
              canBeSuggestedForOptionalCourse={canBeSuggestedForOptionalCourse}
              suggestedForNext={suggestedForNext}
              suggestedForOptional={suggestedForOptional}
              onSuggestedForNextCheckboxChange={
                handleSuggestedForNextCheckboxChange
              }
              onSuggestedForOptionalCheckboxChange={
                handleSuggestedForOptionalCheckboxChange
              }
              onToggleCourseClick={handleToggleCourseClick}
            />
          </Td>
        );
      });

    let rowMods = ["course"];

    if (props.selectNextIsActive || props.selectOptionalIsActive) {
      rowMods.push("selectActive");
    }

    return (
      <Tr key={sSubject.name} modifiers={rowMods}>
        <Td modifiers={["subject"]}>
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {sSubject.name}
          </div>
        </Td>
        {courses}
      </Tr>
    );
  });

  return (
    <Table ref={tableRef}>
      <Tbody>{renderRows}</Tbody>
    </Table>
  );
};

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
  course: Course;
  canBeSelected: boolean;
  selectNextIsActive: boolean;
  selectOptionalIsActive: boolean;
  canBeSuggestedForNextCourse: boolean;
  canBeSuggestedForOptionalCourse: boolean;
  suggestedForNext: boolean;
  suggestedForOptional: boolean;
  onSuggestedForNextCheckboxChange: (
    id: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSuggestedForOptionalCheckboxChange: (
    id: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleCourseClick: (
    courseId: number
  ) => (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => void;
}

/**
 * Renders table data content inside table cell
 * with pop up width animation
 * @param props Component props
 * @returns JSX.Element
 */
const TableDataContent: React.FC<TableDataContentProps> = (props) => {
  const {
    user,
    tableRef,
    modifiers,
    course,
    canBeSelected,
    selectNextIsActive,
    selectOptionalIsActive,
    canBeSuggestedForNextCourse,
    canBeSuggestedForOptionalCourse,
    suggestedForNext,
    suggestedForOptional,
    onSuggestedForNextCheckboxChange,
    onSuggestedForOptionalCheckboxChange,
    onToggleCourseClick,
  } = props;

  /**
   * Default modifiers
   */
  let updatedModifiers = [...modifiers];

  const contentRef = React.useRef<HTMLDivElement>(null);
  const contenNameRef = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState(false);

  let initialWidth = "";

  const checkboxmod = selectNextIsActive || selectOptionalIsActive ? 35 : 0;

  React.useEffect(() => {
    if (contentRef && contentRef.current) {
      initialWidth = contentRef.current.style.width;
    }
  }, []);

  React.useEffect(() => {
    if (expanded) {
      updatedModifiers.push("course__hover");

      contentRef.current.style.width = `${
        contenNameRef.current.offsetWidth + 25 + checkboxmod
      }px`;
    } else {
      contentRef.current.style.width = initialWidth;
    }
  }, [contentRef, contenNameRef, expanded]);

  // Element refs data
  const tableDimensions = useDimensions(tableRef);
  const tableBoundings = useElementBoundings(tableRef);
  const cellBoundings = useElementBoundings(contentRef);
  const contentNameDimensions = useDimensions(contenNameRef);

  if (expanded) {
    updatedModifiers.push("course__hover");

    contentRef.current.style.width = `${
      contenNameRef.current.offsetWidth + 25 + checkboxmod
    }px`;
  }

  /**
   * Checking if table cell with animated width change will overflow over table
   * if so, change animation direction opposite direction
   * Element bounding left value - table bounding left value + animated width length
   */
  if (
    cellBoundings.left -
      tableBoundings.left +
      (contentNameDimensions.width + 25 + checkboxmod) >
    tableDimensions.width
  ) {
    updatedModifiers.push("from__right");
  } else {
    updatedModifiers.push("from__left");
  }

  if (course.mandatory) {
    return canBeSelected ? (
      <div
        onMouseEnter={(e) => setExpanded(true)}
        onMouseLeave={(e) => setExpanded(false)}
        ref={contentRef}
        className={`table-data-content ${
          modifiers
            ? updatedModifiers.map((m) => `table-data-content--${m}`).join(" ")
            : ""
        }`}
      >
        <span>{course.courseNumber}</span>
        <div
          className={`checkbox-container ${
            selectNextIsActive && canBeSuggestedForNextCourse
              ? "checkbox-container--active"
              : ""
          }`}
        >
          <input
            type="checkbox"
            checked={suggestedForNext}
            className="item__input"
            value={course.id}
            onChange={onSuggestedForNextCheckboxChange(course.id)}
          />
        </div>
        <div ref={contenNameRef} className="table-data-content-course-content">
          {course.name}
        </div>
      </div>
    ) : (
      <div
        onMouseEnter={(e) => setExpanded(true)}
        onMouseLeave={(e) => setExpanded(false)}
        ref={contentRef}
        className={`table-data-content ${
          modifiers
            ? updatedModifiers.map((m) => `table-data-content--${m}`).join(" ")
            : ""
        }`}
      >
        <span>{course.courseNumber}</span>
        <div ref={contenNameRef} className="table-data-content-course-content">
          {course.name}
        </div>
      </div>
    );
  } else {
    return canBeSelected ? (
      <div
        onMouseEnter={(e) => setExpanded(true)}
        onMouseLeave={(e) => setExpanded(false)}
        ref={contentRef}
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
        <div
          className={`checkbox-container ${
            selectNextIsActive && canBeSuggestedForNextCourse
              ? "checkbox-container--active"
              : ""
          }`}
        >
          <input
            type="checkbox"
            checked={suggestedForNext}
            className="item__input"
            value={course.id}
            onChange={onSuggestedForNextCheckboxChange(course.id)}
          />
        </div>

        <div
          className={`checkbox-container ${
            selectOptionalIsActive && canBeSuggestedForOptionalCourse
              ? "checkbox-container--active"
              : ""
          }`}
        >
          <input
            type="checkbox"
            checked={suggestedForOptional}
            className="item__input item__input--course__table"
            value={course.id}
            onChange={onSuggestedForOptionalCheckboxChange(course.id)}
          />
        </div>
        <div ref={contenNameRef} className="table-data-content-course-content">
          {course.name}
        </div>
      </div>
    ) : null;
  }
};

/**
 * useDimensions
 * Custom hook to return dimensions of wanted element
 * @param myRef element reference
 * @returns dimension values of width and height
 */
export const useDimensions = (
  myRef: React.MutableRefObject<HTMLDivElement | HTMLTableElement>
) => {
  const getDimensions = () => ({
    width: myRef.current.offsetWidth,
    height: myRef.current.offsetHeight,
  });

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (myRef.current) {
      setDimensions(getDimensions());
    }
  }, [myRef]);

  return dimensions;
};

/**
 * useElementBoundings
 * Custom hook to return bounding values of wanted element
 * @param myRef element reference
 * @returns object with bounding values of right and left
 */
export const useElementBoundings = (
  myRef: React.MutableRefObject<HTMLDivElement | HTMLTableElement>
) => {
  const getBoundings = () => ({
    left: myRef.current.getBoundingClientRect().left,
    right: myRef.current.getBoundingClientRect().right,
  });

  const [boundings, setBoundings] = React.useState({
    left: 0,
    right: 0,
  });

  React.useEffect(() => {
    if (myRef.current) {
      setBoundings(getBoundings());
    }
  }, [myRef]);

  return boundings;
};

/**
 * gets highest of course number available or if under 9, then default 9
 * @param schoolSubjects list of school sucjests
 * @returns number of highest course or default 9
 */
const getHighestCourseNumber = (schoolSubjects: SchoolSubject[]): number => {
  let highestCourseNumber = 1;

  for (const sSubject of schoolSubjects) {
    for (const aCourse of sSubject.availableCourses) {
      if (aCourse.courseNumber <= highestCourseNumber) {
        continue;
      } else {
        highestCourseNumber = aCourse.courseNumber;
      }
    }
  }

  if (highestCourseNumber > 9) {
    return highestCourseNumber;
  }

  return 9;
};

export default CourseTable;
