package fi.otavanopisto.muikku.rest.model;

public class PermissionRestModel {

  public PermissionRestModel(Long id, String name, String scope) {
    this.id = id;
    this.name = name;
    this.scope = scope;
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

  public String getScope() {
    return scope;
  }

  public void setScope(String scope) {
    this.scope = scope;
  }

  private Long id;
  private String name;
  private String scope;
}
