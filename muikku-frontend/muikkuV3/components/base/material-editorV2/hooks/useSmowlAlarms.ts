import * as React from "react";
import {
  createActivityListJson,
  createAlarmsJson,
  createComputerMonitoringAlarmsJson,
  getSmowlApi,
} from "~/api_smowl";
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
  activityConfig: ActivityConfig;
}

/**
 * Custom hook for smowl alarms
 * @param props - The properties for the hook
 */
export const useSmowlAlarms = (props: UseSmowlAlarmsProps) => {
  const { activityConfig } = props;
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
    try {
      const response = await smowlApi.getFrontCameraAlarms({
        // eslint-disable-next-line camelcase
        activityList_json: createActivityListJson([
          props.activityConfig.activityId,
        ]),
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
  }, [props.activityConfig]);

  /**
   * Loads the Computer Monitoring Service alarms for the activity
   */
  const loadComputerMonitoringAlarms = React.useCallback(async () => {
    try {
      const response = await smowlApi.getComputerMonitoringAlarms({
        // eslint-disable-next-line camelcase
        activityList_json: createActivityListJson([
          props.activityConfig.activityId,
        ]),
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
  }, [props.activityConfig]);

  /**
   * Updates the Front Camera Service alarms for the activity
   * @param alarms - The alarms to update
   */
  const updateFrontCameraAlarms = React.useCallback(
    async (alarms: FrontCameraAlarms) => {
      try {
        const response = await smowlApi.setFrontCameraAlarms({
          // eslint-disable-next-line camelcase
          activityList_json: createActivityListJson([
            activityConfig.activityId,
          ]),
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
    [activityConfig]
  );

  /**
   * Updates the Computer Monitoring Service alarms for the activity
   * @param alarms - The alarms to update
   */
  const updateComputerMonitoringAlarms = React.useCallback(
    async (alarms: ComputerMonitoringAlarms) => {
      try {
        const response = await smowlApi.setComputerMonitoringAlarms({
          // eslint-disable-next-line camelcase
          activityList_json: createActivityListJson([
            activityConfig.activityId,
          ]),
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
    [activityConfig]
  );

  React.useEffect(() => {
    activityConfig.FrontCamera && loadFrontCameraAlarms();
    activityConfig.ComputerMonitoring && loadComputerMonitoringAlarms();
  }, [
    activityConfig.FrontCamera,
    activityConfig.ComputerMonitoring,
    loadFrontCameraAlarms,
    loadComputerMonitoringAlarms,
  ]);

  return {
    frontCameraAlarms,
    computerMonitoringAlarms,
    updateFrontCameraAlarms,
    updateComputerMonitoringAlarms,
  };
};
