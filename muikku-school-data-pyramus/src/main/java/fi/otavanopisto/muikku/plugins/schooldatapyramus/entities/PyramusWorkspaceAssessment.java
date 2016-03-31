package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;

public class PyramusWorkspaceAssessment implements WorkspaceAssessment {
  
  public PyramusWorkspaceAssessment(String identifier, String workSpaceUserIdentifier, String assessingUserIdentifier, String gradeIdentifier, String gradingScaleIdentifier,
      String verbalAssessment, Date date) {
    super();
    this.identifier = identifier;
    this.workSpaceUserIdentifier = workSpaceUserIdentifier;
    this.assessingUserIdentifier = assessingUserIdentifier;
    this.gradeIdentifier = gradeIdentifier;
    this.gradingScaleIdentifier = gradingScaleIdentifier;
    this.verbalAssessment = verbalAssessment;
    this.date = date;
  }

  @Override
  public String getIdentifier() {
    return identifier;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public String getWorkspaceUserIdentifier() {
    return workSpaceUserIdentifier;
  }

  @Override
  public String getWorkspaceUserSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public String getAssessingUserIdentifier() {
    return assessingUserIdentifier;
  }

  @Override
  public String getAssessingUserSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public String getGradeIdentifier() {
    return gradeIdentifier;
  }

  @Override
  public String getGradeSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }
  
  @Override
  public String getGradingScaleIdentifier() {
    return gradingScaleIdentifier;
  }

  @Override
  public String getGradingScaleSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }
  
  @Override
  public String getVerbalAssessment() {
    return verbalAssessment;
  }

  @Override
  public Date getDate() {
    return date;
  }

  private String identifier;
  private String workSpaceUserIdentifier;
  private String assessingUserIdentifier;
  private String gradeIdentifier;
  private String gradingScaleIdentifier;
  private String verbalAssessment;
  private Date date;
  
}
