package fi.otavanopisto.muikku.plugins.chat.rest;

public class MessageContentRestModel {
  
  public MessageContentRestModel() {
  }
  
  public MessageContentRestModel(String message) {
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
