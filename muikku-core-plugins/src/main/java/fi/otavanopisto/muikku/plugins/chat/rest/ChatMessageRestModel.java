package fi.otavanopisto.muikku.plugins.chat.rest;

import java.util.Date;

public class ChatMessageRestModel {

  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }
  
  public Long getSourceUserEntityId() {
    return sourceUserEntityId;
  }
  
  public void setSourceUserEntityId(Long sourceUserEntityId) {
    this.sourceUserEntityId = sourceUserEntityId;
  }
  
  public String getNick() {
    return nick;
  }
  
  public void setNick(String nick) {
    this.nick = nick;
  }
  
  public String getMessage() {
    return message;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
  
  public Date getSentDateTime() {
    return sentDateTime;
  }
  
  public void setSentDateTime(Date sentDateTime) {
    this.sentDateTime = sentDateTime;
  }
  
  public Date getEditedDateTime() {
    return editedDateTime;
  }
  
  public void setEditedDateTime(Date editedDateTime) {
    this.editedDateTime = editedDateTime;
  }
  
  public Boolean getArchived() {
    return archived;
  }
  
  public void setArchived(Boolean archived) {
    this.archived = archived;
  }
  
  public String getTargetIdentifier() {
    return targetIdentifier;
  }

  public void setTargetIdentifier(String targetIdentifier) {
    this.targetIdentifier = targetIdentifier;
  }

  public Boolean getHasImage() {
    return hasImage;
  }

  public void setHasImage(Boolean hasImage) {
    this.hasImage = hasImage;
  }

  public ChatUserType getUserType() {
    return userType;
  }

  public void setUserType(ChatUserType userType) {
    this.userType = userType;
  }

  private Long id;
  private Long sourceUserEntityId;
  private String targetIdentifier;
  private String nick;
  private Boolean hasImage;
  private String message;
  private ChatUserType userType;
  private Date sentDateTime;
  private Date editedDateTime;
  private Boolean archived;

}
