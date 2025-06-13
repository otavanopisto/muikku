package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterial extends WorkspaceNode {

  public Long getMaterialId() {
    return materialId;
  }
  
  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }

  @Transient
  public WorkspaceNodeType getType() {
    return WorkspaceNodeType.MATERIAL;
  }
  
  @Transient
  public boolean isAssignment() {
    return assignmentType == WorkspaceMaterialAssignmentType.EVALUATED || assignmentType == WorkspaceMaterialAssignmentType.EXERCISE;
  }

  public WorkspaceMaterialAssignmentType getAssignmentType() {
    return assignmentType;
  }

  public void setAssignmentType(WorkspaceMaterialAssignmentType assignmentType) {
    this.assignmentType = assignmentType;
  }
  
  public WorkspaceMaterialCorrectAnswersDisplay getCorrectAnswers() {
    return correctAnswers;
  }

  public void setCorrectAnswers(WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    this.correctAnswers = correctAnswers;
  }
  
  public Double getMaxPoints() {
    return maxPoints;
  }

  public void setMaxPoints(Double maxPoints) {
    this.maxPoints = maxPoints;
  }
  
  public WorkspaceMaterialAI getAi() {
    return ai;
  }
  
  public void setAi(WorkspaceMaterialAI ai) {
    this.ai = ai;
  }

  @NotNull
  @Column(nullable = false)
  private Long materialId;
  
  @Enumerated (EnumType.STRING)
  private WorkspaceMaterialAssignmentType assignmentType;
  
  @Enumerated (EnumType.STRING)
  private WorkspaceMaterialCorrectAnswersDisplay correctAnswers;

  @Column
  private Double maxPoints;
  
  @Enumerated (EnumType.STRING)
  private WorkspaceMaterialAI ai;
  
}
