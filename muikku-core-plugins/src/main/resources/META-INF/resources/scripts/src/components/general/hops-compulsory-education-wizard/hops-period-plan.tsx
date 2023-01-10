import * as React from "react";
import { HopsStudyPeriodPlan } from "~/@types/shared";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Tr,
  Th,
} from "~/components/general/table";
import { TextField } from "./text-field";
/**
 * HopsPlanningProps
 */
interface HopsPeriodPlanProps {
  disabled: boolean;
  studyPeriodPlan?: HopsStudyPeriodPlan;
  onStudyPeriodPlanChange: (studyPeriodPlan: HopsStudyPeriodPlan) => void;
}

/**
 * HopsPeriodPlan
 * @param props props
 */
const HopsPeriodPlan: React.FC<HopsPeriodPlanProps> = (props) => {
  const { onStudyPeriodPlanChange, studyPeriodPlan, disabled } = props;

  /**
   * handlePeriodPlanChange
   * @param name name
   */
  const handlePeriodPlanChange =
    (name: keyof HopsStudyPeriodPlan) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onStudyPeriodPlanChange({
        ...studyPeriodPlan,
        [name]: e.currentTarget.value,
      });
    };

  return (
    <Table modifiers={["period-plan"]}>
      <TableHead>
        <Tr>
          <Th modifiers={["month"]}>KK</Th>
          <Th modifiers={["planned-courses"]}>Suoritettavat kurssit</Th>
        </Tr>
      </TableHead>
      <Tbody>
        <Tr>
          <Td>1kk</Td>
          <Td>
            <TextField
              id="1kk"
              placeholder="ot1, bi1"
              value={studyPeriodPlan.month1}
              disabled={disabled}
              onChange={handlePeriodPlanChange("month1")}
            />
          </Td>
        </Tr>
        <Tr>
          <Td>2kk</Td>
          <Td>
            <TextField
              id="2kk"
              placeholder="ot1, bi1"
              value={studyPeriodPlan.month2}
              disabled={disabled}
              onChange={handlePeriodPlanChange("month2")}
            />
          </Td>
        </Tr>
        <Tr>
          <Td>3kk</Td>
          <Td>
            <TextField
              id="3kk"
              placeholder="ot1, bi1"
              value={studyPeriodPlan.month3}
              disabled={disabled}
              onChange={handlePeriodPlanChange("month3")}
            />
          </Td>
        </Tr>
        <Tr>
          <Td>4kk</Td>
          <Td>
            <TextField
              id="4kk"
              placeholder="ot1, bi1"
              value={studyPeriodPlan.month4}
              disabled={disabled}
              onChange={handlePeriodPlanChange("month4")}
            />
          </Td>
        </Tr>
        <Tr>
          <Td>5kk</Td>
          <Td>
            <TextField
              id="5kk"
              placeholder="ot1, bi1"
              value={studyPeriodPlan.month5}
              disabled={disabled}
              onChange={handlePeriodPlanChange("month5")}
            />
          </Td>
        </Tr>
        <Tr>
          <Td>6kk</Td>
          <Td>
            <TextField
              id="6kk"
              placeholder="ot1, bi1"
              value={studyPeriodPlan.month6}
              disabled={disabled}
              onChange={handlePeriodPlanChange("month6")}
            />
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default HopsPeriodPlan;
