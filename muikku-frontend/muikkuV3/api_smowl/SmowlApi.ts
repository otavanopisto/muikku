import { objectToFormUrlEncoded } from "./helper";
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
  MonitoringAlarmsResponse,
  MonitoringAlarmsSetResponse,
  ComputerMonitoringAlarmsConfig,
  FrontCameraAlarmsConfig,
  SmowlErrorResponse,
  ExternalCameraRequest,
  ExternalCameraResponse,
  SetMonitoringDeviceAlarmsRequest,
  GetMonitoringDeviceAlarmsRequest,
  SmowlApiConfig,
} from "./types";
import { SmowlApiError } from "./types";

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
   * Activates External Camera Service for one or more activities.
   * Warning: The list cannot contain more than 500 activities in a single request.
   *
   * @param params - Parameters for activating External Camera Service
   * @returns Promise resolving to the External Camera Service activation response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async activateExternalCamera(
    params: ExternalCameraRequest
  ): Promise<ExternalCameraResponse> {
    const url = `${this.config.baseUrl}/configs/externalCameraService/update/activate`;
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

    return responseData as ExternalCameraResponse;
  }

  /**
   * Deactivates External Camera Service for one or more activities.
   * Warning: The list cannot contain more than 500 activities in a single request.
   *
   * @param params - Parameters for deactivating External Camera Service
   * @returns Promise resolving to the External Camera Service deactivation response
   * @throws SmowlApiError if the request fails with an API error
   * @throws Error if the request fails for other reasons
   */
  async deactivateExternalCamera(
    params: ExternalCameraRequest
  ): Promise<ExternalCameraResponse> {
    const url = `${this.config.baseUrl}/configs/externalCameraService/update/deactivate`;
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

    return responseData as ExternalCameraResponse;
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
    params: GetMonitoringDeviceAlarmsRequest
  ): Promise<MonitoringAlarmsResponse<FrontCameraAlarmsConfig>> {
    const url = `${this.config.baseUrl}/alarms/frontCameraService/activities/get`;

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

    return responseData as MonitoringAlarmsResponse<FrontCameraAlarmsConfig>;
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
    params: SetMonitoringDeviceAlarmsRequest
  ): Promise<MonitoringAlarmsSetResponse> {
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

    return responseData as MonitoringAlarmsSetResponse;
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
    params: GetMonitoringDeviceAlarmsRequest
  ): Promise<MonitoringAlarmsResponse<ComputerMonitoringAlarmsConfig>> {
    const url = `${this.config.baseUrl}/alarms/computerMonitoringService/activities/get`;

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

    return responseData as MonitoringAlarmsResponse<ComputerMonitoringAlarmsConfig>;
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
    params: SetMonitoringDeviceAlarmsRequest
  ): Promise<MonitoringAlarmsSetResponse> {
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

    return responseData as MonitoringAlarmsSetResponse;
  }
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
  ComputerMonitoringRequest,
  ComputerMonitoringResponse,
  MonitoringAlarmsResponse,
  MonitoringAlarmsSetResponse,
  ComputerMonitoringAlarmsConfig,
  FrontCameraAlarmsConfig,
  SmowlErrorResponse,
  ExternalCameraRequest,
  ExternalCameraResponse,
  SetMonitoringDeviceAlarmsRequest,
  GetMonitoringDeviceAlarmsRequest,
};
