import * as React from "react";
import {
  StudentActivityByStatus,
  StudentActivityCourse,
  StudentCourseChoice,
} from "~/@types/shared";
import { schoolCourseTable } from "~/mock/mock-data";
import AnimateHeight from "react-animate-height";
import HopsSuggestionList from "./hops-suggested-list";
import {
  ListContainer,
  ListItem,
  ListItemIndicator,
} from "~/components/general/list";
import { UpdateSuggestionParams } from "./hooks/useStudentActivity";
import { HopsUser } from ".";
import { UpdateStudentChoicesParams } from "./hooks/useStudentChoices";

/**
 * CourseListProps
 */
interface HopsCourseListProps extends Partial<StudentActivityByStatus> {
  user: HopsUser;
  studentId: string;
  disabled: boolean;
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
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsCourseList: React.FC<HopsCourseListProps> = (props) => {
  const [openedSubjectSelections, setOpenedSubjectSelections] = React.useState<
    string[]
  >([]);

  const [openedSubjectSuggestions, setOpenedSubjectSuggestions] =
    React.useState<number[]>([]);

  /**
   * handleToggleChoiceClick
   *
   * @param choiceParams choiceParams
   */
  const handleToggleChoiceClick =
    (choiceParams: UpdateStudentChoicesParams) =>
    (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
      props.updateStudentChoice(choiceParams);
    };

  /**
   * handleOpenSuggestionList
   *
   * @param user user
   * @param courseId courseId
   */
  const handleOpenSuggestionList =
    (user: HopsUser, courseId: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (user === "supervisor") {
        /**
         * Old values
         */
        const updatedOpenedSubjectSelections = [...openedSubjectSuggestions];

        /**
         * Find index
         */
        const index = updatedOpenedSubjectSelections.findIndex(
          (sId) => sId === courseId
        );

        /**
         * If index is found, then splice it away, otherwise push id to updated list
         */
        if (index !== -1) {
          updatedOpenedSubjectSelections.splice(index, 1);
        } else {
          updatedOpenedSubjectSelections.push(courseId);
        }

        setOpenedSubjectSuggestions(updatedOpenedSubjectSelections);
      }
    };

  /**
   * handleOpenSubjectCourseSelection
   * Opens and closes subject course lists
   *
   * @param subjectName subjectName
   */
  const handleOpenSubjectCourseSelection =
    (subjectName: string) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      /**
       * Old values
       */
      const updatedOpenedSubjectSelections = [...openedSubjectSelections];

      /**
       * Find index
       */
      const index = updatedOpenedSubjectSelections.findIndex(
        (sId) => sId === subjectName
      );

      /**
       * If index is found, then splice it away, otherwise push id to updated list
       */
      if (index !== -1) {
        updatedOpenedSubjectSelections.splice(index, 1);
      } else {
        updatedOpenedSubjectSelections.push(subjectName);
      }

      setOpenedSubjectSelections(updatedOpenedSubjectSelections);
    };

  /**
   * renderRows
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

    // Counters
    let mandatoryCount = 0;
    let completedCourseCount = 0;

    /**
     * Renders courses
     */
    const courses = sSubject.availableCourses.map((course) => {
      //Default modifiers
      const listItemIndicatormodifiers = ["course"];
      const listItemModifiers = ["course"];

      if (course.mandatory) {
        mandatoryCount++;
        listItemIndicatormodifiers.push("MANDATORY");
        if (
          (props.gradedList &&
            props.gradedList.find(
              (gCourse) =>
                gCourse.subject === sSubject.subjectCode &&
                gCourse.courseNumber === course.courseNumber
            )) ||
          (props.transferedList &&
            props.transferedList.find(
              (tCourse) =>
                tCourse.subject === sSubject.subjectCode &&
                tCourse.courseNumber === course.courseNumber
            ))
        ) {
          completedCourseCount++;
        }
      } else {
        listItemIndicatormodifiers.push("OPTIONAL");
      }

      // List item options with default values
      let canBeSelected = true;
      let courseSuggestions: StudentActivityCourse[] = [];

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

        listItemModifiers.push("NEXT");
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

        listItemModifiers.push("SUGGESTED");
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
        completedCourseCount++;
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

      const suggestionsOpen = openedSubjectSuggestions.includes(course.id);

      if (course.mandatory) {
        if (canBeSelected) {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ListItemIndicator modifiers={listItemIndicatormodifiers} />
                <div
                  onClick={handleOpenSuggestionList(props.user, course.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  {course.courseNumber}. {course.name}
                </div>
              </div>
              <AnimateHeight height={suggestionsOpen ? "auto" : 0}>
                <HopsSuggestionList
                  studentId={props.studentId}
                  suggestedActivityCourses={courseSuggestions}
                  course={course}
                  subjectCode={sSubject.subjectCode}
                  updateSuggestion={props.updateSuggestion}
                  loadData={suggestionsOpen}
                  canSuggestForNext={true}
                  canSuggestForOptional={true}
                />
              </AnimateHeight>
            </ListItem>
          );
        } else {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ListItemIndicator modifiers={listItemIndicatormodifiers} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  {course.courseNumber}. {course.name}
                </div>
              </div>
            </ListItem>
          );
        }
      } else {
        if (canBeSelected) {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ListItemIndicator
                  modifiers={listItemIndicatormodifiers}
                  onClick={handleToggleChoiceClick({
                    studentId: props.studentId,
                    courseNumber: course.courseNumber,
                    subject: sSubject.subjectCode,
                  })}
                />
                <div
                  onClick={handleOpenSuggestionList(props.user, course.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  {course.courseNumber}*. {course.name}
                </div>
              </div>
              <AnimateHeight height={suggestionsOpen ? "auto" : 0}>
                <HopsSuggestionList
                  studentId={props.studentId}
                  suggestedActivityCourses={courseSuggestions}
                  course={course}
                  subjectCode={sSubject.subjectCode}
                  updateSuggestion={props.updateSuggestion}
                  loadData={suggestionsOpen}
                  canSuggestForNext={true}
                  canSuggestForOptional={true}
                />
              </AnimateHeight>
            </ListItem>
          );
        } else {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ListItemIndicator modifiers={listItemIndicatormodifiers} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  {course.courseNumber}*. {course.name}
                </div>
              </div>
            </ListItem>
          );
        }
      }
    });

    /**
     * Boolean value if subject list is open
     */
    const open = openedSubjectSelections.includes(sSubject.name);

    /**
     * Proggress value of completed mandatory courses
     */
    const mandatoryProggress = (completedCourseCount / mandatoryCount) * 100;

    return (
      <ListContainer key={sSubject.name} modifiers={["course"]}>
        <ListItem
          className="list-subject-name"
          onClick={handleOpenSubjectCourseSelection(sSubject.name)}
        >
          <div
            className="list-subject-name-proggress"
            style={{ width: `${mandatoryProggress}%` }}
          />
          <span style={{ zIndex: 10 }}>{sSubject.name}</span>
          <div
            className={`list-item-arrow ${open ? "arrow-down" : "arrow-right"}`}
          />
        </ListItem>

        <AnimateHeight
          height={open ? "auto" : 0}
          className="list-subject-course__container"
        >
          {courses}
        </AnimateHeight>
      </ListContainer>
    );
  });

  return <div className="list-row__container">{renderRows}</div>;
};

export default HopsCourseList;
