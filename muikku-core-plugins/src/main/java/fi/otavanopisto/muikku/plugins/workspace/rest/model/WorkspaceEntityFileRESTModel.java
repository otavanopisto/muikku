package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceEntityFileRESTModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public String getTempFileId() {
    return tempFileId;
  }

  public void setTempFileId(String tempFileId) {
    this.tempFileId = tempFileId;
  }

  public String getFileIdentifier() {
    return fileIdentifier;
  }

  public void setFileIdentifier(String fileIdentifier) {
    this.fileIdentifier = fileIdentifier;
  }

  public String getBase64Data() {
    return base64Data;
  }

  public void setBase64Data(String base64Data) {
    this.base64Data = base64Data;
  }

  private Long id;
  private String fileIdentifier;
  private String tempFileId;
  private String contentType;
  private Long workspaceEntityId;
  private String base64Data;
}
