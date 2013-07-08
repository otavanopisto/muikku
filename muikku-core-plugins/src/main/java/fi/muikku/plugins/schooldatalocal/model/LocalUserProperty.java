package fi.muikku.plugins.schooldatalocal.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class LocalUserProperty {
  
  public Long getId() {
    return id;
  }
  
  public LocalUserPropertyKey getKey() {
		return key;
	}
  
  public void setKey(LocalUserPropertyKey key) {
		this.key = key;
	}
  
  public LocalUser getUser() {
		return user;
	}
  
  public void setUser(LocalUser user) {
		this.user = user;
	}
  
  public String getValue() {
		return value;
	}
  
  public void setValue(String value) {
		this.value = value;
	}

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private LocalUser user;
  
  @ManyToOne
  private LocalUserPropertyKey key;
  
  @NotNull
  @Column(nullable = false)
  @Lob
  private String value;
}