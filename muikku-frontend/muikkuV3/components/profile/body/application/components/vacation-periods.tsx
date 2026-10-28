import * as React from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "~/sass/elements/datepicker/datepicker.scss";
import { localize } from "~/locales/i18n";
import { ButtonPill } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import {
  MAX_VACATION_PERIODS,
  parseVacationPeriods,
  VacationPeriod,
} from "~/helper-functions/vacation-periods";

/**
 * VacationPeriodRow
 */
export interface VacationPeriodRow extends VacationPeriod {
  id: number;
}

/**
 * VacationPeriodsProps
 */
interface VacationPeriodsProps {
  periods: VacationPeriodRow[];
  onDateChange: (
    periodId: number,
    field: "start" | "end",
    newDate: Date | null
  ) => void;
  onAddPeriod: () => void;
  onRemovePeriod: (periodId: number) => void;
}

let nextPeriodId = 1;

/**
 * Creates a period row with a stable local id.
 *
 * @param period period
 * @returns period row
 */
export const createVacationPeriodRow = (
  period: VacationPeriod = { start: null, end: null }
): VacationPeriodRow => ({
  id: nextPeriodId++,
  start: period.start,
  end: period.end,
});

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
): VacationPeriodRow[] => {
  const parsed = parseVacationPeriods(startValue, endValue);

  if (parsed.length === 0) {
    return [createVacationPeriodRow()];
  }

  return parsed.map((period) => createVacationPeriodRow(period));
};

/**
 * VacationPeriodItemProps
 */
interface VacationPeriodItemProps {
  period: VacationPeriodRow;
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
  const { period, canRemove, onDateChange, onRemovePeriod } = props;
  const { t } = useTranslation();

  return (
    <div className="application-sub-panel__multiple-items">
      <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--vacation-start form-element">
        <label
          htmlFor={`profileVacationStart-${period.id}`}
          className="application-sub-panel__item-title"
        >
          {t("labels.beginDate", { ns: "profile" })}
        </label>
        <div className="application-sub-panel__item-data">
          <DatePicker
            id={`profileVacationStart-${period.id}`}
            className="form-element__input form-element__input--vacation-period"
            onChange={onDateChange.bind(null, period.id, "start")}
            maxDate={period.end || undefined}
            locale={outputCorrectDatePickerLocale(localize.language)}
            selected={period.start}
            dateFormat="P"
            isClearable
          />
        </div>
      </div>
      <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--vacation-end form-element">
        <label
          htmlFor={`profileVacationEnd-${period.id}`}
          className="application-sub-panel__item-title"
        >
          {t("labels.endDate", { ns: "profile" })}
        </label>
        <div className="application-sub-panel__item-data">
          <DatePicker
            id={`profileVacationEnd-${period.id}`}
            className="form-element__input form-element__input--vacation-period"
            onChange={onDateChange.bind(null, period.id, "end")}
            minDate={period.start || undefined}
            locale={outputCorrectDatePickerLocale(localize.language)}
            selected={period.end}
            dateFormat="P"
            isClearable
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
          <ButtonPill
            icon="trash"
            buttonModifiers="delete-vacation-period"
            onClick={onRemovePeriod.bind(null, period.id)}
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
      {periods.map((period) => (
        <VacationPeriodItem
          key={period.id}
          period={period}
          canRemove={periods.length > 1}
          onDateChange={onDateChange}
          onRemovePeriod={onRemovePeriod}
        />
      ))}
      <div className="application-sub-panel__multiple-items">
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--vacation-submit">
          <Dropdown
            openByHover
            content={t("actions.add", {
              ns: "profile",
              context: "vacationPeriod",
            })}
          >
            <ButtonPill
              icon="plus"
              buttonModifiers="add-vacation-period"
              onClick={onAddPeriod}
              disabled={periods.length >= MAX_VACATION_PERIODS}
            />
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default VacationPeriods;
