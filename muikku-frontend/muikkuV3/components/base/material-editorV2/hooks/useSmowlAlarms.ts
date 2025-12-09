/* eslint-disable camelcase */
import * as React from "react";
import {
  createActivityListJson,
  createAlarmsJson,
  createComputerMonitoringAlarmsJson,
  getSmowlApi,
} from "~/api_smowl/index";
import {
  ComputerMonitoringAlarmsConfig,
  ComputerMonitoringAllowedActions,
  ComputerMonitoringAllowedPrograms,
  FrontCameraAlarms,
  FrontCameraAlarmsConfig,
  isSmowlErrorResponse,
  SmowlErrorResponse,
} from "~/api_smowl/types";
import _ from "lodash";

const smowlApi = getSmowlApi({});

/**
 * Custom hook for smowl alarms
 */
interface UseSmowlAlarmsProps {
  activityId: string;
  activityType: "exam";
}

/**
 * Custom hook for smowl alarms
 * @param props - The properties for the hook
 */
export const useSmowlAlarms = (props: UseSmowlAlarmsProps) => {
  const { activityId, activityType } = props;
  const [frontCameraAlarms, setFrontCameraAlarms] = React.useState<{
    alarms: FrontCameraAlarmsConfig;
    loading: boolean;
    error: SmowlErrorResponse | null;
  }>({
    alarms: null,
    loading: false,
    error: null,
  });
  // State for pending front camera alarm changes (local edits before saving)
  const originalFrontCameraAlarms =
    React.useRef<FrontCameraAlarmsConfig | null>(null);

  const [computerMonitoringAlarms, setComputerMonitoringAlarms] =
    React.useState<{
      alarms: ComputerMonitoringAlarmsConfig;
      loading: boolean;
      error: SmowlErrorResponse | null;
    }>({
      alarms: null,
      loading: false,
      error: null,
    });

  // State for original computer monitoring alarm changes (local edits before saving)
  const originalComputerMonitoringAlarms =
    React.useRef<ComputerMonitoringAlarmsConfig | null>(null);

  /**
   * Loads the Front Camera Service alarms for the activity
   */
  const loadFrontCameraAlarms = React.useCallback(async () => {
    try {
      const response = await smowlApi.getFrontCameraAlarms({
        activityList_json: createActivityListJson([activityId], activityType),
      });
      const updatedAlarms = { ...response.ActivityList_alarms[0].alarms };
      // For some reason, the API returns created_at and updated_at fields that are not needed
      // and are not document in the API documentation. This only happens if alarms where previously updated.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (updatedAlarms as any).created_at;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (updatedAlarms as any).updated_at;
      originalFrontCameraAlarms.current = updatedAlarms;
      setFrontCameraAlarms((prev) => ({
        ...prev,
        alarms: updatedAlarms,
        loading: false,
        error: null,
      }));
    } catch (error) {
      if (!isSmowlErrorResponse(error)) {
        throw error;
      }
      setFrontCameraAlarms((prev) => ({
        ...prev,
        loading: false,
        error: error,
      }));
    }
  }, [activityId, activityType]);

  /**
   * Loads the Computer Monitoring Service alarms for the activity
   */
  const loadComputerMonitoringAlarms = React.useCallback(async () => {
    try {
      const response = await smowlApi.getComputerMonitoringAlarms({
        activityList_json: createActivityListJson([activityId], activityType),
      });
      originalComputerMonitoringAlarms.current =
        response.ActivityList_alarms[0].alarms;
      setComputerMonitoringAlarms((prev) => ({
        ...prev,
        alarms: response.ActivityList_alarms[0].alarms,
        loading: false,
        error: null,
      }));
    } catch (error) {
      if (!isSmowlErrorResponse(error)) {
        throw error;
      }
      setComputerMonitoringAlarms((prev) => ({
        ...prev,
        loading: false,
        error: error,
      }));
    }
  }, [activityId, activityType]);

  /**
   * Updates the Front Camera Service alarms for the activity
   */
  const updateFrontCameraAlarms = React.useCallback(async () => {
    if (!frontCameraAlarms.alarms) return;
    try {
      setFrontCameraAlarms((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));
      const response = await smowlApi.setFrontCameraAlarms({
        activityList_json: createActivityListJson([activityId], activityType),
        alarms_json: createAlarmsJson(frontCameraAlarms.alarms),
      });
      if (!response.set) {
        throw new Error("Failed to set front camera alarms");
      }
      originalFrontCameraAlarms.current = frontCameraAlarms.alarms;
      setFrontCameraAlarms((prev) => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      if (!isSmowlErrorResponse(error)) {
        throw error;
      }
    }
  }, [activityId, activityType, frontCameraAlarms.alarms]);

  /**
   * Updates the Computer Monitoring Service alarms for the activity
   */
  const updateComputerMonitoringAlarms = React.useCallback(async () => {
    if (!computerMonitoringAlarms.alarms) return;
    try {
      setComputerMonitoringAlarms((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));
      const response = await smowlApi.setComputerMonitoringAlarms({
        activityList_json: createActivityListJson([activityId], activityType),
        alarms_json: createComputerMonitoringAlarmsJson(
          computerMonitoringAlarms.alarms
        ),
      });
      if (!response.set) {
        throw new Error("Failed to set computer monitoring alarms");
      }
      originalComputerMonitoringAlarms.current =
        computerMonitoringAlarms.alarms;
      setComputerMonitoringAlarms((prev) => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      if (!isSmowlErrorResponse(error)) {
        throw error;
      }
    }
  }, [activityId, activityType, computerMonitoringAlarms.alarms]);

  /**
   * Toggles a front camera alarm between allowed and not allowed (local state only)
   * @param alarmKey - The key of the alarm to toggle
   */
  const toggleFrontCameraAlarm = React.useCallback(
    (alarmKey: FrontCameraAlarms) => {
      if (!frontCameraAlarms.alarms) return;

      setFrontCameraAlarms((prev) => {
        const currentAlarms = prev.alarms;
        const currentValue = currentAlarms[alarmKey];

        const isAllowed =
          currentValue !== 0 &&
          currentValue !== "0" &&
          currentValue !== null &&
          currentValue !== undefined;

        return {
          ...prev,
          alarms: {
            ...prev.alarms,
            [alarmKey]: isAllowed ? "0" : "1",
          },
        };
      });
    },
    [frontCameraAlarms.alarms]
  );

  /**
   * Checks if a front camera alarm is currently allowed (checks pending state if available)
   * @param alarmKey - The key of the alarm to check
   * @returns true if the alarm is allowed, false otherwise
   */
  const isFrontCameraAlarmAllowed = React.useCallback(
    (alarmKey: FrontCameraAlarms): boolean => {
      const alarmsToCheck = frontCameraAlarms.alarms;
      if (!alarmsToCheck) return false;

      const value = alarmsToCheck[alarmKey];
      return (
        value !== 0 && value !== "0" && value !== null && value !== undefined
      );
    },
    [frontCameraAlarms.alarms]
  );

  // Checks if the front camera alarms have changed
  const frontCameraAlarmsChanged = React.useMemo(
    () =>
      !_.isEqual(frontCameraAlarms.alarms, originalFrontCameraAlarms.current),
    [frontCameraAlarms]
  );

  /**
   * Saves the pending front camera alarm changes to the API
   */
  const saveFrontCameraAlarms = React.useCallback(async () => {
    if (!frontCameraAlarms.alarms || !frontCameraAlarmsChanged) return;

    await updateFrontCameraAlarms();
  }, [
    frontCameraAlarms.alarms,
    frontCameraAlarmsChanged,
    updateFrontCameraAlarms,
  ]);

  /**
   * Cancels pending front camera alarm changes and resets to saved values
   */
  const cancelFrontCameraAlarms = React.useCallback(() => {
    setFrontCameraAlarms((prev) => ({
      ...prev,
      alarms: originalFrontCameraAlarms.current,
    }));
  }, []);

  /**
   * Toggles a computer monitoring alarm between allowed and not allowed (local state only)
   * @param subKey - The key of the sub-alarm to toggle
   * @param alarmKey - The key of the alarm to toggle
   */
  const toggleComputerMonitoringAlarm = React.useCallback(
    (
      subKey: keyof ComputerMonitoringAlarmsConfig,
      alarmKey:
        | ComputerMonitoringAllowedActions
        | ComputerMonitoringAllowedPrograms
    ) => {
      if (!computerMonitoringAlarms.alarms) return;

      setComputerMonitoringAlarms((prev) => {
        if (!prev.alarms) return prev;

        const currentSubCategory = prev.alarms[subKey];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentValue = (currentSubCategory as any)[alarmKey];

        return {
          ...prev,
          alarms: {
            ...prev.alarms,
            [subKey]: {
              ...currentSubCategory,
              [alarmKey]: !currentValue, // Toggle the boolean value
            },
          },
        };
      });
    },
    [computerMonitoringAlarms.alarms]
  );

  /**
   * Checks if a computer monitoring alarm is currently allowed
   * @param subKey - The key of the sub-category ('allowed_actions' or 'allowed_programs')
   * @param alarmKey - The key of the alarm to check within the sub-category
   * @returns true if the alarm is allowed, false otherwise
   */
  const isComputerMonitoringAlarmAllowed = React.useCallback(
    (
      subKey: keyof ComputerMonitoringAlarmsConfig,
      alarmKey:
        | ComputerMonitoringAllowedActions
        | ComputerMonitoringAllowedPrograms
    ): boolean => {
      if (!computerMonitoringAlarms.alarms) return false;

      const subCategory = computerMonitoringAlarms.alarms[subKey];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (subCategory as any)[alarmKey] === true;
    },
    [computerMonitoringAlarms.alarms]
  );

  // Checks if the computer monitoring alarms have changed
  const computerMonitoringAlarmsChanged = React.useMemo(
    () =>
      !_.isEqual(
        computerMonitoringAlarms.alarms,
        originalComputerMonitoringAlarms.current
      ),
    [computerMonitoringAlarms]
  );

  /**
   * Saves the pending computer monitoring alarm changes to the API
   */
  const saveComputerMonitoringAlarms = React.useCallback(async () => {
    if (!computerMonitoringAlarms.alarms || !computerMonitoringAlarmsChanged)
      return;
    await updateComputerMonitoringAlarms();
  }, [
    computerMonitoringAlarms.alarms,
    computerMonitoringAlarmsChanged,
    updateComputerMonitoringAlarms,
  ]);

  /**
   * Cancels pending computer monitoring alarm changes and resets to saved values
   */
  const cancelComputerMonitoringAlarms = React.useCallback(() => {
    setComputerMonitoringAlarms((prev) => ({
      ...prev,
      alarms: originalComputerMonitoringAlarms.current,
    }));
  }, []);

  // Loads the Front Camera Service and Computer Monitoring Service alarms for the activity
  // Happens when the activity ID changes
  React.useEffect(() => {
    loadFrontCameraAlarms();
    loadComputerMonitoringAlarms();
  }, [loadComputerMonitoringAlarms, loadFrontCameraAlarms]);

  return {
    // Front Camera Service alarms
    frontCameraAlarms,
    frontCameraAlarmsChanged,
    isFrontCameraAlarmAllowed,
    toggleFrontCameraAlarm,
    saveFrontCameraAlarms,
    cancelFrontCameraAlarms,

    // Computer Monitoring Service alarms
    computerMonitoringAlarms,
    computerMonitoringAlarmsChanged,
    isComputerMonitoringAlarmAllowed,
    toggleComputerMonitoringAlarm,
    saveComputerMonitoringAlarms,
    cancelComputerMonitoringAlarms,
  };
};
