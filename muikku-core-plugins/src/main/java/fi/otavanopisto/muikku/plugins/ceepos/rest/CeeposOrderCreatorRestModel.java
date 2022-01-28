package fi.otavanopisto.muikku.plugins.ceepos.rest;

public class CeeposOrderCreatorRestModel {

  public CeeposOrderCreatorRestModel() {
  }

  public CeeposOrderCreatorRestModel(String id, Long userEntityId, String firstName, String lastName, String email) {
    super();
    this.id = id;
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  private String id;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String email;

}
