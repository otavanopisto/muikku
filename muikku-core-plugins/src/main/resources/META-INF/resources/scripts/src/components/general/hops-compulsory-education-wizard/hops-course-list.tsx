import * as React from "react";
import {
  SchoolSubject,
  StudentActivityByStatus,
  StudentActivityCourse,
  StudentCourseChoice,
} from "~/@types/shared";
import HopsSuggestionList from "./hops-suggested-list";
import {
  ListContainer,
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
   * List of student choices
   */
  studentChoiceList?: StudentCourseChoice[];
  updateSuggestion?: (params: UpdateSuggestionParams) => void;
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
      let courseSuggestions: StudentActivityCourse[] = [];

      let selectedByStudent = false;

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
        props.suggestedOptionalList &&
        props.suggestedOptionalList.find(
          (sOCourse) =>
            sOCourse.subject === sSubject.subjectCode &&
            sOCourse.courseNumber === course.courseNumber
        )
      ) {
        const suggestedCourseDataOptional = props.suggestedOptionalList.filter(
          (oCourse) => oCourse.subject === sSubject.subjectCode
        );

        courseSuggestions = courseSuggestions.concat(
          suggestedCourseDataOptional
        );

        listItemIndicatormodifiers.push("SUGGESTED");
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
      const showAddToHopsButton =
        props.user === "supervisor" &&
        props.superVisorModifies &&
        props.useCase === "hops-planing";

      /**
       * Suggestion list is shown only if not disabled, for supervisor only
       * and there can be made selections
       */
      const showSuggestionList =
        !props.disabled && props.user === "supervisor" && canBeSelected;

      return (
        <ListItem
          key={`${sSubject.subjectCode}-${course.courseNumber}`}
          modifiers={listItemModifiers}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
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
            </ListItemIndicator>
          </div>
        </ListItem>
      );
    });

    return (
      <ListContainer key={sSubject.name} modifiers={["subject-name"]}>
        <ListItem className="list-subject-name">
          <span style={{ zIndex: 10 }}>{sSubject.name}</span>
        </ListItem>
        <ListContainer modifiers={["subject-courses"]}>{courses}</ListContainer>
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
            <ListContainer key={s} modifiers={["subject-name"]}>
              <ListItem className="list-subject-name">
                <div className="list-subject-name-proggress" />
                <span style={{ zIndex: 10 }}>
                  {props.skillsAndArt[s][0].subjectName}
                </span>
              </ListItem>
              <ListContainer modifiers={["subject-courses"]}>
                {props.skillsAndArt[s].map((c, index) => {
                  const listItemIndicatormodifiers = ["course", "APPROVAL"];
                  const listItemModifiers = ["course", "APPROVAL"];

                  return (
                    <ListItem key={index} modifiers={listItemModifiers}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ListItemIndicator
                          modifiers={listItemIndicatormodifiers}
                        >
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
                        </ListItemIndicator>
                      </div>
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
            <ListContainer key={s} modifiers={["subject-name"]}>
              <ListItem className="list-subject-name">
                <div className="list-subject-name-proggress" />
                <span style={{ zIndex: 10 }}>
                  {props.otherLanguageSubjects[s][0].subjectName}
                </span>
              </ListItem>
              <ListContainer modifiers={["subject-courses"]}>
                {props.otherLanguageSubjects[s].map((c, index) => {
                  const listItemIndicatormodifiers = ["course", "APPROVAL"];
                  const listItemModifiers = ["course", "APPROVAL"];

                  return (
                    <ListItem key={index} modifiers={listItemModifiers}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ListItemIndicator
                          modifiers={listItemIndicatormodifiers}
                        >
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
                        </ListItemIndicator>
                      </div>
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
          return props.otherSubjects[s].map((c, index) => (
            <ListContainer key={c.courseName} modifiers={["subject-name"]}>
              <ListItem className="list-subject-name">
                <span style={{ zIndex: 10 }}>
                  {c.courseName}
                  {!c.transferCreditMandatory ? "*" : null}
                </span>
              </ListItem>
            </ListContainer>
          ));
        }
      }).filter(Boolean)
    : undefined;

  return (
    <>
      <div className="list-row__container">{renderRows}</div>
      {renderSkillsAndArtRows && renderSkillsAndArtRows.length !== 0 && (
        <div className="list-row__container">
          <ListContainer modifiers={["subtitle"]}>
            <ListItem>Hyväksiluvut: Taito ja taideaineet</ListItem>
          </ListContainer>
          {renderSkillsAndArtRows}
        </div>
      )}

      {renderOtherLanguageSubjectsRows &&
        renderOtherLanguageSubjectsRows.length !== 0 && (
          <div className="list-row__container">
            <ListContainer modifiers={["subtitle"]}>
              <ListItem>Hyväksiluvut: Vieraat kielet</ListItem>
            </ListContainer>
            {renderOtherLanguageSubjectsRows}
          </div>
        )}

      {renderOtherSubjectsRows && renderOtherSubjectsRows.length !== 0 && (
        <div className="list-row__container">
          <ListContainer modifiers={["subtitle"]}>
            <ListItem>Hyväksiluvut: Muut</ListItem>
          </ListContainer>
          {renderOtherSubjectsRows}
        </div>
      )}
    </>
  );
};

export default HopsCourseList;
