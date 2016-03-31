package fi.otavanopisto.muikku.atests;

public class WorkspaceHtmlMaterial {

  public WorkspaceHtmlMaterial() {
  }

  public WorkspaceHtmlMaterial(Long id, Long parentId, String title, String contentType, String html,
      Long revisionNumber, String assignmentType) {
    super();
    this.id = id;
    this.parentId = parentId;
    this.title = title;
    this.contentType = contentType;
    this.html = html;
    this.revisionNumber = revisionNumber;
    this.assignmentType = assignmentType;
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

  public Long getRevisionNumber() {
    return revisionNumber;
  }

  public void setRevisionNumber(Long revisionNumber) {
    this.revisionNumber = revisionNumber;
  }

  public String getAssignmentType() {
    return assignmentType;
  }

  public void setAssignmentType(String assignmentType) {
    this.assignmentType = assignmentType;
  }

  private Long id;
  private Long parentId;
  private String title;
  private String contentType;
  private String html;
  private Long revisionNumber;
  private String assignmentType;
}