package fi.muikku.security;

import java.util.List;


public interface PermissionCollection {
  /**
   * Lists permissions provided by this collection
   * 
   * @return list
   */
  List<String> listPermissions();
  
  /**
   * Return true if permission is part of this collection
   * 
   * @param permission
   * @return
   */
  boolean containsPermission(String permission);
  
  /**
   * Return scope of supplied permission
   * 
   * @param permission
   * @return
   * @throws NoSuchFieldException when permission is not part of this collection
   */
  String getPermissionScope(String permission) throws NoSuchFieldException;
}
