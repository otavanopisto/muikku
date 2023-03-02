import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import DatePicker from "react-datepicker";
import { Textarea } from "../hops-compulsory-education-wizard/text-area";
import { IconButton } from "../button";
import { SupportAction, SupportActionImplementation } from "./types";
import { OptionDefault } from "../react-select/types";
import Select from "react-select";
import WorkspaceSelect from "./workspace-select";
import { PedagogyContext } from ".";

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
) => <div>{props.children}</div>;

/**
 * ImplementedActionsListItemProps
 */
interface ImplementedActionsListItemProps {
  index: number;
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
  const { useCase, editIsActive } = React.useContext(PedagogyContext);

  const supportActionsOptions: OptionDefault<SupportAction>[] = [
    {
      value: "remedialInstruction",
      label: "Tukiopetus",
    },
    {
      value: "specialEducation",
      label: "Erityisopetus",
    },
    {
      value: "extraTime",
      label: "Lisäaika",
    },
    {
      value: "scheduledStudies",
      label: "Aikataulutetut opintojaksot",
    },
    {
      value: "routedStudies",
      label: "Polutetut opinnot",
    },
    {
      value: "other",
      label: "Muu tuki?",
    },
  ];

  const ownerOfEntry = true;
  const disabledFields =
    useCase === "STUDENT" || !editIsActive || !ownerOfEntry;

  return (
    <div style={{ marginBottom: "10px", borderBottom: "1px solid #b4b4b4" }}>
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label htmlFor="graduationGoalMonth" className="hops__label">
            Päivämäärä
          </label>
          <DatePicker
            id="graduationGoalMonth"
            dateFormat="MM/yyyy"
            onChange={(e) => props.onActionChange(props.index, "date", e)}
            selected={new Date(props.implemenetedSupportAction.date)}
            className="hops__input"
            disabled={disabledFields}
          />
        </div>

        <div className="hops__form-element-container">
          <label htmlFor="graduationGoalMonth" className="hops__label">
            Tukitoimi:
          </label>
          <Select
            className="react-select-override"
            classNamePrefix="react-select-override"
            value={supportActionsOptions.find(
              (option) =>
                option.value === props.implemenetedSupportAction.action
            )}
            options={supportActionsOptions}
            onChange={(option) =>
              props.onActionChange(props.index, "action", option.value)
            }
            isSearchable={false}
            isDisabled={disabledFields}
          />
        </div>
        <div className="hops__form-element-container">
          <label htmlFor="graduationGoalMonth" className="hops__label">
            Kurssi:
          </label>
          <WorkspaceSelect
            onChange={(option) => {
              props.onActionChange(
                props.index,
                "course",
                option?.value || undefined
              );
            }}
            selectedValue={
              props.implemenetedSupportAction.course
                ? {
                    value: props.implemenetedSupportAction.course,
                    label: props.implemenetedSupportAction.course.name,
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
            id="studentStrengths"
            label="Lisätietoa?"
            className="hops__input"
            onChange={(e) =>
              props.onActionChange(
                props.index,
                "extraInfoDetails",
                e.target.value
              )
            }
            value={props.implemenetedSupportAction.extraInfoDetails}
            disabled={disabledFields}
          />
        </div>
      </div>

      <div
        className="hops-container__row"
        style={{ justifyContent: "flex-end" }}
      >
        {props.index > 0 && (
          <IconButton
            icon="trash"
            onClick={(e) => props.onDeleteActionClick(props.index)}
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
export const AddNewActionsBox: React.FC<AddNewActionsBoxProps> = (props) => (
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
