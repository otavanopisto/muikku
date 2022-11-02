package fi.otavanopisto.muikku.plugins.material.fieldmeta;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class JournalFieldMeta extends FieldMeta {
  
  public JournalFieldMeta() {
    
  }

  public JournalFieldMeta(String name) {
    super(name);
  }
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.journal";
  }

}
