package fi.otavanopisto.muikku.model.workspace;

public enum WorkspaceAccess {

  /* Workspace is listed and can be accessed only by workspace staff members and workspace students */
  
  MEMBERS_ONLY,

  /* Workspace is listed and can be accessed only by users that are logged in */
  
  LOGGED_IN,
  
  /* Workspace is listed and can be accessed by anyone */
  
  ANYONE
  
}
