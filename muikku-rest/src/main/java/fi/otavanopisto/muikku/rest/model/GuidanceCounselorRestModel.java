package fi.otavanopisto.muikku.rest.model;

import java.util.Map;

public class GuidanceCounselorRestModel {

  public GuidanceCounselorRestModel() {
  }

  public GuidanceCounselorRestModel(String id, Long userEntityId, String firstName, String lastName, String email,
      Map<String, String> properties, boolean hasImage, boolean groupAdvisor, boolean studyAdvisor) {
    super();
    this.id = id;
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.properties = properties;
    this.hasImage = hasImage;
    this.groupAdvisor = groupAdvisor;
    this.studyAdvisor = studyAdvisor;
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

  public boolean getHasImage() {
    return hasImage;
  }

  public void setHasImage(boolean hasImage) {
    this.hasImage = hasImage;
  }

  public boolean isGroupAdvisor() {
    return groupAdvisor;
  }

  public void setGroupAdvisor(boolean groupAdvisor) {
    this.groupAdvisor = groupAdvisor;
  }

  public boolean isStudyAdvisor() {
    return studyAdvisor;
  }

  public void setStudyAdvisor(boolean studyAdvisor) {
    this.studyAdvisor = studyAdvisor;
  }

  private String id;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String email;
  private Map<String, String> properties;
  private boolean hasImage;
  private boolean groupAdvisor;
  private boolean studyAdvisor;
}
