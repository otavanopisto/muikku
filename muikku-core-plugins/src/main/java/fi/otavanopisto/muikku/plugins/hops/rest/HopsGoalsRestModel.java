package fi.otavanopisto.muikku.plugins.hops.rest;

import java.util.Date;

public class HopsGoalsRestModel {

  public Date getGraduationGoal() {
    return graduationGoal;
  }

  public void setGraduationGoal(Date graduationGoal) {
    this.graduationGoal = graduationGoal;
  }

  public Integer getStudyHours() {
    return studyHours;
  }

  public void setStudyHours(Integer studyHours) {
    this.studyHours = studyHours;
  }

  private Date graduationGoal;
  private Integer studyHours;

}
