package fi.otavanopisto.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialCorrectAnswersDisplay;

public class ContentNode {

  public ContentNode(String title, String type, Long workspaceMaterialId, Long materialId, int level, 
      WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers,
      Long parentId, Boolean hidden, String html,  Long currentRevision, Long publishedRevision, String path,
      String license, String producers, MaterialViewRestrict viewRestrict, boolean viewRestricted) {
    super();
    this.children = new ArrayList<>();
    this.title = title;
    this.type = type;
    this.workspaceMaterialId = workspaceMaterialId;
    this.materialId = materialId;
    this.level = level;
    this.assignmentType = assignmentType;
    this.correctAnswers = correctAnswers;
    this.parentId = parentId;
    this.hidden = hidden;
    this.html = html;
    this.currentRevision = currentRevision;
    this.publishedRevision = publishedRevision;
    this.path = path;
    this.license = license;
    this.viewRestrict = viewRestrict;
    this.viewRestricted = viewRestricted;
    this.producers = producers;
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

  public Long getCurrentRevision() {
    return currentRevision;
  }

  public void setCurrentRevision(Long currentRevision) {
    this.currentRevision = currentRevision;
  }

  public Long getPublishedRevision() {
    return publishedRevision;
  }

  public void setPublishedRevision(Long publishedRevision) {
    this.publishedRevision = publishedRevision;
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
  
  public boolean getViewRestricted() {
    return viewRestricted;
  }
  
  public void setViewRestricted(boolean viewRestricted) {
    this.viewRestricted = viewRestricted;
  }
  
  public String getProducers() {
    return producers;
  }
  
  public MaterialViewRestrict getViewRestrict() {
    return viewRestrict;
  }

  public void setViewRestrict(MaterialViewRestrict viewRestrict) {
    this.viewRestrict = viewRestrict;
  }

  private String title;
  private String type;
  private List<ContentNode> children;
  private Long workspaceMaterialId;
  private Long materialId;
  private int level;
  private WorkspaceMaterialAssignmentType assignmentType;
  private WorkspaceMaterialCorrectAnswersDisplay correctAnswers;
  private Boolean hidden;
  private Long parentId;
  private String html;
  private Long currentRevision;
  private Long publishedRevision;
  private String path;
  private String license;
  private MaterialViewRestrict viewRestrict;
  private boolean viewRestricted;
  private String producers;
}