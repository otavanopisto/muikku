package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class WorkspaceMaterialFieldAnswer {

  public WorkspaceMaterialFieldAnswer() {
  }

  public WorkspaceMaterialFieldAnswer(Long workspaceMaterialId, String fieldName, String value) {
    this.workspaceMaterialId = workspaceMaterialId;
    this.fieldName = fieldName;
    this.value = value;
  }

  public String getFieldName() {
    return fieldName;
  }

  public void setFieldName(String fieldName) {
    this.fieldName = fieldName;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }
  
  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }
  
  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }
  
  @JsonIgnore
  public void addSnapshot(WorkspaceMaterialFieldAnswerSnapshot snapshot) {
    snapshots.add(snapshot);
  }
  
  public List<WorkspaceMaterialFieldAnswerSnapshot> getSnapshots() {
    return snapshots;
  }

  public void setSnapshots(List<WorkspaceMaterialFieldAnswerSnapshot> snapshots) {
    this.snapshots = snapshots;
  }

  private Long workspaceMaterialId;
  private String fieldName;
  private String value;
  private List<WorkspaceMaterialFieldAnswerSnapshot> snapshots = new ArrayList<>();

}