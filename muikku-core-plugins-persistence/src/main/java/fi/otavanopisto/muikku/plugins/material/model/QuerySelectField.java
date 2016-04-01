package fi.otavanopisto.muikku.plugins.material.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class QuerySelectField extends QueryField {
  
  @Transient
  @Override
  public String getType() {
    return "application/vnd.muikku.field.select";
  }
  
}
