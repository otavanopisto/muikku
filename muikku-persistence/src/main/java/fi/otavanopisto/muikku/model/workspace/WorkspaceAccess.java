package fi.otavanopisto.muikku.model.workspace;

import java.util.EnumSet;

public enum WorkspaceAccess {

  /* Workspace is listed and can be accessed only by workspace staff members and workspace students */
  
  MEMBERS_ONLY,

  /* Workspace is listed and can be accessed only by users that are logged in */
  
  LOGGED_IN,
  
  /* Workspace is listed and can be accessed by anyone */
  
  ANYONE;

  /**
   * EnumSet of WorkspaceAccess' that by default require the user to be logged in.
   */
  public static final EnumSet<WorkspaceAccess> LOGIN_REQUIRED = EnumSet.of(LOGGED_IN, MEMBERS_ONLY);
}
