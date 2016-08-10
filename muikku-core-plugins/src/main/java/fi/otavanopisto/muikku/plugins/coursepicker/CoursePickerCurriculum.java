package fi.otavanopisto.muikku.plugins.coursepicker;

public class CoursePickerCurriculum {

  public CoursePickerCurriculum() {
  }

  public CoursePickerCurriculum(String identifier, String name) {
    super();
    this.identifier = identifier;
    this.name = name;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String identifier;
  private String name;
}
