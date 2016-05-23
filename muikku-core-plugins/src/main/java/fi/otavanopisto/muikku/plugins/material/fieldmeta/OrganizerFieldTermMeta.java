package fi.otavanopisto.muikku.plugins.material.fieldmeta;

 
public class OrganizerFieldTermMeta {
  
  public OrganizerFieldTermMeta() {
  }

  public OrganizerFieldTermMeta(String id, String name) {
    setId(id);
    setName(name);
  }
  
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String id;
  private String name;

}
