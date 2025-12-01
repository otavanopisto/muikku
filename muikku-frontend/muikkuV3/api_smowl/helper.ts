/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jose from "jose";
import { SMOWL_JWT_SECRET } from "~/api_smowl/const";

export const MONITORING_ENDPOINT = "https://swl.smowltech.net/monitor/";
export const REGISTRATION_ENDPOINT = "https://swl.smowltech.net/register/";
const ISSUER = "smowl_custom_integration";
const AUDIENCE = "muikkuverkko.fi";
const JWT_SECRET = SMOWL_JWT_SECRET;

/**
 * Parameters for the monitoring JWT token
 */
interface MonitorringJwtParams {
  entityKey: string;
  userId: string;
  /**
   * The type of activity, e.g.: "quiz", "course", "test"...
   */
  activityType: string;
  activityId: string;
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
  entityName: string;
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
  entityKey: string;
  userId: string;
  /**
   * The type of activity, e.g.: "quiz", "course", "test"...
   */
  activityType?: string;
  activityId?: string;
  activityContainerId?: string;
}

/**
 * Parameters for the registration get parameters
 */
interface RegistrationGetParams {
  entityName: string;
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
  activityUrl: string;
}

/**
 * Formats a link with a JWT token and additional parameters
 * @param endpoint - The base URL for the endpoint
 * @param jwtParams - The parameters for the JWT token
 * @param getParams - The additional parameters for the link
 * @returns The formatted link
 */
export const formLink = async (
  endpoint: string,
  jwtParams: Record<string, any>,
  getParams: Record<string, any>
) => {
  const controllerUrl = new URL(endpoint);
  const secret = new TextEncoder().encode(JWT_SECRET);
  const jwt = await new jose.SignJWT({ data: jwtParams })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
  controllerUrl.searchParams.append("token", jwt);

  for (const key in getParams) {
    controllerUrl.searchParams.append(key, getParams[key]);
  }

  return controllerUrl.href;
};

/**
 * Generates the monitoring link. Used with monitoring iframe.
 * @param jwtParams - The parameters for the JWT token
 * @param getParams - The additional parameters for the link
 * @returns The monitoring link
 */
export const generateMonitoringLink = async (
  jwtParams: MonitorringJwtParams,
  getParams: MonitoringGetParams
) => formLink(MONITORING_ENDPOINT, jwtParams, getParams);

/**
 * Generates the registration link
 * @param jwtParams - The parameters for the JWT token
 * @param getParams - The additional parameters for the link
 * @returns The registration link
 */
export const generateRegistrationLink = async (
  jwtParams: RegistrationJwtParams,
  getParams: RegistrationGetParams
) => formLink(REGISTRATION_ENDPOINT, jwtParams, getParams);
