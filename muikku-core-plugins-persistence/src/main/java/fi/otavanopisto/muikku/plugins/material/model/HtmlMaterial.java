package fi.otavanopisto.muikku.plugins.material.model;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Cacheable
@PrimaryKeyJoinColumn(name="id")
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
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

  public Long getRevisionNumber() {
    return revisionNumber;
  }

  public void setRevisionNumber(Long revisionNumber) {
    this.revisionNumber = revisionNumber;
  }

  @Lob
  private String html;
  
  @Column (nullable = false)
  @NotEmpty
  private String contentType;

  @Column (nullable = false)
  private Long revisionNumber;
}
