import * as React from "react";
import {
  ActivityConfig,
  AddActivityRequest,
  createActivityListJson,
  getSmowlApi,
} from "~/api_smowl/index";
import {
  GetActiveServicesRequest,
  isSmowlErrorResponse,
  SmowlErrorResponse,
} from "~/api_smowl/types";

const smowlApi = getSmowlApi({
  baseUrl: "https://results-api.smowltech.net/index.php/v2",
});

export const NO_DATA_AVAILABLE_RESPONSE: SmowlErrorResponse = {
  status: 400,
  error: 400,
  messages: {
    activityName: "No data available for the submitted activity Type and Id.",
  },
};

/**
 * Custom hook for smowl integration
 */
interface UseSmowlActivityProps {
  activityId: string;
  activityType?: "exam";
}

/**
 * Custom hook for smowl integration
 * @param props - The properties for the hook
 */
export const useSmowlActivity = (props: UseSmowlActivityProps) => {
  const { activityId, activityType = "exam" } = props;

  const [activity, setActivity] = React.useState<{
    activity: ActivityConfig | null;
    error: SmowlErrorResponse | null;
    loading: boolean;
    noDataAvailable: boolean;
  }>({
    activity: null,
    error: null,
    loading: false,
    noDataAvailable: false,
  });

  /**
   * Loads the activity from SMOWL
   * @param request - The request to load the activity
   */
  const loadActivity = React.useCallback(
    async (request: GetActiveServicesRequest) => {
      setActivity((prev) => ({
        ...prev,
        loading: true,
      }));
      try {
        const response = await smowlApi.getActiveServices({
          ...request,
          activityId: activityId,
        });
        setActivity((prev) => ({
          ...prev,
          activity: response[`${activityType}${request.activityId}`],
          error: null,
          loading: false,
        }));
      } catch (error) {
        if (!isSmowlErrorResponse(error)) {
          throw error;
        }
        setActivity((prev) => ({
          ...prev,
          error: error,
          loading: false,
          noDataAvailable:
            error.messages.activityName ===
            NO_DATA_AVAILABLE_RESPONSE.messages.activityName,
        }));
      }
    },
    [activityId, activityType]
  );

  React.useEffect(() => {
    loadActivity({
      activityType: activityType,
      activityId: activityId,
    });
  }, [activityId, activityType, loadActivity]);

  /**
   * Creates an exam activity in SMOWL
   * @param request - The request to create the activity
   */
  const createExamActivity = async (request: AddActivityRequest) => {
    try {
      const response = await smowlApi.addActivity({
        ...request,
        activityId: activityId,
      });
      setActivity((prev) => ({
        ...prev,
        activity: response[`${activityType}${request.activityId}`],
        error: null,
        loading: false,
        noDataAvailable: false,
      }));
    } catch (error) {
      if (!isSmowlErrorResponse(error)) {
        throw error;
      }
      setActivity((prev) => ({
        ...prev,
        error: error,
        loading: false,
      }));
    }
  };

  /**
   * Enables the activity
   */
  const toggleActivityEnabled = React.useCallback(async () => {
    if (!activity.activity) {
      return;
    }
    try {
      await smowlApi.modifyActivity({
        activityId: activityId,
        activityType: activityType,
        enable: activity.activity.enabled ? "false" : "true",
      });
      setActivity((prev) => ({
        ...prev,
        activity: {
          ...prev.activity,
          enabled: !prev.activity.enabled,
        },
        error: null,
        loading: false,
        noDataAvailable: false,
      }));
    } catch (error) {
      if (!isSmowlErrorResponse(error)) {
        throw error;
      }
      setActivity((prev) => ({
        ...prev,
        error: error,
        loading: false,
      }));
    }
  }, [activity, activityId, activityType]);

  /**
   * Toggles the Front Camera setting for the activity
   */
  const toggleExternalCamera = React.useCallback(async () => {
    if (!activity.activity) {
      return;
    }
    try {
      const activityListJson = createActivityListJson(
        [activity.activity.activityId],
        activityType
      );
      if (activity.activity?.ExternalCamera) {
        await smowlApi.deactivateExternalCamera({
          // eslint-disable-next-line camelcase
          activityList_json: activityListJson,
        });
      } else {
        await smowlApi.activateExternalCamera({
          // eslint-disable-next-line camelcase
          activityList_json: activityListJson,
        });
      }

      setActivity((prev) => ({
        ...prev,
        activity: {
          ...prev.activity,
          ExternalCamera: !activity.activity.ExternalCamera,
        },
        error: null,
        loading: false,
        noDataAvailable: false,
      }));
    } catch (error) {
      if (!isSmowlErrorResponse(error)) {
        throw error;
      }
      setActivity((prev) => ({
        ...prev,
        error: error,
        loading: false,
      }));
    }
  }, [activity, activityType]);

  /**
   * Toggles the Computer Monitoring setting for the activity
   */
  const toggleComputerMonitoring = React.useCallback(async () => {
    if (!activity.activity) {
      return;
    }
    try {
      const activityListJson = createActivityListJson(
        [activity.activity.activityId],
        activityType
      );
      if (activity.activity?.ComputerMonitoring) {
        await smowlApi.deactivateComputerMonitoring({
          // eslint-disable-next-line camelcase
          activityList_json: activityListJson,
        });
      } else {
        await smowlApi.activateComputerMonitoring({
          // eslint-disable-next-line camelcase
          activityList_json: activityListJson,
        });
      }

      setActivity((prev) => ({
        ...prev,
        activity: {
          ...prev.activity,
          ComputerMonitoring: !activity.activity.ComputerMonitoring,
        },
        error: null,
        loading: false,
        noDataAvailable: false,
      }));
    } catch (error) {
      if (!isSmowlErrorResponse(error)) {
        throw error;
      }
      setActivity((prev) => ({
        ...prev,
        error: error,
        loading: false,
      }));
    }
  }, [activity, activityType]);

  /**
   * Toggles the Test Exam Mode setting for the activity
   */
  const toggleTestExamMode = React.useCallback(async () => {
    if (!activity.activity) {
      return;
    }
    try {
      const activityListJson = createActivityListJson(
        [activity.activity.activityId],
        activityType
      );

      if (activity.activity.TestExamMode) {
        await smowlApi.deactivateTestExamMode({
          // eslint-disable-next-line camelcase
          activityList_json: activityListJson,
        });
      } else {
        await smowlApi.activateTestExamMode({
          // eslint-disable-next-line camelcase
          activityList_json: activityListJson,
        });
      }

      setActivity((prev) => ({
        ...prev,
        activity: {
          ...prev.activity,
          TestExamMode: !activity.activity.TestExamMode,
        },
      }));
    } catch (error) {
      if (!isSmowlErrorResponse(error)) {
        throw error;
      }
      setActivity((prev) => ({
        ...prev,
        error: error,
        loading: false,
      }));
    }
  }, [activity, activityType]);

  return {
    activity,
    createExamActivity,
    toggleActivityEnabled,
    toggleExternalCamera,
    toggleComputerMonitoring,
    toggleTestExamMode,
  };
};
