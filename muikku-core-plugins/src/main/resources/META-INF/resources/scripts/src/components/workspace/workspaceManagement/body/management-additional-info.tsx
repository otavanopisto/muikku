import * as React from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { WorkspaceType } from "~/generated/client";

/**
 * WorkspaceSignupGroups
 */
interface ManagementAdditionalInfoProps {
  workspaceNameExtension?: string;
  workspaceType?: string;
  workspaceTypes?: WorkspaceType[];
  workspaceStartDate: Date | null;
  workspaceEndDate: Date | null;

  onWorkspaceNameExtensionChange?: (workspaceNameExtension: string) => void;
  onWorkspaceTypeChange?: (workspaceType: WorkspaceType) => void;
  onWorkspaceStartDateChange?: (date: Date) => void;
  onWorkspaceEndDateChange?: (date: Date) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementAdditionalInfo = (props: ManagementAdditionalInfoProps) => {
  const {
    workspaceNameExtension,
    workspaceType,
    workspaceTypes,
    workspaceStartDate,
    workspaceEndDate,
    onWorkspaceNameExtensionChange,
    onWorkspaceTypeChange,
    onWorkspaceStartDateChange,
    onWorkspaceEndDateChange,
  } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * Handles signup start date change
   * @param e e
   */
  const handleUpdateWorkspaceNameExtension = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (onWorkspaceNameExtensionChange) {
      onWorkspaceNameExtensionChange(e.target.value);
    }
  };

  /**
   * Handle workspace type change
   * @param e e
   */
  const handleWorkspaceTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (onWorkspaceTypeChange) {
      const selectedType = workspaceTypes?.find(
        (type) => type.identifier === e.target.value
      );
      onWorkspaceTypeChange(selectedType);
    }
  };

  /**
   * Handle start date change
   * @param date date
   */
  const handleWorkspaceStartDate = (date: Date) => {
    if (onWorkspaceStartDateChange) {
      onWorkspaceStartDateChange(date);
    }
  };

  /**
   * Handles end date change
   * @param date date
   */
  const handleWorkspaceEndDate = (date: Date) => {
    if (onWorkspaceEndDateChange) {
      onWorkspaceEndDateChange(date);
    }
  };

  return (
    <>
      <h2 className="application-sub-panel__header">
        {t("labels.additionalInfo", { ns: "workspace" })}
      </h2>
      <div className="application-sub-panel__body">
        <div className="form__row form__row--workspace-management">
          <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-name-extension">
            <label htmlFor="workspaceNameExtension">
              {t("labels.nameExtension", { ns: "workspace" })}
            </label>
            <input
              id="workspaceNameExtension"
              name="workspace-name-extension"
              type="text"
              className="form-element__input form-element__input--workspace-name-extension"
              value={workspaceNameExtension || ""}
              onChange={handleUpdateWorkspaceNameExtension}
            />
          </div>
          <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-type">
            <label htmlFor="workspaceType">{t("labels.type")}</label>
            <select
              id="workspaceType"
              name="workspace-type"
              className="form-element__select"
              value={workspaceType || ""}
              onChange={handleWorkspaceTypeChange}
            >
              {workspaceTypes &&
                workspaceTypes.map((type) => (
                  <option key={type.identifier} value={type.identifier}>
                    {type.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-start-date">
            <label
              htmlFor="workspaceStartDate"
              className="application-sub-panel__item-header"
            >
              {t("labels.begingDate", { ns: "workspace" })}
            </label>
            <DatePicker
              id="workspaceStartDate"
              className="form-element__input"
              onChange={handleWorkspaceStartDate}
              maxDate={workspaceEndDate}
              locale={outputCorrectDatePickerLocale(localize.language)}
              selected={workspaceStartDate}
              dateFormat="P"
            />
          </div>
          <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-end-date">
            <label
              htmlFor="workspaceEndDate"
              className="application-sub-panel__item-header"
            >
              {t("labels.endDate", { ns: "workspace" })}
            </label>
            <DatePicker
              id="workspaceEndDate"
              className="form-element__input"
              onChange={handleWorkspaceEndDate}
              minDate={workspaceStartDate}
              locale={outputCorrectDatePickerLocale(localize.language)}
              selected={workspaceEndDate}
              dateFormat="P"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const ManagementAdditionalInfoMemoized = React.memo(
  ManagementAdditionalInfo
);
