package fi.otavanopisto.muikku.plugins.chat;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.WorkspaceChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

public class ChatController {
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private UserChatSettingsDAO userChatSettingsDAO;
  
  @Inject
  private WorkspaceChatSettingsDAO workspaceChatSettingsDAO;

  public boolean isChatAvailable() {
    return sessionController.isLoggedIn() ? isChatAvailable(sessionController.getLoggedUser()) : false;
  }
  
  public boolean isChatAvailable(SchoolDataIdentifier userIdentifier) {
    if (userIdentifier != null) {
      
      // Chat is always available for admins
      
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
      if (userSchoolDataIdentifier != null && userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
        return true;
      }
      
      // Plugin setting chat.enabledOrganizations (if not defined, chat is not active)
      
      String enabledOrganizationsStr = pluginSettingsController.getPluginSetting("chat", "enabledOrganizations");
      if (StringUtils.isNotBlank(enabledOrganizationsStr)) {
        Set<SchoolDataIdentifier> organizationIdentifiers = Arrays.stream(StringUtils.split(enabledOrganizationsStr, ','))
            .map(identifier -> SchoolDataIdentifier.fromId(identifier))
            .collect(Collectors.toSet());

        if (userSchoolDataIdentifier != null) {
          OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();
          if (organization != null) {
            SchoolDataIdentifier userOrganizationIdentifier = organization.schoolDataIdentifier();
            return organizationIdentifiers.contains(userOrganizationIdentifier);
          }
        }
      }
    }
    return false;
  }

  /**
   * Returns true if chat is available and enabled to given user
   * 
   * @param userEntity
   * @return
   */
  public boolean isChatEnabled(UserEntity userEntity) {
    return isChatAvailable(userEntity.defaultSchoolDataIdentifier()) && findUserChatSettings(userEntity) != null;
  }
  
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
