package fi.otavanopisto.muikku.plugins.user.rest;

import fi.otavanopisto.muikku.model.users.UserEntityFileVisibility;

public class RestUserEntityFile {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public String getFileId() {
    return fileId;
  }

  public void setFileId(String fileId) {
    this.fileId = fileId;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public UserEntityFileVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(UserEntityFileVisibility visibility) {
    this.visibility = visibility;
  }

  public String getBase64Data() {
    return base64Data;
  }

  public void setBase64Data(String base64Data) {
    this.base64Data = base64Data;
  }

  private Long id;
  private String name;
  private String contentType;
  private String fileId;
  private String base64Data;
  private String identifier;
  private Long userEntityId;
  private UserEntityFileVisibility visibility;

}
