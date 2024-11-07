package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import fi.otavanopisto.muikku.model.workspace.WorkspaceLanguage;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialCorrectAnswersDisplay;

public class WorkspaceMaterial {

  public WorkspaceMaterial() {
  }

  public WorkspaceMaterial(Long id, Long materialId, Long parentId, Long nextSiblingId, Boolean hidden,
      WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers,
      String path, String title, WorkspaceLanguage titleLanguage, Double maxPoints) {
    super();
    this.id = id;
    this.materialId = materialId;
    this.parentId = parentId;
    this.nextSiblingId = nextSiblingId;
    this.hidden = hidden;
    this.assignmentType = assignmentType;
    this.correctAnswers = correctAnswers;
    this.path = path;
    this.title = title;
    this.titleLanguage = titleLanguage;
    this.maxPoints = maxPoints;
  }
  
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }

  public Long getMaterialId() {
    return materialId;
  }

  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  public Long getNextSiblingId() {
    return nextSiblingId;
  }
  
  public void setNextSiblingId(Long nextSiblingId) {
    this.nextSiblingId = nextSiblingId;
  }
  
  public Boolean getHidden() {
    return hidden;
  }

  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }
  
  public WorkspaceMaterialAssignmentType getAssignmentType() {
    return assignmentType;
  }
  
  public void setAssignmentType(WorkspaceMaterialAssignmentType assignmentType) {
    this.assignmentType = assignmentType;
  }

  public String getPath() {
    return path;
  }
  
  public void setPath(String path) {
    this.path = path;
  }
  
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }


  public WorkspaceMaterialCorrectAnswersDisplay getCorrectAnswers() {
    return correctAnswers;
  }

  public void setCorrectAnswers(WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    this.correctAnswers = correctAnswers;
  }


  public WorkspaceLanguage getTitleLanguage() {
    return titleLanguage;
  }

  public void setTitleLanguage(WorkspaceLanguage titleLanguage) {
    this.titleLanguage = titleLanguage;
  }


  public Double getMaxPoints() {
    return maxPoints;
  }

  public void setMaxPoints(Double maxPoints) {
    this.maxPoints = maxPoints;
  }


  private Long id;
  private Long materialId;
  private Long parentId;
  private Long nextSiblingId;
  private Boolean hidden;
  private WorkspaceMaterialAssignmentType assignmentType;
  private WorkspaceMaterialCorrectAnswersDisplay correctAnswers;
  private String path;
  private String title;
  private WorkspaceLanguage titleLanguage;
  private Double maxPoints;
  
}