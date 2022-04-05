package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.rest.model.UserGroup;

/**
 * REST model for full information about a single message including recipients, sender and 
 * message content.
 */
public class CommunicatorMessageRESTModel extends AbstractCommunicatorMessageRESTModel {

  public CommunicatorMessageRESTModel() {
  }
  
  public CommunicatorMessageRESTModel(Long id, Long communicatorMessageId, Long senderId, CommunicatorUserBasicInfo sender, 
      String categoryName, String caption, String content, Date created, Set<String> tags,
      List<CommunicatorUserBasicInfo> recipients, List<UserGroup> userGroupRecipients, 
      List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> workspaceRecipients, Long recipientCount) {
    super(id, communicatorMessageId, senderId, categoryName, caption, created, tags);
    this.content = content;
    this.sender = sender;
    this.recipients = recipients;
    this.userGroupRecipients = userGroupRecipients;
    this.workspaceRecipients = workspaceRecipients;
    this.recipientCount = recipientCount;
  }
  
  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public List<CommunicatorUserBasicInfo> getRecipients() {
    return recipients;
  }

  public void setRecipients(List<CommunicatorUserBasicInfo> recipients) {
    this.recipients = recipients;
  }

  public Long getRecipientCount() {
    return recipientCount;
  }

  public void setRecipientCount(Long recipientCount) {
    this.recipientCount = recipientCount;
  }

  public CommunicatorUserBasicInfo getSender() {
    return sender;
  }

  public void setSender(CommunicatorUserBasicInfo sender) {
    this.sender = sender;
  }

  public List<UserGroup> getUserGroupRecipients() {
    return userGroupRecipients;
  }

  public void setUserGroupRecipients(List<UserGroup> userGroupRecipients) {
    this.userGroupRecipients = userGroupRecipients;
  }

  public List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> getWorkspaceRecipients() {
    return workspaceRecipients;
  }

  public void setWorkspaceRecipients(List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> workspaceRecipients) {
    this.workspaceRecipients = workspaceRecipients;
  }

  private String content;
  private CommunicatorUserBasicInfo sender;
  private Long recipientCount;
  private List<CommunicatorUserBasicInfo> recipients = new ArrayList<CommunicatorUserBasicInfo>();
  private List<UserGroup> userGroupRecipients;
  private List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> workspaceRecipients;
}
