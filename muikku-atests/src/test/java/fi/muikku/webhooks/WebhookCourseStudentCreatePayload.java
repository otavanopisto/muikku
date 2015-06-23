package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookCourseStudentData;

public class WebhookCourseStudentCreatePayload extends WebhookPayload<WebhookCourseStudentData> {

  public WebhookCourseStudentCreatePayload(Long courseStudentId, Long courseId, Long studentId) {
    super(WebhookType.COURSE_STUDENT_CREATE, new WebhookCourseStudentData(courseStudentId, courseId, studentId));
  }
  
}
