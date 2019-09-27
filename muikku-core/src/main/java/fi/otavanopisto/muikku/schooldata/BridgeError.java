package fi.otavanopisto.muikku.schooldata;

public class BridgeError {

  public BridgeError() {
  }

  public BridgeError(String message) {
    this.message = message;
  }
  
  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  private String message;

}
