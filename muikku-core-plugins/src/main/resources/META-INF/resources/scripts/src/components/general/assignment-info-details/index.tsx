import * as React from "react";
import { localize } from "~/locales/i18n";
import {
  Table,
  TableHead,
  Th,
  Tbody,
  Td,
  ScrollableTableWrapper,
  Tr,
} from "~/components/general/table";
import { AssignmentInfo } from "./helper";

/**
 * Assignment details props
 */
interface AssignmentDetailsProps {
  assignmentInfoList: AssignmentInfo[];
}

/**
 * Assignment details component
 * @param props AssignmentDetailsProps
 * @returns JSX.Element
 */
const AssignmentDetails: React.FC<AssignmentDetailsProps> = (props) => {
  const { assignmentInfoList } = props;

  // Check if any of the assignments have point value
  // If so, we need to calculate summary
  const calculateSummary = assignmentInfoList.some(
    (assignment) => assignment.points !== null
  );

  // Calculate sum of points
  const pointsSum = calculateSummary
    ? assignmentInfoList.reduce(
        (sum, assignment) => sum + (assignment.points || 0),
        0
      )
    : undefined;

  // Calculate average of grades
  const gradesAverage =
    assignmentInfoList.reduce((sum, assignment) => {
      const grade = parseFloat(assignment.grade);
      return isNaN(grade) ? sum : sum + grade;
    }, 0) /
    assignmentInfoList.filter(
      (assignment) => !isNaN(parseFloat(assignment.grade))
    ).length;

  return (
    <div className="form__row">
      <details className="details">
        <summary className="details__summary">
          Arvioitavien tehtävien pisteet ja arvosanat
        </summary>
        <div className="details__content">
          <ScrollableTableWrapper>
            <Table>
              <TableHead modifiers={["sticky"]}>
                <Tr>
                  <Th>Tehtävän nimi</Th>
                  <Th>Pisteet</Th>
                  <Th>Arvosana</Th>
                </Tr>
              </TableHead>
              <Tbody>
                {assignmentInfoList.map((assignment, index) => {
                  let pointsToShow = "-";
                  let gradeToShow = "-";

                  if (assignment.points !== null) {
                    pointsToShow = localize.number(assignment.points);
                  }

                  if (assignment.maxPoints !== null) {
                    pointsToShow = `${localize.number(
                      assignment.points || 0
                    )}/${localize.number(assignment.maxPoints)}`;
                  }

                  if (assignment.grade !== null) {
                    gradeToShow = assignment.grade;
                  }

                  return (
                    <Tr key={index}>
                      <Td modifiers={["centered"]}>{assignment.title}</Td>
                      <Td modifiers={["centered"]}>{pointsToShow}</Td>
                      <Td modifiers={["centered"]}>{gradeToShow}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </ScrollableTableWrapper>

          <Table>
            <TableHead>
              <Tr>
                <Th></Th>
                <Th>Yhteensä</Th>
                <Th>Keskiarvo</Th>
              </Tr>
            </TableHead>
            <Tbody>
              <Tr>
                <Td modifiers={["centered"]}></Td>
                <Td modifiers={["centered"]}>
                  {pointsSum
                    ? localize.number(pointsSum, {
                        maximumFractionDigits: 2,
                      })
                    : "-"}
                </Td>
                <Td modifiers={["centered"]}>
                  {isNaN(gradesAverage)
                    ? "-"
                    : localize.number(gradesAverage, {
                        maximumFractionDigits: 2,
                      })}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </div>
      </details>
    </div>
  );
};

export default AssignmentDetails;
