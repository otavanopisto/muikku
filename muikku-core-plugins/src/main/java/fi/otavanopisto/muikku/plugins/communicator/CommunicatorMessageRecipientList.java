package fi.otavanopisto.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;

public class CommunicatorMessageRecipientList {
  
  /**
   * Returns true if there is at least one recipient.
   * @return true if there is at least one recipient
   */
  public boolean hasRecipients() {
    return CollectionUtils.isNotEmpty(recipientIds);
  }

  public boolean addRecipient(UserEntity recipient) {
    if (!recipientIds.contains(recipient.getId())) {
      this.recipientIds.add(recipient.getId());
      this.recipients.add(recipient);
      return true;
    }
    return false;
  }

  public List<UserEntity> getUserRecipients() {
    return this.recipients;
  }
  
  public boolean addUserGroupRecipient(UserGroupEntity userGroup, UserEntity recipient) {
    if (!recipientIds.contains(recipient.getId())) {
      UserGroupRecipient userGroupRecipient = userGroupRecipients.get(userGroup.getId());
      if (userGroupRecipient == null) {
        userGroupRecipient = new UserGroupRecipient(userGroup);
        userGroupRecipients.put(userGroup.getId(), userGroupRecipient);
      }
      
      this.recipientIds.add(recipient.getId());
      userGroupRecipient.addRecipient(recipient);
      return true;
    }
    return false;
  }

  public List<UserGroupEntity> getUserGroups() {
    return this.userGroupRecipients.values().stream()
        .map(UserGroupRecipient::getUserGroupEntity)
        .collect(Collectors.toList());
  }

  public List<UserEntity> getUserGroupRecipients(UserGroupEntity userGroupEntity) {
    UserGroupRecipient userGroupRecipient = userGroupRecipients.get(userGroupEntity.getId());
    return userGroupRecipient.getRecipients();
  }
  
  public boolean addWorkspaceStudentRecipient(WorkspaceEntity workspaceEntity, UserEntity recipient) {
    if (!recipientIds.contains(recipient.getId())) {
      WorkspaceRecipient workspaceRecipient = studentWorkspaceRecipients.get(workspaceEntity.getId());
      if (workspaceRecipient == null) {
        workspaceRecipient = new WorkspaceRecipient(workspaceEntity);
        studentWorkspaceRecipients.put(workspaceEntity.getId(), workspaceRecipient);
      }
      
      this.recipientIds.add(recipient.getId());
      workspaceRecipient.addRecipient(recipient);
      return true;
    }
    return false;
  }
  
  public List<WorkspaceEntity> getStudentWorkspaces() {
    return this.studentWorkspaceRecipients.values().stream()
        .map(WorkspaceRecipient::getWorkspaceEntity)
        .collect(Collectors.toList());
  }
  
  public List<UserEntity> getWorkspaceStudentRecipients(WorkspaceEntity workspaceEntity) {
    WorkspaceRecipient workspaceRecipient = studentWorkspaceRecipients.get(workspaceEntity.getId());
    return workspaceRecipient.getRecipients();
  }
  
  public boolean addWorkspaceTeacherRecipient(WorkspaceEntity workspaceEntity, UserEntity recipient) {
    if (!recipientIds.contains(recipient.getId())) {
      WorkspaceRecipient workspaceRecipient = teacherWorkspaceRecipients.get(workspaceEntity.getId());
      if (workspaceRecipient == null) {
        workspaceRecipient = new WorkspaceRecipient(workspaceEntity);
        teacherWorkspaceRecipients.put(workspaceEntity.getId(), workspaceRecipient);
      }
      
      this.recipientIds.add(recipient.getId());
      workspaceRecipient.addRecipient(recipient);
      return true;
    }
    return false;
  }
  
  public List<WorkspaceEntity> getTeacherWorkspaces() {
    return this.teacherWorkspaceRecipients.values().stream()
        .map(WorkspaceRecipient::getWorkspaceEntity)
        .collect(Collectors.toList());
  }
  
  public List<UserEntity> getWorkspaceTeacherRecipients(WorkspaceEntity workspaceEntity) {
    WorkspaceRecipient workspaceRecipient = teacherWorkspaceRecipients.get(workspaceEntity.getId());
    return workspaceRecipient.getRecipients();
  }
  
  public Set<Long> getRecipientIds(){
    return this.recipientIds;
  }
  private Set<Long> recipientIds = new HashSet<Long>();
  private List<UserEntity> recipients = new ArrayList<>();
  private Map<Long, UserGroupRecipient> userGroupRecipients = new HashMap<>();
  private Map<Long, WorkspaceRecipient> teacherWorkspaceRecipients = new HashMap<>();
  private Map<Long, WorkspaceRecipient> studentWorkspaceRecipients = new HashMap<>();
  
  private class UserGroupRecipient {
    
    public UserGroupRecipient(UserGroupEntity userGroup) {
      this.userGroup = userGroup;
    }

    public void addRecipient(UserEntity recipient) {
      this.recipients.add(recipient);
    }
    
    public List<UserEntity> getRecipients() {
      return recipients;
    }
    
    public UserGroupEntity getUserGroupEntity() {
      return userGroup;
    }

    private final UserGroupEntity userGroup;
    private List<UserEntity> recipients = new ArrayList<>();
  }
  
  private class WorkspaceRecipient {
    
    public WorkspaceRecipient(WorkspaceEntity workspaceEntity) {
      this.workspaceEntity = workspaceEntity;
    }

    public void addRecipient(UserEntity recipient) {
      this.recipients.add(recipient);
    }
    
    public List<UserEntity> getRecipients() {
      return recipients;
    }
    
    public WorkspaceEntity getWorkspaceEntity() {
      return workspaceEntity;
    }

    private final WorkspaceEntity workspaceEntity;
    private List<UserEntity> recipients = new ArrayList<>();
  }
}
