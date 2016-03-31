package fi.otavanopisto.muikku.notifier;

import java.util.HashMap;
import java.util.Map;

import fi.otavanopisto.muikku.model.users.UserEntity;

public class NotifierContext {

  public UserEntity getSender() {
    return sender;
  }
  public void setSender(UserEntity sender) {
    this.sender = sender;
  }
  public UserEntity getRecipient() {
    return recipient;
  }
  public void setRecipient(UserEntity recipient) {
    this.recipient = recipient;
  }

  public void setParameter(String name, Object value) {
    this.parameters.put(name, value);
  }
  
  public Object getParameter(String name) {
    return parameters.get(name);
  }
  
  public void setParameters(Map<String, Object> params) {
    if (params != null)
      parameters.putAll(params);
  }
  
  private Map<String, Object> parameters = new HashMap<String, Object>();
  private UserEntity sender;
  private UserEntity recipient;
}
