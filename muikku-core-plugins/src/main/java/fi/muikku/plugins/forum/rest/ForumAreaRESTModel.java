package fi.muikku.plugins.forum.rest;


public class ForumAreaRESTModel {

  public ForumAreaRESTModel() {
    
  }
  
  public ForumAreaRESTModel(Long id, String name, String group) {
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

  public String getGroup() {
    return group;
  }

  public void setGroup(String group) {
    this.group = group;
  }

  private Long id;

  private String name;
  private String group;
}
