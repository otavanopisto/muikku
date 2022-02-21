import * as React from "react";
import {
  SchoolSubject,
  StudentActivityByStatus,
  StudentActivityCourse,
  StudentCourseChoice,
} from "~/@types/shared";
import { Table, Tbody, Td, Tr } from "~/components/general/table";
import { schoolCourseTable } from "~/mock/mock-data";
import { TableDataContent } from "./table-data-content";
import { connect, Dispatch } from "react-redux";
import { UpdateStudentChoicesParams } from "../study-tool/hooks/use-student-choices";
import { UpdateSuggestionParams } from "../study-tool/hooks/use-student-activity";
import { HopsUser } from "../hops-compulsory-education-wizard";
import { StateType } from "~/reducers";

/**
 * CourseTableProps
 */
interface CourseTableProps extends Partial<StudentActivityByStatus> {
  user: HopsUser;
  studentId: string;
  disabled: boolean;
  /**
   * Boolean indicating that supervisor can modify values
   */
  superVisorModifies: boolean;
  /**
   * If ethic is selected besides religion
   */
  ethicsSelected: boolean;
  /**
   * If finnish is selected as secondary languages
   */
  finnishAsSecondLanguage: boolean;
  /**
   * List of student choices
   */
  studentChoiceList?: StudentCourseChoice[];
  updateSuggestion: (params: UpdateSuggestionParams) => void;
  updateStudentChoice: (params: UpdateStudentChoicesParams) => void;
}

/**
 * CourseTable
 * Renders courses as table
 * @param props props
 * @returns JSX.Element
 */
const CourseTable: React.FC<CourseTableProps> = (props) => {
  /**
   * Table ref
   */
  const tableRef = React.useRef(null);

  /**
   * handleToggleChoiceClick
   * @param user user
   * @param choiceParams choiceParams
   */
  const handleToggleChoiceClick =
    (user: HopsUser, choiceParams: UpdateStudentChoicesParams) =>
    (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
      if (user === "student") {
        props.updateStudentChoice(choiceParams);
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
        modifiers.push("course", "course-matrix");

        if (course.mandatory) {
          modifiers.push("MANDATORY");
        } else {
          modifiers.push("OPTIONAL");
        }

        // Table data content options with default values
        let canBeSelected = true;
        let canBeSuggestedForNextCourse = true;
        let canBeSuggestedForOptionalCourse = true;

        let courseSuggestions: StudentActivityCourse[] = [];

        let selectedByStudent = false;

        /**
         * If any of these list are given, check whether course is in
         * and push another modifier or change table data content options values
         */
        if (
          props.studentChoiceList &&
          props.studentChoiceList.find(
            (sCourse) =>
              sCourse.subject === sSubject.subjectCode &&
              sCourse.courseNumber === course.courseNumber
          )
        ) {
          selectedByStudent = true;
          modifiers.push("SELECTED_OPTIONAL");
        }

        /**
         * Only one of these can happen
         */
        if (
          props.user === "supervisor" &&
          props.suggestedNextList &&
          props.suggestedNextList.find(
            (sCourse) =>
              sCourse.subject === sSubject.subjectCode &&
              sCourse.courseNumber === course.courseNumber
          )
        ) {
          const suggestedCourseDataNext = props.suggestedNextList.filter(
            (sCourse) => sCourse.subject === sSubject.subjectCode
          );

          courseSuggestions = courseSuggestions.concat(suggestedCourseDataNext);

          modifiers.push("NEXT");
        } else if (
          props.suggestedOptionalList &&
          props.suggestedOptionalList.find(
            (sOCourse) =>
              sOCourse.subject === sSubject.subjectCode &&
              sOCourse.courseNumber === course.courseNumber
          )
        ) {
          const suggestedCourseDataOptional =
            props.suggestedOptionalList.filter(
              (oCourse) => oCourse.subject === sSubject.subjectCode
            );

          courseSuggestions = courseSuggestions.concat(
            suggestedCourseDataOptional
          );

          modifiers.push("SUGGESTED");
        } else if (
          props.transferedList &&
          props.transferedList.find(
            (tCourse) =>
              tCourse.subject === sSubject.subjectCode &&
              tCourse.courseNumber === course.courseNumber
          )
        ) {
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("APPROVAL");
        } else if (
          props.gradedList &&
          props.gradedList.find(
            (gCourse) =>
              gCourse.subject === sSubject.subjectCode &&
              gCourse.courseNumber === course.courseNumber
          )
        ) {
          canBeSuggestedForOptionalCourse = true;
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("COMPLETED");
        } else if (
          props.onGoingList &&
          props.onGoingList.find(
            (oCourse) =>
              oCourse.subject === sSubject.subjectCode &&
              oCourse.courseNumber === course.courseNumber
          )
        ) {
          canBeSuggestedForOptionalCourse = true;
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("INPROGRESS");
        }

        return (
          <Td
            key={course.id}
            modifiers={modifiers}
            onClick={handleToggleChoiceClick(props.user, {
              studentId: props.studentId,
              courseNumber: course.courseNumber,
              subject: sSubject.subjectCode,
            })}
          >
            <TableDataContent
              user={props.user}
              superVisorModifies={props.superVisorModifies}
              modifiers={modifiers}
              tableRef={tableRef}
              subjectCode={sSubject.subjectCode}
              course={course}
              studentId={props.studentId}
              selectedByStudent={selectedByStudent}
              disabled={props.disabled}
              suggestedActivityCourses={courseSuggestions}
              canBeSelected={canBeSelected}
              updateSuggestion={props.updateSuggestion}
              updateStudentChoice={props.updateStudentChoice}
            />
          </Td>
        );
      });

    const rowMods = ["course"];

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
    <Table ref={tableRef} modifiers={["course-matrix"]}>
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
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseTable);
