package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookCourseData;

public class WebhookCourseCreatePayload extends WebhookPayload<WebhookCourseData> {

  public WebhookCourseCreatePayload(Long courseId) {
    super(WebhookType.COURSE_CREATE, new WebhookCourseData(courseId));
  }
  
}
