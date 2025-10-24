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
import { useTranslation } from "react-i18next";

/**
 * Assignment details props
 */
interface AssignmentDetailsProps {
  assignmentInfoList: AssignmentInfo[];
  omitColumns?: ("grade" | "points")[];
  sectionTitle?: string;
}

/**
 * Assignment details component
 * @param props AssignmentDetailsProps
 * @returns JSX.Element
 */
const AssignmentDetails: React.FC<AssignmentDetailsProps> = (props) => {
  const { assignmentInfoList, omitColumns = [], sectionTitle } = props;

  const { t } = useTranslation(["workspace"]);

  // Check if any of the assignments have point value
  // If so, we need to calculate summary
  const calculateSummary = assignmentInfoList.some(
    (assignment) => assignment.points !== null
  );

  const calculateMaxSummary = assignmentInfoList.some(
    (assignment) => assignment.maxPoints !== null
  );

  // Calculate sum of points
  const pointsSum = calculateSummary
    ? assignmentInfoList.reduce(
        (sum, assignment) => sum + (assignment.points || 0),
        0
      )
    : undefined;

  const pointsMaxSum = calculateMaxSummary
    ? assignmentInfoList.reduce(
        (sum, assignment) => sum + (assignment.maxPoints || 0),
        0
      )
    : undefined;

  let pointsString = "–";

  if (pointsMaxSum) {
    // If pointsSum is not available, use 0 as default and show only max points (0/MaxPoints)
    pointsString = `${localize.number(pointsSum || 0, {
      maximumFractionDigits: 2,
    })}/${localize.number(pointsMaxSum)}`;

    // If pointsSum is available, show both points and max points
    if (pointsSum) {
      pointsString = `${localize.number(pointsSum, {
        maximumFractionDigits: 2,
      })}/${localize.number(pointsMaxSum)}`;
    }
  }

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
      <details className="details details--evaluation">
        <summary className="details__summary">
          {sectionTitle ||
            t("labels.assignmentDetailsTitle", { ns: "workspace" })}
        </summary>
        <div className="details__content">
          <ScrollableTableWrapper>
            <Table modifiers={["assignment-points"]}>
              <TableHead modifiers={["sticky"]}>
                <Tr>
                  <Th modifiers={["left"]}>
                    {t("labels.assignmentTitle", { ns: "workspace" })}
                  </Th>
                  {!omitColumns.includes("grade") && (
                    <Th>{t("labels.grade", { ns: "workspace" })}</Th>
                  )}

                  {!omitColumns.includes("points") && (
                    <Th>{t("labels.points", { ns: "workspace" })}</Th>
                  )}
                </Tr>
              </TableHead>
              <Tbody>
                {assignmentInfoList.map((assignment, index) => {
                  let pointsToShow = "–";
                  let gradeToShow = "–";

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
                      <Td>{assignment.title}</Td>
                      {!omitColumns.includes("grade") && (
                        <Td modifiers={["centered"]}>{gradeToShow}</Td>
                      )}
                      {!omitColumns.includes("points") && (
                        <Td modifiers={["centered"]}>{pointsToShow}</Td>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </ScrollableTableWrapper>

          <Table modifiers={["assignment-points"]}>
            <TableHead>
              <Tr>
                <Th></Th>
                {!omitColumns.includes("grade") && (
                  <Th>{t("labels.gradesAverage", { ns: "workspace" })}</Th>
                )}
                {!omitColumns.includes("points") && (
                  <Th>{t("labels.pointsSummary", { ns: "workspace" })}</Th>
                )}
              </Tr>
            </TableHead>
            <Tbody>
              <Tr>
                <Td modifiers={["centered"]}></Td>
                {!omitColumns.includes("grade") && (
                  <Td modifiers={["centered"]}>
                    {isNaN(gradesAverage)
                      ? "—"
                      : localize.number(gradesAverage, {
                          maximumFractionDigits: 2,
                        })}
                  </Td>
                )}

                {!omitColumns.includes("points") && (
                  <Td modifiers={["centered"]}>{pointsString}</Td>
                )}
              </Tr>
            </Tbody>
          </Table>
        </div>
      </details>
    </div>
  );
};

export default AssignmentDetails;
