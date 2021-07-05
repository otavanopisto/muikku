import * as React from "react";
import Button, { ButtonPill } from "~/components/general/button";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Th,
  Tr,
} from "~/components/general/table";
import { LanguageGrade } from "../../../../../../@types/shared";

/**
 * LanguageGradeTableProps
 */
interface LanguageGradeTableProps {}

export const LanguageGradeTable: React.FC<LanguageGradeTableProps> = ({
  children,
}) => {
  return (
    <Table>
      <TableHead>
        <Tr>
          <Th style={{ maxWidth: "80px" }}>Kieli</Th>
          <Th modifiers={["centered"]}>1</Th>
          <Th modifiers={["centered"]}>2</Th>
          <Th modifiers={["centered"]}>3</Th>
          <Th modifiers={["centered"]}>4</Th>
          <Th modifiers={["centered"]}>5</Th>
          <Th style={{ maxWidth: "50px" }} modifiers={["centered"]}>
            Toimin.
          </Th>
        </Tr>
      </TableHead>
      <Tbody>{children}</Tbody>
    </Table>
  );
};

/**
 * LanguageGradeRowProps
 */
interface LanguageGradeRowProps {
  index: number;
  lng?: LanguageGrade;
  onDeleteRowClick?: (index: number) => void;
  onLanguageRowChange?: (updatedLng: LanguageGrade, index: number) => void;
}

export const LanguageGradeRow: React.FC<LanguageGradeRowProps> = ({
  index,
  lng,
  onDeleteRowClick,
  onLanguageRowChange,
}) => {
  /**
   * handleOtherLngChange
   * @param e
   */
  const handleOtherLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updatedLng = { ...lng, name: e.currentTarget.value };

    onLanguageRowChange(updatedLng, index);
  };

  /**
   * handleRadioInputChange
   * @param number
   */
  const handleRadioInputChange =
    (number: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let updatedLng = { ...lng, grade: number };

      onLanguageRowChange(updatedLng, index);
    };

  return (
    <Tr>
      <Td style={{ maxWidth: "80px" }}>
        {lng.hardCoded ? (
          <label className="hops-label">{lng.name}</label>
        ) : (
          <input
            type="text"
            value={lng.name}
            onChange={handleOtherLngChange}
            placeholder="Kieli"
            className="hops-input"
          ></input>
        )}
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 1}
          onChange={handleRadioInputChange(1)}
          className="hops-input"
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 2}
          onChange={handleRadioInputChange(2)}
          className="hops-input"
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 3}
          onChange={handleRadioInputChange(3)}
          className="hops-input"
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 4}
          onChange={handleRadioInputChange(4)}
          className="hops-input"
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade == 5}
          onChange={handleRadioInputChange(5)}
          className="hops-input"
        ></input>
      </Td>
      <Td modifiers={["centered"]} style={{ maxWidth: "50px" }}>
        {lng.hardCoded ? (
          "-"
        ) : (
          <ButtonPill icon="trash" onClick={(e) => onDeleteRowClick(index)} />
        )}
      </Td>
    </Tr>
  );
};
