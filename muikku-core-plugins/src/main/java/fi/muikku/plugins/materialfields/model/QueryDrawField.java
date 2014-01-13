package fi.muikku.plugins.materialfields.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name = "id")
public class QueryDrawField extends QueryField {

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getCanvasHtml() {
    return canvasHtml;
  }

  public void setCanvasHtml(String canvasHtml) {
    this.canvasHtml = canvasHtml;
  }
  
  @Transient
  @Override
  public String getType() {
    return "draw";
  }

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String text;

  @NotEmpty
  @NotNull
  @Lob
  @Column(nullable = false)
  private String canvasHtml;

}
