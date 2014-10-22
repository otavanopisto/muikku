package fi.muikku.plugins.material.model;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

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

  @Lob
  private String html;
}
