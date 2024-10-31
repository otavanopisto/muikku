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
import { HopsUsePlace } from "~/@types/hops";
import { useTranslation } from "react-i18next";

/**
 * LanguageGradeTableProps
 */
interface HopsLanguageGradeTableProps {
  usePlace: HopsUsePlace;
}

/**
 * LanguageGradeTable
 * @param props props
 * @returns JSX.Element. Language grade table component
 */
export const HopsLanguageGradeTable: React.FC<HopsLanguageGradeTableProps> = (
  props
) => {
  const { children, usePlace } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  const uTableHeadModifiers = ["language-table"];

  if (usePlace === "studies" || usePlace === "guardian") {
    uTableHeadModifiers.push("sticky");
  } else if (usePlace === "guider") {
    uTableHeadModifiers.push("sticky-inside-dialog");
  }

  return (
    <>
      <div className="hops-container__table-container-descriptions">
        <div className="hops-container__table-description-item">
          {t("labels.hopsCompulsoryLanguageTableSkillLevel1", {
            ns: "hops_new",
            context: "description",
          })}
        </div>
        <div className="hops-container__table-description-item">
          {t("labels.hopsCompulsoryLanguageTableSkillLevel2", {
            ns: "hops_new",
            context: "description",
          })}
        </div>
        <div className="hops-container__table-description-item">3 = Hyvä</div>
        <div className="hops-container__table-description-item">
          {t("labels.hopsCompulsoryLanguageTableSkillLevel4", {
            ns: "hops_new",
            context: "description",
          })}
        </div>
        <div className="hops-container__table-description-item">
          {t("labels.hopsCompulsoryLanguageTableSkillLevel5", {
            ns: "hops_new",
            context: "description",
          })}
        </div>
      </div>
      <Table modifiers={["language-table"]}>
        <TableHead modifiers={uTableHeadModifiers}>
          <Tr modifiers={["language-table"]}>
            <Th modifiers={["centered", "language"]}>Kieli</Th>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsCompulsoryLanguageTableSkillLevel1", {
                  ns: "hops_new",
                })}
              </span>
              <span className="hops-container__table-head-container hops-container__table-head-description--short">
                1
              </span>
            </Th>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsCompulsoryLanguageTableSkillLevel2", {
                  ns: "hops_new",
                })}
              </span>
              <span className="hops-container__table-head-container hops-container__table-head-description--short">
                2
              </span>
            </Th>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsCompulsoryLanguageTableSkillLevel3", {
                  ns: "hops_new",
                })}
              </span>
              <span className="hops-container__table-head-container hops-container__table-head-description--short">
                3
              </span>
            </Th>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsCompulsoryLanguageTableSkillLevel4", {
                  ns: "hops_new",
                })}
              </span>
              <span className="hops-container__table-head-container hops-container__table-head-description--short">
                4
              </span>
            </Th>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsCompulsoryLanguageTableSkillLevel5", {
                  ns: "hops_new",
                })}
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
};

/**
 * LanguageGradeRowProps
 */
interface LanguageGradeRowProps {
  index: number;
  disabled: boolean;
  lng: LanguageGrade;
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
  const { t } = useTranslation(["hops_new", "common"]);

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
          <span className="table__alignment-helper table__alignment-helper--required">
            {lng.name}
          </span>
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
            checked={
              lng.grade
                ? lng.grade === LanguageGradeEnum.NATIVE_LANGUAGE
                : false
            }
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
            checked={
              lng.grade ? lng.grade === LanguageGradeEnum.EXCELLENT : false
            }
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
            checked={lng.grade ? lng.grade === LanguageGradeEnum.GOOD : false}
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
            checked={
              lng.grade ? lng.grade === LanguageGradeEnum.SATISFYING : false
            }
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
            checked={
              lng.grade ? lng.grade === LanguageGradeEnum.NOT_STUDIED : false
            }
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
            <label
              id={`removeLanguageRowLabel${index}`}
              className="visually-hidden"
            >
              {t("actions.remove")}
            </label>
            <Button
              aria-labelledby={`removeLanguageRowLabel${index}`}
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
