package fi.muikku.plugins.material.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class HtmlMaterial extends Material {

  public String getHtml() {
		return html;
	}
  
  public void setHtml(String html) {
		this.html = html;
	}

  @NotEmpty
  @NotNull
  @Column (nullable = false)
  @Lob
  private String html;
}
