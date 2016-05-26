package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterialSorterFieldAnswer extends WorkspaceMaterialFieldAnswer {

  public String getValue() {
    return value;
  }
  
  public void setValue(String value) {
    this.value = value;
  }
  
  @Lob
  private String value;
}
