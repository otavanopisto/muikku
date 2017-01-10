package fi.otavanopisto.muikku.atests;

public class Discussion {

  public Discussion() {
  }

  public Discussion(Long id, String name, String description, Long groupId) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
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

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  private Long id;
  private String name;
  private String description;
  private Long groupId;
}