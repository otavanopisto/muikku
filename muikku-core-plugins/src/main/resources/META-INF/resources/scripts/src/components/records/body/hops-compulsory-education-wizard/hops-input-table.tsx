import * as React from "react";
import {
  Table,
  TableHead,
  TableRowProps,
  Tbody,
  Td,
  Th,
  Tr,
} from "~/components/general/table";

import "~/sass/elements/wcag.scss";

/**
 * LanguageGradeTableProps
 */
interface HopsInputTableProps {}

/**
 * HopsInputTable
 * @param param0 param0
 * @param param0.children children
 * @returns JSX.Element. Language grade table component
 */
export const HopsInputTable: React.FC<HopsInputTableProps> = ({ children }) => (
  <Table modifiers={["language-table"]}>
    <TableHead modifiers={["language-table"]}>
      <Tr modifiers={["language-table"]}>
        <Th modifiers={["centered", "language"]}>Kysymys</Th>
        <Th modifiers={["centered"]}>1</Th>
        <Th modifiers={["centered"]}>2</Th>
        <Th modifiers={["centered"]}>3</Th>
        <Th modifiers={["centered"]}>4</Th>
        <Th modifiers={["centered"]}>5</Th>
      </Tr>
    </TableHead>
    <Tbody>{children}</Tbody>
  </Table>
);

/**
 * LanguageGradeRowProps
 */
interface InputRowProps {
  label: string;
  groupName: string;
  selectedValue: number;
  disabled: boolean;
  onInputGroupChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * InputRow
 * @param param0 param0
 * @param param0.label label
 * @param param0.selectedValue selectedValue
 * @param param0.groupName groupName
 * @param param0.onInputGroupChange onInputGroupChange
 * @returns JSX.Element
 */
export const InputRow: React.FC<InputRowProps> = ({
  label,
  selectedValue,
  groupName,
  onInputGroupChange,
}) => (
  <Tr modifiers={["language-table"]}>
    <Td modifiers={["centered", "language"]}>
      <span className="table__alignment-helper">{label}</span>
    </Td>
    <Td modifiers={["centered"]}>
      <span className="table__alignment-helper">
        <input
          name={groupName}
          checked={selectedValue === 1}
          value={1}
          onChange={onInputGroupChange}
          type="radio"
          className="hops__input hops__input--inside-table"
        ></input>
      </span>
    </Td>
    <Td modifiers={["centered"]}>
      <span className="table__alignment-helper">
        <input
          name={groupName}
          checked={selectedValue === 2}
          value={2}
          onChange={onInputGroupChange}
          type="radio"
          className="hops__input hops__input--inside-table"
        ></input>
      </span>
    </Td>
    <Td modifiers={["centered"]}>
      <span className="table__alignment-helper">
        <input
          name={groupName}
          checked={selectedValue === 3}
          value={3}
          onChange={onInputGroupChange}
          type="radio"
          className="hops__input hops__input--inside-table"
        ></input>
      </span>
    </Td>
    <Td modifiers={["centered"]}>
      <span className="table__alignment-helper">
        <input
          name={groupName}
          checked={selectedValue === 4}
          value={4}
          onChange={onInputGroupChange}
          type="radio"
          className="hops__input hops__input--inside-table"
        ></input>
      </span>
    </Td>
    <Td modifiers={["centered"]}>
      <span className="table__alignment-helper">
        <input
          name={groupName}
          checked={selectedValue === 5}
          value={5}
          onChange={onInputGroupChange}
          type="radio"
          className="hops__input hops__input--inside-table"
        ></input>
      </span>
    </Td>
  </Tr>
);

/**
 * EmptyRowProps
 */
interface EmptyRowProps extends TableRowProps {
  colSpan?: number;
}

/**
 * EmptyRow
 * @param param0 param0
 * @param param0.colSpan param0.colSpan
 */
export const EmptyRow: React.FC<EmptyRowProps> = ({
  colSpan = 0,
  ...rowProps
}) => (
  <Tr {...rowProps}>
    <Td colSpan={colSpan}></Td>
  </Tr>
);
