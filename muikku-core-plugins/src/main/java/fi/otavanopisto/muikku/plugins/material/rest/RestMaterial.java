package fi.otavanopisto.muikku.plugins.material.rest;

public class RestMaterial {
  
  public RestMaterial() {
  }
  
  public RestMaterial(Long id, String title, String license) {
    super();
    this.id = id;
    this.title = title;
    this.license = license;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public String getTitle() {
    return title;
  }
  
  public void setTitle(String title) {
    this.title = title;
  }
  
  public String getLicense() {
    return license;
  }
  
  public void setLicense(String license) {
    this.license = license;
  }

  private Long id;
  private String title;
  private String license;
}
