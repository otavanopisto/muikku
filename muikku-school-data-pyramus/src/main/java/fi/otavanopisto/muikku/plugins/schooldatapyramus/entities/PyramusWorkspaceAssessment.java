package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;

public class PyramusWorkspaceAssessment implements WorkspaceAssessment {
  
  public PyramusWorkspaceAssessment(String identifier, String workSpaceUserIdentifier, String assessingUserIdentifier, String gradeIdentifier, String gradingScaleIdentifier,
      String verbalAssessment, Date date) {
    super();
    this.identifier = new SchoolDataIdentifier(identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.workSpaceUserIdentifier = new SchoolDataIdentifier(workSpaceUserIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.assessingUserIdentifier = new SchoolDataIdentifier(assessingUserIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.gradeIdentifier = new SchoolDataIdentifier(gradeIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.gradingScaleIdentifier = new SchoolDataIdentifier(gradingScaleIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.verbalAssessment = verbalAssessment;
    this.date = date;
  }

  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public SchoolDataIdentifier getWorkspaceUserIdentifier() {
    return workSpaceUserIdentifier;
  }

  @Override
  public SchoolDataIdentifier getAssessingUserIdentifier() {
    return assessingUserIdentifier;
  }

  @Override
  public SchoolDataIdentifier getGradeIdentifier() {
    return gradeIdentifier;
  }
  
  @Override
  public SchoolDataIdentifier getGradingScaleIdentifier() {
    return gradingScaleIdentifier;
  }

  @Override
  public String getVerbalAssessment() {
    return verbalAssessment;
  }

  @Override
  public Date getDate() {
    return date;
  }

  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier workSpaceUserIdentifier;
  private SchoolDataIdentifier assessingUserIdentifier;
  private SchoolDataIdentifier gradeIdentifier;
  private SchoolDataIdentifier gradingScaleIdentifier;
  private String verbalAssessment;
  private Date date;
  
}
