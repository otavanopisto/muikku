import * as React from "react";
import {
  SchoolSubject,
  StudentActivityByStatus,
  StudentActivityCourse,
  StudentCourseChoice,
} from "~/@types/shared";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Tr,
  Th,
} from "~/components/general/table";
import Button from "~/components/general/button";
import { schoolCourseTable } from "~/mock/mock-data";
import { connect } from "react-redux";
import { HopsUser } from ".";
import { StateType } from "~/reducers";
import Dropdown from "~/components/general/dropdown";
import { UpdateSuggestionParams } from "./hooks/useStudentActivity";
import { UpdateStudentChoicesParams } from "./hooks/useStudentChoices";
import HopsSuggestionList from "./hops-suggested-list";

/**
 * CourseTableProps
 */
interface HopsCourseTableProps extends Partial<StudentActivityByStatus> {
  useCase: "study-matrix" | "hops-planing";
  /**
   * user
   */
  user: HopsUser;
  /**
   * studentId
   */
  studentId: string;
  /**
   * disabled
   */
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

const defaultProps = {
  canSuggestNext: true,
  canSuggestAsOptional: true,
  canChooseToBePartOfHops: true,
};

/**
 * CourseTable
 * Renders courses as table
 * @param props props
 * @returns JSX.Element
 */
const HopsCourseTable: React.FC<HopsCourseTableProps> = (props) => {
  props = { ...defaultProps, ...props };

  /**
   * handleToggleChoiceClick
   * @param choiceParams choiceParams
   */
  const handleToggleChoiceClick =
    (choiceParams: UpdateStudentChoicesParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      props.updateStudentChoice(choiceParams);
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
      if (sSubject.subjectCode === "äi") {
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
          modifiers = ["centered", "course"];

          return (
            <Td key={`empty-${index + 1}`} modifiers={modifiers}>
              <div
                className={`table-data-content table-data-content-centered table-data-content--empty`}
              >
                -
              </div>
            </Td>
          );
        }

        /**
         * Default modifier is always course
         */
        modifiers.push("course", "course-matrix", "centered");

        if (course.mandatory) {
          modifiers.push("MANDATORY");
        } else {
          modifiers.push("OPTIONAL");
        }

        // Table data content options with default values
        let canBeSelected = true;
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
          modifiers.push("OPTIONAL-SELECTED");
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
          canBeSelected = false;
          modifiers.push("INPROGRESS");
        }

        /**
         * Button is shown only if modifying user is supervisor
         */
        const showAddToHopsButton =
          props.user === "supervisor" && props.superVisorModifies;

        /**
         * Suggestion list is shown only if not disabled, for supervisor only
         * and there can be made selections
         */
        const showSuggestionList =
          !props.disabled && props.user === "supervisor" && canBeSelected;

        return (
          <Td
            key={course.id}
            modifiers={modifiers}
            onClick={
              !course.mandatory && props.user === "student"
                ? handleToggleChoiceClick({
                    studentId: props.studentId,
                    courseNumber: course.courseNumber,
                    subject: sSubject.subjectCode,
                  })
                : undefined
            }
          >
            <Dropdown
              openByHover={props.user !== "supervisor"}
              content={
                <div className="hops-container__study-tool-dropdown-container">
                  <div className="hops-container__study-tool-dropdow-title">
                    {course.mandatory ? course.name : `${course.name}*`}
                  </div>
                  {course.mandatory ? (
                    <>
                      {showSuggestionList && (
                        <HopsSuggestionList
                          studentId={props.studentId}
                          suggestedActivityCourses={courseSuggestions}
                          subjectCode={sSubject.subjectCode}
                          course={course}
                          updateSuggestion={props.updateSuggestion}
                          canSuggestForNext={
                            props.useCase === "hops-planing" ||
                            props.useCase === "study-matrix"
                          }
                          canSuggestForOptional={
                            props.useCase === "hops-planing"
                          }
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {showAddToHopsButton && (
                        <button
                          onClick={handleToggleChoiceClick({
                            studentId: props.studentId,
                            courseNumber: course.courseNumber,
                            subject: sSubject.subjectCode,
                          })}
                        >
                          {selectedByStudent
                            ? "Peru valinta"
                            : "Valitse osaksi hopsia"}
                        </button>
                      )}

                      {showSuggestionList && (
                        <HopsSuggestionList
                          studentId={props.studentId}
                          suggestedActivityCourses={courseSuggestions}
                          subjectCode={sSubject.subjectCode}
                          course={course}
                          updateSuggestion={props.updateSuggestion}
                          canSuggestForNext={
                            props.useCase === "hops-planing" ||
                            props.useCase === "study-matrix"
                          }
                          canSuggestForOptional={
                            props.useCase === "hops-planing"
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              }
            >
              <span
                tabIndex={0}
                className="table__data-content-wrapper table__data-content-wrapper--course"
              >
                {course.mandatory
                  ? course.courseNumber
                  : `${course.courseNumber}*`}
              </span>
            </Dropdown>
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
    <Table modifiers={["course-matrix"]}>
      <TableHead modifiers={["course-matrix"]}>
        <Tr modifiers={["course-matrix"]}>
          <Th modifiers={["subject"]}>Oppiaine</Th>
          <Th colSpan={currentMaxCourses}>Kurssit</Th>
        </Tr>
      </TableHead>
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
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsCourseTable);
