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
import Button from "../../../../general/button";
import AnimateHeight from "react-animate-height";

interface CourseTableProps {
  selectedSubjects?: SchoolSubject[];
  user: "supervisor" | "student";
  selectNextIsActive: boolean;
  ethicsSelected: boolean;
  finnishAsSecondLanguage: boolean;
  selectedSubjectListOfIds?: number[];
  completedSubjectListOfIds?: number[];
  approvedSubjectListOfIds?: number[];
  inprogressSubjectListOfIds?: number[];
  selectedOptionalListOfIds?: number[];
  supervisorSuggestedNextListOfIds?: number[];
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
  const [width, setWidth] = React.useState<number>(window.innerWidth);
  const [openedSubjectSelections, setOpenedSubjectSelections] = React.useState<
    string[]
  >([]);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  let isMobile: boolean = width <= 640;

  /**
   * handleTableDataChange
   */
  const handleToggleCourseClick =
    (subjectIndex: number, subjectCourseIndex: number) =>
    (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
      const selectedSubjects = [...props.selectedSubjects];

      if (props.user === "supervisor") {
        if (
          props.onChangeSelectSubjectList &&
          props.supervisorSugestedSubjectListOfIds &&
          selectedSubjects
        ) {
          let supervisorSugestedSubjectListOfIds = [
            ...props.supervisorSugestedSubjectListOfIds,
          ];

          if (
            selectedSubjects[subjectIndex].availableCourses[
              subjectCourseIndex
            ] !== undefined
          ) {
            let indexOfSubjectCourse =
              supervisorSugestedSubjectListOfIds.findIndex(
                (subjectId) =>
                  subjectId ===
                  selectedSubjects[subjectIndex].availableCourses[
                    subjectCourseIndex
                  ].id
              );

            if (indexOfSubjectCourse !== -1) {
              supervisorSugestedSubjectListOfIds.splice(
                indexOfSubjectCourse,
                1
              );
            } else {
              supervisorSugestedSubjectListOfIds.push(
                selectedSubjects[subjectIndex].availableCourses[
                  subjectCourseIndex
                ].id
              );
            }
          }

          props.onChangeSelectSubjectList &&
            props.onChangeSelectSubjectList(supervisorSugestedSubjectListOfIds);
        }
      } else {
        if (
          props.onChangeSelectSubjectList &&
          props.selectedSubjectListOfIds &&
          selectedSubjects
        ) {
          let selectedSubjectListOfIds = [...props.selectedSubjectListOfIds];

          if (
            selectedSubjects[subjectIndex].availableCourses[
              subjectCourseIndex
            ] !== undefined
          ) {
            let indexOfSubjectCourse = selectedSubjectListOfIds.findIndex(
              (subjectId) =>
                subjectId ===
                selectedSubjects[subjectIndex].availableCourses[
                  subjectCourseIndex
                ].id
            );

            if (indexOfSubjectCourse !== -1) {
              selectedSubjectListOfIds.splice(indexOfSubjectCourse, 1);
            } else {
              selectedSubjectListOfIds.push(
                selectedSubjects[subjectIndex].availableCourses[
                  subjectCourseIndex
                ].id
              );
            }
          }

          props.onChangeSelectSubjectList &&
            props.onChangeSelectSubjectList(selectedSubjectListOfIds);
        }
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
        const supervisorSuggestedNextListOfIds = [
          ...props.supervisorSuggestedNextListOfIds,
        ];

        const index = supervisorSuggestedNextListOfIds.findIndex(
          (courseId) => courseId === id
        );

        if (index !== -1) {
          supervisorSuggestedNextListOfIds.splice(index, 1);
        } else {
          supervisorSuggestedNextListOfIds.push(id);
        }

        props.onChangeSuggestedForNextList &&
          props.onChangeSuggestedForNextList(supervisorSuggestedNextListOfIds);
      }
    };

  /**
   * handleOpenSubjectCourseSelection
   * @param subjectId
   */
  const handleOpenSubjectCourseSelection =
    (subjectName: string) =>
    (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
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
   * currentMaxCourses
   */
  const currentMaxCourses = getHighestCourseNumber(mockSchoolSubjects);

  /**
   * renderTableHeaderRow
   */
  const renderTableHeaderRow = (
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
  );

  /**
   * renderRows
   */
  const renderRows = mockSchoolSubjects.map((sSubject, i) => {
    let courses = [];

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

    for (let index = 0; index < currentMaxCourses; index++) {
      const isAvailable =
        sSubject.availableCourses.findIndex(
          (aCourse) => aCourse.courseNumber === index + 1
        ) !== -1;

      /**
       * If with current course number there is available course
       * otherwise render empty table data cell
       */
      if (isAvailable && sSubject.availableCourses[index] !== undefined) {
        let modifiers = ["course", "centered"];

        let canBeSelected = true;

        if (sSubject.availableCourses[index].mandatory) {
          modifiers.push("MANDATORY");
        } else {
          modifiers.push("OPTIONAL");
        }

        let canBeSuggestedForNextCourse = true;
        let suggestedForNext = false;

        /**
         * If any of these list are given, check whether course id is in
         * and push another modifier
         */
        if (
          props.approvedSubjectListOfIds &&
          props.approvedSubjectListOfIds.find(
            (courseId) => courseId === sSubject.availableCourses[index].id
          )
        ) {
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("APPROVAL");
        } else if (
          props.selectedOptionalListOfIds &&
          props.selectedOptionalListOfIds.find(
            (courseId) => courseId === sSubject.availableCourses[index].id
          )
        ) {
          modifiers.push("SELECTED_OPTIONAL");
        } else if (
          props.completedSubjectListOfIds &&
          props.completedSubjectListOfIds.find(
            (courseId) => courseId === sSubject.availableCourses[index].id
          )
        ) {
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("COMPLETED");
        } else if (
          props.inprogressSubjectListOfIds &&
          props.inprogressSubjectListOfIds.find(
            (courseId) => courseId === sSubject.availableCourses[index].id
          )
        ) {
          canBeSuggestedForNextCourse = false;
          canBeSelected = false;
          modifiers.push("INPROGRESS");
        } else if (
          props.supervisorSugestedSubjectListOfIds &&
          props.supervisorSugestedSubjectListOfIds.find(
            (courseId) => courseId === sSubject.availableCourses[index].id
          )
        ) {
          modifiers.push("SUGGESTED");
        }

        if (
          props.selectedSubjectListOfIds &&
          props.selectedSubjectListOfIds.find(
            (courseId) => courseId === sSubject.availableCourses[index].id
          )
        ) {
          modifiers.push("SELECTED");
        }

        if (
          props.supervisorSuggestedNextListOfIds &&
          props.supervisorSuggestedNextListOfIds.find(
            (courseId) => courseId === sSubject.availableCourses[index].id
          )
        ) {
          suggestedForNext = true;

          !props.selectNextIsActive && modifiers.push("NEXT");
        }

        /**
         * Checks whether course is mandatory or not
         * and sets indicator to indicate that
         */
        if (sSubject.availableCourses[index].mandatory) {
          courses.push(
            <Td
              key={sSubject.availableCourses[index].name}
              modifiers={modifiers}
            >
              {canBeSelected ? (
                <Dropdown
                  openByHover={props.user === "student"}
                  content={
                    <div>
                      <h4>
                        Suoritusaika-arvio:{" "}
                        {sSubject.availableCourses[index].length}h
                      </h4>
                    </div>
                  }
                >
                  <div
                    tabIndex={0}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 10px",
                    }}
                  >
                    <span>{index + 1}</span>
                    {props.selectNextIsActive && canBeSuggestedForNextCourse ? (
                      <input
                        type="checkbox"
                        checked={suggestedForNext}
                        className="item__input"
                        value={sSubject.availableCourses[index].id}
                        onChange={handleSuggestedForNextCheckboxChange(
                          sSubject.availableCourses[index].id
                        )}
                      />
                    ) : null}
                  </div>
                </Dropdown>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 10px",
                  }}
                >
                  <span>{index + 1}</span>
                </div>
              )}
            </Td>
          );
        } else {
          if (canBeSelected) {
            courses.push(
              <Td
                key={sSubject.availableCourses[index].name}
                onClick={handleToggleCourseClick(i, index)}
                modifiers={modifiers}
              >
                <Dropdown
                  openByHover={props.user === "student"}
                  content={
                    <div>
                      <h4>
                        Suoritusaika-arvio:{" "}
                        {sSubject.availableCourses[index].length}h
                      </h4>
                    </div>
                  }
                >
                  <div
                    tabIndex={0}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 10px",
                    }}
                  >
                    <span>{index + 1}*</span>
                    {props.selectNextIsActive && canBeSuggestedForNextCourse ? (
                      <input
                        type="checkbox"
                        checked={suggestedForNext}
                        className="item__input"
                        value={sSubject.availableCourses[index].id}
                        onChange={handleSuggestedForNextCheckboxChange(
                          sSubject.availableCourses[index].id
                        )}
                      />
                    ) : null}
                  </div>
                </Dropdown>
              </Td>
            );
          } else {
            courses.push(
              <Td
                key={sSubject.availableCourses[index].name}
                modifiers={modifiers}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 10px",
                  }}
                >
                  <span>{index + 1}*</span>
                </div>
              </Td>
            );
          }
        }
      } else {
        courses.push(
          <Td key={`empty-${index}`} modifiers={["centered", "empty"]}>
            -
          </Td>
        );
      }
    }

    return (
      <Tr key={sSubject.name} modifiers={["course"]}>
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
