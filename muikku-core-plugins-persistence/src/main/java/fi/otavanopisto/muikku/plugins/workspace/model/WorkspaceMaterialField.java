package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import fi.otavanopisto.muikku.plugins.material.model.QueryField;

@Entity
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = { "embedId", "queryField_id", "workspaceMaterial_id" })
  }    
)
public class WorkspaceMaterialField {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmbedId() {
    return embedId;
  }
  
  public void setEmbedId(String embedId) {
    this.embedId = embedId;
  }

  public QueryField getQueryField() {
    return queryField;
  }

  public void setQueryField(QueryField queryField) {
    this.queryField = queryField;
  }

  public WorkspaceMaterial getWorkspaceMaterial() {
    return workspaceMaterial;
  }
  
  public void setWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    this.workspaceMaterial = workspaceMaterial;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  private String embedId;
  
  @ManyToOne
  private QueryField queryField;
  
  @ManyToOne
  private WorkspaceMaterial workspaceMaterial;
  
}
