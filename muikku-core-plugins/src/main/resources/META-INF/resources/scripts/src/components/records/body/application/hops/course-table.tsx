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

interface CourseTableProps {
  selectedSubjects: SchoolSubject[];
  ethicsSelected: boolean;
  finnishAsSecondLanguage: boolean;
  onChange: (schoolSubjects: SchoolSubject[]) => void;
}

/**
 * CourseTable
 * @returns
 */
const CourseTable: React.FC<CourseTableProps> = (props) => {
  /**
   * handleTableDataChange
   */
  const handleToggleCourseClick =
    (subjectIndex: number, subjectCourseIndex: number) =>
    (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
      const selectedSubjects = [...props.selectedSubjects];

      if (
        selectedSubjects[subjectIndex].availableCourses[subjectCourseIndex] !==
        undefined
      ) {
        switch (
          selectedSubjects[subjectIndex].availableCourses[subjectCourseIndex]
            .status
        ) {
          case CourseStatus.NOSTATUS:
            selectedSubjects[subjectIndex].availableCourses[
              subjectCourseIndex
            ] = {
              ...selectedSubjects[subjectIndex].availableCourses[
                subjectCourseIndex
              ],
              status: CourseStatus.APPROVAL,
            };
            break;
          case CourseStatus.APPROVAL:
            selectedSubjects[subjectIndex].availableCourses[
              subjectCourseIndex
            ] = {
              ...selectedSubjects[subjectIndex].availableCourses[
                subjectCourseIndex
              ],
              status: CourseStatus.INPROGRESS,
            };
            break;

          case CourseStatus.INPROGRESS:
            selectedSubjects[subjectIndex].availableCourses[
              subjectCourseIndex
            ] = {
              ...selectedSubjects[subjectIndex].availableCourses[
                subjectCourseIndex
              ],
              status: CourseStatus.COMPLETED,
            };
            break;

          case CourseStatus.COMPLETED:
            selectedSubjects[subjectIndex].availableCourses[
              subjectCourseIndex
            ] = {
              ...selectedSubjects[subjectIndex].availableCourses[
                subjectCourseIndex
              ],
              status: CourseStatus.NOSTATUS,
            };
            break;
        }
      }

      props.onChange(selectedSubjects);
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
  const renderRows = props.selectedSubjects.map((sSubject, i) => {
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

        /**
         * Checks courses status and pushes data cell indicator
         */
        switch (sSubject.availableCourses[index].status) {
          case CourseStatus.APPROVAL:
            modifiers.push("APPROVAL");
            break;

          case CourseStatus.INPROGRESS:
            modifiers.push("INPROGRESS");
            break;

          case CourseStatus.COMPLETED:
            modifiers.push("COMPLETED");
            break;

          case CourseStatus.NOSTATUS:
            modifiers.push("NOSTATUS");
            break;
        }

        /**
         * Checks whether course is mandatory or not
         * and sets indicator to indicate that
         */
        if (sSubject.availableCourses[index].mandatory) {
          courses.push(
            <Td
              key={sSubject.availableCourses[index].name}
              onClick={handleToggleCourseClick(i, index)}
              modifiers={modifiers}
            >
              {index + 1}
            </Td>
          );
        } else {
          courses.push(
            <Td
              key={sSubject.availableCourses[index].name}
              onClick={handleToggleCourseClick(i, index)}
              modifiers={modifiers}
            >
              {index + 1}*
            </Td>
          );
        }
      } else {
        courses.push(
          <Td key={`empty-${index}`} modifiers={["centered"]}>
            -
          </Td>
        );
      }
    }

    return (
      <Tr key={sSubject.name} modifiers={["course"]}>
        <Td>{sSubject.name}</Td>
        {courses}
      </Tr>
    );
  });

  return (
    <Table>
      <TableHead>{renderTableHeaderRow}</TableHead>
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
