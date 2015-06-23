package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookStaffMemberData;

public class WebhookStaffMemberUpdatePayload extends WebhookPayload<WebhookStaffMemberData> {

  public WebhookStaffMemberUpdatePayload(Long staffMemberId) {
    super(WebhookType.STAFF_MEMBER_UPDATE, new WebhookStaffMemberData(staffMemberId));
  }
  
}
