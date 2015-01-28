package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

import fi.muikku.plugins.workspace.ContentNode;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;

public class ContentNode {

  public ContentNode(String title, String type, Long workspaceMaterialId,
      Long materialId, int level, WorkspaceMaterialAssignmentType assignmentType) {
    super();
    this.children = new ArrayList<>();
    this.title = title;
    this.type = type;
    this.workspaceMaterialId = workspaceMaterialId;
    this.materialId = materialId;
    this.level = level;
    this.assignmentType = assignmentType;
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

  private String title;
  private String type;
  private List<ContentNode> children;
  private Long workspaceMaterialId;
  private Long materialId;
  private int level;
  private WorkspaceMaterialAssignmentType assignmentType;
}