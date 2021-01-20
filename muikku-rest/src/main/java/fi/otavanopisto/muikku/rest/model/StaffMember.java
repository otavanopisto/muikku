package fi.otavanopisto.muikku.rest.model;

import java.util.Map;

public class StaffMember {

  public StaffMember() {
  }

  public StaffMember(String id, Long userEntityId, String firstName, String lastName, String email,
      Map<String, String> properties, OrganizationRESTModel organization, String role, boolean hasImage) {
    super();
    this.id = id;
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.properties = properties;
    this.organization = organization;
    this.role = role;
    this.setHasImage(hasImage);
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

  public Map<String, String> getProperties() {
    return properties;
  }

  public void setProperties(Map<String, String> properties) {
    this.properties = properties;
  }

  public OrganizationRESTModel getOrganization() {
    return organization;
  }

  public void setOrganization(OrganizationRESTModel organization) {
    this.organization = organization;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public Boolean getHasImage() {
    return hasImage;
  }

  public void setHasImage(Boolean hasImage) {
    this.hasImage = hasImage;
  }

  private String id;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String email;
  private Map<String, String> properties;
  private OrganizationRESTModel organization;
  private String role;
  private Boolean hasImage;
}
