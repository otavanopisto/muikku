package fi.otavanopisto.muikku.atests;

public class WorkspaceDiscussionGroup {

  public WorkspaceDiscussionGroup() {
  }

  public WorkspaceDiscussionGroup(Long id, String name) {
    super();
    this.id = id;
    this.name = name;
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

  private Long id;
  private String name;
}