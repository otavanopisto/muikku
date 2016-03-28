package fi.otavanopisto.muikku.plugins.schooldatalocal.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.model.util.ArchivableEntity;

@Entity
public class LocalUser implements ArchivableEntity {
  
  public Long getId() {
    return id;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }
  
  public String getFirstName() {
		return firstName;
	}
  
  public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
  
  public String getLastName() {
		return lastName;
	}
  
  public void setLastName(String lastName) {
		this.lastName = lastName;
	}
  
  public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}
  
  public Long getRoleId() {
		return roleId;
	}

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
  
  private String firstName;
  
  private String lastName;
  
  // Many To One reference into core RoleEntity 
  private Long roleId;
}