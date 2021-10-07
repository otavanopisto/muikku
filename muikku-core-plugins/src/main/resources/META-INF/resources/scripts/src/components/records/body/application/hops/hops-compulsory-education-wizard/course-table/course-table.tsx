import * as React from "react";
import { SchoolSubject } from "~/@types/shared";
import { Table, Tbody, Td, Tr } from "~/components/general/table";
import { schoolCourseTable } from "~/mock/mock-data";
import { TableDataContent } from "./table-data-content";
import { StateType } from "../../../../../../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { GuiderType } from "../../../../../../../reducers/main-function/guider/index";

interface CourseTableProps {
  user: "supervisor" | "student";
  ethicsSelected: boolean;
  finnishAsSecondLanguage: boolean;
  guider: GuiderType;
  selectedSubjectListOfIds?: number[];
  completedSubjectListOfIds?: number[];
  approvedSubjectListOfIds?: number[];
  inprogressSubjectListOfIds?: number[];
  selectedOptionalListOfIds?: number[];
  supervisorSuggestedNextListOfIds?: number[];
  supervisorSugestedSubjectListOfIds?: number[];
  onChangeSelectSubjectList?: (selectSubjects: number[]) => void;
}

/**
 * CourseTable
 * Renders courses as table
 * @returns
 */
const CourseTable: React.FC<CourseTableProps> = (props) => {
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
      if (props.onChangeSelectSubjectList && props.selectedSubjectListOfIds) {
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
   * currentMaxCourses
   */
  const currentMaxCourses = getHighestCourseNumber(schoolCourseTable);

  /**
   * renderRows
   * !!--USES list of mock objects currently--!!
   */
  const renderRows = schoolCourseTable.map((sSubject, i) => {
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
          modifiers.push("SUGGESTED");
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
          modifiers.push("NEXT");
        }

        return (
          <Td key={course.id} modifiers={modifiers}>
            <TableDataContent
              user={props.user}
              modifiers={modifiers}
              tableRef={tableRef}
              subjectCode={sSubject.subjectCode}
              course={course}
              canBeSelected={canBeSelected}
              canBeSuggestedForNextCourse={canBeSuggestedForNextCourse}
              canBeSuggestedForOptionalCourse={canBeSuggestedForOptionalCourse}
              onToggleCourseClick={handleToggleCourseClick}
            />
          </Td>
        );
      });

    let rowMods = ["course"];

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

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    guider: state.guider,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseTable);
