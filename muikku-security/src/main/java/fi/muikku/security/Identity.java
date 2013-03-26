package fi.muikku.security;

/**
 * Interface for User identity checks. Permission framework will use this for security checks so it 
 * expects implementing bean to be available during runtime. 
 * 
 * @author antti.viljakainen
 */
public interface Identity {

  /**
   * Return true, if there is logged in user at current session
   * 
   * @return
   */
  boolean isLoggedIn();

  /**
   * Return true if user is administrator
   * 
   * @return
   */
  boolean isAdmin();
  
  /**
   * Return true, if current logged user has permission at context
   * 
   * @param permission
   * @param contextReference
   * @return
   */
  boolean hasPermission(String permission, ContextReference contextReference);
}
