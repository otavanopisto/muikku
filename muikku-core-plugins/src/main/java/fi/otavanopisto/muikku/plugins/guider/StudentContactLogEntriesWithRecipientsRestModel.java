package fi.otavanopisto.muikku.plugins.guider;

import fi.otavanopisto.muikku.rest.StudentContactLogEntryRestModel;

public class StudentContactLogEntriesWithRecipientsRestModel {

  public StudentContactLogEntriesWithRecipientsRestModel() {
    super();
  }

  public StudentContactLogEntriesWithRecipientsRestModel(Long id, StudentContactLogEntryRestModel contactLogEntry, RecipientListRESTModel recipients) {
    super();
    this.id = id;
    this.setContactLogEntry(contactLogEntry);
    this.setRecipients(recipients);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public StudentContactLogEntryRestModel getContactLogEntry() {
    return contactLogEntry;
  }

  public void setContactLogEntry(StudentContactLogEntryRestModel contactLogEntry) {
    this.contactLogEntry = contactLogEntry;
  }

  public RecipientListRESTModel getRecipients() {
    return recipients;
  }

  public void setRecipients(RecipientListRESTModel recipients) {
    this.recipients = recipients;
  }

  private Long id;
  private StudentContactLogEntryRestModel contactLogEntry;
  private RecipientListRESTModel recipients;
}