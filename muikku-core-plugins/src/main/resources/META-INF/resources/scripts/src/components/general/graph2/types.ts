/**
 * These are the graph points note how they are not in a 1->1 relationship
 * with the data, as they have been defined so
 */
export enum Graph {
  SESSION_LOGGEDIN = "logins",
  MATERIAL_ASSIGNMENTDONE = "assignments",
  MATERIAL_EXERCISEDONE = "exercises",
  WORKSPACE_VISIT = "visits",
  FORUM_NEWMESSAGE = "discussionMessages",
  EVALUATION_REQUESTED = "evaluationRequest",
  EVALUATION_PASSED = "passed",
  EVALUATION_FAILED = "failed",
  EVALUATION_INCOMPLETED = "incomplete",
}

export enum GraphFilterEnum {
  SESSION_LOGGEDIN = "SESSION_LOGGEDIN",
  MATERIAL_ASSIGNMENTDONE = "MATERIAL_ASSIGNMENTDONE",
  MATERIAL_EXERCISEDONE = "MATERIAL_EXERCISEDONE",
  WORKSPACE_VISIT = "WORKSPACE_VISIT",
  FORUM_NEWMESSAGE = "FORUM_NEWMESSAGE",
  EVALUATION_REQUESTED = "EVALUATION_REQUESTED",
  EVALUATION_PASSED = "EVALUATION_GOTPASSED",
  EVALUATION_FAILED = "EVALUATION_GOTFAILED",
  EVALUATION_INCOMPLETED = "EVALUATION_GOTINCOMPLETED",
}

/**
 * This information comes from the api endpoint and contains
 * those properties, any changes to this data will be related
 * to the endpoint
 */
export interface MainChartData {
  EVALUATION_REQUESTED?: number;
  EVALUATION_GOTINCOMPLETED?: number;
  EVALUATION_GOTFAILED?: number;
  EVALUATION_GOTPASSED?: number;
  SESSION_LOGGEDIN?: number;
  WORKSPACE_VISIT?: number;
  MATERIAL_EXERCISEDONE?: number;
  MATERIAL_ASSIGNMENTDONE?: number;
  FORUM_NEWMESSAGE?: number;
  NOTIFICATION_ASSESMENTREQUEST?: number;
  NOTIFICATION_NOPASSEDCOURSES?: number;
  NOTIFICATION_SUPPLEMENTATIONREQUEST?: number;
  NOTIFICATION_STUDYTIME?: number;
}
