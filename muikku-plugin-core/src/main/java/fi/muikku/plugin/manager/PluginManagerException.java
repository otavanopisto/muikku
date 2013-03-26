package fi.muikku.plugin.manager;

/** 
 * General PluginManager exception
 */
public class PluginManagerException extends Exception {

  private static final long serialVersionUID = -5174694440768819025L;

  public PluginManagerException(Exception e) {
    super(e);
  }
  
  public PluginManagerException(String message) {
    super(message);
  }
  
  public PluginManagerException(Exception e, String message) {
    super(message, e);
  }
  
}
