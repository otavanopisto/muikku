package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookStudentData;

public class WebhookStudentUpdatePayload extends WebhookPayload<WebhookStudentData> {

  public WebhookStudentUpdatePayload(Long studentId) {
    super(WebhookType.STUDENT_UPDATE, new WebhookStudentData(studentId));
  }
  
}
