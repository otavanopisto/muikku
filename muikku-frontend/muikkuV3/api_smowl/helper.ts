/* eslint-disable @typescript-eslint/no-explicit-any */
import { SmowlApi } from "./SmowlApi";
import {
  ComputerMonitoringAlarmsConfig,
  FrontCameraAlarmsConfig,
  MonitoringAlarmsActivityResult,
  SmowlApiError,
  SmowlApiConfig,
} from "./types";

const MONITORING_ENDPOINT = "https://swl.smowltech.net/monitor/";
const REGISTRATION_ENDPOINT = "https://swl.smowltech.net/register/";

/**
 * Parameters for the monitoring JWT token
 */
interface MonitoringJwtParams {
  /**
   * The type of activity, e.g.: "quiz", "course", "test"...
   */
  activityType: string;
  activityId: string;
  /**
   * The container ID of the activity, e.g.: "course_id", "folder_id"...
   */
  activityContainerId: string;
  /**
   * The monitoring mode, 0: Instructions mode, 1: Monitoring mode
   */
  isMonitoring: number;
}

/**
 * Parameters for the monitoring get parameters
 */
interface MonitoringGetParams {
  userName: string;
  userEmail: string;
  /**
   * The language of the user, e.g.: "en", "es", "fr", "pt", "it", "de"...
   */
  lang: string;
  type: number;
}

/**
 * Parameters for the registration JWT token
 */
interface RegistrationJwtParams {
  /**
   * The type of activity, e.g.: "quiz", "course", "test"...
   */
  activityType?: string;
  activityId?: string;
  /**
   * The container ID of the activity, e.g.: "course_id", "folder_id"...
   */
  activityContainerId?: string;
}

/**
 * Parameters for the registration get parameters
 */
interface RegistrationGetParams {
  userName: string;
  userEmail: string;
  /**
   * The language of the user, e.g.: "en", "es", "fr", "pt", "it", "de"...
   */
  lang: string;
  type: number;
  /**
   * The URL of the activity where to redirect the user after registration
   */
  activityUrl?: string;
}

/**
 * Forms a link with a JWT token and additional parameters
 * @param endpoint - The base URL for the endpoint
 * @param jwtParams - The parameters for the JWT token
 * @param getParams - The additional parameters for the link
 * @returns The formatted link
 */
export const formLinkWithJwt = async (
  endpoint: string,
  jwtParams: Record<string, any>,
  getParams: Record<string, any>
) => {
  const jwtResponse = await getJwtToken(jwtParams);
  const controllerUrl = new URL(endpoint);

  const updatedGetParams: Record<string, any> = {
    ...getParams,
    entityName: jwtResponse.entityName,
  };

  controllerUrl.searchParams.append("token", jwtResponse.token);

  for (const key in updatedGetParams) {
    controllerUrl.searchParams.append(key, updatedGetParams[key]);
  }
  return controllerUrl.href;
};

/**
 * Generates the registration link with a JWT token
 * @param jwtParams - The parameters for the JWT token
 * @param getParams - The additional parameters for the link
 * @returns The registration link
 */
export const generateRegistrationLinkWithJwt = async (
  jwtParams: RegistrationJwtParams,
  getParams: RegistrationGetParams
) => formLinkWithJwt(REGISTRATION_ENDPOINT, jwtParams, getParams);

/**
 * Generates the monitoring link with a JWT token
 * @param jwtParams - The parameters for the JWT token
 * @param getParams - The additional parameters for the link
 * @returns The monitoring link
 */
export const generateMonitoringLinkWithJwt = async (
  jwtParams: MonitoringJwtParams,
  getParams: MonitoringGetParams
) => formLinkWithJwt(MONITORING_ENDPOINT, jwtParams, getParams);

/**
 * Response from the Muikku API for the JWT token
 */
interface JwtResponse {
  token: string;
  entityName: string;
}

/**
 * Gets a JWT token from the Muikku API
 * @param jwtParams - The parameters for the JWT token
 * @returns The JWT token
 */
async function getJwtToken(
  jwtParams: Record<string, any>
): Promise<JwtResponse> {
  const url = "/rest/smowl/signjwt";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jwtParams),
  });
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to get JWT token");
  }

  return responseData as JwtResponse;
}

/**
 * Response from the SMOWL API for the API key
 */
interface SmowlApiAccountInfoResponse {
  entityName: string;
  swlAPIKey: string;
}

/**
 * Gets the API key from the SMOWL API
 * @returns The API key
 */
export async function getSmowlApiAccountInfo(): Promise<SmowlApiAccountInfoResponse> {
  const url = "/rest/smowl/apikey";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to get API key");
  }

  return responseData as SmowlApiAccountInfoResponse;
}

/**
 * Creates a hash map of front camera alarms
 * @param alarms - The alarms to create the hash map from
 * @returns The hash map of front camera alarms
 */
export const createFrontAlarmHashMap = (
  alarms: MonitoringAlarmsActivityResult<FrontCameraAlarmsConfig>[]
): Record<string, MonitoringAlarmsActivityResult<FrontCameraAlarmsConfig>> =>
  alarms.reduce<
    Record<string, MonitoringAlarmsActivityResult<FrontCameraAlarmsConfig>>
  >((acc, alarm) => {
    const updatedAlarms = { ...alarm.alarms };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (updatedAlarms as any).created_at;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (updatedAlarms as any).updated_at;
    acc[alarm.activity] = {
      ...alarm,
      alarms: updatedAlarms,
    };
    return acc;
  }, {});

/**
 * Creates a hash map of computer monitoring alarms
 * @param alarms - The alarms to create the hash map from
 * @returns The hash map of computer monitoring alarms
 */
export const createComputerMonitoringAlarmHashMap = (
  alarms: MonitoringAlarmsActivityResult<ComputerMonitoringAlarmsConfig>[]
): Record<
  string,
  MonitoringAlarmsActivityResult<ComputerMonitoringAlarmsConfig>
> =>
  alarms.reduce<
    Record<
      string,
      MonitoringAlarmsActivityResult<ComputerMonitoringAlarmsConfig>
    >
  >((acc, alarm) => {
    acc[alarm.activity] = alarm;
    return acc;
  }, {});

/**
 * Converts an object to a form URL encoded string.
 * @param obj - Object to convert
 * @returns Form URL encoded string
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectToFormUrlEncoded(obj: Record<string, any>): string {
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
 * @param activityId - Array of activity IDs
 * @param activityType - Type of activity (e.g. "exam", "course", "test")
 * @returns JSON string in the required format
 */
export function createActivityListJson(
  activityId: string[],
  activityType: "exam"
): string {
  const activityObject: Record<string, string> = {};
  activityId.forEach((id, index) => {
    activityObject[String(index)] = `${activityType}${id}`;
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
export function createAlarmsJson(alarms: FrontCameraAlarmsConfig): string {
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
  alarms: ComputerMonitoringAlarmsConfig
): string {
  return JSON.stringify(alarms);
}

/**
 * Checks if the given error is a SMOWL API error
 * @param error - The error to check
 * @returns True if the error is a SMOWL API error, false otherwise
 */
export const isSmowlApiError = (error: unknown): error is SmowlApiError =>
  typeof error === "object" &&
  error !== null &&
  "name" in error &&
  error.name === "SmowlApiError";

/**
 * Creates a new SMOWL API client instance
 *
 * @param config - Configuration for the SMOWL API client
 * @returns New SMowlApi instance
 */
export function getSmowlApi(config: SmowlApiConfig): SmowlApi {
  return new SmowlApi({
    ...config,
    baseUrl: config.baseUrl || "/rest/smowl",
    headers: {
      ...config.headers,
    },
  });
}
