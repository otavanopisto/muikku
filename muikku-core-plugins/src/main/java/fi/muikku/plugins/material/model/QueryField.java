package fi.muikku.plugins.material.model;

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
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class QueryField {
	
	public Long getId() {
		return id;
	}
	
	public String getName() {
    return name;
  }
	
	public void setName(String name) {
    this.name = name;
  }
	
	public Material getMaterial() {
    return material;
  }
	
	public void setMaterial(Material material) {
    this.material = material;
  }
  
  @Transient
  public String getType() {
    throw new PersistenceException("type not found");
  }
	
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;
	
  @NotEmpty
  @NotNull
  @Column (nullable = false)
	private String name;
  
  @ManyToOne
  private Material material;

}
