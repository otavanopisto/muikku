package fi.otavanopisto.muikku.plugins.guider;

import fi.otavanopisto.muikku.plugins.communicator.rest.CommunicatorNewMessageRESTModel;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryRestModel;

public class StudentContactLogEntriesWithRecipientsRestModel {

  public StudentContactLogEntriesWithRecipientsRestModel() {
    super();
  }

  public StudentContactLogEntriesWithRecipientsRestModel(Long id, StudentContactLogEntryRestModel contactLogEntry, CommunicatorNewMessageRESTModel recipients) {
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

  public CommunicatorNewMessageRESTModel getRecipients() {
    return recipients;
  }

  public void setRecipients(CommunicatorNewMessageRESTModel recipients) {
    this.recipients = recipients;
  }

  private Long id;
  private StudentContactLogEntryRestModel contactLogEntry;
  private CommunicatorNewMessageRESTModel recipients;
}