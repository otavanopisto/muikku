package fi.otavanopisto.muikku.plugins.guider;

import java.util.ArrayList;
import java.util.List;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;

public class RecipientListRESTModel{

  public RecipientListRESTModel() {
  }

  public List<EnvironmentRoleArchetype> getRecipientRoles() {
    return recipientRoles;
  }

  public void setRecipientRoles(List<EnvironmentRoleArchetype> recipientRoles) {
    this.recipientRoles = recipientRoles;
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

  public List<Long> getRecipientIds() {
    return recipientIds;
  }

  public void setRecipientIds(List<Long> recipientIds) {
    this.recipientIds = recipientIds;
  }

  private List<Long> recipientIds = new ArrayList<Long>();

  private List<Long> recipientGroupIds = new ArrayList<Long>();
  
  private List<Long> recipientStudentsWorkspaceIds = new ArrayList<Long>();

  private List<Long> recipientTeachersWorkspaceIds = new ArrayList<Long>();
  
  private List<EnvironmentRoleArchetype> recipientRoles = new ArrayList<EnvironmentRoleArchetype>();
}
