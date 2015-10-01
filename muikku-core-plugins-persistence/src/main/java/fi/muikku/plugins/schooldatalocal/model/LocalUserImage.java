package fi.muikku.plugins.schooldatalocal.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class LocalUserImage {
  
  public Long getId() {
    return id;
  }
  
  public LocalUser getUser() {
		return user;
	}
  
  public void setUser(LocalUser user) {
		this.user = user;
	}

  public String getContentType() {
		return contentType;
	}
  
  public void setContentType(String contentType) {
		this.contentType = contentType;
	}
  
  public byte[] getContent() {
		return content;
	}
  
  public void setContent(byte[] content) {
		this.content = content;
	}

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private LocalUser user;
  
  @NotNull
  @Column(nullable = false)
  @NotEmpty
  private String contentType;
  
  @NotNull
  @Column(nullable = false)
  @Lob
  private byte[] content;
}