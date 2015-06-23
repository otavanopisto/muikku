package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookPersonData;

public class WebhookPersonUpdatePayload extends WebhookPayload<WebhookPersonData> {

  public WebhookPersonUpdatePayload(Long personId) {
    super(WebhookType.PERSON_UPDATE, new WebhookPersonData(personId));
  }
  
}
