package fi.otavanopisto.muikku.plugins.communicator.model;

public class CommunicatorMessageSearchResult{

  public Long getId() {
    return id;
  }
  
  public String getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(String communicatorMessageId) {
    this.communicatorMessageId = communicatorMessageId;
  }

  public String getCaption() {
    return caption;
  }

  public void setCaption(String caption) {
    this.caption = caption;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getSender() {
    return sender;
  }
  
  public String getReceiver() {
	return receiver;
  }

  public void setSender(String sender) {
    this.sender = sender;
  }

  public void setReceiver(String receiver) {
	this.receiver = receiver;
  }
  
  public void setSenderId(String senderId2) {
	this.senderId = senderId2;
  }
  
  public String getSenderId() {
	return senderId;
  }
  
  private Long id;
  
  private String senderId;

  private String communicatorMessageId;

  private String sender;

  private String caption;

  private String content;
  
  private String receiver;

}
