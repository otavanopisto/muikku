import { SMOWL_API_KEY, SMOWL_ENTITY_NAME } from "~/api_smowl/const";
import type {
  AddActivityRequest,
  AddActivityResponse,
  ModifyActivityRequest,
  ModifyActivityResponse,
  GetActiveServicesRequest,
  GetActiveServicesResponse,
  TestExamModeRequest,
  TestExamModeResponse,
  ComputerMonitoringRequest,
  ComputerMonitoringResponse,
  FrontCameraAlarmsRequest,
  FrontCameraAlarmsResponse,
  SetFrontCameraAlarmsRequest,
  ComputerMonitoringAlarmsRequest,
  ComputerMonitoringAlarmsResponse,
  SetComputerMonitoringAlarmsRequest,
  ComputerMonitoringAlarms,
  FrontCameraAlarms,
  SmowlErrorResponse,
  FrontCameraRequest,
  FrontCameraResponse,
  AlarmSetResponse,
} from "./types";
import { SmowlApiError } from "./types";

/**
 * Configuration for SMOWL API client
 */
export interface SmowlApiConfig {
  /** Base URL for the SMOWL API */
  baseUrl: string;
  /** Optional headers to include in requests */
  headers?: Record<string, string>;
}

/**
 * Converts an object to a form URL encoded string.
 * @param obj - Object to convert
 * @returns Form URL encoded string
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectToFormUrlEncoded(obj: Record<string, any>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      // Convert to string - handle different types
      params.append(key, String(value));
    }
  }

  return params.toString();
}

/**
 * Creates the activityList_json string in the required format.
 * The API requires a JSON object (not array) with string numeric keys.
 * Example: ["quiz1", "quiz2"] -> '{"0":"quiz1","1":"quiz2"}'
 *
 * @param activityNames - Array of activity names
 * @returns JSON string in the required format
 */
export function createActivityListJson(activityNames: string[]): string {
  const activityObject: Record<string, string> = {};
  activityNames.forEach((name, index) => {
    activityObject[String(index)] = name;
  });
  return JSON.stringify(activityObject);
}

/**
 * Creates the alarms_json string in the required format.
 * The API requires a JSON object with alarm keys and their values (can be int or string).
 * Example: { INCORRECT_USER: 2, MORE_THAN_ONE: 1, ... } -> '{"INCORRECT_USER":2,"MORE_THAN_ONE":1,...}'
 *
 * @param alarms - Object containing alarm configurations
 * @returns JSON string in the required format
 */
export function createAlarmsJson(alarms: FrontCameraAlarms): string {
  return JSON.stringify(alarms);
}

/**
 * Creates the alarms_json string in the required format for Computer Monitoring Service.
 * The API requires a JSON object with alarm keys and their values.
 * Example: { allowed_actions: {...}, allowed_programs: {...} } -> '{"allowed_actions":{...},"allowed_programs":{...}}'
 *
 * @param alarms - Object containing Computer Monitoring alarm configurations
 * @returns JSON string in the required format
 */
export function createComputerMonitoringAlarmsJson(
  alarms: ComputerMonitoringAlarms
): string {
  return JSON.stringify(alarms);
}

/**
 * SMOWL API client
 */
export class SmowlApi {
  private config: SmowlApiConfig;

  /**
   * Constructor for the SMOWL API client
   * @param config - Configuration for the SMOWL API client
   */
  constructor(config: SmowlApiConfig) {
    this.config = config;
  }

  /**
   * Gets the service configurations default from entity and apply in the new activity.
   *
   * @param params - Parameters for adding a new activity
   * @returns Promise resolving to the activity configuration response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async addActivity(params: AddActivityRequest): Promise<AddActivityResponse> {
    const url = `${this.config.baseUrl}/configs/activeServices/addActivity`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as AddActivityResponse;
  }

  /**
   * Modifies an existing activity configuration.
   *
   * @param params - Parameters for modifying an activity
   * @returns Promise resolving to the activity configuration response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async modifyActivity(
    params: ModifyActivityRequest
  ): Promise<ModifyActivityResponse> {
    const url = `${this.config.baseUrl}/configs/activeServices/modifyActivity`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...this.config.headers,
      },
      body: JSON.stringify(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as ModifyActivityResponse;
  }

  /**
   * Gets the service configurations for an activity or a full course.
   * Shows which services are activated or deactivated in a given activity.
   *
   * @param params - Parameters for getting active services
   * @returns Promise resolving to a collection of activity configurations
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async getActiveServices(
    params: GetActiveServicesRequest
  ): Promise<GetActiveServicesResponse> {
    const url = `${this.config.baseUrl}/configs/activeServices/get`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as GetActiveServicesResponse;
  }

  /**
   * Activates 'TestExam' mode for one or more activities.
   * Warning: The max number of activities in the list can vary depending on the specific API request.
   *
   * @param params - Parameters for activating TestExam mode
   * @returns Promise resolving to the TestExam mode activation response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async activateTestExamMode(
    params: TestExamModeRequest
  ): Promise<TestExamModeResponse> {
    const url = `${this.config.baseUrl}/configs/testExamMode/update/activate`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as TestExamModeResponse;
  }

  /**
   * Deactivates 'TestExam' mode for one or more activities.
   * Warning: The max number of activities in the list can vary depending on the specific API request.
   *
   * @param params - Parameters for deactivating TestExam mode
   * @returns Promise resolving to the TestExam mode deactivation response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async deactivateTestExamMode(
    params: TestExamModeRequest
  ): Promise<TestExamModeResponse> {
    const url = `${this.config.baseUrl}/configs/testExamMode/update/deactivate`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as TestExamModeResponse;
  }

  /**
   * Activates Front Camera Service for one or more activities.
   * Warning: The list cannot contain more than 500 activities in a single request.
   *
   * @param params - Parameters for activating Front Camera Service
   * @returns Promise resolving to the Front Camera Service activation response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async activateFrontCamera(
    params: FrontCameraRequest
  ): Promise<FrontCameraResponse> {
    const url = `${this.config.baseUrl}/configs/frontCameraService/update/activate`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as FrontCameraResponse;
  }

  /**
   * Activates Front Camera Service for one or more activities.
   * Warning: The list cannot contain more than 500 activities in a single request.
   *
   * @param params - Parameters for activating Front Camera Service
   * @returns Promise resolving to the Front Camera Service activation response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async deactivateFrontCamera(
    params: FrontCameraRequest
  ): Promise<FrontCameraResponse> {
    const url = `${this.config.baseUrl}/configs/frontCameraService/update/deactivate`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as FrontCameraResponse;
  }

  /**
   * Activates Computer Monitoring (CM) service for one or more activities.
   * Warning: The list cannot contain more than 500 activities in a single request.
   *
   * @param params - Parameters for activating Computer Monitoring service
   * @returns Promise resolving to the Computer Monitoring activation response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async activateComputerMonitoring(
    params: ComputerMonitoringRequest
  ): Promise<ComputerMonitoringResponse> {
    const url = `${this.config.baseUrl}/configs/computerMonitoringService/update/activate`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as ComputerMonitoringResponse;
  }

  /**
   * Deactivates Computer Monitoring (CM) service for one or more activities.
   * Warning: The list cannot contain more than 500 activities in a single request.
   *
   * @param params - Parameters for deactivating Computer Monitoring service
   * @returns Promise resolving to the Computer Monitoring deactivation response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async deactivateComputerMonitoring(
    params: ComputerMonitoringRequest
  ): Promise<ComputerMonitoringResponse> {
    const url = `${this.config.baseUrl}/configs/computerMonitoringService/update/deactivate`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as ComputerMonitoringResponse;
  }

  /**
   * Gets Front Camera Service alarms for one or more activities.
   *
   * @param params - Parameters for getting Front Camera Service alarms
   * @returns Promise resolving to the Front Camera Service alarms response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async getFrontCameraAlarms(
    params: FrontCameraAlarmsRequest
  ): Promise<FrontCameraAlarmsResponse> {
    const url = `${this.config.baseUrl}/alarms/frontCameraService/activities/get`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...this.config.headers,
      },
      body: JSON.stringify(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as FrontCameraAlarmsResponse;
  }

  /**
   * Sets Front Camera Service alarm settings for a group of activities.
   *
   * @param params - Parameters for setting Front Camera Service alarms
   * @returns Promise resolving to the Front Camera Service alarms set response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async setFrontCameraAlarms(
    params: SetFrontCameraAlarmsRequest
  ): Promise<AlarmSetResponse> {
    const url = `${this.config.baseUrl}/alarms/frontCameraService/activities/set`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as AlarmSetResponse;
  }

  /**
   * Gets Computer Monitoring Service alarms for one or more activities.
   *
   * @param params - Parameters for getting Computer Monitoring Service alarms
   * @returns Promise resolving to the Computer Monitoring Service alarms response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async getComputerMonitoringAlarms(
    params: ComputerMonitoringAlarmsRequest
  ): Promise<ComputerMonitoringAlarmsResponse> {
    const url = `${this.config.baseUrl}/alarms/computerMonitoringService/activities/get`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...this.config.headers,
      },
      body: JSON.stringify(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as ComputerMonitoringAlarmsResponse;
  }

  /**
   * Sets Computer Monitoring Service alarm settings for a group of activities.
   *
   * @param params - Parameters for setting Computer Monitoring Service alarms
   * @returns Promise resolving to the Computer Monitoring Service alarms set response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async setComputerMonitoringAlarms(
    params: SetComputerMonitoringAlarmsRequest
  ): Promise<AlarmSetResponse> {
    const url = `${this.config.baseUrl}/alarms/computerMonitoringService/activities/set`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.config.headers,
      },
      body: objectToFormUrlEncoded(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if the error response matches the SMOWL error format
      if (
        responseData &&
        typeof responseData.status === "number" &&
        typeof responseData.error === "number" &&
        responseData.messages &&
        typeof responseData.messages === "object"
      ) {
        throw new SmowlApiError(responseData as SmowlErrorResponse);
      }

      // Fallback for other error formats
      throw new Error(
        `SMOWL API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData as AlarmSetResponse;
  }
}

/**
 * Creates a new SMOWL API client instance
 *
 * @param config - Configuration for the SMOWL API client
 * @returns New SMowlApi instance
 */
export function getSmowlApi(config: SmowlApiConfig): SmowlApi {
  const entityName = SMOWL_ENTITY_NAME;
  const apiKey = SMOWL_API_KEY;
  const authString = `Basic ${btoa(entityName + ":" + apiKey)}`;
  return new SmowlApi({
    ...config,
    headers: {
      ...config.headers,
      Authorization: authString,
    },
  });
}

// Export types
export type {
  AddActivityRequest,
  AddActivityResponse,
  ModifyActivityRequest,
  ModifyActivityResponse,
  GetActiveServicesRequest,
  GetActiveServicesResponse,
  TestExamModeRequest,
  TestExamModeResponse,
  TestExamModeActivityResult,
  TestExamModeReason,
  ComputerMonitoringRequest,
  ComputerMonitoringResponse,
  ComputerMonitoringActivityResult,
  ComputerMonitoringReason,
  FrontCameraAlarmsRequest,
  FrontCameraAlarmsResponse,
  SetFrontCameraAlarmsRequest,
  FrontCameraAlarmsActivityResult,
  FrontCameraAlarms,
  ComputerMonitoringAlarmsRequest,
  ComputerMonitoringAlarmsResponse,
  SetComputerMonitoringAlarmsRequest,
  ComputerMonitoringAlarmsActivityResult,
  ComputerMonitoringAlarms,
  ComputerMonitoringAllowedActions,
  ComputerMonitoringAllowedPrograms,
  AlarmSource,
  ActivityConfig,
  SmowlErrorResponse,
} from "./types";
export { SmowlApiError } from "./types";
