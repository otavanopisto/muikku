import * as React from "react";
import { Opinion, OpinionType } from "~/@types/pedagogy-form";
import { TextField } from "../hops-compulsory-education-wizard/text-field";
import CKEditor from "../ckeditor";
import Button from "../button";
import CkeditorLoaderContent from "../../base/ckeditor-loader/content";
import * as moment from "moment";

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
            label="Merkitsijä"
            value={opinion.creatorName}
            disabled
          />
        </div>

        <div className="hops__form-element-container">
          <label htmlFor="createdDate" className="hops__label">
            Päivämäärä
          </label>
          <TextField
            id="CreatedDate"
            value={
              opinion.updatedDate
                ? `${moment(opinion.creationDate).format(
                    "DD.MM.YYYY"
                  )} (Päivitetty ${moment(opinion.updatedDate).format(
                    "DD.MM.YYYY"
                  )})`
                : moment(opinion.creationDate).format("DD.MM.YYYY")
            }
            className="hops__input"
            disabled
          />
        </div>
      </div>
      <div className="hops-container__row">
        {!disabled ? (
          <div className="hops__form-element-container">
            <CKEditor
              onChange={(v) => onOpinionChange(index, "opinion", v, type)}
            >
              {opinionText}
            </CKEditor>
          </div>
        ) : (
          <div className="hops__form-element-container">
            {opinionText === "" ? (
              <p>Lukion näkemystä ei ole vielä asetettu</p>
            ) : (
              <CkeditorLoaderContent html={opinionText} />
            )}
          </div>
        )}
      </div>
      <div
        className="hops-container__row hops-container__row--remove-row-action"
      >
        {!disabled && (
          <>
            <label id={`removePedagogyRowLabel-${type}${index}`} className="visually-hidden">
              Poista
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
export const AddNewOpinionBox: React.FC<AddNewActionsBoxProps> = (props) => (
  <div className="hops-container__row">
    <Button
      buttonModifiers={"add-pedagogy-row"}
      onClick={props.onClick}
      icon="plus"
      disabled={props.disabled}
    >
      Lisää uusi rivi
    </Button>
  </div>
);
