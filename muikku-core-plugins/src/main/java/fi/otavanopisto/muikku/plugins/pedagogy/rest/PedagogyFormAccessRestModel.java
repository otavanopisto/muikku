package fi.otavanopisto.muikku.plugins.pedagogy.rest;

public class PedagogyFormAccessRestModel {
  
  public PedagogyFormAccessRestModel() {
  }

  public PedagogyFormAccessRestModel(boolean isAccessible, boolean isSpecEdTeacher, boolean isGuidanceCounselor, boolean isCourseTeacher, boolean studentParent, boolean isCounselor) {
    this.isAccessible = isAccessible;
    this.isSpecEdTeacher = isSpecEdTeacher;
    this.isGuidanceCounselor = isGuidanceCounselor;
    this.isCourseTeacher = isCourseTeacher;
    this.studentParent = studentParent;
    this.isCounselor = isCounselor;
  }

  public boolean isAccessible() {
    return isAccessible;
  }

  public void setAccessible(boolean isAccessible) {
    this.isAccessible = isAccessible;
  }

  public boolean isSpecEdTeacher() {
    return isSpecEdTeacher;
  }

  public void setSpecEdTeacher(boolean isSpecEdTeacher) {
    this.isSpecEdTeacher = isSpecEdTeacher;
  }

  public boolean isGuidanceCounselor() {
    return isGuidanceCounselor;
  }

  public void setGuidanceCounselor(boolean isGuidanceCounselor) {
    this.isGuidanceCounselor = isGuidanceCounselor;
  }

  public boolean isCourseTeacher() {
    return isCourseTeacher;
  }

  public void setCourseTeacher(boolean isCourseTeacher) {
    this.isCourseTeacher = isCourseTeacher;
  }

  public boolean isStudentParent() {
    return studentParent;
  }

  public void setStudentParent(boolean studentParent) {
    this.studentParent = studentParent;
  }

  public boolean isCounselor() {
    return isCounselor;
  }

  public void setCounselor(boolean isCounselor) {
    this.isCounselor = isCounselor;
  }

  private boolean isAccessible;
  private boolean isSpecEdTeacher;
  private boolean isGuidanceCounselor;
  private boolean isCourseTeacher;
  private boolean studentParent;
  private boolean isCounselor;

}
