package fi.otavanopisto.muikku.plugins.pedagogy.rest;

public class PedagogyFormAccessRestModel {
  
  public PedagogyFormAccessRestModel() {
  }

  public PedagogyFormAccessRestModel(boolean isAccessible, boolean isSpecEdTeacher, boolean isGuidanceCounselor, boolean isCourseTeacher) {
    this.isAccessible = isAccessible;
    this.isSpecEdTeacher = isSpecEdTeacher;
    this.isGuidanceCounselor = isGuidanceCounselor;
    this.isCourseTeacher = isCourseTeacher;
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

  private boolean isAccessible;
  private boolean isSpecEdTeacher;
  private boolean isGuidanceCounselor;
  private boolean isCourseTeacher;

}
