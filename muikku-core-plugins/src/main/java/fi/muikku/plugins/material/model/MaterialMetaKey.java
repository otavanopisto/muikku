package fi.muikku.plugins.material.model;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Cacheable
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
public class MaterialMetaKey {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable = false, unique = true)
  @NotNull
  @NotEmpty
  private String name;
}
