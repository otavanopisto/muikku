package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookCourseStaffMemberData;

public class WebhookCourseStaffMemberDeletePayload extends WebhookPayload<WebhookCourseStaffMemberData> {

  public WebhookCourseStaffMemberDeletePayload(Long courseStaffMemberId, Long courseId, Long staffMemberId) {
    super(WebhookType.COURSE_STAFF_MEMBER_DELETE, new WebhookCourseStaffMemberData(courseStaffMemberId, courseId, staffMemberId));
  }
  
}
