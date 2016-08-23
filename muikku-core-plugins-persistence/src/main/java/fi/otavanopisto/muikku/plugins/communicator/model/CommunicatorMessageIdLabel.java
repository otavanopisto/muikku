package fi.otavanopisto.muikku.plugins.communicator.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.otavanopisto.security.ContextReference;

@Entity
public class CommunicatorMessageIdLabel implements ContextReference {

  public Long getId() {
    return id;
  }

  public Long getUserEntity() {
    return userEntity;
  }

  public void setUserEntity(Long userEntity) {
    this.userEntity = userEntity;
  }

  public CommunicatorMessageId getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(CommunicatorMessageId communicatorMessageId) {
    this.communicatorMessageId = communicatorMessageId;
  }

  public CommunicatorLabel getLabel() {
    return label;
  }

  public void setLabel(CommunicatorLabel label) {
    this.label = label;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (name = "userEntity_id")
  private Long userEntity;

  @ManyToOne
  private CommunicatorMessageId communicatorMessageId;
  
  @ManyToOne
  private CommunicatorLabel label;
}
