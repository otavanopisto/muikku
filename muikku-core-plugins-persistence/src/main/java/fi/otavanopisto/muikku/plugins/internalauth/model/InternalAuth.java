package fi.otavanopisto.muikku.plugins.internalauth.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class InternalAuth {
  
  public Long getId() {
    return id;
  }
  
  public String getPassword() {
		return password;
	}
  
  public void setPassword(String password) {
		this.password = password;
	}
  
  public Long getUserEntityId() {
		return userEntityId;
	}
  
  public void setUserEntityId(Long userEntityId) {
		this.userEntityId = userEntityId;
	}
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String password;

  @NotNull
  @Column (nullable = false)
  private Long userEntityId;
}