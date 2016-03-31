package fi.otavanopisto.muikku.plugins.workspace.fieldio;

public class WorkspaceFieldIOException extends Exception {

  private static final long serialVersionUID = 3203737688604862317L;

  public WorkspaceFieldIOException(String message) {
    super(message);
  }
  
  public WorkspaceFieldIOException(String message, Throwable cause) {
    super(message, cause);
  }
  
}
