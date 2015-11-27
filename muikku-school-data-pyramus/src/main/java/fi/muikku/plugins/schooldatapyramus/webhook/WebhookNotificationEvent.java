package fi.muikku.plugins.schooldatapyramus.webhook;

import fi.pyramus.webhooks.WebhookType;

public class WebhookNotificationEvent {
  
  public WebhookNotificationEvent(WebhookType type, String data) {
    this.type = type;
    this.data = data;
  }
  
  public WebhookType getType() {
    return type;
  }
  
  public String getData() {
    return data;
  }
  
  private WebhookType type;
  private String data;
}
