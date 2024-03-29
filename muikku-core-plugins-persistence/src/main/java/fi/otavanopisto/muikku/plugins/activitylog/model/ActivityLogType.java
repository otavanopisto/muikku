package fi.otavanopisto.muikku.plugins.activitylog.model;

public enum ActivityLogType {
  EVALUATION_REQUESTED,
  EVALUATION_GOTINCOMPLETED,
  EVALUATION_GOTFAILED,
  EVALUATION_GOTPASSED,
  SESSION_LOGGEDIN,
  WORKSPACE_VISIT,
  MATERIAL_EXERCISEDONE,
  MATERIAL_ASSIGNMENTDONE,
  FORUM_NEWMESSAGE,
  FORUM_NEWTHREAD,
  NOTIFICATION_ASSESMENTREQUEST,
  NOTIFICATION_NOPASSEDCOURSES,
  NOTIFICATION_SUPPLEMENTATIONREQUEST,
  NOTIFICATION_STUDYTIME,
  NOTIFICATION_NEVERLOGGEDIN,
  NOTIFICATION_NOLOGGEDINFORTWOMONTHS,
  EVALUATION_REQUEST_CANCELLED
}
