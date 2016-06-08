package fi.otavanopisto.muikku.plugins.material.rest;

import fi.otavanopisto.muikku.plugins.material.model.MaterialVisibility;

public class RestMaterial {
  
  public RestMaterial() {
  }
  
  public RestMaterial(Long id, String title, String license, MaterialVisibility visibility) {
    super();
    this.id = id;
    this.title = title;
    this.license = license;
    this.visibility = visibility;
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

  public MaterialVisibility getVisibility() {
    return visibility;
  }
  
  public void setVisibility(MaterialVisibility visibility) {
    this.visibility = visibility;
  }
  
  private Long id;
  private String title;
  private String license;
  private MaterialVisibility visibility;
}
