package fi.otavanopisto.muikku.rest;

import java.time.OffsetDateTime;
import java.util.List;

public class StudentContactLogWithRecipientsRestModel extends StudentContactLogEntryRestModel{

  public StudentContactLogWithRecipientsRestModel() {
    super();
  }

  public StudentContactLogWithRecipientsRestModel(Long id, String text, Long creatorId, String creatorName, OffsetDateTime entryDate, StudentContactLogEntryType type, List<StudentContactLogEntryCommentRestModel> comments, Boolean archived, Boolean hasImage, List<Long> recipients) {
    super();
    this.recipients = recipients;
  }

  public List<Long> getRecipients() {
    return recipients;
  }

  public void setRecipients(List<Long> recipients) {
    this.recipients = recipients;
  }
  private List<Long> recipients;
}