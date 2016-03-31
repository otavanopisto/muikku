package fi.otavanopisto.muikku.plugins.schooldatapyramus.webhook;

import com.fasterxml.jackson.databind.JsonNode;

import fi.pyramus.webhooks.WebhookType;

public class PyramusWebhookPayload {
  
  public PyramusWebhookPayload() {
    super();
  }
  
  public String getData() {
    return data.toString();
  }

  public void setData(JsonNode data) {
    this.data = data;
  }
  
  public WebhookType getType() {
    return type;
  }
  
  public void setType(WebhookType type) {
    this.type = type;
  }
  
  private WebhookType type;
  private Object data;
}