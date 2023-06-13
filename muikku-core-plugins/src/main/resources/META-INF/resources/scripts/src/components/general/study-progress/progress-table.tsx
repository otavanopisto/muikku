import * as React from "react";
import { SchoolSubject, StudentActivityCourse } from "~/@types/shared";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Tr,
  Th,
} from "~/components/general/table";

import { connect } from "react-redux";
import { StudyProgrammeName } from ".";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import Dropdown from "~/components/general/dropdown";
import {
  LANGUAGE_SUBJECTS,
  OTHER_SUBJECT_OUTSIDE_HOPS,
  SKILL_AND_ART_SUBJECTS,
} from "../../../hooks/useStudentActivity";
import { UpdateStudentChoicesParams } from "~/hooks/useStudentChoices";
import { UpdateSupervisorOptionalSuggestionParams } from "~/hooks/useSupervisorOptionalSuggestion";
import {
  useStudyProgressContextState,
  useStudyProgressContextUpdater,
  useStudyProgressStaticDataContext,
} from "./context";
import {
  compulsoryOrUpperSecondary,
  filterMatrix,
  showSubject,
} from "~/helper-functions/shared";
import SuggestionList from "./suggestion-list";

/**
 * CourseTableProps
 */
interface HopsCourseTableProps {
  studyProgrammeName: StudyProgrammeName;
  editMode: boolean;
}

/**
 * CourseTable
 * Renders courses as table
 * @param props props
 * @returns JSX.Element
 */
const ProgressTable: React.FC<HopsCourseTableProps> = (props) => {
  const { editMode, studyProgrammeName } = props;

  const studyProgress = useStudyProgressContextState();
  const studyProgressStatic = useStudyProgressStaticDataContext();
  const studyProgressUpdater = useStudyProgressContextUpdater();

  /**
   * handleToggleChoiceClick
   * @param choiceParams choiceParams
   */
  const handleToggleChoiceClick =
    (choiceParams: UpdateStudentChoicesParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      studyProgressUpdater.updateStudentChoice(choiceParams);
    };

  /**
   * handleToggleSuggestOptionalNext
   * @param params params
   */
  const handleToggleSuggestOptional =
    (params: UpdateSupervisorOptionalSuggestionParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      studyProgressUpdater.updateSupervisorOptionalSuggestion(params);
    };

  const matrix = compulsoryOrUpperSecondary(studyProgrammeName);

  const filteredMatrix = filterMatrix(
    studyProgrammeName,
    matrix,
    studyProgress.options
  );

  /**
   * currentMaxCourses
   */
  const currentMaxCourses = getHighestCourseNumber(matrix);

  /**
   * renderRows
   * !!--USES list of mock objects currently--!!
   */
  const renderRows = filteredMatrix.map((sSubject, i) => {
    let showSubjectRow = showSubject(props.studyProgrammeName, sSubject);

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
        let courseSuggestions: StudentActivityCourse[] = [];

        let selectedByStudent = false;
        let suggestedBySupervisor = false;

        /**
         * If any of these list are given, check whether course is in
         * and push another modifier or change table data content options values
         */
        if (
          studyProgress.studentChoices.find(
            (sCourse) =>
              sCourse.subject === sSubject.subjectCode &&
              sCourse.courseNumber === course.courseNumber
          )
        ) {
          selectedByStudent = true;
          modifiers.push("OPTIONAL-SELECTED");
        }
        if (
          studyProgress.supervisorOptionalSuggestions.find(
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
          studyProgressStatic.user === "supervisor" &&
          studyProgress.suggestedNextList.find(
            (sCourse) =>
              sCourse.subject === sSubject.subjectCode &&
              sCourse.courseNumber === course.courseNumber
          )
        ) {
          const suggestedCourseDataNext =
            studyProgress.suggestedNextList.filter(
              (sCourse) => sCourse.subject === sSubject.subjectCode
            );

          courseSuggestions = courseSuggestions.concat(suggestedCourseDataNext);

          modifiers.push("NEXT");
        } else if (
          studyProgress.transferedList.find(
            (tCourse) =>
              tCourse.subject === sSubject.subjectCode &&
              tCourse.courseNumber === course.courseNumber
          )
        ) {
          showSubjectRow = true;
          canBeSelected = false;
          modifiers.push("APPROVAL");
        } else if (
          studyProgress.gradedList.find(
            (gCourse) =>
              gCourse.subject === sSubject.subjectCode &&
              gCourse.courseNumber === course.courseNumber
          )
        ) {
          canBeSelected = false;
          modifiers.push("COMPLETED");
        } else if (
          studyProgress.onGoingList.find(
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
          editMode &&
          studyProgressStatic.user === "supervisor" &&
          studyProgressStatic.useCase === "hops-planning";

        /**
         * Suggestion list is shown only if not disabled, for supervisor only
         * and there can be made selections
         */
        const showSuggestionList =
          editMode &&
          studyProgressStatic.user === "supervisor" &&
          canBeSelected;

        const courseDropdownName =
          sSubject.subjectCode + course.courseNumber + " - " + course.name;

        return (
          <Td
            key={`${sSubject.subjectCode}-${course.courseNumber}`}
            modifiers={modifiers}
            onClick={
              !course.mandatory && studyProgressStatic.user === "student"
                ? handleToggleChoiceClick({
                    studentId: studyProgressStatic.studentId,
                    courseNumber: course.courseNumber,
                    subject: sSubject.subjectCode,
                  })
                : undefined
            }
          >
            <Dropdown
              openByHover={studyProgressStatic.user !== "supervisor"}
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
                        <SuggestionList
                          studentId={studyProgressStatic.studentId}
                          studentsUserEntityId={
                            studyProgressStatic.studentUserEntityId
                          }
                          suggestedActivityCourses={courseSuggestions}
                          subjectCode={sSubject.subjectCode}
                          course={course}
                          updateSuggestionNext={
                            studyProgressUpdater.updateSuggestionForNext
                          }
                          openSignUpBehalfDialog={
                            studyProgressUpdater.openSignUpBehalfDialog
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
                              studentId: studyProgressStatic.studentId,
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
                              studentId: studyProgressStatic.studentId,
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
                        <SuggestionList
                          studentId={studyProgressStatic.studentId}
                          studentsUserEntityId={
                            studyProgressStatic.studentUserEntityId
                          }
                          suggestedActivityCourses={courseSuggestions}
                          subjectCode={sSubject.subjectCode}
                          course={course}
                          updateSuggestionNext={
                            studyProgressUpdater.updateSuggestionForNext
                          }
                          openSignUpBehalfDialog={
                            studyProgressUpdater.openSignUpBehalfDialog
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
      showSubjectRow && (
        <Tr key={sSubject.name} modifiers={["course"]}>
          <Td modifiers={["subject"]}>
            <div>{`${sSubject.name} (${sSubject.subjectCode})`}</div>
          </Td>
          {courses}
        </Tr>
      )
    );
  });

  /**
   * Subjects and courses related to skills and arts
   */
  const renderSkillsAndArtRows = studyProgress.skillsAndArt
    ? SKILL_AND_ART_SUBJECTS.map((s) => {
        let missingColumsCount = currentMaxCourses;

        if (
          studyProgress.skillsAndArt[s] &&
          studyProgress.skillsAndArt[s].length !== 0
        ) {
          return (
            <Tr key={s} modifiers={["course"]}>
              <Td modifiers={["subject"]}>
                <div>{studyProgress.skillsAndArt[s][0].subjectName}</div>
              </Td>

              {studyProgress.skillsAndArt[s].map((c, index) => {
                missingColumsCount--;

                const listItemModifiers = ["course", "centered", "APPROVAL"];

                return (
                  <Td key={index} modifiers={listItemModifiers}>
                    <Dropdown
                      openByHover={studyProgressStatic.user !== "supervisor"}
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
  const renderOtherLanguageSubjectsRows = studyProgress.otherLanguageSubjects
    ? LANGUAGE_SUBJECTS.map((s) => {
        let missingColumsCount = currentMaxCourses;

        if (
          studyProgress.otherLanguageSubjects[s] &&
          studyProgress.otherLanguageSubjects[s].length !== 0
        ) {
          return (
            <Tr key={s} modifiers={["course"]}>
              <Td modifiers={["subject"]}>
                <div>
                  {studyProgress.otherLanguageSubjects[s][0].subjectName}
                </div>
              </Td>

              {studyProgress.otherLanguageSubjects[s].map((c, index) => {
                missingColumsCount--;

                const listItemModifiers = ["course", "centered", "APPROVAL"];

                return (
                  <Td key={index} modifiers={listItemModifiers}>
                    <Dropdown
                      openByHover={studyProgressStatic.user !== "supervisor"}
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
  const renderOtherSubjectsRows = studyProgress.otherSubjects
    ? OTHER_SUBJECT_OUTSIDE_HOPS.map((s) => {
        if (
          studyProgress.otherSubjects[s] &&
          studyProgress.otherSubjects[s].length !== 0
        ) {
          return studyProgress.otherSubjects[s].map((c, index) => {
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

  if (studyProgressStatic.useCase === "hops-planning") {
    uTableHeadModifiers.push("sticky");
  } else if (studyProgressStatic.useCase === "state-of-studies") {
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

export default connect(mapStateToProps, mapDispatchToProps)(ProgressTable);
