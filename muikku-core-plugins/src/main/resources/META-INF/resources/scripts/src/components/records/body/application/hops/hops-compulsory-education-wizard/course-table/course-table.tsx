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
import { StateType } from "../../../../../../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { GuiderType } from "../../../../../../../reducers/main-function/guider/index";
import { UpdateStudentChoicesParams } from "../study-tool/handlers/handlers";
import {
  updateSuggestion,
  UpdateSuggestionParams,
} from "../suggestion-list/handlers/handlers";

interface CourseTableProps extends Partial<StudentActivityByStatus> {
  user: "supervisor" | "student";
  studentId: string;
  disabled: boolean;
  ethicsSelected: boolean;
  superVisorModifies: boolean;
  finnishAsSecondLanguage: boolean;
  guider: GuiderType;
  studentChoiceList?: StudentCourseChoice[];
  supervisorSuggestedNextListOfIds?: number[];
  supervisorSugestedSubjectListOfIds?: number[];
  onChangeSelectSubjectList?: (selectSubjects: number[]) => void;
  updateSuggestion: (params: UpdateSuggestionParams) => void;
  updateStudentChoice: (params: UpdateStudentChoicesParams) => void;
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

        let courseSuggestions: StudentActivityCourse[] = [];

        let selectedByStudent = false;

        /**
         * If any of these list are given, check whether course id is in
         * and push another modifier or change table data content options values
         */
        if (
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
          props.studentChoiceList &&
          props.studentChoiceList.find(
            (sCourse) =>
              sCourse.subject === sSubject.subjectCode &&
              sCourse.courseNumber === course.courseNumber
          )
        ) {
          selectedByStudent = true;
          modifiers.push("SELECTED_OPTIONAL");
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
        } else if (
          props.suggestedOptionalList &&
          props.suggestedOptionalList.find(
            (sOCourse) =>
              sOCourse.subject === sSubject.subjectCode &&
              sOCourse.courseNumber === course.courseNumber
          )
        ) {
          let suggestedCourseDataOptional = props.suggestedOptionalList.filter(
            (oCourse) => oCourse.subject === sSubject.subjectCode
          );

          courseSuggestions = courseSuggestions.concat(
            suggestedCourseDataOptional
          );

          modifiers.push("SUGGESTED");
        }

        if (
          props.suggestedNextList &&
          props.suggestedNextList.find(
            (sCourse) =>
              sCourse.subject === sSubject.subjectCode &&
              sCourse.courseNumber === course.courseNumber
          )
        ) {
          let suggestedCourseDataNext = props.suggestedNextList.filter(
            (sCourse) => sCourse.subject === sSubject.subjectCode
          );

          courseSuggestions = courseSuggestions.concat(suggestedCourseDataNext);

          modifiers.push("NEXT");
        }

        return (
          <Td
            key={course.id}
            modifiers={modifiers}
            onClick={() =>
              props.updateStudentChoice({
                goal: selectedByStudent ? "remove" : "add",
                studentId: props.studentId,
                courseNumber: course.courseNumber,
                subject: sSubject.subjectCode,
              })
            }
          >
            <TableDataContent
              user={props.user}
              superVisorModifies={props.superVisorModifies}
              modifiers={modifiers}
              tableRef={tableRef}
              subjectCode={sSubject.subjectCode}
              course={course}
              disabled={props.disabled}
              suggestedActivityCourses={courseSuggestions}
              canBeSelected={canBeSelected}
              canBeSuggestedForNextCourse={canBeSuggestedForNextCourse}
              canBeSuggestedForOptionalCourse={canBeSuggestedForOptionalCourse}
              updateSuggestion={props.updateSuggestion}
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
