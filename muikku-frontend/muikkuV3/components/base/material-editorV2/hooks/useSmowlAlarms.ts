import * as React from "react";
import {
  createActivityListJson,
  createAlarmsJson,
  createComputerMonitoringAlarmsJson,
  getSmowlApi,
} from "~/api_smowl/index";
import {
  ActivityConfig,
  ComputerMonitoringAlarms,
  FrontCameraAlarms,
  isSmowlErrorResponse,
  SmowlErrorResponse,
} from "~/api_smowl/types";

const smowlApi = getSmowlApi({
  baseUrl: "https://results-api.smowltech.net/index.php/v2",
});

/**
 * Custom hook for smowl alarms
 */
interface UseSmowlAlarmsProps {
  activityConfig: ActivityConfig | null;
  activityType: "exam";
}

/**
 * Custom hook for smowl alarms
 * @param props - The properties for the hook
 */
export const useSmowlAlarms = (props: UseSmowlAlarmsProps) => {
  const { activityConfig, activityType } = props;
  const [frontCameraAlarms, setFrontCameraAlarms] = React.useState<{
    alarms: FrontCameraAlarms;
    loading: boolean;
    error: SmowlErrorResponse | null;
  }>({
    alarms: null,
    loading: false,
    error: null,
  });
  const [computerMonitoringAlarms, setComputerMonitoringAlarms] =
    React.useState<{
      alarms: ComputerMonitoringAlarms;
      loading: boolean;
      error: SmowlErrorResponse | null;
    }>({
      alarms: null,
      loading: false,
      error: null,
    });

  /**
   * Loads the Front Camera Service alarms for the activity
   */
  const loadFrontCameraAlarms = React.useCallback(async () => {
    if (!activityConfig) {
      return;
    }
    try {
      const response = await smowlApi.getFrontCameraAlarms({
        // eslint-disable-next-line camelcase
        activityList_json: createActivityListJson(
          [activityConfig.activityId],
          activityType
        ),
      });
      setFrontCameraAlarms((prev) => ({
        ...prev,
        alarms: response.ActivityList_alarms[0].alarms,
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
  }, [activityConfig, activityType]);

  /**
   * Loads the Computer Monitoring Service alarms for the activity
   */
  const loadComputerMonitoringAlarms = React.useCallback(async () => {
    if (!activityConfig) {
      return;
    }
    try {
      const response = await smowlApi.getComputerMonitoringAlarms({
        // eslint-disable-next-line camelcase
        activityList_json: createActivityListJson(
          [activityConfig.activityId],
          activityType
        ),
      });
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
  }, [activityConfig, activityType]);

  /**
   * Updates the Front Camera Service alarms for the activity
   * @param alarms - The alarms to update
   */
  const updateFrontCameraAlarms = React.useCallback(
    async (alarms: FrontCameraAlarms) => {
      if (!activityConfig) {
        return;
      }
      try {
        const response = await smowlApi.setFrontCameraAlarms({
          // eslint-disable-next-line camelcase
          activityList_json: createActivityListJson(
            [activityConfig.activityId],
            activityType
          ),
          // eslint-disable-next-line camelcase
          alarms_json: createAlarmsJson(alarms),
        });
        if (!response.set) {
          throw new Error("Failed to set front camera alarms");
        }
        setFrontCameraAlarms((prev) => ({
          ...prev,
          alarms: alarms,
          loading: false,
          error: null,
        }));
      } catch (error) {
        if (!isSmowlErrorResponse(error)) {
          throw error;
        }
      }
    },
    [activityConfig, activityType]
  );

  /**
   * Updates the Computer Monitoring Service alarms for the activity
   * @param alarms - The alarms to update
   */
  const updateComputerMonitoringAlarms = React.useCallback(
    async (alarms: ComputerMonitoringAlarms) => {
      if (!activityConfig) {
        return;
      }
      try {
        const response = await smowlApi.setComputerMonitoringAlarms({
          // eslint-disable-next-line camelcase
          activityList_json: createActivityListJson(
            [activityConfig.activityId],
            activityType
          ),
          // eslint-disable-next-line camelcase
          alarms_json: createComputerMonitoringAlarmsJson(alarms),
        });
        if (!response.set) {
          throw new Error("Failed to set computer monitoring alarms");
        }
        setComputerMonitoringAlarms((prev) => ({
          ...prev,
          alarms: alarms,
          loading: false,
          error: null,
        }));
      } catch (error) {
        if (!isSmowlErrorResponse(error)) {
          throw error;
        }
      }
    },
    [activityConfig, activityType]
  );

  React.useEffect(() => {
    loadFrontCameraAlarms();
  }, [loadFrontCameraAlarms]);

  React.useEffect(() => {
    loadComputerMonitoringAlarms();
  }, [loadComputerMonitoringAlarms]);

  return {
    frontCameraAlarms,
    computerMonitoringAlarms,
    updateFrontCameraAlarms,
    updateComputerMonitoringAlarms,
  };
};
