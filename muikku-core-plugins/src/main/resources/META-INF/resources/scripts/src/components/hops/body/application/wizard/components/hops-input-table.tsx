import * as React from "react";
import { useTranslation } from "react-i18next";
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
 * createArrayOfNumberIntervals
 * @param scaleStart scaleStart
 * @param scaleInterval scaleInterval
 * @param scaleLength scaleLength
 * @returns array of numbers
 */
const createArrayOfNumberIntervals = (
  scaleStart: number,
  scaleInterval: number,
  scaleLength: number
) => {
  let interval = scaleStart;
  return Array(scaleLength)
    .fill(1)
    .map((v, i: number) => {
      if (i === 0) {
        return interval;
      }

      interval += scaleInterval;
      return interval;
    });
};

/**
 * QuestionGradeTableProps
 */
interface HopsInputTableProps {
  usePlace: "studies" | "guardian";
}

/**
 * HopsInputTable
 * @param props props
 * @returns React.JSX.Element. Language grade table component
 */
export const HopsInputTable: React.FC<HopsInputTableProps> = (props) => {
  const { children, usePlace } = props;

  const { t } = useTranslation(["hops_new"]);

  const uTableHeadModifiers = [];

  if (usePlace === "studies" || usePlace === "guardian") {
    uTableHeadModifiers.push("sticky");
  } else if (usePlace === "guider") {
    uTableHeadModifiers.push("sticky-inside-dialog");
  }

  return (
    <>
      <div className="hops-container__table-container-descriptions">
        <div className="hops-container__table-description-item">
          {t("labels.hopsFormSelfAssessmentLevel1", {
            ns: "hops_new",
            context: "description",
          })}
        </div>
        <div className="hops-container__table-description-item">
          {t("labels.hopsFormSelfAssessmentLevel2_description", {
            ns: "hops_new",
            context: "description",
          })}
        </div>
        <div className="hops-container__table-description-item">
          {t("labels.hopsFormSelfAssessmentLevel3_description", {
            ns: "hops_new",
            context: "description",
          })}
        </div>
        <div className="hops-container__table-description-item">
          {t("labels.hopsFormSelfAssessmentLevel4_description", {
            ns: "hops_new",
            context: "description",
          })}
        </div>
        <div className="hops-container__table-description-item">
          {t("labels.hopsFormSelfAssessmentLevel5_description", {
            ns: "hops_new",
            context: "description",
          })}
        </div>
      </div>
      <Table modifiers={["question-table"]}>
        <TableHead modifiers={uTableHeadModifiers}>
          <Tr>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsFormSelfAssessmentLevel1", {
                  ns: "hops_new",
                })}
              </span>
              <span className="hops-container__table-head-container hops-container__table-head-description--short">
                1
              </span>
            </Th>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsFormSelfAssessmentLevel2", {
                  ns: "hops_new",
                })}
              </span>
              <span className="hops-container__table-head-container hops-container__table-head-description--short">
                2
              </span>
            </Th>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsFormSelfAssessmentLevel3", {
                  ns: "hops_new",
                })}
              </span>
              <span className="hops-container__table-head-container hops-container__table-head-description--short">
                3
              </span>
            </Th>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsFormSelfAssessmentLevel4", {
                  ns: "hops_new",
                })}
              </span>
              <span className="hops-container__table-head-container hops-container__table-head-description--short">
                4
              </span>
            </Th>
            <Th modifiers={["centered"]}>
              <span className="hops-container__table-head-container hops-container__table-head-description--long">
                {t("labels.hopsFormSelfAssessmentLevel5", {
                  ns: "hops_new",
                })}
              </span>
              <span className="hops-container__table-head-container hops-container__table-head-description--short">
                5
              </span>
            </Th>
          </Tr>
        </TableHead>
        <Tbody>{children}</Tbody>
      </Table>
    </>
  );
};

/**
 * QuestionGradeRowProps
 */
interface InputRowProps {
  label: string;
  groupName: string;
  selectedValue?: number;
  disabled: boolean;
  scaleStart: number;
  scaleInterval: number;
  scaleLength: number;
  labelOnSeparateRow: boolean;
  required?: boolean;
  onInputGroupChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const defaultProps = {
  required: false,
};

/**
 * InputRow
 * @param props props
 * @returns React.JSX.Element
 */
export const InputRow: React.FC<InputRowProps> = (props) => {
  props = { ...defaultProps, ...props };

  const {
    label,
    selectedValue,
    groupName,
    scaleStart,
    scaleInterval,
    scaleLength,
    labelOnSeparateRow,
    onInputGroupChange,
    disabled,
    required,
  } = props;

  const labelClassName = required
    ? "table__alignment-helper table__alignment-helper--required"
    : "table__alignment-helper";

  return labelOnSeparateRow ? (
    <>
      <Tr modifiers={["question-table"]}>
        <Td
          modifiers={["centered", "question", "merged"]}
          colSpan={scaleLength}
        >
          <span className={labelClassName}>{label}</span>
        </Td>
      </Tr>
      <Tr modifiers={["question-table"]}>
        {createArrayOfNumberIntervals(
          scaleStart,
          scaleInterval,
          scaleLength
        ).map((v, i: number) => (
          <Td key={i} modifiers={["centered"]}>
            <span className="table__alignment-helper">
              <input
                name={groupName}
                checked={selectedValue ? selectedValue === v : false}
                value={v}
                disabled={disabled}
                onChange={onInputGroupChange}
                type="radio"
                className="hops__input hops__input--inside-table"
              ></input>
            </span>
          </Td>
        ))}
      </Tr>
    </>
  ) : (
    <Tr modifiers={["question-table"]}>
      <Td modifiers={["centered", "question"]}>
        <span className={labelClassName}>{label}</span>
      </Td>

      {createArrayOfNumberIntervals(scaleStart, scaleInterval, scaleLength).map(
        (v, i: number) => (
          <Td key={i} modifiers={["centered"]}>
            <span className="table__alignment-helper">
              <input
                name={groupName}
                checked={selectedValue ? selectedValue === v : false}
                value={v}
                onChange={onInputGroupChange}
                type="radio"
                disabled={disabled}
                className="hops__input hops__input--inside-table"
              ></input>
            </span>
          </Td>
        )
      )}
    </Tr>
  );
};

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
