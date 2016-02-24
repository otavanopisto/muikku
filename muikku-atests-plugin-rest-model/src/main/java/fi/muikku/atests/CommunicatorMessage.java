package fi.muikku.atests;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

public class CommunicatorMessage {
  public CommunicatorMessage() {
  }
  
  public CommunicatorMessage(Long id, Long communicatorMessageId, Long senderId, String categoryName, String caption, String content, Date created,
    Set<String> tags, List<Long> recipientIds, List<Long> recipientGroupIds, List<Long> recipientStudentsWorkspaceIds, List<Long> recipientTeachersWorkspaceIds) {
    super();
    this.id = id;
    this.communicatorMessageId = communicatorMessageId;
    this.senderId = senderId;
    this.categoryName = categoryName;
    this.caption = caption;
    this.content = content;
    this.created = created;
    this.tags = tags;
    this.recipientIds = recipientIds;
    this.recipientGroupIds = recipientGroupIds;
    this.recipientStudentsWorkspaceIds = recipientStudentsWorkspaceIds;
    this.recipientTeachersWorkspaceIds = recipientTeachersWorkspaceIds;
  }

  public List<Long> getRecipientGroupIds() {
    return recipientGroupIds;
  }

  public void setRecipientGroupIds(List<Long> recipientGroupIds) {
    this.recipientGroupIds = recipientGroupIds;
  }

  public List<Long> getRecipientStudentsWorkspaceIds() {
    return recipientStudentsWorkspaceIds;
  }

  public void setRecipientStudentsWorkspaceIds(List<Long> recipientStudentsWorkspaceIds) {
    this.recipientStudentsWorkspaceIds = recipientStudentsWorkspaceIds;
  }

  public List<Long> getRecipientTeachersWorkspaceIds() {
    return recipientTeachersWorkspaceIds;
  }

  public void setRecipientTeachersWorkspaceIds(List<Long> recipientTeachersWorkspaceIds) {
    this.recipientTeachersWorkspaceIds = recipientTeachersWorkspaceIds;
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

  public List<Long> getRecipientIds() {
    return recipientIds;
  }

  public void setRecipientIds(List<Long> recipientIds) {
    this.recipientIds = recipientIds;
  }

  private Long id;
  private Long communicatorMessageId;
  private Long senderId;
  private String categoryName;
  private String caption;
  private String content;
  private Date created;
  private Set<String> tags;
  private List<Long> recipientIds;
  private List<Long> recipientGroupIds = new ArrayList<Long>();
  private List<Long> recipientStudentsWorkspaceIds = new ArrayList<Long>();
  private List<Long> recipientTeachersWorkspaceIds = new ArrayList<Long>();
}
