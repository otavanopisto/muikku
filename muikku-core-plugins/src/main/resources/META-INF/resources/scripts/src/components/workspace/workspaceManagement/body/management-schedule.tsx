import * as React from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";

/**
 * WorkspaceSignupGroups
 */
interface ManagementScheduleProps {
  workspaceSignupStartDate: Date | null;
  workspaceSignupEndDate: Date | null;
  onSignupStartDateChange?: (date: Date) => void;
  onSignupEndDateChange?: (date: Date) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementSchedule = (props: ManagementScheduleProps) => {
  const {
    workspaceSignupStartDate,
    workspaceSignupEndDate,
    onSignupStartDateChange,
    onSignupEndDateChange,
  } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * Handles signup start date change
   * @param date date
   */
  const handleSignupStartDateChange = (date: Date) => {
    if (onSignupStartDateChange) {
      props.onSignupStartDateChange(date);
    }
  };

  /**
   * Handles signup end date change
   * @param date date
   */
  const handleSignupEndDateChange = (date: Date) => {
    if (onSignupEndDateChange) {
      props.onSignupEndDateChange(date);
    }
  };

  return (
    <>
      <h2 className="application-sub-panel__header">
        {t("labels.signUpSchedule", { ns: "workspace" })}
      </h2>
      <div className="application-sub-panel__body">
        <div className="form__row form__row--split">
          <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-start-date">
            <label
              htmlFor="workspaceSignupStartDate"
              className="application-sub-panel__item-header"
            >
              {t("labels.signUpBeginDate", { ns: "workspace" })}
            </label>
            <DatePicker
              id="workspaceSignupStartDate"
              className="form-element__input"
              onChange={handleSignupStartDateChange}
              minDate={new Date()}
              maxDate={
                workspaceSignupEndDate !== null
                  ? workspaceSignupEndDate
                  : undefined
              }
              locale={outputCorrectDatePickerLocale(localize.language)}
              selected={workspaceSignupStartDate}
              dateFormat="P"
            />
          </div>
          <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-start-date">
            <label
              htmlFor="workspaceSignupEndDate"
              className="application-sub-panel__item-header"
            >
              {t("labels.signUpEndDate", { ns: "workspace" })}
            </label>
            <DatePicker
              id="workspaceSignupEndDate"
              className="form-element__input"
              onChange={handleSignupEndDateChange}
              minDate={
                workspaceSignupStartDate !== null
                  ? workspaceSignupStartDate
                  : new Date()
              }
              locale={outputCorrectDatePickerLocale(localize.language)}
              selected={workspaceSignupEndDate}
              dateFormat="P"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const ManagementScheduleMemoized = React.memo(ManagementSchedule);
