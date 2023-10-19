import * as React from "react";
import { SchoolSubject, StudentActivityByStatus } from "~/@types/shared";
import HopsSuggestionList from "./hops-suggested-list";
import {
  ListContainer,
  ListHeader,
  ListItem,
  ListItemIndicator,
} from "~/components/general/list";
import {
  LANGUAGE_SUBJECTS,
  OTHER_SUBJECT_OUTSIDE_HOPS,
  SKILL_AND_ART_SUBJECTS,
  UpdateSuggestionParams,
} from "../../../hooks/useStudentActivity";
import { HopsUser } from ".";
import { UpdateStudentChoicesParams } from "~/hooks/useStudentChoices";
import Dropdown from "~/components/general/dropdown";
import Button from "~/components/general/button";
import { UpdateSupervisorOptionalSuggestionParams } from "~/hooks/useSupervisorOptionalSuggestion";
import {
  OptionalCourseSuggestion,
  StudentCourseChoice,
  StudentStudyActivity,
} from "~/generated/client";

/**
 * CourseListProps
 */
interface HopsCourseListProps extends Partial<StudentActivityByStatus> {
  /**
   * matrix
   */
  matrix: SchoolSubject[];
  /**
   * useCase
   */
  useCase: "study-matrix" | "hops-planning";
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
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsCourseList: React.FC<HopsCourseListProps> = (props) => {
  /**
   * handleToggleChoiceClick
   *
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
   * renderRows
   */
  const renderRows = props.matrix.map((sSubject, i) => {
    /**
     * Renders courses
     */
    const courses = sSubject.availableCourses.map((course) => {
      //Default modifiers
      const listItemIndicatormodifiers = ["course"];
      const listItemModifiers = ["course"];

      if (course.mandatory) {
        listItemIndicatormodifiers.push("MANDATORY");
      } else {
        listItemIndicatormodifiers.push("OPTIONAL");
      }

      // List item options with default values
      let canBeSelected = true;
      let courseSuggestions: StudentStudyActivity[] = [];

      let selectedByStudent = false;
      let suggestedBySupervisor = false;

      /**
       * If any of these list are given, check whether course id is in
       * and push another modifier
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
        listItemIndicatormodifiers.push("OPTIONAL-SELECTED");
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
        listItemIndicatormodifiers.push("SUGGESTED");
      }

      /**
       * Only one of these can happen
       */
      if (
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

        listItemIndicatormodifiers.push("NEXT");
      } else if (
        props.transferedList &&
        props.transferedList.find(
          (tCourse) =>
            tCourse.subject === sSubject.subjectCode &&
            tCourse.courseNumber === course.courseNumber
        )
      ) {
        canBeSelected = false;
        listItemIndicatormodifiers.push("APPROVAL");
      } else if (
        props.gradedList &&
        props.gradedList.find(
          (gCourse) =>
            gCourse.subject === sSubject.subjectCode &&
            gCourse.courseNumber === course.courseNumber
        )
      ) {
        canBeSelected = false;
        listItemIndicatormodifiers.push("COMPLETED");
      } else if (
        props.onGoingList &&
        props.onGoingList.find(
          (oCourse) =>
            oCourse.subject === sSubject.subjectCode &&
            oCourse.courseNumber === course.courseNumber
        )
      ) {
        canBeSelected = false;
        listItemIndicatormodifiers.push("INPROGRESS");
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

      return (
        <ListItem
          key={`${sSubject.subjectCode}-${course.courseNumber}`}
          modifiers={listItemModifiers}
        >
          <ListItemIndicator
            modifiers={listItemIndicatormodifiers}
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
                        {showSuggestAndAddToHopsButtons &&
                          props.useCase === "hops-planning" && (
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
              <span tabIndex={0} className="list__indicator-data-wapper">
                {course.mandatory
                  ? course.courseNumber
                  : `${course.courseNumber}*`}
              </span>
            </Dropdown>
          </ListItemIndicator>
        </ListItem>
      );
    });

    return (
      <ListContainer key={sSubject.name} modifiers={["subject"]}>
        <ListContainer modifiers={["row"]}>
          <ListHeader
            modifiers={["subject-name"]}
          >{`${sSubject.name} (${sSubject.subjectCode})`}</ListHeader>
        </ListContainer>
        <ListContainer modifiers={["row"]}>{courses}</ListContainer>
      </ListContainer>
    );
  });

  /**
   * Subjects and courses related to skills and arts
   */
  const renderSkillsAndArtRows = props.skillsAndArt
    ? SKILL_AND_ART_SUBJECTS.map((s) => {
        if (props.skillsAndArt[s].length !== 0) {
          return (
            <ListContainer key={s} modifiers={["subject"]}>
              <ListContainer modifiers={["row"]}>
                <ListHeader modifiers={["subject-name"]}>
                  {props.skillsAndArt[s][0].subjectName}
                </ListHeader>
              </ListContainer>
              <ListContainer modifiers={["row"]}>
                {props.skillsAndArt[s].map((c, index) => {
                  const listItemIndicatormodifiers = ["course", "APPROVAL"];
                  const listItemModifiers = ["course", "APPROVAL"];

                  return (
                    <ListItem key={index} modifiers={listItemModifiers}>
                      <ListItemIndicator modifiers={listItemIndicatormodifiers}>
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
                            className="list__indicator-data-wapper"
                          >
                            {c.courseNumber}
                            {!c.transferCreditMandatory ? "*" : null}
                          </span>
                        </Dropdown>
                      </ListItemIndicator>
                    </ListItem>
                  );
                })}
              </ListContainer>
            </ListContainer>
          );
        }
      }).filter(Boolean)
    : undefined;

  /**
   * Subjects and courses related to skills and arts
   */
  const renderOtherLanguageSubjectsRows = props.otherLanguageSubjects
    ? LANGUAGE_SUBJECTS.map((s) => {
        if (props.otherLanguageSubjects[s].length !== 0) {
          return (
            <ListContainer key={s} modifiers={["subject"]}>
              <ListContainer modifiers={["row"]}>
                <ListHeader modifiers={["subject-name"]}>
                  {props.otherLanguageSubjects[s][0].subjectName}
                </ListHeader>
              </ListContainer>
              <ListContainer modifiers={["row"]}>
                {props.otherLanguageSubjects[s].map((c, index) => {
                  const listItemIndicatormodifiers = ["course", "APPROVAL"];
                  const listItemModifiers = ["course", "APPROVAL"];

                  return (
                    <ListItem key={index} modifiers={listItemModifiers}>
                      <ListItemIndicator modifiers={listItemIndicatormodifiers}>
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
                          <span tabIndex={0} className="list__item-data-wapper">
                            {c.courseNumber}
                            {!c.transferCreditMandatory ? "*" : null}
                          </span>
                        </Dropdown>
                      </ListItemIndicator>
                    </ListItem>
                  );
                })}
              </ListContainer>
            </ListContainer>
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
          return props.otherSubjects[s].map((c) => (
            <ListContainer key={c.courseName} modifiers={["row"]}>
              <ListHeader modifiers={["subject-name"]}>
                {c.courseName}
                {!c.transferCreditMandatory ? "*" : null}
              </ListHeader>
            </ListContainer>
          ));
        }
      }).filter(Boolean)
    : undefined;

  return (
    <div className="list">
      <ListContainer modifiers={["section"]}>{renderRows}</ListContainer>

      {renderSkillsAndArtRows && renderSkillsAndArtRows.length !== 0 && (
        <ListContainer modifiers={["section"]}>
          <ListContainer modifiers={["row"]}>
            <ListHeader modifiers={["subtitle"]}>
              Hyväksiluvut: Taito- ja taideaineet
            </ListHeader>
          </ListContainer>
          {renderSkillsAndArtRows}
        </ListContainer>
      )}

      {renderOtherLanguageSubjectsRows &&
        renderOtherLanguageSubjectsRows.length !== 0 && (
          <ListContainer modifiers={["section"]}>
            <ListContainer modifiers={["row"]}>
              <ListHeader modifiers={["subtitle"]}>
                Hyväksiluvut: Vieraat kielet
              </ListHeader>
            </ListContainer>
            {renderOtherLanguageSubjectsRows}
          </ListContainer>
        )}

      {renderOtherSubjectsRows && renderOtherSubjectsRows.length !== 0 && (
        <ListContainer modifiers={["section"]}>
          <ListContainer modifiers={["row"]}>
            <ListHeader modifiers={["subtitle"]}>Hyväksiluvut: Muut</ListHeader>
          </ListContainer>
          {renderOtherSubjectsRows}
        </ListContainer>
      )}
    </div>
  );
};

export default HopsCourseList;
