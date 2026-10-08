package fi.otavanopisto.muikku.plugins.material.rest;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;

public class HtmlRestMaterial extends RestMaterial {

  public HtmlRestMaterial() {
  }
  
  public HtmlRestMaterial(Long id, String title, String contentType, String html, String license, MaterialViewRestrict visibility, String editor, Date edited) {
    super(id, title, license, visibility);
    this.contentType = contentType;
    this.html = html;
    this.editor = editor;
    this.edited = edited;
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

  public String getEditor() {
    return editor;
  }

  public void setEditor(String editor) {
    this.editor = editor;
  }

  public Date getEdited() {
    return edited;
  }

  public void setEdited(Date edited) {
    this.edited = edited;
  }

  private String html;
  private String contentType;
  private String editor;
  private Date edited;

}
