package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.rest.model.UserGroup;

/**
 * REST model for message threads containing information about the thread but not the contents nor recipients.
 */
public class CommunicatorSearchResultRESTModel extends AbstractCommunicatorMessageRESTModel {

  public CommunicatorSearchResultRESTModel(Long id, Long communicatorMessageId, Long senderId, CommunicatorSearchSenderRESTModel sender, 
      String categoryName, String caption, String content, Date created, Set<String> tags, 
      List<CommunicatorMessageRecipientRESTModel> recipients, 
      List<UserGroup> userGroupRecipients, 
      List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> workspaceRecipients, 
      Boolean readByReceiver, List<CommunicatorMessageIdLabelRESTModel> labels) {
    super(id, communicatorMessageId, senderId, categoryName, caption, created, tags);
    this.recipients = recipients;
    this.userGroupRecipients = userGroupRecipients;
    this.workspaceRecipients = workspaceRecipients;
    this.sender = sender;
    this.readByReceiver = readByReceiver;
    this.labels = labels;
  }

  public CommunicatorSearchSenderRESTModel getSender() {
    return sender;
  }

  public void setSender(CommunicatorSearchSenderRESTModel sender) {
    this.sender = sender;
  }
  
  public Boolean getReadByReceiver() {
    return readByReceiver;
  }
  
  public void setReadByReceiver(Boolean readByReceiver) {
    this.readByReceiver = readByReceiver;
  }
  
  public List<CommunicatorMessageIdLabelRESTModel> getLabels() {
    return labels;
  }

  public void setLabels(List<CommunicatorMessageIdLabelRESTModel> labels) {
    this.labels = labels;
  }

  public List<CommunicatorMessageRecipientRESTModel> getRecipients() {
    return recipients;
  }

  public void setRecipients(List<CommunicatorMessageRecipientRESTModel> recipients) {
    this.recipients = recipients;
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

  private CommunicatorSearchSenderRESTModel sender;
  private Boolean readByReceiver;
  private List<CommunicatorMessageIdLabelRESTModel> labels;
  private List<CommunicatorMessageRecipientRESTModel> recipients = new ArrayList<CommunicatorMessageRecipientRESTModel>();
  private List<UserGroup> userGroupRecipients;
  private List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> workspaceRecipients;
}
