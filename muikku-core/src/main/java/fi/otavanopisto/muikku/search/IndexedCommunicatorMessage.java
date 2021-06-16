package fi.otavanopisto.muikku.search;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;

@Indexable (name = "IndexedCommunicatorMessage")
@JsonIgnoreProperties(ignoreUnknown = true)
public class IndexedCommunicatorMessage {
  
  public String getMessage() {
    return this.message;
  }
  
  public Long getCommunicatorMessageThreadId() {
    return this.communicatorMessageThreadId;
  }
  
  public String getCaption() {
    return this.caption;
  }
  
  public IndexedCommunicatorMessageSender getSender() {
    return this.sender;
  }
  
  public List<IndexedCommunicatorMessageRecipient> getRecipients() {
    return this.recipients;
  }
  
  @IndexId
  public Long getId() {
    return this.id;
  }
  
  public Date getCreated() {
    return this.created;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
  
  public void setCommunicatorMessageThreadId(Long communicatorMessageThreadId) {
    this.communicatorMessageThreadId = communicatorMessageThreadId;
  }
  
  public void setCaption(String caption) {
    this.caption = caption;
  }
  
  public void setSender(IndexedCommunicatorMessageSender sender) {
    this.sender = sender;
  }
  
  public void setRecipients(List<IndexedCommunicatorMessageRecipient> recipientsEntityList) {
    this.recipients = recipientsEntityList;
  }
  
  public void setSearchId(Long searchId) {
    this.id = searchId;
  }
  
  public void setCreated(Date created) {
    this.created = created;
  }
  
  public List<IndexedCommunicatorMessageRecipientGroup> getGroupRecipients() {
    return groupRecipients;
  }

  public void setGroupRecipients(List<IndexedCommunicatorMessageRecipientGroup> groupRecipients) {
    this.groupRecipients = groupRecipients;
  }

  private Long id;
  private Long communicatorMessageThreadId;
  private Date created;
  private String caption;
  private String message;
  private IndexedCommunicatorMessageSender sender;
  private List<IndexedCommunicatorMessageRecipient> recipients = new ArrayList<>();
  private List<IndexedCommunicatorMessageRecipientGroup> groupRecipients = new ArrayList<>();
}
