package fi.otavanopisto.muikku.plugins.evaluation.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"studentEntityId", "workspaceNodeId"})
    }
)
public class WorkspaceNodeEvaluation {

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

  public Long getWorkspaceNodeId() {
    return workspaceNodeId;
  }
  
  public void setWorkspaceNodeId(Long workspaceNodeId) {
    this.workspaceNodeId = workspaceNodeId;
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

  public String getVerbalAssessment() {
    return verbalAssessment;
  }

  public void setVerbalAssessment(String verbalAssessment) {
    this.verbalAssessment = verbalAssessment;
  }

  public WorkspaceNodeEvaluationType getEvaluationType() {
    return evaluationType;
  }

  public void setEvaluationType(WorkspaceNodeEvaluationType evaluationType) {
    this.evaluationType = evaluationType;
  }

  public Double getPoints() {
    return points;
  }

  public void setPoints(Double points) {
    this.points = points;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Temporal(TemporalType.TIMESTAMP)
  @Column(nullable = false)
  @NotNull
  private Date evaluated;

  @Column(nullable = false)
  @NotNull
  private Long assessorEntityId;

  @Column(nullable = false)
  @NotNull
  private Long studentEntityId;

  @Column(nullable = false)
  @NotNull
  private Long workspaceNodeId;

  @Column
  private String gradingScaleIdentifier;

  @Column
  private String gradingScaleSchoolDataSource;

  @Column
  private String gradeIdentifier;

  @Column
  private String gradeSchoolDataSource;

  @Lob
  private String verbalAssessment;
  
  @Column
  private Double points;
  
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private WorkspaceNodeEvaluationType evaluationType;

}