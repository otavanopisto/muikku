package fi.otavanopisto.muikku.plugins.material.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class HtmlMaterial extends Material {

  public String getHtml() {
    return html;
  }
  
  public void setHtml(String html) {
    this.html = html;
  }
  
  @Override
  @Transient
  public String getType() {
    return "html";
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public Long getEditor() {
    return editor;
  }

  public void setEditor(Long editor) {
    this.editor = editor;
  }

  public Date getEdited() {
    return edited;
  }

  public void setEdited(Date edited) {
    this.edited = edited;
  }

  @Lob
  private String html;
  
  @Column (nullable = false)
  @NotEmpty
  private String contentType;
  
  @Column
  private Long editor;
  
  @Column
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date edited;

}
