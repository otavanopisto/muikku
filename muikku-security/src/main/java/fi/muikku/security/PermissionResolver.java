package fi.muikku.security;

public interface PermissionResolver {

  /**
   * Return true, if this PermissionResolver can handle given permission
   * 
   * @return
   */
  boolean handlesPermission(String permission);

  /**
   * Return true, if user has permission to resource. Note that this method must handle possible public (everyone) access also.
   *  
   * @param user
   * @param resource
   * @param permission
   * @return
   */
  boolean hasPermission(String permission, ContextReference contextReference, User user);
  
  /**
   * Return true, if public access to resource is allowed with permission. Used for unauthenticated users.
   * 
   * @param resource
   * @param permission
   * @return
   */
  boolean hasEveryonePermission(String permission, ContextReference contextReference);
}
