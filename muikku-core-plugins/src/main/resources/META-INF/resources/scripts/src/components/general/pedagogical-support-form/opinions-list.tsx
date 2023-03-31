import * as React from "react";
import { Opinion, OpinionType } from "~/@types/pedagogy-form";
import { TextField } from "../hops-compulsory-education-wizard/text-field";
import CKEditor from "../ckeditor";
import { IconButton } from "../button";
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
    <div style={{ marginBottom: "10px", borderBottom: "1px solid #b4b4b4" }}>
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <TextField
            id="creatorName"
            label="Merkitsijä"
            value={opinion.creatorName}
            disabled
          />
        </div>

        <div className="hops__form-element-container">
          <label htmlFor="graduationGoalMonth" className="hops__label">
            Päivämäärä
          </label>
          <TextField
            id="graduationGoalMonth"
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
        className="hops-container__row"
        style={{ justifyContent: "flex-end" }}
      >
        {!disabled && (
          <IconButton
            icon="trash"
            onClick={(e) => onDeleteEntryClick(index, type)}
          />
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
  <div
    style={{
      height: "33px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #000",
      borderStyle: "dashed",
      margin: "5px",
    }}
  >
    <IconButton onClick={props.onClick} icon="plus" disabled={props.disabled} />
  </div>
);
