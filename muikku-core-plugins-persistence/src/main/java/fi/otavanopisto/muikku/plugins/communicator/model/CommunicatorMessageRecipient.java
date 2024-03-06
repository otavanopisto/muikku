package fi.otavanopisto.muikku.plugins.communicator.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.security.ContextReference;

@Entity
@Table (
    indexes = {
        // Index for automated trash folder archive task
        @Index ( columnList = "archivedByReceiver, trashedByReceiver, trashedByReceiverTimestamp" ),
    }
)
public class CommunicatorMessageRecipient implements ContextReference {

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

  public Boolean getReadByReceiver() {
    return readByReceiver;
  }

  public void setReadByReceiver(Boolean readByReceiver) {
    this.readByReceiver = readByReceiver;
  }

  public Boolean getTrashedByReceiver() {
    return trashedByReceiver;
  }

  public void setTrashedByReceiver(Boolean trashedByReceiver) {
    this.trashedByReceiver = trashedByReceiver;
  }

  public CommunicatorMessageRecipientGroup getRecipientGroup() {
    return recipientGroup;
  }

  public void setRecipientGroup(CommunicatorMessageRecipientGroup recipientGroup) {
    this.recipientGroup = recipientGroup;
  }

  public Date getTrashedByReceiverTimestamp() {
    return trashedByReceiverTimestamp;
  }

  public void setTrashedByReceiverTimestamp(Date trashedByReceiverTimestamp) {
    this.trashedByReceiverTimestamp = trashedByReceiverTimestamp;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private CommunicatorMessage communicatorMessage;

  @Column (name = "recipient_id")
  private Long recipient;

  @ManyToOne
  private CommunicatorMessageRecipientGroup recipientGroup;
  
  @NotNull
  @Column(nullable = false)
  private Boolean readByReceiver;

  @NotNull
  @Column(nullable = false)
  private Boolean trashedByReceiver;

  @Column
  @Temporal (value = TemporalType.TIMESTAMP)
  private Date trashedByReceiverTimestamp;

  @NotNull
  @Column(nullable = false)
  private Boolean archivedByReceiver;
}
