package fi.muikku.plugins.material.rest;

public class HtmlRestMaterial {

  public HtmlRestMaterial() {
  }
  
  public HtmlRestMaterial(Long id, String title, String contentType, String html) {
    this.id = id;
    this.title = title;
    this.contentType = contentType;
    this.html = html;
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
  
  private Long id;
  private String title;
  private String html;
  private String contentType;
}
