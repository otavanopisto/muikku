package fi.otavanopisto.muikku.plugins.notes;

import fi.otavanopisto.muikku.plugins.guider.RecipientListRESTModel;

public class NoteWithRecipientsRestModel {

  public NoteWithRecipientsRestModel() {
    super();
  }

  public NoteWithRecipientsRestModel(Long id, NoteRestModel note, RecipientListRESTModel recipients) {
    super();
    this.id = id;
    this.note = note;
    this.setRecipients(recipients);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public RecipientListRESTModel getRecipients() {
    return recipients;
  }

  public void setRecipients(RecipientListRESTModel recipients) {
    this.recipients = recipients;
  }

  public NoteRestModel getNote() {
    return note;
  }

  public void setNote(NoteRestModel note) {
    this.note = note;
  }

  public NoteReceiverRestModel getNoteReceiver() {
    return noteReceiver;
  }

  public void setNoteReceiver(NoteReceiverRestModel noteReceiver) {
    this.noteReceiver = noteReceiver;
  }

  private Long id;
  private NoteRestModel note;
  private NoteReceiverRestModel noteReceiver;
  private RecipientListRESTModel recipients;
}