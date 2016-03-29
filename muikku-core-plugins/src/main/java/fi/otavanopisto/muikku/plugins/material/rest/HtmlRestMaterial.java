package fi.otavanopisto.muikku.plugins.material.rest;

public class HtmlRestMaterial {

  public HtmlRestMaterial() {
  }
  
  public HtmlRestMaterial(Long id, String title, String contentType, String html, Long currentRevision, Long publishedRevision) {
    this.id = id;
    this.title = title;
    this.contentType = contentType;
    this.html = html;
    this.currentRevision = currentRevision;
    this.publishedRevision = publishedRevision;
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
  
  public Long getCurrentRevision() {
    return currentRevision;
  }
  
  public void setCurrentRevision(Long currentRevision) {
    this.currentRevision = currentRevision;
  }
  
  public Long getPublishedRevision() {
    return publishedRevision;
  }
  
  public void setPublishedRevision(Long publishedRevision) {
    this.publishedRevision = publishedRevision;
  }
  
  private Long id;
  private String title;
  private String html;
  private String contentType;
  private Long currentRevision;
  private Long publishedRevision;
}
