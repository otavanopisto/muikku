package fi.muikku.plugins.workspace.rest.model;

import java.util.Date;

public class WorkspaceAssessment {
  
  public WorkspaceAssessment() {
  }
  
  public WorkspaceAssessment(Long id, Date evaluated, Long assessorEntityId, Long workspaceUserEntityId, Long workspaceMaterialId,
      String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, String verbalAssessment) {
    super();
    this.id = id;
    this.evaluated = evaluated;
    this.workspaceUserEntityId = workspaceUserEntityId;
    this.assessorEntityId = assessorEntityId;
    this.gradingScaleIdentifier = gradingScaleIdentifier;
    this.gradingScaleSchoolDataSource = gradingScaleSchoolDataSource;
    this.gradeIdentifier = gradeIdentifier;
    this.gradeSchoolDataSource = gradeSchoolDataSource;
    this.verbalAssessment = verbalAssessment;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Date getEvaluated() {
    return evaluated;
  }

  public void setEvaluated(Date evaluated) {
    this.evaluated = evaluated;
  }

  public Long getAssessorEntityId() {
    return assessorEntityId;
  }

  public void setAssessorEntityId(Long assessorEntityId) {
    this.assessorEntityId = assessorEntityId;
  }
  
  public String getGradingScaleIdentifier() {
    return gradingScaleIdentifier;
  }
  
  public void setGradingScaleIdentifier(String gradingScaleIdentifier) {
    this.gradingScaleIdentifier = gradingScaleIdentifier;
  }
  
  public String getGradingScaleSchoolDataSource() {
    return gradingScaleSchoolDataSource;
  }
  
  public void setGradingScaleSchoolDataSource(String gradingScaleSchoolDataSource) {
    this.gradingScaleSchoolDataSource = gradingScaleSchoolDataSource;
  }

  public String getGradeIdentifier() {
    return gradeIdentifier;
  }

  public void setGradeIdentifier(String gradeIdentifier) {
    this.gradeIdentifier = gradeIdentifier;
  }

  public String getGradeSchoolDataSource() {
    return gradeSchoolDataSource;
  }

  public void setGradeSchoolDataSource(String gradeSchoolDataSource) {
    this.gradeSchoolDataSource = gradeSchoolDataSource;
  }

  public String getVerbalAssessment() {
    return verbalAssessment;
  }

  public void setVerbalAssessment(String verbalAssessment) {
    this.verbalAssessment = verbalAssessment;
  }
  


  public Long getWorkspaceUserEntityId() {
    return workspaceUserEntityId;
  }

  public void setWorkspaceUserEntityId(Long workspaceUserEntityId) {
    this.workspaceUserEntityId = workspaceUserEntityId;
  }



  private Long id;
  private Date evaluated;
  private Long workspaceUserEntityId;
  private Long assessorEntityId;
  private String gradingScaleIdentifier;
  private String gradingScaleSchoolDataSource;
  private String gradeIdentifier;
  private String gradeSchoolDataSource;
  private String verbalAssessment;
}