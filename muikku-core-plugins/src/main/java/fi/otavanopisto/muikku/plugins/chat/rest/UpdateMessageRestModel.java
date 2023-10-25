package fi.otavanopisto.muikku.plugins.chat.rest;

public class UpdateMessageRestModel {
  
  public UpdateMessageRestModel() {
  }

  public UpdateMessageRestModel(String message) {
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
