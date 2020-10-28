package fi.otavanopisto.muikku.plugins.communicator.model;

import java.util.Date;
import java.util.List;
import java.util.Set;

public class CommunicatorMessageSearchResult<IndexedCommunicatorMessageRecipient, IndexedCommunicatorMessageSender>{

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

  public IndexedCommunicatorMessageSender getSender() {
    return sender;
  }
  
  public List<IndexedCommunicatorMessageRecipient> getReceiver() {
	return receiver;
  }

  public void setSender(IndexedCommunicatorMessageSender sender) {
    this.sender = sender;
  }

  public void setReceiver(List<IndexedCommunicatorMessageRecipient> receiver) {
	this.receiver = receiver;
  }
  
  public void setSenderId(String senderId) {
	this.senderId = senderId;
  }
  
  public String getSenderId() {
	return senderId;
  }
  
  public void setCreated(String created) {
	this.created = created;
  }
  
  public String getCreated() {
	return created;
  }
  
  public void setTags(String tags) {
	this.tags = tags;
  }
  
  public String getTags(){
	return tags;
  }
  
  
  private Long id;
  
  private String senderId;

  private String communicatorMessageId;

  private IndexedCommunicatorMessageSender sender;

  private String caption;

  private String content;
  
  private List<IndexedCommunicatorMessageRecipient> receiver;
  
  private String created;
  
  private String tags;

}
