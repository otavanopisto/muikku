package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class WorkspaceAssessment {
  
  public WorkspaceAssessment() {
  }
  
  public WorkspaceAssessment(String identifier, String workspaceSubjectIdentifier, Date evaluated, Long assessorEntityId, String workspaceStudentId,
      String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String grade, String gradingScale, String gradeIdentifier, 
      String gradeSchoolDataSource, String verbalAssessment, Boolean passed) {
    super();
    this.identifier = identifier;
    this.setWorkspaceSubjectIdentifier(workspaceSubjectIdentifier);
    this.evaluated = evaluated;
    this.workspaceStudentId = workspaceStudentId;
    this.assessorEntityId = assessorEntityId;
    this.gradingScaleIdentifier = gradingScaleIdentifier;
    this.gradingScaleSchoolDataSource = gradingScaleSchoolDataSource;
    this.grade = grade;
    this.gradingScale = gradingScale;
    this.gradeIdentifier = gradeIdentifier;
    this.gradeSchoolDataSource = gradeSchoolDataSource;
    this.verbalAssessment = verbalAssessment;
    this.passed = passed;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  public void setIdentifier(String identifier) {
    this.identifier = identifier;
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

  public String getWorkspaceStudentId() {
    return workspaceStudentId;
  }
  
  public void setWorkspaceStudentId(String workspaceStudentId) {
    this.workspaceStudentId = workspaceStudentId;
  }
  
  public Boolean getPassed() {
    return passed;
  }

  public void setPassed(Boolean passed) {
    this.passed = passed;
  }

  public String getGrade() {
    return grade;
  }

  public void setGrade(String grade) {
    this.grade = grade;
  }

  public String getGradingScale() {
    return gradingScale;
  }

  public void setGradingScale(String gradingScale) {
    this.gradingScale = gradingScale;
  }

  public String getWorkspaceSubjectIdentifier() {
    return workspaceSubjectIdentifier;
  }

  public void setWorkspaceSubjectIdentifier(String workspaceSubjectIdentifier) {
    this.workspaceSubjectIdentifier = workspaceSubjectIdentifier;
  }

  private String identifier;
  private String workspaceSubjectIdentifier;
  private Date evaluated;
  private String workspaceStudentId;
  private Long assessorEntityId;
  private String gradingScaleIdentifier;
  private String gradingScaleSchoolDataSource;
  private String gradeIdentifier;
  private String gradeSchoolDataSource;
  private String grade;
  private String gradingScale;
  private String verbalAssessment;
  private Boolean passed;
}