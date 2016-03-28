package fi.otavanopisto.muikku.plugins.material.rest;

public class BinaryRestMaterial {

  public BinaryRestMaterial() {
  }
  
  public BinaryRestMaterial(Long id, String fileId, String title, String contentType) {
    super();
    this.id = id;
    this.fileId = fileId;
    this.title = title;
    this.contentType = contentType;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFileId() {
    return fileId;
  }

  public void setFileId(String fileId) {
    this.fileId = fileId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  private Long id;
  private String fileId;
  private String title;
  private String contentType;
}
