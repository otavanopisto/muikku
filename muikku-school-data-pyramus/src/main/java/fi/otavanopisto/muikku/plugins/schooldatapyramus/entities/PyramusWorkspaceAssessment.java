package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;

public class PyramusWorkspaceAssessment implements WorkspaceAssessment {
  
  public PyramusWorkspaceAssessment(String identifier, SchoolDataIdentifier workspaceSubjectIdentifier, String workSpaceUserIdentifier, String assessingUserIdentifier, String gradeIdentifier, String gradingScaleIdentifier,
      String verbalAssessment, Date date, Boolean passing) {
    super();
    this.identifier = new SchoolDataIdentifier(identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.workSpaceUserIdentifier = new SchoolDataIdentifier(workSpaceUserIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.assessingUserIdentifier = new SchoolDataIdentifier(assessingUserIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.gradeIdentifier = new SchoolDataIdentifier(gradeIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.gradingScaleIdentifier = new SchoolDataIdentifier(gradingScaleIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.workspaceSubjectIdentifier = workspaceSubjectIdentifier;
    this.verbalAssessment = verbalAssessment;
    this.date = date;
    this.passing = passing;
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

  @Override
  public Boolean getPassing() {
    return passing;
  }

  @Override
  public SchoolDataIdentifier getWorkspaceSubjectIdentifier() {
    return workspaceSubjectIdentifier;
  }
  
  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier workSpaceUserIdentifier;
  private SchoolDataIdentifier assessingUserIdentifier;
  private SchoolDataIdentifier gradeIdentifier;
  private SchoolDataIdentifier gradingScaleIdentifier;
  private SchoolDataIdentifier workspaceSubjectIdentifier;
  private String verbalAssessment;
  private Date date;
  private Boolean passing;
}
