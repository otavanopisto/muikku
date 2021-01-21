package fi.otavanopisto.muikku.search;

import java.util.ArrayList;
import java.util.List;

public class IndexedCommunicatorMessageRecipientGroup {

  public Long getUserGroupEntityId() {
    return userGroupEntityId;
  }
  
  public void setUserGroupEntityId(Long userGroupEntityId) {
    this.userGroupEntityId = userGroupEntityId;
  }

  public String getGroupName() {
    return groupName;
  }

  public void setGroupName(String groupName) {
    this.groupName = groupName;
  }

  public List<IndexedCommunicatorMessageRecipient> getRecipients() {
    return recipients;
  }

  public void setRecipients(List<IndexedCommunicatorMessageRecipient> recipients) {
    this.recipients = recipients;
  }

  private Long userGroupEntityId;
  private String groupName;
  private List<IndexedCommunicatorMessageRecipient> recipients = new ArrayList<>();
}
