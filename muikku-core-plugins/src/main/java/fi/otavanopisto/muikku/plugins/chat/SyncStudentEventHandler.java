package fi.otavanopisto.muikku.plugins.chat;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

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
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class SyncStudentEventHandler {
  
  @Inject
  private ChatSyncController chatSyncController;
  
  @Inject
  private ChatController chatController;
  
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
    
    WorkspaceEntity workspace = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceDataSource, workspaceIdentifier);
    
    WorkspaceChatSettings workspaceChatStatus = chatController.findWorkspaceChatSettings(workspace.getId());

    if (workspaceChatStatus != null && workspaceChatStatus.getStatus() == WorkspaceChatStatus.ENABLED) {
      chatSyncController.syncWorkspaceUser(workspace, user);
    }
  }

 
  public synchronized void onSchoolDataWorkspaceUserRemovedEvent(@Observes SchoolDataWorkspaceUserRemovedEvent event) {
    //kun kurssilta poistuu joku opiskelija    
    String userIdentifier = event.getUserIdentifier();
    String userDataSource = event.getUserDataSource();
    SchoolDataIdentifier user = new SchoolDataIdentifier(userIdentifier, userDataSource);
    String workspaceDataSource = event.getWorkspaceDataSource();
    String workspaceIdentifier = event.getWorkspaceIdentifier();
    
    WorkspaceEntity workspace = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceDataSource, workspaceIdentifier);
    
    chatSyncController.removeChatRoomMembership(user, workspace);
    
  }
  
  public synchronized void onWorkspaceChatSettingsEnabledEvent (@Observes WorkspaceChatSettingsEnabledEvent event) {
    //jos kurssin chatti pistetään päälle niin kaikki sen opiskelijat läpi ja ne, joilla on chatti päällä niin mukaan

    String workspaceIdentifier = event.getWorkspaceIdentifier();
    String workspaceDataSource = event.getWorkspaceDataSource();
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceDataSource, workspaceIdentifier);

    
    List<WorkspaceUserEntity> activeWorkspaceStudents = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);
    List<WorkspaceUserEntity> workspaceStaffMembers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
    for (WorkspaceUserEntity activeWorkspaceStudent : activeWorkspaceStudents) {
      SchoolDataIdentifier user = new SchoolDataIdentifier(activeWorkspaceStudent.getUserSchoolDataIdentifier().getIdentifier(), activeWorkspaceStudent.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
      
      UserChatSettings userChatSetting = chatController.findUserChatSettings(user);
      
      if (userChatSetting != null && UserChatVisibility.VISIBLE_TO_ALL.equals(userChatSetting.getVisibility())){
        chatSyncController.syncWorkspaceUser(workspaceEntity, user);
      }
      
    }
    
    for (WorkspaceUserEntity workspaceStaffMember : workspaceStaffMembers) {

      SchoolDataIdentifier user = new SchoolDataIdentifier(workspaceStaffMember.getUserSchoolDataIdentifier().getIdentifier(), workspaceStaffMember.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
      UserChatSettings userChatSetting = chatController.findUserChatSettings(user);
      
      if (userChatSetting != null && UserChatVisibility.VISIBLE_TO_ALL.equals(userChatSetting.getVisibility())){
        chatSyncController.syncWorkspaceUser(workspaceEntity, user);
      }
    }
  }
 
}
