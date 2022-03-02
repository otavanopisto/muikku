import * as React from "react";
import { ButtonPill } from "~/components/general/button";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Th,
  Tr,
} from "~/components/general/table";
import { LanguageGrade } from "../../../../@types/shared";

/**
 * LanguageGradeTableProps
 */
interface HopsLanguageGradeTableProps {}

/**
 * LanguageGradeTable
 * @param param0 param0
 * @param param0.children children
 * @returns JSX.Element. Language grade table component
 */
export const HopsLanguageGradeTable: React.FC<HopsLanguageGradeTableProps> = ({
  children,
}) => (
  <Table modifiers={["language-table"]}>
    <TableHead modifiers={["language-table"]}>
      <Tr modifiers={["language-table"]}>
        <Th style={{ maxWidth: "80px", textAlign: "center" }}>Kieli</Th>
        <Th modifiers={["centered"]}>1</Th>
        <Th modifiers={["centered"]}>2</Th>
        <Th modifiers={["centered"]}>3</Th>
        <Th modifiers={["centered"]}>4</Th>
        <Th modifiers={["centered"]}>5</Th>
        <Th style={{ maxWidth: "50px", textAlign: "center" }}>Toimin.</Th>
      </Tr>
    </TableHead>
    <Tbody>{children}</Tbody>
  </Table>
);

/**
 * LanguageGradeRowProps
 */
interface LanguageGradeRowProps {
  index: number;
  disabled: boolean;
  lng?: LanguageGrade;
  onDeleteRowClick?: (index: number) => void;
  onLanguageRowChange?: (updatedLng: LanguageGrade, index: number) => void;
}

/**
 * LanguageGradeRow
 * @param param0 param0
 * @param param0.index index
 * @param param0.lng lng
 * @param param0.onDeleteRowClick onDeleteRowClick
 * @param param0.onLanguageRowChange onLanguageRowChange
 * @param param0.disabled disabled
 * @returns JSX.Element. Language grade table row
 */
export const LanguageGradeRow: React.FC<LanguageGradeRowProps> = ({
  index,
  lng,
  onDeleteRowClick,
  onLanguageRowChange,
  disabled,
}) => {
  /**
   * Handles language name changes
   *
   * @param e e
   */
  const handleOtherLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLng = { ...lng, name: e.currentTarget.value };

    onLanguageRowChange(updatedLng, index);
  };

  /**
   * Handles radio input changes
   *
   * @param number value which is clicked
   */
  const handleRadioInputChange =
    (number: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedLng = { ...lng, grade: number };

      onLanguageRowChange(updatedLng, index);
    };

  return (
    <Tr>
      <Td style={{ maxWidth: "80px", textAlign: "center" }}>
        {lng.hardCoded ? (
          <label className="hops-label">{lng.name}</label>
        ) : (
          <input
            type="text"
            value={lng.name}
            onChange={handleOtherLngChange}
            placeholder="Kieli"
            className="hops-input"
            disabled={disabled}
            style={{ textAlign: "center" }}
          ></input>
        )}
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 1}
          onChange={handleRadioInputChange(1)}
          className="hops-input"
          disabled={disabled}
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 2}
          onChange={handleRadioInputChange(2)}
          className="hops-input"
          disabled={disabled}
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 3}
          onChange={handleRadioInputChange(3)}
          className="hops-input"
          disabled={disabled}
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 4}
          onChange={handleRadioInputChange(4)}
          className="hops-input"
          disabled={disabled}
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 5}
          onChange={handleRadioInputChange(5)}
          className="hops-input"
          disabled={disabled}
        ></input>
      </Td>
      <Td
        modifiers={["centered"]}
        style={{ maxWidth: "50px", textAlign: "center" }}
      >
        {lng.hardCoded ? (
          "-"
        ) : (
          <ButtonPill
            icon="trash"
            onClick={(e) => onDeleteRowClick(index)}
            disabled={disabled}
          />
        )}
      </Td>
    </Tr>
  );
};
