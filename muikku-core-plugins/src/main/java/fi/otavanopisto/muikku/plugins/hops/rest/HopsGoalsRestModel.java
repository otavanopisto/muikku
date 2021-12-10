package fi.otavanopisto.muikku.plugins.hops.rest;

public class HopsGoalsRestModel {

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }
  
  public Integer getCourseNumber() {
    return courseNumber;
  }

  public void setCourseNumber(Integer courseNumber) {
    this.courseNumber = courseNumber;
  }
  
  private String subject;
  private Integer courseNumber;

}
