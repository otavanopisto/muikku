package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterialTextFieldAnswer extends WorkspaceMaterialFieldAnswer {

  public String getValue() {
    return value;
  }
  
  public void setValue(String value) {
    this.value = value;
  }
  
  private String value;
}
