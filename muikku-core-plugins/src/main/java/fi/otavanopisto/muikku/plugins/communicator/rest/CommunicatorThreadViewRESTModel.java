package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.List;

public class CommunicatorThreadViewRESTModel {

  public CommunicatorThreadViewRESTModel() {
  }
  
  public CommunicatorThreadViewRESTModel(Long olderThreadId, Long newerThreadId, 
      List<CommunicatorMessageRESTModel> messages) {
    this.olderThreadId = olderThreadId;
    this.newerThreadId = newerThreadId;
    this.messages = messages;
  }
  
  public Long getOlderThreadId() {
    return olderThreadId;
  }

  public void setOlderThreadId(Long olderThreadId) {
    this.olderThreadId = olderThreadId;
  }

  public Long getNewerThreadId() {
    return newerThreadId;
  }

  public void setNewerThreadId(Long newerThreadId) {
    this.newerThreadId = newerThreadId;
  }

  public List<CommunicatorMessageRESTModel> getMessages() {
    return messages;
  }

  public void setMessages(List<CommunicatorMessageRESTModel> messages) {
    this.messages = messages;
  }

  private Long olderThreadId;
  private Long newerThreadId;
  private List<CommunicatorMessageRESTModel> messages;
}
