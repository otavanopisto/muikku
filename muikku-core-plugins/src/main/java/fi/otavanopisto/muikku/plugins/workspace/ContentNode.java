package fi.otavanopisto.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

import fi.otavanopisto.muikku.plugins.material.rest.MaterialProducer;
import fi.otavanopisto.muikku.model.workspace.WorkspaceLanguage;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAI;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialCorrectAnswersDisplay;

public class ContentNode {

  public ContentNode(String title, String type, String contentType, Long workspaceMaterialId, Long materialId, int level, 
      WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers,
      Long parentId, Long nextSiblingId, Boolean hidden, String html,  String path,
      String license, List<MaterialProducer> producers, MaterialViewRestrict viewRestrict, Boolean contentHiddenForUser,
      WorkspaceLanguage titleLanguage, Double maxPoints, WorkspaceMaterialAI ai) {
    super();
    this.children = new ArrayList<>();
    this.title = title;
    this.type = type;
    this.contentType = contentType;
    this.workspaceMaterialId = workspaceMaterialId;
    this.materialId = materialId;
    this.level = level;
    this.assignmentType = assignmentType;
    this.correctAnswers = correctAnswers;
    this.parentId = parentId;
    this.nextSiblingId = nextSiblingId;
    this.hidden = hidden;
    this.html = html;
    this.path = path;
    this.license = license;
    this.viewRestrict = viewRestrict;
    this.producers = producers;
    this.contentHiddenForUser = contentHiddenForUser;
    this.titleLanguage = titleLanguage;
    this.maxPoints = maxPoints;
    this.setAi(ai);
  }

  public void addChild(ContentNode child) {
    this.children.add(child);
  }

  public String getTitle() {
    return title;
  }

  public String getType() {
    return type;
  }

  public String getContentType() {
    return contentType;
  }

  public List<ContentNode> getChildren() {
    return children;
  }

  public Long getMaterialId() {
    return materialId;
  }

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }
  
  public WorkspaceMaterialAssignmentType getAssignmentType() {
    return assignmentType;
  }
  
  public void setAssignmentType(WorkspaceMaterialAssignmentType assignmentType) {
    this.assignmentType = assignmentType;
  }
  
  public Boolean getHidden() {
    return hidden;
  }
  
  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }
  
  public Long getParentId() {
    return parentId;
  }
  
  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }
  
  public String getHtml() {
    return html;
  }
  
  public void setHtml(String html) {
    this.html = html;
  }

  public WorkspaceMaterialCorrectAnswersDisplay getCorrectAnswers() {
    return correctAnswers;
  }

  public void setCorrectAnswers(WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    this.correctAnswers = correctAnswers;
  }
 
  public String getPath() {
    return path;
  }
  
  public void setPath(String path) {
    this.path = path;
  }
  
  public String getLicense() {
    return license;
  }
  
  public void setLicense(String license) {
    this.license = license;
  }
  
  public List<MaterialProducer> getProducers() {
    return producers;
  }
  
  public MaterialViewRestrict getViewRestrict() {
    return viewRestrict;
  }

  public void setViewRestrict(MaterialViewRestrict viewRestrict) {
    this.viewRestrict = viewRestrict;
  }

  public Long getNextSiblingId() {
    return nextSiblingId;
  }

  public void setNextSiblingId(Long nextSiblingId) {
    this.nextSiblingId = nextSiblingId;
  }

  public Boolean getContentHiddenForUser() {
    return contentHiddenForUser;
  }

  public void setContentHiddenForUser(Boolean contentHiddenForUser) {
    this.contentHiddenForUser = contentHiddenForUser;
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

  public WorkspaceMaterialAI getAi() {
    return ai;
  }

  public void setAi(WorkspaceMaterialAI ai) {
    this.ai = ai;
  }

  private String title;
  private String type;
  private String contentType;
  private List<ContentNode> children;
  private Long workspaceMaterialId;
  private Long materialId;
  private int level;
  private WorkspaceMaterialAssignmentType assignmentType;
  private WorkspaceMaterialCorrectAnswersDisplay correctAnswers;
  private Boolean hidden;
  private Long parentId;
  private Long nextSiblingId;
  private String html;
  private String path;
  private String license;
  private MaterialViewRestrict viewRestrict;
  private List<MaterialProducer> producers;
  private Boolean contentHiddenForUser;
  private WorkspaceLanguage titleLanguage;
  private Double maxPoints;
  private WorkspaceMaterialAI ai;

}