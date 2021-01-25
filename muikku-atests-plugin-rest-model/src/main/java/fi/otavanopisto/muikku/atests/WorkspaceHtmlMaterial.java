package fi.otavanopisto.muikku.atests;

public class WorkspaceHtmlMaterial {

  public WorkspaceHtmlMaterial() {
  }

  public WorkspaceHtmlMaterial(Long id, Long parentId, String title, String contentType, String html,
      String assignmentType, String license) {
    super();
    this.id = id;
    this.parentId = parentId;
    this.title = title;
    this.contentType = contentType;
    this.html = html;
    this.assignmentType = assignmentType;
    this.license = license;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public Long getParentId() {
    return parentId;
  }
  
  public void setParentId(Long parentId) {
    this.parentId = parentId;
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

  public String getHtml() {
    return html;
  }

  public void setHtml(String html) {
    this.html = html;
  }

  public String getAssignmentType() {
    return assignmentType;
  }

  public void setAssignmentType(String assignmentType) {
    this.assignmentType = assignmentType;
  }
  
  public String getLicense() {
    return license;
  }
  
  public void setLicense(String license) {
    this.license = license;
  }

  private Long id;
  private Long parentId;
  private String title;
  private String contentType;
  private String html;
   private String assignmentType;
  private String license;
}