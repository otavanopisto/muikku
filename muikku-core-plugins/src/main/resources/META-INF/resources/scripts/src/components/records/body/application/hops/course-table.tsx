import * as React from "react";
import { CourseStatus, SchoolSubject } from "~/@types/shared";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Th,
  Tr,
} from "~/components/general/table";
import { mockSchoolSubjects } from "~/mock/mock-data";
import Dropdown from "../../../../general/dropdown";

interface CourseTableProps {
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
const CourseTable: React.FC<CourseTableProps> = (props) => {
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
   * currentMaxCourses
   */
  const currentMaxCourses = getHighestCourseNumber(mockSchoolSubjects);

  /**
   * renderTableHeaderRow
   */
  /* const renderTableHeaderRow = (
    <Tr>
      <Th>Oppiaine</Th>
      {Array(currentMaxCourses)
        .fill(1)
        .map((value, index) => (
          <Th modifiers={["centered"]} key={index}>
            {index + 1}
          </Th>
        ))}
    </Tr>
  ); */

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

    const courses = Array(currentMaxCourses)
      .fill(1)
      .map((c, index) => {
        let canBeSelected = true;
        let modifiers = ["course", "centered"];
        let canBeSuggestedForNextCourse = true;
        let canBeSuggestedForOptionalCourse = true;
        let suggestedForNext = false;
        let suggestedForOptional = false;

        const course = sSubject.availableCourses.find(
          (aCourse) => aCourse.courseNumber === index + 1
        );

        if (course === undefined) {
          return (
            <Td key={`empty-${index + 1}`} modifiers={["centered", "empty"]}>
              -
            </Td>
          );
        }

        if (course.mandatory) {
          modifiers.push("MANDATORY");
        } else {
          modifiers.push("OPTIONAL");
        }

        if (
          props.approvedSubjectListOfIds &&
          props.approvedSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("APPROVAL");
        } else if (
          props.selectedOptionalListOfIds &&
          props.selectedOptionalListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          modifiers.push("SELECTED_OPTIONAL");
        } else if (
          props.completedSubjectListOfIds &&
          props.completedSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          canBeSuggestedForOptionalCourse = true;
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("COMPLETED");
        } else if (
          props.inprogressSubjectListOfIds &&
          props.inprogressSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          canBeSuggestedForOptionalCourse = true;
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("INPROGRESS");
        } else if (
          props.supervisorSugestedSubjectListOfIds &&
          props.supervisorSugestedSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          suggestedForOptional = true;
          !props.selectOptionalIsActive && modifiers.push("SUGGESTED");
        }

        if (
          props.selectedSubjectListOfIds &&
          props.selectedSubjectListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          modifiers.push("SELECTED");
        }

        if (
          props.supervisorSuggestedNextListOfIds &&
          props.supervisorSuggestedNextListOfIds.find(
            (courseId) => courseId === course.id
          )
        ) {
          suggestedForNext = true;

          !props.selectNextIsActive && modifiers.push("NEXT");
        }

        if (course.mandatory) {
          return (
            <Td key={course.id} modifiers={modifiers}>
              {canBeSelected ? (
                <Dropdown
                  openByHover={true}
                  content={
                    <div>
                      <h4>Suoritusaika-arvio: {course.length}h</h4>
                    </div>
                  }
                >
                  <div
                    tabIndex={0}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {course.courseNumber}
                    </span>
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
                        onChange={handleSuggestedForNextCheckboxChange(
                          course.id
                        )}
                      />
                    </div>
                  </div>
                </Dropdown>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>{course.courseNumber}</span>
                </div>
              )}
            </Td>
          );
        } else {
          if (canBeSelected) {
            return (
              <Td
                key={course.name}
                modifiers={modifiers}
                onClick={
                  props.user === "student"
                    ? handleToggleCourseClick(course.id)
                    : undefined
                }
              >
                <Dropdown
                  openByHover={true}
                  content={
                    <div>
                      <h4>Suoritusaika-arvio: {course.length}h</h4>
                    </div>
                  }
                >
                  <div
                    tabIndex={0}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {course.courseNumber}*
                    </span>

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
                        onChange={handleSuggestedForNextCheckboxChange(
                          course.id
                        )}
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
                        className="item__input item__input--course__table"
                        value={course.id}
                        onChange={handleSuggestedForOptionalCheckboxChange(
                          course.id
                        )}
                      />
                    </div>
                  </div>
                </Dropdown>
              </Td>
            );
          } else {
            return (
              <Td key={course.name} modifiers={modifiers}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>{course.courseNumber}*</span>
                </div>
              </Td>
            );
          }
        }
      });

    let rowMods = ["course"];

    if (props.selectNextIsActive || props.selectOptionalIsActive) {
      rowMods.push("selectActive");
    }

    return (
      <Tr key={sSubject.name} modifiers={rowMods}>
        <Td modifiers={["subject"]}>{sSubject.name}</Td>
        {courses}
      </Tr>
    );
  });

  return (
    <Table>
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

export default CourseTable;
