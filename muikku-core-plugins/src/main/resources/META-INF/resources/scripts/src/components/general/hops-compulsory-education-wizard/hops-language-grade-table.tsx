import * as React from "react";
import Button from "~/components/general/button";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Th,
  Tr,
} from "~/components/general/table";
import { LanguageGrade, LanguageGradeEnum } from "~/@types/shared";

import "~/sass/elements/wcag.scss";

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
  <>
    <div className="hops-container__table-container-descriptions">
      <div className="hops-container__table-description-item">
        1 = Äidinkieli
      </div>
      <div className="hops-container__table-description-item">
        2 = Erinomainen / Kiitettävä
      </div>
      <div className="hops-container__table-description-item">3 = Hyvä</div>
      <div className="hops-container__table-description-item">
        4 = Tyydyttävä / Alkeet
      </div>
      <div className="hops-container__table-description-item">
        5 = En ole opiskellut
      </div>
    </div>
    <Table modifiers={["language-table"]}>
      <TableHead modifiers={["language-table"]}>
        <Tr modifiers={["language-table"]}>
          <Th modifiers={["centered", "language"]}>Kieli</Th>
          <Th modifiers={["centered"]}>
            <span className="hops-container__table-head-container hops-container__table-head-description--long">
              Äidinkieli
            </span>
            <span className="hops-container__table-head-container hops-container__table-head-description--short">
              1
            </span>
          </Th>
          <Th modifiers={["centered"]}>
            <span className="hops-container__table-head-container hops-container__table-head-description--long">
              Erinomainen / Kiitettävä
            </span>
            <span className="hops-container__table-head-container hops-container__table-head-description--short">
              2
            </span>
          </Th>
          <Th modifiers={["centered"]}>
            <span className="hops-container__table-head-container hops-container__table-head-description--long">
              Hyvä
            </span>
            <span className="hops-container__table-head-container hops-container__table-head-description--short">
              3
            </span>
          </Th>
          <Th modifiers={["centered"]}>
            <span className="hops-container__table-head-container hops-container__table-head-description--long">
              Tyydyttävä / Alkeet
            </span>
            <span className="hops-container__table-head-container hops-container__table-head-description--short">
              4
            </span>
          </Th>
          <Th modifiers={["centered"]}>
            <span className="hops-container__table-head-container hops-container__table-head-description--long">
              En ole opiskellut
            </span>
            <span className="hops-container__table-head-container hops-container__table-head-description--short">
              5
            </span>
          </Th>
          <Th></Th>
        </Tr>
      </TableHead>
      <Tbody>{children}</Tbody>
    </Table>
  </>
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
    <Tr modifiers={["language-table"]}>
      <Td modifiers={["centered", "language"]}>
        {lng.hardCoded ? (
          <>{lng.name}</>
        ) : (
          <span className="table__alignment-helper">
            <input
              type="text"
              value={lng.name}
              onChange={handleOtherLngChange}
              placeholder="Kieli"
              className="hops__input hops__input--inside-table"
              disabled={disabled}
              style={{ textAlign: "center" }}
            ></input>
          </span>
        )}
      </Td>
      <Td modifiers={["centered"]}>
        <span className="table__alignment-helper">
          <input
            type="radio"
            checked={lng.grade === LanguageGradeEnum.NATIVE_LANGUAGE}
            onChange={handleRadioInputChange(LanguageGradeEnum.NATIVE_LANGUAGE)}
            className="hops__input hops__input--inside-table"
            disabled={disabled}
          ></input>
        </span>
      </Td>
      <Td modifiers={["centered"]}>
        <span className="table__alignment-helper">
          <input
            type="radio"
            checked={lng.grade === LanguageGradeEnum.EXCELLENT}
            onChange={handleRadioInputChange(LanguageGradeEnum.EXCELLENT)}
            className="hops__input hops__input--inside-table"
            disabled={disabled}
          ></input>
        </span>
      </Td>
      <Td modifiers={["centered"]}>
        <span className="table__alignment-helper">
          <input
            type="radio"
            checked={lng.grade === LanguageGradeEnum.GOOD}
            onChange={handleRadioInputChange(LanguageGradeEnum.GOOD)}
            className="hops__input hops__input--inside-table"
            disabled={disabled}
          ></input>
        </span>
      </Td>
      <Td modifiers={["centered"]}>
        <span className="table__alignment-helper">
          <input
            type="radio"
            checked={lng.grade === LanguageGradeEnum.SATISFYING}
            onChange={handleRadioInputChange(LanguageGradeEnum.SATISFYING)}
            className="hops__input hops__input--inside-table"
            disabled={disabled}
          ></input>
        </span>
      </Td>
      <Td modifiers={["centered"]}>
        <span className="table__alignment-helper">
          <input
            type="radio"
            checked={lng.grade === LanguageGradeEnum.NOT_STUDIED}
            onChange={handleRadioInputChange(LanguageGradeEnum.NOT_STUDIED)}
            className="hops__input hops__input--inside-table"
            disabled={disabled}
          ></input>
        </span>
      </Td>
      <Td modifiers={["centered"]}>
        {lng.hardCoded ? (
          <span className="table__alignment-helper">-</span>
        ) : (
          <span className="table__alignment-helper">
            <label id="removeLanguageRowLabel" className="visually-hidden">
              Poista
            </label>
            <Button
              aria-labelledby="removeLanguageRowLabel"
              buttonModifiers={["remove-hops-row"]}
              icon="trash"
              onClick={(e) => onDeleteRowClick(index)}
              disabled={disabled}
            />
          </span>
        )}
      </Td>
    </Tr>
  );
};
