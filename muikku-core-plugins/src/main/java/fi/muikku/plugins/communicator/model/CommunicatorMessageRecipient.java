package fi.muikku.plugins.communicator.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class CommunicatorMessageRecipient {

  public Long getId() {
    return id;
  }
  
  public CommunicatorMessage getCommunicatorMessage() {
    return communicatorMessage;
  }

  public void setCommunicatorMessage(CommunicatorMessage communicatorMessage) {
    this.communicatorMessage = communicatorMessage;
  }

  public Boolean getArchivedByReceiver() {
    return archivedByReceiver;
  }

  public void setArchivedByReceiver(Boolean archivedByReceiver) {
    this.archivedByReceiver = archivedByReceiver;
  }

  public Long getRecipient() {
    return recipient;
  }

  public void setRecipient(Long recipient) {
    this.recipient = recipient;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private CommunicatorMessage communicatorMessage;

  @Column (name = "recipient_id")
  private Long recipient;

  @NotNull
  @Column(nullable = false)
  private Boolean archivedByReceiver = Boolean.FALSE;
}
