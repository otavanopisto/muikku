package fi.otavanopisto.muikku.plugins.material.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class BinaryMaterial extends Material {
	
	public byte[] getContent() {
		return content;
	}
	
	public void setContent(byte[] content) {
		this.content = content;
	}
	
	public String getContentType() {
		return contentType;
	}
	
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	
	@Override
	@Transient
	public String getType() {
	  return "binary";
	}

  @NotNull
  @Column (nullable = false)
  @Lob
  private byte[] content;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String contentType;
}
