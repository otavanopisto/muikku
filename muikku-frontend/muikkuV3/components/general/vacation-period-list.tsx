import * as React from "react";
import { localize } from "~/locales/i18n";
import { getRelevantVacationPeriodsFromProperties } from "~/helper-functions/vacation-periods";

/**
 * VacationPeriodListProps
 */
interface VacationPeriodListProps {
  startValue?: string | null;
  endValue?: string | null;
  label: string;
}

/**
 * Renders current and upcoming vacation periods from comma-separated
 * profile properties. Past-only periods are omitted.
 *
 * @param props props
 * @returns JSX.Element
 */
const VacationPeriodList: React.FC<VacationPeriodListProps> = (props) => {
  const { startValue, endValue, label } = props;
  const periods = getRelevantVacationPeriodsFromProperties(
    startValue,
    endValue
  );

  return (
    <>
      {periods.map((period) => (
        <div
          className="item-list__user-vacation-period"
          key={period.start.toISOString()}
        >
          {label}
          &nbsp;
          {localize.date(period.start)}
          {period.end ? "–" + localize.date(period.end) : null}
        </div>
      ))}
    </>
  );
};

export default VacationPeriodList;
