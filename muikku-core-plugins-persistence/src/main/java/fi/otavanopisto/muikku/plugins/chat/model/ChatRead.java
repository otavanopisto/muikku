package fi.otavanopisto.muikku.plugins.chat.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity
@Table (
    indexes = {
      @Index ( columnList = "sourceUserEntityId, targetIdentifier" )
    }
  )
public class ChatRead {

  public Long getId() {
    return id;
  }

  public Long getSourceUserEntityId() {
    return sourceUserEntityId;
  }

  public void setSourceUserEntityId(Long sourceUserEntityId) {
    this.sourceUserEntityId = sourceUserEntityId;
  }

  public Date getLastRead() {
    return lastRead;
  }

  public void setLastRead(Date lastRead) {
    this.lastRead = lastRead;
  }

  public String getTargetIdentifier() {
    return targetIdentifier;
  }

  public void setTargetIdentifier(String targetIdentifier) {
    this.targetIdentifier = targetIdentifier;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column(nullable = false)
  private Long sourceUserEntityId;

  @NotNull
  @NotEmpty
  @Column(nullable = false)
  private String targetIdentifier;
  
  @NotNull
  @Column(nullable = false)
  private Date lastRead;

}
