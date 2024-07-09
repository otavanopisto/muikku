package fi.otavanopisto.muikku.plugins.communicator;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageIdDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class UserRecipientController {
  
  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;


  @Inject
  private CommunicatorMessageIdDAO communicatorMessageIdDAO;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  public CommunicatorMessageId createMessageId() {
    return communicatorMessageIdDAO.create();
  }
  
  /**
   * Prepares a communicator message recipient list.
   * 
   * Drops recipients that are considered duplicates, inactive users or 
   * the sender (as a group recipient - the sender can send messages to 
   * themselves if they're listed as individual recipients).
   * 
   * @param sender the user sending the message
   * @param userRecipients the individual user recipients
   * @param userGroupRecipients the user groups whose members should receive the message
   * @param workspaceStudentRecipients the workspaces whose students should receive the message
   * @param workspaceTeacherRecipients the workspaces whose teachers should receive the message
   * @return the recipient list
   */
  public CommunicatorMessageRecipientList prepareRecipientList(UserEntity sender, List<UserEntity> userRecipients, 
      List<UserGroupEntity> userGroupRecipients, List<WorkspaceEntity> workspaceStudentRecipients, 
      List<WorkspaceEntity> workspaceTeacherRecipients, List<EnvironmentRoleArchetype> roles) {
    CommunicatorMessageRecipientList preparedRecipientList = new CommunicatorMessageRecipientList();
    
    // Clean duplicates from recipient list
    cleanDuplicateRecipients(userRecipients);
     
    for (UserEntity recipient : userRecipients) {
      // #3758: Only send messages to active users
      UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(recipient);
      
      Boolean recipientRole = hasAnyRole(roles, usdi);
      if (isActiveUser(recipient) && (roles.isEmpty() || recipientRole)) {
        preparedRecipientList.addRecipient(recipient);
      }
    }
    
    if (!CollectionUtils.isEmpty(userGroupRecipients)) {
      for (UserGroupEntity userGroup : userGroupRecipients) {
        List<UserGroupUserEntity> groupUsers = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(userGroup);

        if (!CollectionUtils.isEmpty(groupUsers)) {
          for (UserGroupUserEntity groupUser : groupUsers) {
            UserSchoolDataIdentifier userSchoolDataIdentifier = groupUser.getUserSchoolDataIdentifier();
            UserEntity recipient = userSchoolDataIdentifier.getUserEntity();
            // #3758: Only send messages to active students
            // #4920: Only message students' current study programmes
            if (!isActiveUser(userSchoolDataIdentifier)) {
              continue;
            }
            if ((recipient != null) && !Objects.equals(sender.getId(), recipient.getId())) {
              preparedRecipientList.addUserGroupRecipient(userGroup, recipient);
            }
          }
        }
      }
    }

    // Workspace members

    if (!CollectionUtils.isEmpty(workspaceStudentRecipients)) {
      for (WorkspaceEntity workspaceEntity : workspaceStudentRecipients) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);

        if (!CollectionUtils.isEmpty(workspaceUsers)) {
          for (WorkspaceUserEntity workspaceUserEntity : workspaceUsers) {
            UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
            UserEntity recipient = userSchoolDataIdentifier.getUserEntity();
            
            Boolean recipientRole = hasAnyRole(roles, userSchoolDataIdentifier);
            // #3758: Only send messages to active students
            // #4920: Only message students' current study programmes
            if (!isActiveUser(userSchoolDataIdentifier) && (!roles.isEmpty() && !recipientRole)) {
              continue;
            }
            if ((recipient != null) && !Objects.equals(sender.getId(), recipient.getId())) {
              preparedRecipientList.addWorkspaceStudentRecipient(workspaceEntity, recipient);
            }
          }
        }
      }
    }

    if (!CollectionUtils.isEmpty(workspaceTeacherRecipients)) {
      for (WorkspaceEntity workspaceEntity : workspaceTeacherRecipients) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
        
        if (!CollectionUtils.isEmpty(workspaceUsers)) {
          for (WorkspaceUserEntity wosu : workspaceUsers) {
            UserEntity recipient = wosu.getUserSchoolDataIdentifier().getUserEntity();
            
            // Skip if role list is empty or role list doesn't contain wosu's role
            if (!roles.isEmpty() && !hasAnyRole(roles, wosu.getUserSchoolDataIdentifier())) {
              continue;
            }
            // #3758: Workspace teachers are considered active, no need to check
            if ((recipient != null) && !Objects.equals(sender.getId(), recipient.getId())) {
              preparedRecipientList.addWorkspaceTeacherRecipient(workspaceEntity, recipient);
            }
          }
        }
      }
    }

    return preparedRecipientList;
  }
  
  public boolean isActiveUser(UserEntity userEntity) {
    return isActiveUser(userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userEntity.defaultSchoolDataIdentifier()));
  }
  
  private boolean hasAnyRole (List<EnvironmentRoleArchetype> roles, UserSchoolDataIdentifier userSchoolDataIdentifier) {

    EnvironmentRoleArchetype[] roleArray = roles.toArray(new EnvironmentRoleArchetype[0]);
    
    return userSchoolDataIdentifier.hasAnyRole(roleArray);
  }
  
  private boolean isActiveUser(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    EnvironmentRoleArchetype[] staffRoles = {
        EnvironmentRoleArchetype.ADMINISTRATOR, 
        EnvironmentRoleArchetype.MANAGER, 
        EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER,
        EnvironmentRoleArchetype.STUDY_GUIDER,
        EnvironmentRoleArchetype.TEACHER
    };
    
    if (!userSchoolDataIdentifier.hasAnyRole(staffRoles)) {
      SearchProvider searchProvider = getProvider("elastic-search");
      if (searchProvider != null) {
        SearchResult searchResult = searchProvider.findUser(userSchoolDataIdentifier.schoolDataIdentifier(), false);
        return searchResult.getTotalHitCount() > 0;
      }
    }
    return true;
  }
  
  private SearchProvider getProvider(String name) {
    for (SearchProvider searchProvider : searchProviders) {
      if (name.equals(searchProvider.getName())) {
        return searchProvider;
      }
    }
    return null;
  }
  
  /**
   * Cleans list of UserEntities so that there are no duplicates present. Returns the original list.
   * 
   * @param userEntities
   * @return
   */
  public void cleanDuplicateRecipients(List<UserEntity> userEntities) {
    Set<Long> userIds = new HashSet<Long>(userEntities.size());
    
    for (int i = userEntities.size() - 1; i >= 0; i--) {
      if (userEntities.get(i) != null) {
        Long userId = userEntities.get(i).getId();
        
        if (!userIds.contains(userId))
          userIds.add(userId);
        else
          userEntities.remove(i);
      } else
        userEntities.remove(i);
    }
  }

}