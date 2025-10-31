package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;
import java.util.List;

public class RestWorkspaceNodeEvaluation {
  
  public RestWorkspaceNodeEvaluation() {
  }
  
  public RestWorkspaceNodeEvaluation(
      Long id,
      Date evaluated, 
      Long assessorEntityId, 
      Long studentEntityId, 
      Long workspaceMaterialId,
      String gradingScaleIdentifier, 
      String gradingScaleSchoolDataSource, 
      String grade, 
      String gradeIdentifier, 
      String gradeSchoolDataSource, 
      String gradingScale,
      String verbalAssessment,
      Boolean passed,
      List<RestAssignmentEvaluationAudioClip> audioAssessments) {
    super();
    this.id = id;
    this.evaluated = evaluated;
    this.assessorEntityId = assessorEntityId;
    this.studentEntityId = studentEntityId;
    this.workspaceMaterialId = workspaceMaterialId;
    this.gradingScaleIdentifier = gradingScaleIdentifier;
    this.gradingScaleSchoolDataSource = gradingScaleSchoolDataSource;
    this.grade = grade;
    this.gradeIdentifier = gradeIdentifier;
    this.gradeSchoolDataSource = gradeSchoolDataSource;
    this.gradingScale = gradingScale;
    this.verbalAssessment = verbalAssessment;
    this.passed = passed;
    this.audioAssessments = audioAssessments;
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

  public Long getStudentEntityId() {
    return studentEntityId;
  }

  public void setStudentEntityId(Long studentEntityId) {
    this.studentEntityId = studentEntityId;
  }

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }
  
  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
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

  public String getGrade() {
    return grade;
  }

  public void setGrade(String grade) {
    this.grade = grade;
  }

  public Boolean getPassed() {
    return passed;
  }

  public void setPassed(Boolean passed) {
    this.passed = passed;
  }

  public String getGradingScale() {
    return gradingScale;
  }

  public void setGradingScale(String gradingScale) {
    this.gradingScale = gradingScale;
  }

  public void addAudioAssessment(RestAssignmentEvaluationAudioClip audioAssessment) {
    this.audioAssessments.add(audioAssessment);
  }

  public List<RestAssignmentEvaluationAudioClip> getAudioAssessments() {
    return audioAssessments;
  }

  public void setAudioAssessments(List<RestAssignmentEvaluationAudioClip> audioAssessments) {
    this.audioAssessments = audioAssessments;
  }

  private Long id;
  private Date evaluated;
  private Long assessorEntityId;
  private Long studentEntityId;
  private Long workspaceMaterialId; // TODO Swagger + rename to workspaceNodeId
  private String gradingScaleIdentifier;
  private String gradingScaleSchoolDataSource;
  private String grade;
  private String gradeIdentifier;
  private String gradeSchoolDataSource;
  private String gradingScale;
  private String verbalAssessment;
  private Boolean passed;
  private List<RestAssignmentEvaluationAudioClip> audioAssessments;
}