package fi.otavanopisto.muikku.plugins.pedagogy.rest;

public class PedagogyWorkspaceRestModel {
  
  public PedagogyWorkspaceRestModel() {
  }

  public PedagogyWorkspaceRestModel(Long id, String urlName, String name, String nameExtension) {
    this.id = id;
    this.urlName = urlName;
    this.name = name;
    this.nameExtension = nameExtension;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUrlName() {
    return urlName;
  }

  public void setUrlName(String urlName) {
    this.urlName = urlName;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getNameExtension() {
    return nameExtension;
  }

  public void setNameExtension(String nameExtension) {
    this.nameExtension = nameExtension;
  }

  private Long id;
  private String urlName;
  private String name;
  private String nameExtension;

}
