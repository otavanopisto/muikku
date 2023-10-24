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
  
  public Long getTargetUserEntityId() {
    return targetUserEntityId;
  }
  
  public void setTargetUserEntityId(Long targetUserEntityId) {
    this.targetUserEntityId = targetUserEntityId;
  }
  
  public Long getTargetRoomId() {
    return targetRoomId;
  }
  
  public void setTargetRoomId(Long targetRoomId) {
    this.targetRoomId = targetRoomId;
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
  
  private Long id;
  private Long sourceUserEntityId;
  private Long targetUserEntityId;
  private Long targetRoomId;
  private String nick;
  private String message;
  private Date sentDateTime;
  private Date editedDateTime;
  private Boolean archived;

}
