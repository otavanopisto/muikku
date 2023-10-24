import * as React from "react";
import { SchoolSubject, StudentActivityByStatus } from "~/@types/shared";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Tr,
  Th,
} from "~/components/general/table";
import { schoolCourseTable } from "~/mock/mock-data";
import { connect } from "react-redux";
import { HopsUsePlace, HopsUser } from ".";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import Dropdown from "~/components/general/dropdown";
import {
  LANGUAGE_SUBJECTS,
  OTHER_SUBJECT_OUTSIDE_HOPS,
  SKILL_AND_ART_SUBJECTS,
  UpdateSuggestionParams,
} from "../../../hooks/useStudentActivity";
import HopsSuggestionList from "./hops-suggested-list";
import { UpdateStudentChoicesParams } from "~/hooks/useStudentChoices";
import { UpdateSupervisorOptionalSuggestionParams } from "~/hooks/useSupervisorOptionalSuggestion";
import {
  OptionalCourseSuggestion,
  StudentCourseChoice,
  StudentStudyActivity,
} from "~/generated/client";

/**
 * CourseTableProps
 */
interface HopsCourseTableProps extends Partial<StudentActivityByStatus> {
  /**
   * matrix to be rendered
   */
  matrix: SchoolSubject[];
  /**
   * useCase
   */
  useCase: "study-matrix" | "hops-planning";
  /**
   * Table uses sticky header
   */
  usePlace: HopsUsePlace;
  /**
   * user
   */
  user: HopsUser;
  /**
   * studentId
   */
  studentId: string;
  studentsUserEntityId: number;
  /**
   * disabled
   */
  disabled: boolean;
  /**
   * Boolean indicating that supervisor can modify values
   */
  superVisorModifies: boolean;

  /**
   * List of student choices
   */
  studentChoiceList?: StudentCourseChoice[];

  /**
   * List of student choices
   */
  supervisorOptionalSuggestionsList?: OptionalCourseSuggestion[];

  updateSuggestionNext?: (params: UpdateSuggestionParams) => void;
  updateSuggestionOptional?: (
    params: UpdateSupervisorOptionalSuggestionParams
  ) => void;
  updateStudentChoice?: (params: UpdateStudentChoicesParams) => void;
}

/**
 * CourseTable
 * Renders courses as table
 * @param props props
 * @returns JSX.Element
 */
const HopsCourseTable: React.FC<HopsCourseTableProps> = (props) => {
  /**
   * handleToggleChoiceClick
   * @param choiceParams choiceParams
   */
  const handleToggleChoiceClick =
    (choiceParams: UpdateStudentChoicesParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      props.updateStudentChoice && props.updateStudentChoice(choiceParams);
    };

  /**
   * handleToggleSuggestOptionalNext
   * @param params params
   */
  const handleToggleSuggestOptional =
    (params: UpdateSupervisorOptionalSuggestionParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      props.updateSuggestionOptional && props.updateSuggestionOptional(params);
    };

  /**
   * currentMaxCourses
   */
  const currentMaxCourses = getHighestCourseNumber(schoolCourseTable);

  /**
   * renderRows
   * !!--USES list of mock objects currently--!!
   */
  const renderRows = props.matrix.map((sSubject, i) => {
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
        modifiers.push("course", "centered");

        if (course.mandatory) {
          modifiers.push("MANDATORY");
        } else {
          modifiers.push("OPTIONAL");
        }

        // Table data content options with default values
        let canBeSelected = true;
        let courseSuggestions: StudentStudyActivity[] = [];

        let selectedByStudent = false;
        let suggestedBySupervisor = false;

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
        if (
          props.supervisorOptionalSuggestionsList &&
          props.supervisorOptionalSuggestionsList.find(
            (sOCourse) =>
              sOCourse.subject === sSubject.subjectCode &&
              sOCourse.courseNumber === course.courseNumber
          )
        ) {
          suggestedBySupervisor = true;
          modifiers.push("SUGGESTED");
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
        const showSuggestAndAddToHopsButtons =
          props.user === "supervisor" &&
          props.superVisorModifies &&
          props.useCase === "hops-planning";

        /**
         * WorkspaceSuggestion list is shown only if not disabled, for supervisor only
         * and there can be made selections
         */
        const showSuggestionList =
          !props.disabled && props.user === "supervisor" && canBeSelected;

        const courseDropdownName =
          sSubject.subjectCode + course.courseNumber + " - " + course.name;

        return (
          <Td
            key={`${sSubject.subjectCode}-${course.courseNumber}`}
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
                    {course.mandatory
                      ? `${courseDropdownName}`
                      : `${courseDropdownName}*`}
                  </div>
                  {course.mandatory ? (
                    <>
                      {showSuggestionList && (
                        <HopsSuggestionList
                          studentId={props.studentId}
                          studentsUserEntityId={props.studentsUserEntityId}
                          suggestedActivityCourses={courseSuggestions}
                          subjectCode={sSubject.subjectCode}
                          course={course}
                          updateSuggestionNext={props.updateSuggestionNext}
                          canSuggestForNext={
                            props.useCase === "hops-planning" ||
                            props.useCase === "study-matrix"
                          }
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <div className="hops-container__study-tool-button-container">
                        {showSuggestAndAddToHopsButtons && (
                          <Button
                            buttonModifiers={[
                              "guider-hops-studytool",
                              "guider-hops-studytool-suggested",
                            ]}
                            onClick={handleToggleSuggestOptional({
                              courseNumber: course.courseNumber,
                              subject: sSubject.subjectCode,
                              studentId: props.studentId,
                            })}
                          >
                            {suggestedBySupervisor
                              ? "Ehdotettu"
                              : "Ehdota valinnaiseksi"}
                          </Button>
                        )}

                        {showSuggestAndAddToHopsButtons && (
                          <Button
                            onClick={handleToggleChoiceClick({
                              studentId: props.studentId,
                              courseNumber: course.courseNumber,
                              subject: sSubject.subjectCode,
                            })}
                            buttonModifiers={["guider-hops-studytool"]}
                          >
                            {selectedByStudent
                              ? "Peru valinta"
                              : "Valitse osaksi hopsia"}
                          </Button>
                        )}
                      </div>

                      {showSuggestionList && (
                        <HopsSuggestionList
                          studentId={props.studentId}
                          studentsUserEntityId={props.studentsUserEntityId}
                          suggestedActivityCourses={courseSuggestions}
                          subjectCode={sSubject.subjectCode}
                          course={course}
                          updateSuggestionNext={props.updateSuggestionNext}
                          canSuggestForNext={
                            props.useCase === "hops-planning" ||
                            props.useCase === "study-matrix"
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

    return (
      <Tr key={sSubject.name} modifiers={["course"]}>
        <Td modifiers={["subject"]}>
          <div>{`${sSubject.name} (${sSubject.subjectCode})`}</div>
        </Td>
        {courses}
      </Tr>
    );
  });

  /**
   * Subjects and courses related to skills and arts
   */
  const renderSkillsAndArtRows = props.skillsAndArt
    ? SKILL_AND_ART_SUBJECTS.map((s) => {
        let missingColumsCount = currentMaxCourses;

        if (props.skillsAndArt[s].length !== 0) {
          return (
            <Tr key={s} modifiers={["course"]}>
              <Td modifiers={["subject"]}>
                <div>{props.skillsAndArt[s][0].subjectName}</div>
              </Td>

              {props.skillsAndArt[s].map((c, index) => {
                missingColumsCount--;

                const listItemModifiers = ["course", "centered", "APPROVAL"];

                return (
                  <Td key={index} modifiers={listItemModifiers}>
                    <Dropdown
                      openByHover={props.user !== "supervisor"}
                      content={
                        <div className="hops-container__study-tool-dropdown-container">
                          <div className="hops-container__study-tool-dropdow-title">
                            {c.courseName}
                          </div>
                        </div>
                      }
                    >
                      <span
                        tabIndex={0}
                        className="table__data-content-wrapper table__data-content-wrapper--course"
                      >
                        {c.courseNumber}
                        {!c.transferCreditMandatory ? "*" : null}
                      </span>
                    </Dropdown>
                  </Td>
                );
              })}

              {Array(missingColumsCount)
                .fill(1)
                .map((c, index) => {
                  const modifiers = ["centered", "course"];

                  return (
                    <Td key={`empty-${index + 1}`} modifiers={modifiers}>
                      <div
                        className={`table-data-content table-data-content-centered table-data-content--empty`}
                      >
                        -
                      </div>
                    </Td>
                  );
                })}
            </Tr>
          );
        }
      }).filter(Boolean)
    : undefined;

  /**
   * Subjects and courses related to skills and arts
   */
  const renderOtherLanguageSubjectsRows = props.otherLanguageSubjects
    ? LANGUAGE_SUBJECTS.map((s) => {
        let missingColumsCount = currentMaxCourses;

        if (props.otherLanguageSubjects[s].length !== 0) {
          return (
            <Tr key={s} modifiers={["course"]}>
              <Td modifiers={["subject"]}>
                <div>{props.otherLanguageSubjects[s][0].subjectName}</div>
              </Td>

              {props.otherLanguageSubjects[s].map((c, index) => {
                missingColumsCount--;

                const listItemModifiers = ["course", "centered", "APPROVAL"];

                return (
                  <Td key={index} modifiers={listItemModifiers}>
                    <Dropdown
                      openByHover={props.user !== "supervisor"}
                      content={
                        <div className="hops-container__study-tool-dropdown-container">
                          <div className="hops-container__study-tool-dropdow-title">
                            {c.courseName}
                          </div>
                        </div>
                      }
                    >
                      <span
                        tabIndex={0}
                        className="table__data-content-wrapper table__data-content-wrapper--course"
                      >
                        {c.courseNumber}
                        {!c.transferCreditMandatory ? "*" : null}
                      </span>
                    </Dropdown>
                  </Td>
                );
              })}

              {Array(missingColumsCount)
                .fill(1)
                .map((c, index) => {
                  const modifiers = ["centered", "course"];

                  return (
                    <Td key={`empty-${index + 1}`} modifiers={modifiers}>
                      <div
                        className={`table-data-content table-data-content-centered table-data-content--empty`}
                      >
                        -
                      </div>
                    </Td>
                  );
                })}
            </Tr>
          );
        }
      }).filter(Boolean)
    : undefined;

  /**
   * Subjects and courses related to skills and arts
   */
  const renderOtherSubjectsRows = props.otherSubjects
    ? OTHER_SUBJECT_OUTSIDE_HOPS.map((s) => {
        if (props.otherSubjects[s].length !== 0) {
          return props.otherSubjects[s].map((c, index) => {
            const listItemModifiers = ["subject"];

            return (
              <Tr key={index} modifiers={["course"]}>
                <Td
                  colSpan={currentMaxCourses + 1}
                  modifiers={listItemModifiers}
                >
                  <div>
                    {c.courseName}
                    {!c.transferCreditMandatory ? "*" : null}
                  </div>
                </Td>
              </Tr>
            );
          });
        }
      }).filter(Boolean)
    : undefined;

  const uTableHeadModifiers = ["course"];

  if (props.usePlace === "studies") {
    uTableHeadModifiers.push("sticky");
  } else if (props.usePlace === "guider") {
    uTableHeadModifiers.push("sticky-inside-dialog");
  }

  return (
    <Table modifiers={["course"]}>
      <TableHead modifiers={uTableHeadModifiers}>
        <Tr modifiers={["course"]}>
          <Th modifiers={["subject"]}>Oppiaine</Th>
          <Th colSpan={currentMaxCourses}>Kurssit</Th>
        </Tr>
      </TableHead>
      <Tbody>{renderRows}</Tbody>
      {renderSkillsAndArtRows && renderSkillsAndArtRows.length !== 0 && (
        <Tbody>
          <Tr>
            <Td modifiers={["subtitle"]} colSpan={currentMaxCourses + 1}>
              Hyväksiluvut: Taito- ja taideaineet
            </Td>
          </Tr>
          {renderSkillsAndArtRows}
        </Tbody>
      )}

      {renderOtherLanguageSubjectsRows &&
        renderOtherLanguageSubjectsRows.length !== 0 && (
          <Tbody>
            <Tr>
              <Td modifiers={["subtitle"]} colSpan={currentMaxCourses + 1}>
                Hyväksiluvut: Vieraat kielet
              </Td>
            </Tr>
            {renderOtherLanguageSubjectsRows}
          </Tbody>
        )}

      {renderOtherSubjectsRows && renderOtherSubjectsRows.length !== 0 && (
        <Tbody>
          <Tr>
            <Td modifiers={["subtitle"]} colSpan={currentMaxCourses + 1}>
              Hyväksiluvut: Muut
            </Td>
          </Tr>
          {renderOtherSubjectsRows}
        </Tbody>
      )}
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
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsCourseTable);
