import * as React from "react";
import { Opinion, OpinionType } from "~/@types/pedagogy-form";
import { TextField } from "../hops-compulsory-education-wizard/text-field";
import CKEditor from "../ckeditor";
import Button from "../button";
import CkeditorLoaderContent from "../../base/ckeditor-loader/content";
import moment from "moment";
import { useTranslation } from "react-i18next";

/**
 * OpinionListProps
 */
interface OpinionListProps {}

/**
 * Creates opinion list
 *
 * @param props props
 * @returns JSX.Element
 */
export const OpinionList: React.FC<OpinionListProps> = (props) => (
  <div>{props.children}</div>
);

/**
 * OpinionItemProps
 */
interface OpinionItemProps {
  index: number;
  type: OpinionType;
  opinion: Opinion;
  disabled: boolean;
  onDeleteEntryClick?: (index: number, type: OpinionType) => void;
  onOpinionChange?: <T extends keyof Opinion>(
    index: number,
    key: T,
    value: Opinion[T],
    type: OpinionType
  ) => void;
}

/**
 * Creates opinion item
 *
 * @param props props
 * @returns JSX.Element
 */
export const OpinionItem: React.FC<OpinionItemProps> = (props) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
  const {
    index,
    opinion,
    disabled,
    onDeleteEntryClick,
    onOpinionChange,
    type,
  } = props;

  const opinionText = opinion.opinion || "";

  return (
    <div className="hops-container__section">
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <TextField
            id="opinionCreatorName"
            label={t("labels.creator", { ns: "pedagogySupportPlan" })}
            value={opinion.creatorName}
            disabled
          />
        </div>

        <div className="hops__form-element-container">
          <label htmlFor="createdDate" className="hops__label">
            {t("labels.date", { ns: "common" })}
          </label>
          <TextField
            id="CreatedDate"
            value={
              opinion.updatedDate
                ? `${moment(opinion.creationDate).format("DD.MM.YYYY")} (${t(
                    "labels.updated",
                    { ns: "common" }
                  )} ${moment(opinion.updatedDate).format("DD.MM.YYYY")})`
                : moment(opinion.creationDate).format("DD.MM.YYYY")
            }
            className="hops__input"
            disabled
          />
        </div>
      </div>
      <div className="hops-container__row">
        {!disabled ? (
          <div className="hops__form-element-container rich-text">
            <CKEditor
              onChange={(v) => onOpinionChange(index, "opinion", v, type)}
            >
              {opinionText}
            </CKEditor>
          </div>
        ) : (
          <div className="hops__form-element-container rich-text">
            {opinionText === "" ? (
              <p>
                {t("content.pointOfViewNotSet", { ns: "pedagogySupportPlan" })}
              </p>
            ) : (
              <CkeditorLoaderContent html={opinionText} />
            )}
          </div>
        )}
      </div>
      <div className="hops-container__row hops-container__row--remove-row-action">
        {!disabled && (
          <>
            <label
              id={`removePedagogyRowLabel-${type}${index}`}
              className="visually-hidden"
            >
              {t("actions.remove", { ns: "common" })}
            </label>
            <Button
              icon="trash"
              aria-labelledby={`removePedagogyRowLabel-${type}${index}`}
              buttonModifiers={"remove-pedagogy-row"}
              onClick={(e) => onDeleteEntryClick(index, type)}
            ></Button>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * AddNewActionsBoxProps
 */
interface AddNewActionsBoxProps {
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * AddNewActionsBox
 * @param props props
 * @returns JSX.Element
 */
export const AddNewOpinionBox: React.FC<AddNewActionsBoxProps> = (props) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);

  const { onClick, disabled } = props;

  return (
    <div className="hops-container__row">
      <Button
        buttonModifiers={"add-pedagogy-row"}
        onClick={onClick}
        icon="plus"
        disabled={disabled}
      >
        {t("actions.add", { ns: "pedagogySupportPlan", context: "row" })}
      </Button>
    </div>
  );
};
