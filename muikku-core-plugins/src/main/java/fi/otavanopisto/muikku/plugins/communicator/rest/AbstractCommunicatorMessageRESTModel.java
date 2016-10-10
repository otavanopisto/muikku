package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public abstract class AbstractCommunicatorMessageRESTModel {

  public AbstractCommunicatorMessageRESTModel() {
  }
  
  public AbstractCommunicatorMessageRESTModel(Long id, Long communicatorMessageId, Long senderId, String categoryName, String caption, 
      String content, Date created, Set<String> tags) {
    this.id = id;
    this.communicatorMessageId = communicatorMessageId;
    this.senderId = senderId;
    this.categoryName = categoryName;
    this.caption = caption;
    this.content = content;
    this.created = created;
    this.tags = tags;
  }
  
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(Long communicatorMessageId) {
    this.communicatorMessageId = communicatorMessageId;
  }

  public Long getSenderId() {
    return senderId;
  }

  public void setSenderId(Long senderId) {
    this.senderId = senderId;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
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

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Set<String> getTags() {
    return tags;
  }

  public void setTags(Set<String> tags) {
    this.tags = tags;
  }

  private Long id;

  private Long communicatorMessageId;

  private Long senderId;
  
  private String categoryName;
  
  private String caption;

  private String content;

  private Date created;
  
  private Set<String> tags = new HashSet<String>();
}
