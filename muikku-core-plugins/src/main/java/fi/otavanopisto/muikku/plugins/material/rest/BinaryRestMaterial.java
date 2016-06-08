package fi.otavanopisto.muikku.plugins.material.rest;

public class BinaryRestMaterial extends RestMaterial {

  public BinaryRestMaterial() {
  }
  
  public BinaryRestMaterial(Long id, String fileId, String title, String contentType, String license) {
    super(id ,title, license);
    this.fileId = fileId;
    this.contentType = contentType;
  }

  public String getFileId() {
    return fileId;
  }

  public void setFileId(String fileId) {
    this.fileId = fileId;
  }
  
  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  private String fileId;
  private String contentType;
}
