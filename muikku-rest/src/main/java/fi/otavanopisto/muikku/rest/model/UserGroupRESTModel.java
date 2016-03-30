package fi.otavanopisto.muikku.rest.model;

public class UserGroupRESTModel {
  
  public UserGroupRESTModel(Long id, String name) {
    this.id = id;
    this.name = name;
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
