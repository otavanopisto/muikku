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


public class ChatController {
  
  @Inject
  private UserChatSettingsDAO userChatSettingsDAO;
  @Inject
  private WorkspaceChatSettingsDAO workspaceChatSettingsDAO;
  @Inject
  private WorkspaceEntity workspaceEntity;
  
  public UserChatSettings findUserChatSettings(SchoolDataIdentifier userIdentifier) {
    return userChatSettingsDAO.findByUser(userIdentifier);
  }

  public UserChatSettings createUserChatSettings(SchoolDataIdentifier userIdentifier, UserChatVisibility visibility) {
    return userChatSettingsDAO.create(userIdentifier.toId(), visibility);
  }

  public UserChatSettings updateUserChatSettings(UserChatSettings settings, UserChatVisibility visibility) {
    return userChatSettingsDAO.updateVisibility(settings, visibility);
  }
  
  public WorkspaceChatSettings findWorkspaceChatSettings(String workspaceIdentifier) {
    workspaceIdentifier = workspaceEntity.getIdentifier();
    return workspaceChatSettingsDAO.findByWorkspace(workspaceIdentifier);
  }

  public WorkspaceChatSettings createWorkspaceChatSettings(String workspaceIdentifier, WorkspaceChatStatus status) {
    workspaceIdentifier = workspaceEntity.getIdentifier();
    return workspaceChatSettingsDAO.create(workspaceIdentifier, status);
  }

  public WorkspaceChatSettings updateWorkspaceChatSettings(WorkspaceChatSettings settings, WorkspaceChatStatus status) {
    return workspaceChatSettingsDAO.updateSettings(settings, status);
  }
}
