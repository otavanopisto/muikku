package fi.otavanopisto.muikku.plugins.chat;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.WorkspaceChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.dao.users.UserSchoolDataIdentifierDAO;

public class ChatController {
  
  @Inject
  private UserChatSettingsDAO userChatSettingsDAO;
  
  @Inject
  private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;
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
  
  public WorkspaceChatSettings findWorkspaceChatSettings(WorkspaceEntity workspaceEntity) {
    return workspaceChatSettingsDAO.findByWorkspace(workspaceEntity.getId());
  }

  public WorkspaceChatSettings createWorkspaceChatSettings(WorkspaceEntity workspaceEntity, WorkspaceChatStatus status) {    
    return workspaceChatSettingsDAO.create(workspaceEntity.getId(), status);
  }

  public WorkspaceChatSettings updateWorkspaceChatSettings(WorkspaceChatSettings settings, WorkspaceChatStatus status) {
    return workspaceChatSettingsDAO.updateSettings(settings, status);
  }
  
  public List<UserSchoolDataIdentifier> listByOrganizationAndRoles(int i, List<String> roles){ {
    
    List<UserSchoolDataIdentifier> result = userSchoolDataIdentifierDAO.listByOrganizationAndRoles(i, roles);

    return result;
  }
}
}
