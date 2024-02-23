package fi.otavanopisto.muikku.plugins.chat.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table (
    uniqueConstraints = {
      @UniqueConstraint( columnNames = {"sourceUserEntityId", "targetUserEntityId"} )
    }
  )
public class ChatClosedConvo {

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

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column(nullable = false)
  private Long sourceUserEntityId;

  @NotNull
  @Column(nullable = false)
  private Long targetUserEntityId;

}
