package fi.otavanopisto.muikku.plugins.material.rest;

import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;

public class RestMaterial {
  
  public RestMaterial() {
  }
  
  public RestMaterial(Long id, String title, String license, MaterialViewRestrict visibility) {
    super();
    this.id = id;
    this.title = title;
    this.license = license;
    this.viewRestrict = visibility;
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

  public MaterialViewRestrict getViewRestrict() {
    return viewRestrict;
  }
  
  public void setViewRestrict(MaterialViewRestrict viewRestrict) {
    this.viewRestrict = viewRestrict;
  }
  
  private Long id;
  private String title;
  private String license;
  private MaterialViewRestrict viewRestrict;
}
