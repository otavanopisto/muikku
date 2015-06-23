package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookStudentData;

public class WebhookStudentArchivePayload extends WebhookPayload<WebhookStudentData> {

  public WebhookStudentArchivePayload(Long studentId) {
    super(WebhookType.STUDENT_ARCHIVE, new WebhookStudentData(studentId));
  }
  
}
