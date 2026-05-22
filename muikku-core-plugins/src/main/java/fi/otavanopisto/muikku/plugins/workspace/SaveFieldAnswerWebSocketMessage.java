package fi.otavanopisto.muikku.plugins.workspace;

public class SaveFieldAnswerWebSocketMessage {

  public String getAnswer() {
    return answer;
  }

  public void setAnswer(String answer) {
    this.answer = answer;
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

  private String answer;
  private String fieldName;
  private String originTicket;
  private Long workspaceMaterialId;
  private Long userEntityId;

}
