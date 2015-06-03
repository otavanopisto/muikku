package fi.muikku.rest.model;

public class UserGroupRESTModel {
  
  public UserGroupRESTModel(Long id, String name) {
    this.id = id;
    this.name = name;
  }
  
  public UserGroupRESTModel(fi.muikku.model.users.UserGroup domainModel) {
    this(domainModel.getId(), domainModel.getName());
  }

  public Long getId() {
    return id;
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
