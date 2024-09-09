package fi.otavanopisto.muikku.plugins.me;

import java.util.Date;

public class GuardiansDependentWorkspaceRestModel {

  public GuardiansDependentWorkspaceRestModel(String name, String nameExtension, Date enrollmentDate, Date latestAssessmentRequestDate) {
    super();
    this.name = name;
    this.nameExtension = nameExtension;
    this.enrollmentDate = enrollmentDate;
    this.latestAssessmentRequestDate = latestAssessmentRequestDate;
  }

  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getNameExtension() {
    return nameExtension;
  }
  
  public void setNameExtension(String nameExtension) {
    this.nameExtension = nameExtension;
  }
  
  public Date getEnrollmentDate() {
    return enrollmentDate;
  }
  
  public void setEnrollmentDate(Date enrollmentDate) {
    this.enrollmentDate = enrollmentDate;
  }
  
  public Date getLatestAssessmentRequestDate() {
    return latestAssessmentRequestDate;
  }
  
  public void setLatestAssessmentRequestDate(Date latestAssessmentRequestDate) {
    this.latestAssessmentRequestDate = latestAssessmentRequestDate;
  }

  private String name;
  private String nameExtension;
  private Date enrollmentDate;
  private Date latestAssessmentRequestDate;
}
