package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookStudentData;

public class WebhookStudentCreatePayload extends WebhookPayload<WebhookStudentData> {

  public WebhookStudentCreatePayload(Long studentId) {
    super(WebhookType.STUDENT_CREATE, new WebhookStudentData(studentId));
  }
  
}
