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
import { ExamInfo } from "./helper";
import { useTranslation } from "react-i18next";

/**
 * Exam details props
 */
interface ExamDetailsProps {
  examInfoList: ExamInfo[];
  omitColumns?: ("grade" | "points")[];
  sectionTitle?: string;
}

/**
 * Exam details component
 * @param props ExamDetailsProps
 * @returns JSX.Element
 */
const ExamDetails: React.FC<ExamDetailsProps> = (props) => {
  const { examInfoList, omitColumns = [], sectionTitle } = props;

  const { t } = useTranslation(["workspace"]);

  return (
    <div className="form__row">
      <details className="details details--evaluation">
        <summary className="details__summary">
          {sectionTitle || "Kokeiden pisteet ja arvosanat"}
        </summary>
        <div className="details__content">
          <ScrollableTableWrapper>
            <Table modifiers={["assignment-points"]}>
              <TableHead modifiers={["sticky"]}>
                <Tr>
                  <Th modifiers={["left"]}>Koe</Th>
                  {!omitColumns.includes("grade") && (
                    <Th>{t("labels.grade", { ns: "workspace" })}</Th>
                  )}
                  {!omitColumns.includes("points") && (
                    <Th>{t("labels.points", { ns: "workspace" })}</Th>
                  )}
                </Tr>
              </TableHead>
              <Tbody>
                {examInfoList.map((exam, index) => {
                  let pointsToShow = "–";
                  let gradeToShow = "–";

                  if (exam.points !== null) {
                    pointsToShow = localize.number(exam.points);
                  }

                  if (exam.grade !== null) {
                    gradeToShow = exam.grade;
                  }

                  return (
                    <Tr key={index}>
                      <Td>{exam.title}</Td>
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
        </div>
      </details>
    </div>
  );
};

export default ExamDetails;
