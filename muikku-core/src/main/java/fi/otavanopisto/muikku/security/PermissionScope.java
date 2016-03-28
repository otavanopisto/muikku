package fi.otavanopisto.muikku.security;

public class PermissionScope {
  
  public static final String PERSONAL = "PERSONAL";         // Accessible only by the person himself as logged user
  public static final String USERGROUP = "USERGROUP";
  public static final String ENVIRONMENT = "ENVIRONMENT";
  public static final String WORKSPACE = "WORKSPACE";
  public static final String RESOURCE = "RESOURCE";
}
