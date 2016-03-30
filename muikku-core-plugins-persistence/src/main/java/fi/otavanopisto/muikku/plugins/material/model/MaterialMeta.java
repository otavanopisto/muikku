package fi.otavanopisto.muikku.plugins.material.model;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
@Cacheable
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = { "key_", "material_id" })
  }    
)
public class MaterialMeta {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public String getValue() {
    return value;
  }
  
  public void setValue(String value) {
    this.value = value;
  }
  
  public Material getMaterial() {
    return material;
  }
  
  public void setMaterial(Material material) {
    this.material = material;
  }
  
  public MaterialMetaKey getKey() {
    return key;
  }
  
  public void setKey(MaterialMetaKey key) {
    this.key = key;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Lob
  private String value;

  @ManyToOne (optional = false)
  private Material material;

  @ManyToOne (optional = false)
  @JoinColumn (name = "key_")
  private MaterialMetaKey key;
}
