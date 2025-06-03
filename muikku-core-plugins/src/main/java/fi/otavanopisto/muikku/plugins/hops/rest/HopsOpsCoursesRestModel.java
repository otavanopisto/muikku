package fi.otavanopisto.muikku.plugins.hops.rest;

import java.util.Set;

public class HopsOpsCoursesRestModel {
  
  public HopsOpsCoursesRestModel() {
  }

  public HopsOpsCoursesRestModel(String subjectCode, Set<Integer> courseNumbers) {
    this.subjectCode = subjectCode;
    this.courseNumbers = courseNumbers;
  }

  public String getSubjectCode() {
    return subjectCode;
  }

  public void setSubjectCode(String subjectCode) {
    this.subjectCode = subjectCode;
  }

  public Set<Integer> getCourseNumbers() {
    return courseNumbers;
  }

  public void setCourseNumbers(Set<Integer> courseNumbers) {
    this.courseNumbers = courseNumbers;
  }

  private String subjectCode;
  private Set<Integer> courseNumbers;

}
