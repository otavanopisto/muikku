package fi.otavanopisto.muikku.plugins.communicator.model;

import java.util.Date;
import java.util.List;
import java.util.Set;

public class CommunicatorMessageSearchResult<IndexedCommunicatorMessageRecipient, IndexedCommunicatorMessageSender>{

  public Long getId() {
    return id;
  }
  
  public Long getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(Long communicatorMessageId) {
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
  
  public void setSenderId(Long senderId) {
	this.senderId = senderId;
  }
  
  public Long getSenderId() {
	return senderId;
  }
  
  public void setCreated(String created) {
	this.created = created;
  }
  
  public String getCreated() {
	return created;
  }
  
  public void setTags(Set<Long> tags) {
	this.tags = tags;
  }
  
  public Set<Long> getTags(){
	return tags;
  }
  
  public List<CommunicatorMessageIdLabel> getLabels(){
	return labels;
  }
  
  public void setLabels(List<CommunicatorMessageIdLabel> labels) {
	this.labels = labels;
  }
  
  
  private Long id;
  
  private Long senderId;

  private Long communicatorMessageId;

  private IndexedCommunicatorMessageSender sender;

  private String caption;

  private String content;
  
  private List<IndexedCommunicatorMessageRecipient> receiver;
  
  private String created;
  
  private Set<Long> tags;
  
  private List<CommunicatorMessageIdLabel> labels;

}
