package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.plugins.material.model.QuerySelectFieldOption;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterialSelectFieldAnswer extends WorkspaceMaterialFieldAnswer {
  
  public QuerySelectFieldOption getValue() {
    return value;
  }
  
  public void setValue(QuerySelectFieldOption value) {
    this.value = value;
  }
  
  @ManyToOne
  private QuerySelectFieldOption value;
}
