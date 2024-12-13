import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

/**
 * RecordsInfo
 */
interface RecordsInfo {
  /**
   * Users data school identifier "PYRAMUS-STUDENT-XX" or "PYRAMUS-STAFF-XX"
   */
  identifier: string;
  /**
   * Users entity id
   */
  userEntityId: number;
  /**
   * Display notification trigger
   */
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * WizardProviderProps
 */
interface RecordsInfoProviderProps {
  children: React.ReactNode;
  value: RecordsInfo;
}

export const RecordsInfoContext = React.createContext<RecordsInfo | undefined>(
  undefined
);

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 * @param props props
 */
function RecordsInfoProvider(props: RecordsInfoProviderProps) {
  const { children, value } = props;

  return (
    <RecordsInfoContext.Provider value={value}>
      {children}
    </RecordsInfoContext.Provider>
  );
}

/**
 * Method to returns context of records info
 * Check if context is defined and if not, throw an error
 */
function useRecordsInfoContext() {
  const context = React.useContext(RecordsInfoContext);
  if (context === undefined) {
    throw new Error(
      "useRecordsInfoContext must be used within a RecordsInfoProvider"
    );
  }
  return context;
}

export { useRecordsInfoContext, RecordsInfoProvider };
