package fi.otavanopisto.muikku.plugins.chat.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity
@Table (
    indexes = {
      @Index ( columnList = "sourceUserEntityId, targetUserEntityId, sent" ),
      @Index ( columnList = "targetRoomId, sent" )
    }
  )
public class ChatMessage {

  public Long getId() {
    return id;
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

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Date getSent() {
    return sent;
  }

  public void setSent(Date sent) {
    this.sent = sent;
  }

  public Date getEdited() {
    return edited;
  }

  public void setEdited(Date edited) {
    this.edited = edited;
  }

  public Long getLastModifierId() {
    return lastModifierId;
  }

  public void setLastModifierId(Long lastModifierId) {
    this.lastModifierId = lastModifierId;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long sourceUserEntityId;

  @Column
  private Long targetUserEntityId;

  @Column
  private Long targetRoomId;

  @NotNull
  @NotEmpty
  @Column(columnDefinition = "mediumtext", nullable = false)
  private String message;

  @NotNull
  @Column(nullable = false)
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date sent;

  @Column
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date edited;

  @Column
  private Long lastModifierId;

  @NotNull
  @Column(nullable = false)
  private Boolean archived;

}
