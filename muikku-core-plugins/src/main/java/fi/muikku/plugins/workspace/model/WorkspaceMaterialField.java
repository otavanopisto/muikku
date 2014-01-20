package fi.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.muikku.plugins.material.model.QueryField;

@Entity
public class WorkspaceMaterialField {

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

  public QueryField getQueryField() {
    return queryField;
  }

  public void setQueryField(QueryField queryField) {
    this.queryField = queryField;
  }

  public WorkspaceMaterial getMaterial() {
    return material;
  }

  public void setMaterial(WorkspaceMaterial material) {
    this.material = material;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  @NotNull
  @Column (nullable = false)
  private String name;
  
  @ManyToOne
  private QueryField queryField;
  
  @ManyToOne
  private WorkspaceMaterial material;
  
}
