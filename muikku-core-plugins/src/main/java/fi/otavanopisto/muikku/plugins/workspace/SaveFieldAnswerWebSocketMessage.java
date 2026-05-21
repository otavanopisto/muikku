package fi.otavanopisto.muikku.plugins.workspace;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;

public class SaveFieldAnswerWebSocketMessage {

  public String getAnswer() {
    return answer;
  }

  public void setAnswer(String answer) {
    this.answer = answer;
  }

  public Long getMaterialId() {
    return materialId;
  }

  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }

  public String getFieldName() {
    return fieldName;
  }

  public void setFieldName(String fieldName) {
    this.fieldName = fieldName;
  }
  
  public String getOriginTicket() {
    return originTicket;
  }
  
  public void setOriginTicket(String originTicket) {
    this.originTicket = originTicket;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }
  
  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }
  
  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public WorkspaceMaterialReplyState getState() {
    return state;
  }

  public void setState(WorkspaceMaterialReplyState state) {
    this.state = state;
  }

  private String answer;
  private Long materialId;
  private String fieldName;
  private String originTicket;
  private Long workspaceMaterialId;
  private Long workspaceEntityId;
  private WorkspaceMaterialReplyState state;
  private Long userEntityId;
}
