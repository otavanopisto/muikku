package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.List;

public class CommunicatorThreadViewRESTModel {

  public CommunicatorThreadViewRESTModel() {
  }
  
  public CommunicatorThreadViewRESTModel(Long olderThreadId, Long newerThreadId, 
      List<CommunicatorMessageRESTModel> messages, List<CommunicatorMessageIdLabelRESTModel> labels) {
    this.olderThreadId = olderThreadId;
    this.newerThreadId = newerThreadId;
    this.messages = messages;
    this.labels = labels;
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

  public List<CommunicatorMessageIdLabelRESTModel> getLabels() {
    return labels;
  }

  public void setLabels(List<CommunicatorMessageIdLabelRESTModel> labels) {
    this.labels = labels;
  }

  private Long olderThreadId;
  private Long newerThreadId;
  private List<CommunicatorMessageRESTModel> messages;
  private List<CommunicatorMessageIdLabelRESTModel> labels;
}
