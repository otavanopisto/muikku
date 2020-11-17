package fi.otavanopisto.muikku.plugins.chat;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.WorkspaceChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;

public class ChatController {
  
  @Inject
  private UserChatSettingsDAO userChatSettingsDAO;
  
  @Inject
  private WorkspaceChatSettingsDAO workspaceChatSettingsDAO;

  public UserChatSettings findUserChatSettings(UserEntity userEntity) {
    return userChatSettingsDAO.findByUserEntityId(userEntity.getId());
  }

  public UserChatSettings findUserChatSettingsByNick(String nick) {
    return userChatSettingsDAO.findByNick(nick);
  }

  public UserChatSettings createUserChatSettings(UserEntity userEntity, UserChatVisibility visibility, String nick) {
    return userChatSettingsDAO.create(userEntity.getId(), visibility, nick);
  }

  public void deleteUserChatSettings(UserChatSettings userChatSettings) {
    userChatSettingsDAO.delete(userChatSettings);
  }

  public UserChatSettings updateNickAndVisibility(UserChatSettings settings, String nick, UserChatVisibility visibility) {
    return userChatSettingsDAO.updateNickAndVisibility(settings, nick, visibility);
  }

  public WorkspaceChatSettings findWorkspaceChatSettings(WorkspaceEntity workspaceEntity) {
    return workspaceChatSettingsDAO.findByWorkspace(workspaceEntity.getId());
  }

  public WorkspaceChatSettings createWorkspaceChatSettings(WorkspaceEntity workspaceEntity, WorkspaceChatStatus status) {    
    return workspaceChatSettingsDAO.create(workspaceEntity.getId(), status);
  }

  public WorkspaceChatSettings updateWorkspaceChatSettings(WorkspaceChatSettings settings, WorkspaceChatStatus status) {
    return workspaceChatSettingsDAO.updateSettings(settings, status);
  }
  
  public void deleteWorkspaceChatSettings(WorkspaceChatSettings settings) {
    workspaceChatSettingsDAO.delete(settings);
  }

}
