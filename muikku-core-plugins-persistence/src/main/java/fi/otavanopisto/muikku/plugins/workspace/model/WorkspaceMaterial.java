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

  @NotNull
  @Column(nullable = false)
  private Long materialId;
  
  @Enumerated (EnumType.STRING)
  private WorkspaceMaterialAssignmentType assignmentType;
  
  @Enumerated (EnumType.STRING)
  private WorkspaceMaterialCorrectAnswersDisplay correctAnswers;
  
}
