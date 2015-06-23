package fi.muikku.webhooks;

import fi.muikku.webhooks.data.WebhookPersonData;

public class WebhookPersonArchivePayload extends WebhookPayload<WebhookPersonData> {

  public WebhookPersonArchivePayload(Long personId) {
    super(WebhookType.PERSON_ARCHIVE, new WebhookPersonData(personId));
  }
  
}
