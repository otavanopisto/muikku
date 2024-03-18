import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import DatePicker from "react-datepicker";
import { Textarea } from "../hops-compulsory-education-wizard/text-area";
import Button from "../button";
import Select from "react-select";
import WorkspaceSelect from "./workspace-select";
import { SupportActionImplementation } from "~/@types/pedagogy-form";
import { supportActionsOptions } from "./helpers";
import { TextField } from "../hops-compulsory-education-wizard/text-field";
import { usePedagogyContext } from "./context/pedagogy-context";
import { useTranslation } from "react-i18next";

/**
 * ImplementedActionsListProps
 */
interface ImplementedActionsListProps {}

/**
 * ImplementedActionsList
 * @param props props
 * @returns JSX.Element
 */
export const ImplementedActionsList: React.FC<ImplementedActionsListProps> = (
  props
) => <>{props.children}</>;

/**
 * ImplementedActionsListItemProps
 */
interface ImplementedActionsListItemProps {
  index: number;
  ownerOfEntry: boolean;
  implemenetedSupportAction: SupportActionImplementation;
  onDeleteActionClick?: (index: number) => void;
  onActionChange?: <T extends keyof SupportActionImplementation>(
    index: number,
    key: T,
    value: SupportActionImplementation[T]
  ) => void;
}

/**
 * ImplementedActionsListItem
 * @param props props
 * @returns JSX.Element
 */
export const ImplementedActionsListItem: React.FC<
  ImplementedActionsListItemProps
> = (props) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
  const { userRole, editIsActive, studentId } = usePedagogyContext();

  const {
    index,
    ownerOfEntry,
    implemenetedSupportAction,
    onDeleteActionClick,
    onActionChange,
  } = props;

  const disabledFields =
    userRole === "STUDENT" || !editIsActive || !ownerOfEntry;

  return (
    <div className="hops-container__section">
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <TextField
            id="implemenetedSupportActionCreatorName"
            label={t("labels.creator", { ns: "pedagogySupportPlan" })}
            value={implemenetedSupportAction.creatorName}
            disabled
          />
        </div>

        <div className="hops__form-element-container">
          <label
            htmlFor="implemenetedSupportActionDate"
            className="hops__label"
          >
            {t("labels.date", { ns: "common" })}
          </label>
          <DatePicker
            id="implemenetedSupportActionDate"
            dateFormat="dd.MM.yyyy"
            onChange={(e) => onActionChange(index, "date", e)}
            selected={new Date(implemenetedSupportAction.date)}
            maxDate={new Date()}
            className="hops__input"
            disabled={disabledFields}
          />
        </div>

        <div className="hops__form-element-container">
          <label
            htmlFor="implemenetedSupportActionAction"
            className="hops__label"
          >
            {t("labels.supportAction", { ns: "pedagogySupportPlan" })}
          </label>
          <Select
            id="implemenetedSupportActionAction"
            className="react-select-override react-select-override--hops"
            classNamePrefix="react-select-override"
            value={supportActionsOptions.find(
              (option) => option.value === implemenetedSupportAction.action
            )}
            options={supportActionsOptions}
            onChange={(option) => onActionChange(index, "action", option.value)}
            isSearchable={false}
            isDisabled={disabledFields}
          />
        </div>
        <div className="hops__form-element-container">
          <label
            htmlFor="implemenetedSupportActionCourse"
            className="hops__label"
          >
            {t("labels.course", { ns: "common" })}
          </label>
          <WorkspaceSelect
            id="implemenetedSupportActionCourse"
            studentIdentifier={studentId}
            onChange={(option) => {
              onActionChange(index, "course", option?.value || undefined);
            }}
            selectedValue={
              implemenetedSupportAction.course
                ? {
                    value: implemenetedSupportAction.course,
                    label: implemenetedSupportAction.course.nameExtension
                      ? `${implemenetedSupportAction.course.name} (${implemenetedSupportAction.course.nameExtension})`
                      : implemenetedSupportAction.course.name,
                  }
                : undefined
            }
            disabled={disabledFields}
          />
        </div>
      </div>
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <Textarea
            id="implemenetedSupportActionStudentStrengths"
            label={t("labels.additionalInfo", { ns: "pedagogySupportPlan" })}
            className="hops__textarea"
            onChange={(e) =>
              onActionChange(index, "extraInfoDetails", e.target.value)
            }
            value={implemenetedSupportAction.extraInfoDetails}
            disabled={disabledFields}
          />
        </div>
      </div>

      <div className="hops-container__row hops-container__row--remove-row-action">
        {ownerOfEntry && editIsActive && (
          <>
            <label
              id={`removePedagogyRowLabel${index}`}
              className="visually-hidden"
            >
              {t("actions.remove", { ns: "common" })}
            </label>
            <Button
              icon="trash"
              aria-labelledby={`removePedagogyRowLabel${index}`}
              buttonModifiers={"remove-pedagogy-row"}
              onClick={(e) => onDeleteActionClick(index)}
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
export const AddNewActionsBox: React.FC<AddNewActionsBoxProps> = (props) => {
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
