package fi.otavanopisto.muikku.plugins.chat;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.WorkspaceChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;


public class ChatController {
  
  @Inject
  private UserChatSettingsDAO userChatSettingsDAO;
  @Inject
  private WorkspaceChatSettingsDAO workspaceChatSettingsDAO;
  public UserChatSettings findUserChatSettings(SchoolDataIdentifier userIdentifier) {
    return userChatSettingsDAO.findByUser(userIdentifier);
  }

  public UserChatSettings createUserChatSettings(SchoolDataIdentifier userIdentifier, UserChatVisibility visibility, String nick) {
    return userChatSettingsDAO.create(userIdentifier.toId(), visibility, nick);
  }

  public UserChatSettings updateUserChatVisibility(UserChatSettings settings, UserChatVisibility visibility) {
    return userChatSettingsDAO.updateVisibility(settings, visibility);
  }
  
  public UserChatSettings updateChatNick(UserChatSettings settings, String nick) {
    return userChatSettingsDAO.updateNick(settings, nick);
  }
  
  public WorkspaceChatSettings findWorkspaceChatSettings(Long workspaceEntityId) {
    return workspaceChatSettingsDAO.findByWorkspace(workspaceEntityId);
  }

  public WorkspaceChatSettings createWorkspaceChatSettings(Long workspaceEntity, WorkspaceChatStatus status) {    
    return workspaceChatSettingsDAO.create(workspaceEntity, status);
  }

  public WorkspaceChatSettings updateWorkspaceChatSettings(WorkspaceChatSettings settings, WorkspaceChatStatus status) {
    return workspaceChatSettingsDAO.updateSettings(settings, status);
  }
}
