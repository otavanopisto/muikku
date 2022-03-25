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
import { LanguageGrade, LanguageGradeEnum } from "../../../../@types/shared";

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
        <Th modifiers={["centered"]}>Äidinkieli</Th>
        <Th modifiers={["centered"]}>Erinomainen / Kiitettävä</Th>
        <Th modifiers={["centered"]}>Hyvä</Th>
        <Th modifiers={["centered"]}>Tyydyttävä / Alkeet</Th>
        <Th modifiers={["centered"]}>En ole opiskellut</Th>
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
   * @param v value which is clicked
   */
  const handleRadioInputChange =
    (v: LanguageGradeEnum) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedLng = { ...lng, grade: v };

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
          checked={lng.grade === LanguageGradeEnum.NATIVE_LANGUAGE}
          onChange={handleRadioInputChange(LanguageGradeEnum.NATIVE_LANGUAGE)}
          className="hops-input"
          disabled={disabled}
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade === LanguageGradeEnum.EXCELLENT}
          onChange={handleRadioInputChange(LanguageGradeEnum.EXCELLENT)}
          className="hops-input"
          disabled={disabled}
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade === LanguageGradeEnum.GOOD}
          onChange={handleRadioInputChange(LanguageGradeEnum.GOOD)}
          className="hops-input"
          disabled={disabled}
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade === LanguageGradeEnum.SATISFYING}
          onChange={handleRadioInputChange(LanguageGradeEnum.SATISFYING)}
          className="hops-input"
          disabled={disabled}
        ></input>
      </Td>
      <Td>
        <input
          type="radio"
          checked={lng.grade === LanguageGradeEnum.NOT_STUDIED}
          onChange={handleRadioInputChange(LanguageGradeEnum.NOT_STUDIED)}
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
