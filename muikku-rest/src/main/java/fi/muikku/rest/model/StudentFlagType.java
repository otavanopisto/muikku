package fi.muikku.rest.model;

public class StudentFlagType {
  
  public StudentFlagType() {
  }
  
  public StudentFlagType(String type) {
    super();
    this.type = type;
  }

  public String getType() {
    return type;
  }
  
  public void setType(String type) {
    this.type = type;
  }

  private String type;
}
