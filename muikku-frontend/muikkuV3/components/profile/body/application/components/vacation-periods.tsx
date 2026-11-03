import * as React from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "~/sass/elements/datepicker/datepicker.scss";
import { localize } from "~/locales/i18n";
import Button, { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import {
  parseVacationPeriods,
  VacationPeriod,
} from "~/helper-functions/vacation-periods";

/**
 * VacationPeriodsProps
 */
interface VacationPeriodsProps {
  periods: VacationPeriod[];
  onDateChange: (
    index: number,
    field: "start" | "end",
    newDate: Date | null
  ) => void;
  onAddPeriod: () => void;
  onRemovePeriod: (index: number) => void;
}

/**
 * Parses profile properties into editable rows. Always keeps at least one row.
 *
 * @param startValue startValue
 * @param endValue endValue
 * @returns period rows
 */
export const vacationPeriodsFromProperties = (
  startValue?: string,
  endValue?: string
): VacationPeriod[] => {
  const parsed = parseVacationPeriods(startValue, endValue);
  return parsed.length > 0 ? parsed : [{ start: null, end: null }];
};

/**
 * VacationPeriodItemProps
 */
interface VacationPeriodItemProps {
  index: number;
  period: VacationPeriod;
  canRemove: boolean;
  onDateChange: VacationPeriodsProps["onDateChange"];
  onRemovePeriod: VacationPeriodsProps["onRemovePeriod"];
}

/**
 * Single editable vacation period row.
 *
 * @param props props
 * @returns JSX.Element
 */
const VacationPeriodItem: React.FC<VacationPeriodItemProps> = (props) => {
  const { index, period, canRemove, onDateChange, onRemovePeriod } = props;
  const { t } = useTranslation();

  return (
    <div className="application-sub-panel__multiple-items">
      <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--vacation-start form-element">
        <label
          htmlFor={`profileVacationStart-${index}`}
          className="application-sub-panel__item-title"
        >
          {t("labels.beginDate", { ns: "profile" })}
        </label>
        <div className="application-sub-panel__item-data">
          <DatePicker
            id={`profileVacationStart-${index}`}
            className="form-element__input"
            onChange={(newDate) => onDateChange(index, "start", newDate)}
            maxDate={period.end || undefined}
            locale={outputCorrectDatePickerLocale(localize.language)}
            selected={period.start}
            dateFormat="P"
          />
        </div>
      </div>
      <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--vacation-end form-element">
        <label
          htmlFor={`profileVacationEnd-${index}`}
          className="application-sub-panel__item-title"
        >
          {t("labels.endDate", { ns: "profile" })}
        </label>
        <div className="application-sub-panel__item-data">
          <DatePicker
            id={`profileVacationEnd-${index}`}
            className="form-element__input"
            onChange={(newDate) => onDateChange(index, "end", newDate)}
            minDate={period.start || undefined}
            locale={outputCorrectDatePickerLocale(localize.language)}
            selected={period.end}
            dateFormat="P"
          />
        </div>
      </div>
      <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--vacation-actions">
        <Dropdown
          openByHover
          content={t("actions.remove", {
            ns: "profile",
            context: "vacationPeriod",
          })}
        >
          <IconButton
            icon="trash"
            buttonModifiers="delete-vacation-period"
            onClick={() => onRemovePeriod(index)}
            disabled={!canRemove}
          />
        </Dropdown>
      </div>
    </div>
  );
};

/**
 * Vacation period list with add/remove controls.
 *
 * @param props props
 * @returns JSX.Element
 */
const VacationPeriods: React.FC<VacationPeriodsProps> = (props) => {
  const { periods, onDateChange, onAddPeriod, onRemovePeriod } = props;
  const { t } = useTranslation();

  return (
    <>
      {periods.map((period, index) => (
        <VacationPeriodItem
          key={index}
          index={index}
          period={period}
          canRemove={periods.length > 1}
          onDateChange={onDateChange}
          onRemovePeriod={onRemovePeriod}
        />
      ))}
      <div className="application-sub-panel__multiple-items">
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--vacation-submit">
          <Button icon="plus" onClick={onAddPeriod}>
            {" "}
            {t("actions.add", {
              ns: "profile",
              context: "vacationPeriod",
            })}{" "}
          </Button>
        </div>
      </div>
    </>
  );
};

export default VacationPeriods;
