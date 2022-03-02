package fi.otavanopisto.muikku.rest.model;

public class UserEntityProperty {

  public UserEntityProperty() {
  }

  public UserEntityProperty(String key, String value) {
    this.setKey(key);
    this.setValue(value);
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  private String key;
  private String value;
  private Long userEntityId;

}
