package fi.muikku.atests;

public class WorkspaceDiscussion {

  public WorkspaceDiscussion() {
  }

  public WorkspaceDiscussion(Long id, String name, Long groupId) {
    super();
    this.id = id;
    this.name = name;
    this.groupId = groupId;
  }

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

  public Long getGroupId() {
    return groupId;
  }

  public void setGroupId(Long groupId) {
    this.groupId = groupId;
  }

  private Long id;
  private String name;
  private Long groupId;
}