/* eslint-disable @typescript-eslint/no-explicit-any */
export const MONITORING_ENDPOINT = "https://swl.smowltech.net/monitor/";
export const REGISTRATION_ENDPOINT = "https://swl.smowltech.net/register/";

/**
 * Parameters for the monitoring JWT token
 */
interface MonitoringJwtParamsV2 {
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
interface MonitoringGetParamsV2 {
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
interface RegistrationJwtParamsV2 {
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
interface RegistrationGetParamsV2 {
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
  jwtParams: RegistrationJwtParamsV2,
  getParams: RegistrationGetParamsV2
) => formLinkWithJwt(REGISTRATION_ENDPOINT, jwtParams, getParams);

/**
 * Generates the monitoring link with a JWT token
 * @param jwtParams - The parameters for the JWT token
 * @param getParams - The additional parameters for the link
 * @returns The monitoring link
 */
export const generateMonitoringLinkWithJwt = async (
  jwtParams: MonitoringJwtParamsV2,
  getParams: MonitoringGetParamsV2
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
async function getSmowlApiAccountInfo(): Promise<SmowlApiAccountInfoResponse> {
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

export { getSmowlApiAccountInfo };
