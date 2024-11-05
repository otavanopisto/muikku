package fi.otavanopisto.muikku.plugins.notes.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class NoteReceiver {


  public Long getId() {
    return id;
  }
  
  public Note getNote() {
    return note;
  }

  public void setNote(Note note) {
    this.note = note;
  }

  public Long getRecipient() {
    return recipient;
  }

  public void setRecipient(Long recipient) {
    this.recipient = recipient;
  }

  public Boolean getPinned() {
    return pinned;
  }

  public void setPinned(Boolean pinned) {
    this.pinned = pinned;
  }
  
  public NoteStatus getStatus() {
    return status;
  }
  
  public void setStatus(NoteStatus status) {
    this.status = status;
  }

  public Long getRecipientGroup() {
    return recipientGroup_id;
  }

  public void setRecipientGroup(Long recipientGroup_id) {
    this.recipientGroup_id = recipientGroup_id;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private Note note;

  @Column (nullable=false)
  private Boolean pinned;
  
  @NotNull
  @Column (nullable=false)
  private Long recipient;
  
  @NotNull
  @Column (nullable=false)
  @Enumerated (EnumType.STRING)
  private NoteStatus status;

  @Column
  private Long recipientGroup_id;
}