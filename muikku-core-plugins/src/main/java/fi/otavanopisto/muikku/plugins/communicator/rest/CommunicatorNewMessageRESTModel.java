package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

public class CommunicatorNewMessageRESTModel extends CommunicatorMessageRESTModel {

  public CommunicatorNewMessageRESTModel() {
  }
  
  public CommunicatorNewMessageRESTModel(Long id, Long communicatorMessageId, Long senderId, String categoryName, String caption, 
      String content, Date created, Set<String> tags, List<Long> recipientIds, List<Long> recipientGroupIds, 
      List<Long> recipientTeachersWorkspaceIds, List<Long> recipientStudentsWorkspaceIds) {
    super(id, communicatorMessageId, senderId, categoryName, caption, content, created, tags, recipientIds);

    this.recipientGroupIds = recipientGroupIds;
    this.recipientStudentsWorkspaceIds = recipientStudentsWorkspaceIds;
    this.recipientTeachersWorkspaceIds = recipientTeachersWorkspaceIds;
  }

  public List<Long> getRecipientGroupIds() {
    return recipientGroupIds;
  }

  public void setRecipientGroupIds(List<Long> recipientGroupIds) {
    this.recipientGroupIds = recipientGroupIds;
  }

  public List<Long> getRecipientStudentsWorkspaceIds() {
    return recipientStudentsWorkspaceIds;
  }

  public void setRecipientStudentsWorkspaceIds(List<Long> recipientStudentsWorkspaceIds) {
    this.recipientStudentsWorkspaceIds = recipientStudentsWorkspaceIds;
  }

  public List<Long> getRecipientTeachersWorkspaceIds() {
    return recipientTeachersWorkspaceIds;
  }

  public void setRecipientTeachersWorkspaceIds(List<Long> recipientTeachersWorkspaceIds) {
    this.recipientTeachersWorkspaceIds = recipientTeachersWorkspaceIds;
  }

  private List<Long> recipientGroupIds = new ArrayList<Long>();
  
  private List<Long> recipientStudentsWorkspaceIds = new ArrayList<Long>();

  private List<Long> recipientTeachersWorkspaceIds = new ArrayList<Long>();
}
