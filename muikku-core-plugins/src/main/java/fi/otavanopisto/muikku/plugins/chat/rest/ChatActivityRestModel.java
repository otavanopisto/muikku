package fi.otavanopisto.muikku.plugins.chat.rest;

import java.util.Date;

public class ChatActivityRestModel {

  public String getTargetIdentifier() {
    return targetIdentifier;
  }

  public void setTargetIdentifier(String targetIdentifier) {
    this.targetIdentifier = targetIdentifier;
  }

  public Date getLatestMessage() {
    return latestMessage;
  }

  public void setLatestMessage(Date latestMessage) {
    this.latestMessage = latestMessage;
  }

  private String targetIdentifier;
  private Date latestMessage;

}
