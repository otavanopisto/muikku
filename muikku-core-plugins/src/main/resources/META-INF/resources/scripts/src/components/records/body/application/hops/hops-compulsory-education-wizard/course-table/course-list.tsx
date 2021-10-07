import * as React from "react";
import { SchoolSubject } from "~/@types/shared";
import { schoolCourseTable } from "~/mock/mock-data";
import AnimateHeight from "react-animate-height";
import {
  ListContainer,
  ListItem,
  ListItemIndicator,
} from "~/components/general/list";

/**
 * CourseListProps
 */
interface CourseListProps {
  user: "supervisor" | "student";
  ethicsSelected: boolean;
  finnishAsSecondLanguage: boolean;
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
 * @returns JSX.Element
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
   * handleOpenSubjectCourseSelection
   * Opens and closes subject course lists
   * @param subjectId
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
      if (sSubject.subjectCode === "ai") {
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
      let listItemIndicatormodifiers = ["course"];
      let listItemModifiers = ["course"];

      if (course.mandatory) {
        mandatoryCount++;
        listItemIndicatormodifiers.push("MANDATORY");
        if (
          (props.completedSubjectListOfIds &&
            props.completedSubjectListOfIds.find(
              (courseId) => courseId === course.id
            )) ||
          (props.approvedSubjectListOfIds &&
            props.approvedSubjectListOfIds.find(
              (courseId) => courseId === course.id
            ))
        ) {
          completedCourseCount++;
        }
      } else {
        listItemIndicatormodifiers.push("OPTIONAL");
      }

      // List item options with default values
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
        completedCourseCount++;
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
        listItemModifiers.push("SUGGESTED");
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

        listItemModifiers.push("NEXT");
      }

      if (course.mandatory) {
        if (canBeSelected) {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ListItemIndicator modifiers={listItemIndicatormodifiers} />
                {course.courseNumber}. {course.name}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}></div>
            </ListItem>
          );
        } else {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ListItemIndicator modifiers={listItemIndicatormodifiers} />
                {course.courseNumber}. {course.name}
              </div>
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <ListItemIndicator modifiers={listItemIndicatormodifiers} />
                {course.courseNumber}*. {course.name}
              </div>
            </ListItem>
          );
        } else {
          return (
            <ListItem key={course.id} modifiers={listItemModifiers}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ListItemIndicator modifiers={listItemIndicatormodifiers} />
                {course.courseNumber}*. {course.name}
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
