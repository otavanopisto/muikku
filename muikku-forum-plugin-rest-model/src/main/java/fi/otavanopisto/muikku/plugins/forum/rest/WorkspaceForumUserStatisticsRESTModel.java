package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.Date;

public class WorkspaceForumUserStatisticsRESTModel {

  public WorkspaceForumUserStatisticsRESTModel() {
    
  }
  
  public WorkspaceForumUserStatisticsRESTModel(Long messageCount, Date latestMessage) {
    this.messageCount = messageCount;
    this.latestMessage = latestMessage;
  }
  
  public Long getMessageCount() {
    return messageCount;
  }
  
  public void setMessageCount(Long messageCount) {
    this.messageCount = messageCount;
  }
  
  public Date getLatestMessage() {
    return latestMessage;
  }
  
  public void setLatestMessage(Date latestMessage) {
    this.latestMessage = latestMessage;
  }

  private Long messageCount;
  private Date latestMessage;
}
