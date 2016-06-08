package fi.otavanopisto.muikku.plugins.material.model;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.PersistenceException;
import javax.persistence.Transient;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
@Cacheable
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
public class Material {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Transient
  public String getType() {
    throw new PersistenceException("Not Implemented");
  }
  
  public String getTitle() {
		return title;
	}

  public void setTitle(String title) {
    this.title = title;
  }

  public Material getOriginMaterial() {
    return originMaterial;
  }

  public void setOriginMaterial(Material originMaterial) {
    this.originMaterial = originMaterial;
  }
  
  public String getLicense() {
    return license;
  }
  
  public void setLicense(String license) {
    this.license = license;
  }
  
  public Long getVersion() {
    return version;
  }
  
  public void setVersion(Long version) {
    this.version = version;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  @NotNull
  @Column (nullable = false)
  private String title;

  @ManyToOne
  private Material originMaterial;

  private String license;
  
  @Version
  private Long version;
}
