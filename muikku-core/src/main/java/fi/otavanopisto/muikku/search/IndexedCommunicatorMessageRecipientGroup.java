package fi.otavanopisto.muikku.search;

import java.util.ArrayList;
import java.util.List;

/**
 * Common message recipient group descriptor for all recipient groups
 * * UserGroups
 * * WorkspaceUserGroups (teachers/students)
 */
public class IndexedCommunicatorMessageRecipientGroup {

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

  private String groupName;
  private List<IndexedCommunicatorMessageRecipient> recipients = new ArrayList<>();
}
