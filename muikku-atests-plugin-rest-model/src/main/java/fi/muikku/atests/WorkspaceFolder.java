package fi.muikku.atests;

public class WorkspaceFolder {

  public WorkspaceFolder() {
  }

  public WorkspaceFolder(Long id, Boolean hidden, Integer orderNumber, String urlName, String title, Long parentId) {
    super();
    this.id = id;
    this.hidden = hidden;
    this.orderNumber = orderNumber;
    this.urlName = urlName;
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

  public Integer getOrderNumber() {
    return orderNumber;
  }

  public void setOrderNumber(Integer orderNumber) {
    this.orderNumber = orderNumber;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
  
  public String getUrlName() {
    return urlName;
  }
  
  public void setUrlName(String urlName) {
    this.urlName = urlName;
  }

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  private Long id;
  private Boolean hidden;
  private Integer orderNumber;
  private String title;
  private String urlName;
  private Long parentId;
}