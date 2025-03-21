import React, { createContext, useContext, useMemo } from "react";
import { PlannedPeriod } from "~/reducers/hops";
import { getCurrentActivePeriodDateRange } from "../helper";

/**
 * Active period context type
 */
interface ActivePeriodContextType {
  activePeriodStartDate: Date;
}

const ActivePeriodContext = createContext<ActivePeriodContextType | null>(null);

/**
 * Active period provider
 * @param props props
 * @returns active period provider
 */
export const ActivePeriodProvider: React.FC<{
  calculatedPeriods: PlannedPeriod[];
  children: React.ReactNode;
}> = (props) => {
  const { calculatedPeriods, children } = props;

  const activePeriodStartDate = useMemo(
    () => getCurrentActivePeriodDateRange(calculatedPeriods),
    [calculatedPeriods]
  );

  return (
    <ActivePeriodContext.Provider value={{ activePeriodStartDate }}>
      {children}
    </ActivePeriodContext.Provider>
  );
};

/**
 * Use active period
 * @returns use active period
 */
export const useActivePeriod = () => {
  const context = useContext(ActivePeriodContext);
  if (!context) {
    throw new Error(
      "useActivePeriod must be used within an ActivePeriodProvider"
    );
  }
  return context;
};
