package fi.muikku.plugins.materialfields.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class QueryConnectField extends QueryField {
  
  @Transient
  @Override
  public String getType() {
    return "connect";
  }
  
}
