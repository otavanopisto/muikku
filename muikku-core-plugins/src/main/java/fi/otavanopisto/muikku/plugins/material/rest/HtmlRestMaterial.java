package fi.otavanopisto.muikku.plugins.material.rest;

import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;

public class HtmlRestMaterial extends RestMaterial {

  public HtmlRestMaterial() {
  }
  
  public HtmlRestMaterial(Long id, String title, String contentType, String html, String license, MaterialViewRestrict visibility) {
    super(id, title, license, visibility);
    this.contentType = contentType;
    this.html = html;
  }
  
  public String getContentType() {
    return contentType;
  }
  
  public void setContentType(String contentType) {
    this.contentType = contentType;
  }
  
  public String getHtml() {
    return html;
  }
  
  public void setHtml(String html) {
    this.html = html;
  }
  
  private String html;
  private String contentType;

}
