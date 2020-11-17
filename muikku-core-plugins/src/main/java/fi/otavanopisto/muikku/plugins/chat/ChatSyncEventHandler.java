package fi.otavanopisto.muikku.plugins.chat;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceRemovedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUpdatedEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserRemovedEvent;
import fi.otavanopisto.muikku.users.UserEntityController;

public class ChatSyncEventHandler {
  
  @Inject
  private ChatSyncController chatSyncController;
  
  @Inject
  private ChatController chatController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  // Workspace has been updated
  public void onSchoolDataWorkspaceUpdatedEvent(@Observes SchoolDataWorkspaceUpdatedEvent event) {
    String workspaceDataSource = event.getDataSource();
    String workspaceIdentifier = event.getIdentifier();
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceDataSource, workspaceIdentifier);
    WorkspaceChatSettings workspaceChatSettings = chatController.findWorkspaceChatSettings(workspaceEntity);
    if (workspaceChatSettings != null && workspaceChatSettings.getStatus() == WorkspaceChatStatus.ENABLED) {
      chatSyncController.ensureRoomNameUpToDate(workspaceEntity);
    }
  }
  
  // Workspace has been removed
  public void onSchoolDataWorkspaceRemovedEvent(@Observes SchoolDataWorkspaceRemovedEvent event) {
    String workspaceDataSource = event.getDataSource();
    String workspaceIdentifier = event.getIdentifier();
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceDataSource, workspaceIdentifier);
    WorkspaceChatSettings workspaceChatSettings = chatController.findWorkspaceChatSettings(workspaceEntity);
    if (workspaceChatSettings != null && workspaceChatSettings.getStatus() == WorkspaceChatStatus.ENABLED) {
      // Turn off chat in workspace
      chatController.deleteWorkspaceChatSettings(workspaceChatSettings);
      // Delete workspace chat room
      chatSyncController.removeWorkspaceChatRoom(workspaceIdentifier);
    }
  }

  // New student has entered a workspace
  public void onSchoolDataWorkspaceUserDiscoveredEvent(@Observes SchoolDataWorkspaceUserDiscoveredEvent event) {
    String userIdentifier = event.getUserIdentifier();
    String userDataSource = event.getUserDataSource();
    SchoolDataIdentifier user = new SchoolDataIdentifier(userIdentifier, userDataSource);
    String workspaceDataSource = event.getWorkspaceDataSource();
    String workspaceIdentifier = event.getWorkspaceIdentifier();
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceDataSource, workspaceIdentifier);
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(user);
    
    WorkspaceChatSettings workspaceChatStatus = chatController.findWorkspaceChatSettings(workspaceEntity);

    if (workspaceChatStatus != null && workspaceChatStatus.getStatus() == WorkspaceChatStatus.ENABLED) {
      UserChatSettings userChatSettings = chatController.findUserChatSettings(userEntity);
      if (userChatSettings != null && userChatSettings.getVisibility() == UserChatVisibility.VISIBLE_TO_ALL) {
        chatSyncController.syncWorkspaceUser(workspaceEntity, userEntity);
      }
    }
  }
 
  // Student has been removed from a workspace
  public void onSchoolDataWorkspaceUserRemovedEvent(@Observes SchoolDataWorkspaceUserRemovedEvent event) {
    //kun kurssilta poistuu joku opiskelija    
    String userIdentifier = event.getUserIdentifier();
    String userDataSource = event.getUserDataSource();
    SchoolDataIdentifier user = new SchoolDataIdentifier(userIdentifier, userDataSource);
    String workspaceDataSource = event.getWorkspaceDataSource();
    String workspaceIdentifier = event.getWorkspaceIdentifier();
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceDataSource, workspaceIdentifier);
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(user);
    
    WorkspaceChatSettings workspaceChatStatus = chatController.findWorkspaceChatSettings(workspaceEntity);
    
    if (workspaceChatStatus != null && workspaceChatStatus.getStatus() == WorkspaceChatStatus.ENABLED) {
      UserChatSettings userChatSettings = chatController.findUserChatSettings(userEntity);
      if (userChatSettings != null && userChatSettings.getVisibility() == UserChatVisibility.VISIBLE_TO_ALL) {
        chatSyncController.removeChatRoomMembership(userEntity, workspaceEntity);
      }
    }
  }
 
}
