package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookCourseData;

public class WebhookCourseArchivePayload extends WebhookPayload<WebhookCourseData> {

  public WebhookCourseArchivePayload(Long courseId) {
    super(WebhookType.COURSE_ARCHIVE, new WebhookCourseData(courseId));
  }
  
}
