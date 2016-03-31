package fi.otavanopisto.muikku.plugins.schooldatalocal.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.util.ArchivableEntity;

@Entity
public class LocalUserEmail implements ArchivableEntity {
  
  public Long getId() {
    return id;
  }
  
  public LocalUser getUser() {
		return user;
	}
  
  public void setUser(LocalUser user) {
		this.user = user;
	}
  
  public String getAddress() {
		return address;
	}
  
  public void setAddress(String address) {
		this.address = address;
	}

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
  
  @ManyToOne
  private LocalUser user;
  
  @NotNull
  @Column(nullable = false)
  @NotEmpty
  @Email
  private String address;
}