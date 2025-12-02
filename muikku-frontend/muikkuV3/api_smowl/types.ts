/**
 * Request parameters for adding a new activity
 */
export interface AddActivityRequest {
  /** The type of activity, e.g.: "quiz", "course", "test"... */
  activityType: string;
  /** The activity unique identifier from client platforms */
  activityId: string;
  /** The container id */
  courseId: string;
  /** The module id (optional) */
  moduleId?: string;
  /** The number of users per activity */
  numberUsers: string;
  /** Start Date with hours, example '2023-02-01 12:00:00' */
  startDate: Date;
  /** End Date with hours, example '2023-02-01 13:00:00' */
  endDate: Date;
  /** Course Name */
  displayName: string;
}

/**
 * Request parameters for modifying an existing activity
 */
export interface ModifyActivityRequest {
  /** The type of activity, e.g.: "quiz", "course", "test"... */
  activityType: string;
  /** The activity unique identifier from client platforms */
  activityId: string;
  /** Enable or disable the activity. "true" or "false" */
  enable?: string;
  /** The number of users per activity */
  numberUsers?: string;
  /** Start Date with hours, example '2023-02-01 12:00:00' */
  startDate?: Date;
  /** End Date with hours, example '2023-02-01 13:00:00' */
  endDate?: Date;
  /** Course Name */
  displayName?: string;
}

/**
 * Request parameters for getting active services
 */
export interface GetActiveServicesRequest {
  /** The type of activity, e.g.: "quiz", "course", "test"... */
  activityType: string;
  /** The activity unique identifier from client platforms */
  activityId: string;
}

/**
 * Request information in response
 */
export interface RequestInfo {
  /** Status of the response, e.g. "OK" */
  status: string;
  /** Indicates if any errors occurred during data processing, analysis and generation of the response */
  error: boolean;
  /** The Date and Time the current API request was made (UTC). Format: YYYY-MM-DD hh:mm:ss */
  requestDateTime: string;
  /** The time taken (in seconds) for servers to process, analyse and generate data for the response */
  speed: number;
}

/**
 * Request parameters for activating or deactivating TestExam mode
 * Warning: The max number of activities in the list can vary depending on the specific API request.
 * The final JSON must be wrapped in curly braces (an object), not an array.
 * Example format: {"0":"quiz1","1":"quiz2","2":"quiz3"}
 */
export interface TestExamModeRequest {
  /**
   * A JSON encoded object (not array) of activity names.
   * Must be an object with string numeric keys (e.g., "0", "1", "2") and activity name values.
   * Example: {"0":"quiz1","1":"quiz2","2":"quiz3"}
   * Use the createActivityListJson helper function to generate this correctly.
   */
  activityList_json: string;
}

/**
 * Response from activating or deactivating TestExam mode
 */
export interface TestExamModeResponse {
  /** Collection (array) of activity objects */
  ActivityConfigList_TestExams: ActivityConfigResult[];
  /** Object containing information about the current request */
  request_info: RequestInfo;
}

/**
 * Request parameters for activating or deactivating Front Camera Service
 */
export interface ExternalCameraRequest {
  /**
   * A JSON encoded object (not array) of activity names.
   * Must be an object with string numeric keys (e.g., "0", "1", "2") and activity name values.
   * Example: {"0":"quiz1","1":"quiz2","2":"quiz3"}
   * Use the createActivityListJson helper function to generate this correctly.
   */
  activityList_json: string;
}

/**
 * Response from activating or deactivating Front Camera Service
 */
export interface ExternalCameraResponse {
  /** Collection (array) of activity objects */
  ActivityConfigList_Ext: ActivityConfigResult[];
  /** Object containing information about the current request */
  request_info: RequestInfo;
}

/**
 * Request parameters for activating or deactivating Computer Monitoring Service
 * Warning: The list cannot contain more than 500 activities in a single request.
 * The final JSON must be wrapped in curly braces (an object), not an array.
 * Example format: {"0":"quiz1","1":"quiz2","2":"quiz3"}
 */
export interface ComputerMonitoringRequest {
  /**
   * A JSON encoded object (not array) of activity names.
   * Must be an object with string numeric keys (e.g., "0", "1", "2") and activity name values.
   * Example: {"0":"quiz1","1":"quiz2","2":"quiz3"}
   * Use the createActivityListJson helper function to generate this correctly.
   */
  activityList_json: string;
}

/**
 * Possible reason values for Computer Monitoring Service activation/deactivation
 */
export type ActivityConfigReason =
  | "QUIZ_NOT_EXIST"
  | "QUIZ_HAS_DATA"
  | "ALREADY_SET"
  | "UPDATED"
  | "UPDATE_FAILED";

/**
 * Activity result in Computer Monitoring Service activation/deactivation response
 */
export interface ActivityConfigResult {
  /** The name of an activity that was sent in the request */
  activityName: string;
  /**
   * Status of the current 'activate' or 'deactivate' request for an activity.
   * true: If the activity was updatable, and the update action was successful.
   * false: If the activity was not updatable, or the update action was unsuccessful, or was unnecessary because the service was already active or inactive.
   */
  status: boolean;
  /**
   * Explains why the 'status' attribute is in a certain boolean state.
   * Possible values: "QUIZ_NOT_EXIST", "QUIZ_HAS_DATA", "ALREADY_SET", "UPDATED", "UPDATE_FAILED"
   */
  reason: ActivityConfigReason;
}

/**
 * Response from activating or deactivating Computer Monitoring Service
 */
export interface ComputerMonitoringResponse {
  /** Collection (array) of activity objects */
  ActivityConfigList_CM: ActivityConfigResult[];
  /** Object containing information about the current request */
  request_info: RequestInfo;
}

/**
 * Activity configuration data
 */
export interface ActivityConfig {
  /** The type of activity, e.g.: "quiz", "course", "test"... */
  activityType: string;
  /** The activity unique identifier from client platforms */
  activityId: string;
  /** When true the Front Camera service is active for the activity, is false when inactive */
  FrontCamera: boolean;
  /** When true the External Camera service is active for the activity, is false when inactive */
  ExternalCamera: boolean;
  /** When true the Computer Monitoring(SMOWL CM) service is active for the activity, is false when inactive */
  ComputerMonitoring: boolean;
  /** When true the Browser Extension (SMOWL LOCK) service is active for the activity, is false when inactive */
  BrowserExtension: boolean;
  /** When true the Audio service is active for the activity, is false when inactive */
  Audio: boolean;
  /** When true the IP Analysis service is active for the activity, is false when inactive */
  IpAnalysis: boolean;
  /** When true the activity has 'TestExam' mode activated. This attribute will not be present when 'TestExam' mode is inactive */
  TestExamMode?: boolean;
  /** When true the activity is enabled, is false when inactive */
  enabled: boolean;
  /** Course Name */
  displayName: string;
}

/**
 * Response from adding a new activity
 * The response is an object with the activity identifier as the key
 * Example: { "quiz999": { activityType: "quiz", ... } }
 */
export interface AddActivityResponse {
  [activityKey: string]: ActivityConfig;
}

/**
 * Response from modifying an activity
 * The response is an object with the activity identifier as the key
 * Example: { "quiz999": { activityType: "quiz", ... } }
 */
export interface ModifyActivityResponse {
  [activityKey: string]: ActivityConfig;
}

/**
 * Response from getting active services
 * The response is a collection of activity objects, where keys are activity names.
 * If request is for 'course' mode, collection contains multiple activity objects.
 * If request is for a single activity, collection contains a single activity object.
 * Example: { "quiz999": { activityType: "quiz", ... }, "quiz7": { ... } }
 */
export interface GetActiveServicesResponse {
  [activityKey: string]: ActivityConfig;
}

/**
 * Error response from SMOWL API
 */
export interface SmowlErrorResponse {
  /** HTTP status code */
  status: number;
  /** Error code (typically same as status) */
  error: number;
  /** Field-specific error messages */
  messages: Record<string, string>;
}

/**
 * Custom error class for SMOWL API errors
 */
export class SmowlApiError extends Error {
  public status: number;
  public error: number;
  public messages: Record<string, string>;

  /**
   * Constructor for the SMOWL API error
   * @param response - Response from the SMOWL API
   */
  constructor(response: SmowlErrorResponse) {
    const messageKeys = Object.keys(response.messages);
    const firstMessage = response.messages[messageKeys[0]] || "Unknown error";
    super(`SMOWL API error (${response.status}): ${firstMessage}`);
    this.name = "SmowlApiError";
    this.status = response.status;
    this.error = response.error;
    this.messages = response.messages;
  }
}

/**
 * Checks if the given error is a SMOWL error response
 * @param error - The error to check
 * @returns True if the error is a SMOWL error response, false otherwise
 */
export const isSmowlErrorResponse = (
  error: unknown
): error is SmowlErrorResponse =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  "error" in error &&
  "messages" in error;

/**
 * Request parameters for setting Front Camera Service alarms
 */
export interface SetMonitoringDeviceAlarmsRequest {
  /**
   * A JSON encoded object (not array) of activity names.
   * Must be an object with string numeric keys (e.g., "0", "1", "2") and activity name values.
   * Example: {"0":"quiz1","1":"quiz2","2":"quiz3"}
   * Use the createActivityListJson helper function to generate this correctly.
   */
  activityList_json: string;
  /**
   * A JSON encoded object of alarm keys and desired settings.
   * Must contain all alarm keys with their values (can be int or string).
   * Use the createAlarmsJson helper function to generate this correctly.
   */
  alarms_json: string;
}

/**
 * Request parameters for getting Computer Monitoring Service alarms
 */
export interface GetMonitoringDeviceAlarmsRequest {
  /**
   * A JSON encoded object (not array) of activity names.
   * Must be an object with string numeric keys (e.g., "0", "1", "2") and activity name values.
   * Example: {"0":"quiz1","1":"quiz2","2":"quiz3"}
   * Use the createActivityListJson helper function to generate this correctly.
   */
  activityList_json: string;
}

/**
 * Response from setting alarms
 */
export interface MonitoringAlarmsSetResponse {
  /** True indicates that the alarms were saved successfully, or false if not */
  set: boolean;
  /** Object containing information about the current request */
  request_info: RequestInfo;
}

/**
 * Source of alarm configuration
 */
export type MonitoringAlarmsSource = "activity" | "entity" | "default";

/**
 * Activity alarm result in alarms response
 */
export interface MonitoringAlarmsActivityResult<T> {
  /** The name of an activity that was sent in the request */
  activity: string;
  /** This represents the alarms for an activity */
  alarms: T;
  /**
   * This explains the 'source' the alarms configurations that were applied.
   * - "activity": The alarms were retrieved from the activity config settings.
   * - "entity": The alarms were retrieved from the client config settings.
   * - "default": A default alarm configuration was applied, because neither 'entity' or 'activity' alarms were available for the activity.
   */
  source: MonitoringAlarmsSource;
}

/**
 * Response from getting Computer Monitoring Service alarms
 */
export interface MonitoringAlarmsResponse<T> {
  /** Collection (array) of activity objects */
  ActivityList_alarms: MonitoringAlarmsActivityResult<T>[];
  /** Object containing information about the current request */
  request_info: RequestInfo;
}

/**
 * Computer Monitoring Service allowed actions configuration
 */
export interface ComputerMonitoringAllowedActions {
  /** true if web navigation is allowed, false if not */
  WEB_NAVIGATION: boolean;
  /** true if running the activity in a virtual machine is allowed, false if not */
  VIRTUAL_MACHINE: boolean;
  /** true if running a virtual webcam is allowed, false if not */
  VIRTUAL_WEBCAM: boolean;
  /** true if having multiple screens is allowed, false if not */
  MULTIPLE_SCREENS: boolean;
  /** true if running commands is allowed, false if not */
  COMMANDS: boolean;
  /** true if running background programs is allowed, false if not */
  BACKGROUND_PROGRAMS: boolean;
  /** true if closing the computer monitoring tool before ending the activity is allowed, false if not */
  EARLY_CLOSE: boolean;
}

/**
 * Computer Monitoring Service allowed programs configuration
 */
export interface ComputerMonitoringAllowedPrograms {
  /** true if a text editor program is allowed, false if not */
  TEXT_EDITOR: boolean;
  /** true if a pdf program is allowed, false if not */
  PDF_READER: boolean;
  /** true if a spreadsheet program is allowed, false if not */
  SPREADSHEET: boolean;
  /** true if an email program is allowed, false if not */
  MAIL: boolean;
  /** true if a communication program is allowed, false if not */
  COMMUNICATION: boolean;
  /** true if virtual webcam program is allowed, false if not */
  VIRTUAL_WEBCAM: boolean;
  /** true if opening file system programs is allowed, false if not */
  FILE_SYSTEM: boolean;
  /** true if a media player program is allowed, false if not */
  MEDIA_PLAYER: boolean;
  /** true if a presentation or slide viewer program is allowed, false if not */
  SLIDE_VIEWER: boolean;
  /** true if a screenshot program is allowed, false if not */
  SCREENSHOTER: boolean;
  /** true if a remote control program (pc remote access control) is allowed, false if not */
  REMOTE_CONTROL: boolean;
  /** true if pentesting programs is allowed, false if not */
  PENTESTING: boolean;
  /** true if a code editor program is allowed, false if not */
  CODE_EDITOR: boolean;
  /** true if a virtual machine program is allowed, false if not */
  VIRTUAL_MACHINES: boolean;
  /** true if a database program is allowed, false if not */
  DATABASE: boolean;
  /** true if a open source office suite program is allowed, false if not */
  OPEN_SOURCE_OFFICE_SUITE: boolean;
}

/**
 * Computer Monitoring Service alarm configuration
 */
export interface ComputerMonitoringAlarms {
  /** Allowed actions configuration */
  allowed_actions: ComputerMonitoringAllowedActions;
  /** Allowed programs configuration */
  allowed_programs: ComputerMonitoringAllowedPrograms;
}

/**
 * Front Camera Service alarm configuration
 * Each property represents the number of allowed occurrences for that alarm type
 */
export interface FrontCameraAlarms {
  /** Number of allowed occurrences of 'incorrect' user */
  INCORRECT_USER: number | string;
  /** Number of allowed occurrences of more than 1 person */
  MORE_THAN_ONE: number | string;
  /** Number of allowed occurrences of nobody in front of camera */
  NOBODY: number | string;
  /** Number of allowed occurrences of web camera being covered */
  WEBCAM_COVERED: number | string;
  /** Number of allowed occurrences of another browser tab being open */
  OTHER_TAB: number | string;
  /** Number of allowed occurrences of insufficient lighting for camera to capture detail of the student surroundings, or student badly positioned in front of camera */
  WRONG_LIGHT_POSING: number | string;
  /** Number of allowed occurrences of banned or not permitted elements during exam (E.g. mobile phones, calculators, notes) */
  BANNED_ELEMENTS: number | string;
  /** Number of allowed occurrences of student having a suspicious behaviour */
  SUSPICIOUS_BEHAVIOUR: number | string;
  /** A minimum number of images required to be captured during the exam */
  MIN_IMAGES_REQUIRED: number | string;
  /** Number of allowed occurrences of the webcam permissions being rejected by the user */
  WEBCAM_REJECTED: number | string;
  /** Number of allowed occurrences of configuration related problems */
  CONFIGURATION_PROBLEM: number | string;
  /** Number of allowed occurrences of no webcam being detected or available */
  NO_WEBCAM: number | string;
  /** Number of allowed occurrences of the webcam being blocked by the user or other software */
  WEBCAM_BLOCKED: number | string;
  /** Number of allowed occurrences of the browser being unsupported */
  UNSUPPORTED_BROWSER: number | string;
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
