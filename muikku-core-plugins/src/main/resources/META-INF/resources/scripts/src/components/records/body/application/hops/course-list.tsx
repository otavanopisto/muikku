import * as React from "react";
import { SchoolSubject } from "~/@types/shared";
import { mockSchoolSubjects } from "~/mock/mock-data";
import Dropdown from "../../../../general/dropdown";
import AnimateHeight from "react-animate-height";
import {
  ListContainer,
  ListItem,
  ListItemIndicator,
} from "~/components/general/list";

interface CourseListProps {
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
 * @returns
 */
const CourseList: React.FC<CourseListProps> = (props) => {
  const [openedSubjectSelections, setOpenedSubjectSelections] = React.useState<
    string[]
  >([]);

  React.useEffect(() => {}, [
    props.supervisorSuggestedNextListOfIds,
    props.supervisorSugestedSubjectListOfIds,
  ]);

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
        let selectedOptionalCourseListOfIds = [
          ...props.selectedSubjectListOfIds,
        ];

        let indexOfSubjectCourse = selectedOptionalCourseListOfIds.findIndex(
          (sCourseId) => sCourseId === courseId
        );

        if (indexOfSubjectCourse !== -1) {
          selectedOptionalCourseListOfIds.splice(indexOfSubjectCourse, 1);
        } else {
          selectedOptionalCourseListOfIds.push(courseId);
        }

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
        const updatedSuggestedForNextListIds = [
          ...props.supervisorSuggestedNextListOfIds,
        ];

        const index = updatedSuggestedForNextListIds.findIndex(
          (courseId) => courseId === id
        );

        if (index !== -1) {
          updatedSuggestedForNextListIds.splice(index, 1);
        } else {
          updatedSuggestedForNextListIds.push(id);
        }

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
        const updatedSuggestedForOptionalListIds = [
          ...props.supervisorSugestedSubjectListOfIds,
        ];

        const index = updatedSuggestedForOptionalListIds.findIndex(
          (courseId) => courseId === id
        );

        if (index !== -1) {
          updatedSuggestedForOptionalListIds.splice(index, 1);
        } else {
          updatedSuggestedForOptionalListIds.push(id);
        }

        props.onChangeSuggestedForNextList &&
          props.onChangeSuggestedForNextList(
            updatedSuggestedForOptionalListIds
          );
      }
    };

  /**
   * handleOpenSubjectCourseSelection
   * @param subjectId
   */
  const handleOpenSubjectCourseSelection =
    (subjectName: string) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const updatedOpenedSubjectSelections = [...openedSubjectSelections];

      const index = updatedOpenedSubjectSelections.findIndex(
        (sId) => sId === subjectName
      );

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
  const renderRows = mockSchoolSubjects.map((sSubject, i) => {
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

    const courses = sSubject.availableCourses.map((course, index) => {
      let listItemIndicatormodifiers = ["course"];
      let listItemModifiers = ["course"];

      if (course.mandatory) {
        listItemIndicatormodifiers.push("MANDATORY");
      } else {
        listItemIndicatormodifiers.push("OPTIONAL");
      }

      let canBeSelected = true;
      let canBeSuggestedForNextCourse = true;
      let canBeSuggestedForOptionalCourse = true;
      let suggestedForNext = false;
      let suggestedForOptional = false;

      /**
       * If any of these list are given, check whether course id is in
       * and push another modifier
       */
      if (
        props.approvedSubjectListOfIds &&
        props.approvedSubjectListOfIds.find(
          (courseId) => courseId === course.id
        )
      ) {
        canBeSuggestedForNextCourse = false;
        canBeSelected = false;
        listItemIndicatormodifiers.push("APPROVAL");
      } else if (
        props.selectedOptionalListOfIds &&
        props.selectedOptionalListOfIds.find(
          (courseId) => courseId === course.id
        )
      ) {
        listItemIndicatormodifiers.push("SELECTED_OPTIONAL");
      } else if (
        props.completedSubjectListOfIds &&
        props.completedSubjectListOfIds.find(
          (courseId) => courseId === course.id
        )
      ) {
        canBeSuggestedForOptionalCourse = false;
        canBeSuggestedForNextCourse = false;
        canBeSelected = false;
        listItemIndicatormodifiers.push("COMPLETED");
      } else if (
        props.inprogressSubjectListOfIds &&
        props.inprogressSubjectListOfIds.find(
          (courseId) => courseId === course.id
        )
      ) {
        canBeSuggestedForOptionalCourse = false;
        canBeSuggestedForNextCourse = false;
        canBeSelected = false;
        listItemIndicatormodifiers.push("INPROGRESS");
      } else if (
        props.supervisorSugestedSubjectListOfIds &&
        props.supervisorSugestedSubjectListOfIds.find(
          (courseId) => courseId === course.id
        )
      ) {
        suggestedForOptional = true;
        !props.selectOptionalIsActive && listItemModifiers.push("SUGGESTED");
      }

      if (
        props.selectedSubjectListOfIds &&
        props.selectedSubjectListOfIds.find(
          (courseId) => courseId === course.id
        )
      ) {
        listItemIndicatormodifiers.push("SELECTED");
      }

      if (
        props.supervisorSuggestedNextListOfIds &&
        props.supervisorSuggestedNextListOfIds.find(
          (courseId) => courseId === course.id
        )
      ) {
        suggestedForNext = true;

        !props.selectNextIsActive && listItemModifiers.push("NEXT");
      }

      if (course.mandatory) {
        if (canBeSelected) {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <ListItemIndicator modifiers={listItemIndicatormodifiers} />
              {course.courseNumber}. {course.name}
              <div
                className={`checkbox-container ${
                  props.selectNextIsActive && canBeSuggestedForNextCourse
                    ? "checkbox-container--active"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={suggestedForNext}
                  className="item__input"
                  value={course.id}
                  onChange={handleSuggestedForNextCheckboxChange(course.id)}
                />
              </div>
            </ListItem>
          );
        } else {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <ListItemIndicator modifiers={listItemIndicatormodifiers} />
              {course.courseNumber}. {course.name}
            </ListItem>
          );
        }
      } else {
        if (canBeSelected) {
          return (
            <ListItem
              key={course.id}
              onClick={
                props.user === "student"
                  ? handleToggleCourseClick(course.id)
                  : undefined
              }
              modifiers={listItemModifiers}
            >
              <ListItemIndicator modifiers={listItemIndicatormodifiers} />
              {course.courseNumber}*. {course.name}
              <div
                className={`checkbox-container ${
                  props.selectNextIsActive && canBeSuggestedForNextCourse
                    ? "checkbox-container--active"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={suggestedForNext}
                  className="item__input"
                  value={course.id}
                  onChange={handleSuggestedForNextCheckboxChange(course.id)}
                />
              </div>
              <div
                className={`checkbox-container ${
                  props.selectOptionalIsActive &&
                  canBeSuggestedForOptionalCourse
                    ? "checkbox-container--active"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={suggestedForOptional}
                  className="item__input"
                  value={course.id}
                  onChange={handleSuggestedForOptionalCheckboxChange(course.id)}
                />
              </div>
            </ListItem>
          );
        } else {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <ListItemIndicator modifiers={listItemIndicatormodifiers} />
              {course.courseNumber}*. {course.name}
            </ListItem>
          );
        }
      }
    });

    const open = openedSubjectSelections.includes(sSubject.name);

    return (
      <ListContainer key={sSubject.name} modifiers={["course"]}>
        <ListItem
          modifiers={["subject"]}
          onClick={handleOpenSubjectCourseSelection(sSubject.name)}
        >
          {sSubject.name}
          <div className={`list-item-arrow ${open ? "down" : "right"}`} />
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

export default CourseList;
