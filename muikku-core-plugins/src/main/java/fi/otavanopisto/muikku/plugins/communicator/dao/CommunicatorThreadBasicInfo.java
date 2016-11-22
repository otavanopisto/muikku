package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;

public class CommunicatorThreadBasicInfo {

  public CommunicatorThreadBasicInfo(CommunicatorMessageId threadId, Date latestThread) {
    this.threadId = threadId;
    this.latestThread = latestThread;
  }

  public Date getLatestThread() {
    return latestThread;
  }

  public void setLatestThread(Date latestThread) {
    this.latestThread = latestThread;
  }

  public CommunicatorMessageId getThreadId() {
    return threadId;
  }

  public void setThreadId(CommunicatorMessageId threadId) {
    this.threadId = threadId;
  }

  private CommunicatorMessageId threadId;
  private Date latestThread;
}
