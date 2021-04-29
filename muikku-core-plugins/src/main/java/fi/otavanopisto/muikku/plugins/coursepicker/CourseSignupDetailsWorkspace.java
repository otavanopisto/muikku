package fi.otavanopisto.muikku.plugins.coursepicker;


public class CourseSignupDetailsWorkspace {

  public CourseSignupDetailsWorkspace() {
  }

  public CourseSignupDetailsWorkspace(Long id, String description, boolean canSignup, boolean isCourseMember) {
    super();
    this.id = id;
    this.description = description;
    this.canSignup = canSignup;
    this.isCourseMember = isCourseMember;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

 
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Boolean getCanSignup() {
    return canSignup;
  }

  public void setCanSignup(Boolean canSignup) {
    this.canSignup = canSignup;
  }
  
  public Boolean getIsCourseMember() {
    return isCourseMember;
  }

  public void setIsCourseMember(Boolean isCourseMember) {
    this.isCourseMember = isCourseMember;
  }

  private Long id;
  private String description;
  private Boolean canSignup;
  private Boolean isCourseMember;

}
