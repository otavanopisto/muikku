package fi.muikku.atests;

public class WorkspaceFolder {

  public WorkspaceFolder() {
  }

  public WorkspaceFolder(Long id, Boolean hidden, Long orderNumber, String title, Long parentId) {
    super();
    this.id = id;
    this.hidden = hidden;
    this.orderNumber = orderNumber;
    this.title = title;
    this.parentId = parentId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Boolean getHidden() {
    return hidden;
  }

  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }

  public Long getOrderNumber() {
    return orderNumber;
  }

  public void setOrderNumber(Long orderNumber) {
    this.orderNumber = orderNumber;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  private Long id;
  private Boolean hidden;
  private Long orderNumber;
  private String title;
  private Long parentId;
}