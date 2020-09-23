package fi.otavanopisto.muikku.plugins.chat;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUserRemovedEvent;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class SyncStudentEventHandler {
  
  @Inject
  private ChatSyncController chatSyncController;
  
  @Inject
  private ChatController chatController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
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
      chatSyncController.syncWorkspaceUser(workspaceEntity, userEntity);
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
      chatSyncController.removeChatRoomMembership(userEntity, workspaceEntity);
    }
  }
  
  public synchronized void onWorkspaceChatSettingsEnabledEvent (@Observes WorkspaceChatSettingsEnabledEvent event) {
    //jos kurssin chatti pistetään päälle niin kaikki sen opiskelijat läpi ja ne, joilla on chatti päällä niin mukaan

    String workspaceIdentifier = event.getWorkspaceIdentifier();
    String workspaceDataSource = event.getWorkspaceDataSource();
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceDataSource, workspaceIdentifier);

    List<WorkspaceUserEntity> activeWorkspaceStudents = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);
    List<WorkspaceUserEntity> workspaceStaffMembers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
    for (WorkspaceUserEntity activeWorkspaceStudent : activeWorkspaceStudents) {
      UserEntity userEntity = activeWorkspaceStudent.getUserSchoolDataIdentifier().getUserEntity();
      UserChatSettings userChatSetting = chatController.findUserChatSettings(userEntity);
      if (userChatSetting != null && UserChatVisibility.VISIBLE_TO_ALL.equals(userChatSetting.getVisibility())){
        chatSyncController.syncWorkspaceUser(workspaceEntity, userEntity);
      }
    }
    
    for (WorkspaceUserEntity workspaceStaffMember : workspaceStaffMembers) {
      UserEntity userEntity = workspaceStaffMember.getUserSchoolDataIdentifier().getUserEntity();
      UserChatSettings userChatSetting = chatController.findUserChatSettings(userEntity);
      if (userChatSetting != null && UserChatVisibility.VISIBLE_TO_ALL.equals(userChatSetting.getVisibility())){
        chatSyncController.syncWorkspaceUser(workspaceEntity, userEntity);
      }
    }
  }
 
}
