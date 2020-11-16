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
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserRemovedEvent;
import fi.otavanopisto.muikku.users.UserEntityController;

public class SyncStudentEventHandler {
  
  @Inject
  private ChatSyncController chatSyncController;
  
  @Inject
  private ChatController chatController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  public synchronized void onSchoolDataWorkspaceUserDiscoveredEvent(@Observes SchoolDataWorkspaceUserDiscoveredEvent event) {
    //kun kurssille pelmahtaa uusi opiskelija
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
 
  public synchronized void onSchoolDataWorkspaceUserRemovedEvent(@Observes SchoolDataWorkspaceUserRemovedEvent event) {
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
