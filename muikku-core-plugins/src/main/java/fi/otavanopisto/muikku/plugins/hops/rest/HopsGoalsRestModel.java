package fi.otavanopisto.muikku.plugins.hops.rest;

import java.util.Date;

public class HopsGoalsRestModel {

  public Date getGraduationGoal() {
    return graduationGoal;
  }

  public void setGraduationGoal(Date graduationGoal) {
    this.graduationGoal = graduationGoal;
  }

  public String getFollowUpGoal() {
    return followUpGoal;
  }

  public void setFollowUpGoal(String followUpGoal) {
    this.followUpGoal = followUpGoal;
  }

  public String getFollowUpStudies() {
    return followUpStudies;
  }

  public void setFollowUpStudies(String followUpStudies) {
    this.followUpStudies = followUpStudies;
  }

  public String getFollowUpStudiesElse() {
    return followUpStudiesElse;
  }

  public void setFollowUpStudiesElse(String followUpStudiesElse) {
    this.followUpStudiesElse = followUpStudiesElse;
  }

  public String getStudySector() {
    return studySector;
  }

  public void setStudySector(String studySector) {
    this.studySector = studySector;
  }

  public String getStudySectorElse() {
    return studySectorElse;
  }

  public void setStudySectorElse(String studySectorElse) {
    this.studySectorElse = studySectorElse;
  }

  public String getFollowUpPlanExtraInfo() {
    return followUpPlanExtraInfo;
  }

  public void setFollowUpPlanExtraInfo(String followUpPlanExtraInfo) {
    this.followUpPlanExtraInfo = followUpPlanExtraInfo;
  }

  private Date graduationGoal;
  private String followUpGoal;
  private String followUpStudies;
  private String followUpStudiesElse;
  private String studySector;
  private String studySectorElse;
  private String followUpPlanExtraInfo;

}
