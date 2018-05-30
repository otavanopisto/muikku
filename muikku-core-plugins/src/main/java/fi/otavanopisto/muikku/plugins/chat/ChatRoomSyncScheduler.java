package fi.otavanopisto.muikku.plugins.chat;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.infinispan.configuration.global.ShutdownHookBehavior;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.openfire.rest.client.RestApiClient;
import fi.otavanopisto.muikku.openfire.rest.client.entity.AuthenticationToken;
import fi.otavanopisto.muikku.openfire.rest.client.entity.MUCRoomEntity;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.rest.model.Student;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.users.UserController;

@Stateless
public class ChatRoomSyncScheduler {

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private UserChatSettingsDAO userChatSettingsDao;

  @Schedule(second = "0", minute = "*/15", hour = "*", persistent = false)
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void updateChatRooms() {
//    String enabledUsersCsv = pluginSettingsController.getPluginSetting("chat", "enabledUsers");
//    if (enabledUsersCsv == null) {
//      return;
//    }
//    List<String> enabledUsers = Arrays.asList(enabledUsersCsv.split(","));
//
    String enabledWorkspacesCsv = pluginSettingsController.getPluginSetting("chat", "enabledWorkspaces");
    if (enabledWorkspacesCsv == null) {
     return;
    }
    List<String> enabledWorkspaces = Arrays.asList(enabledWorkspacesCsv.split(","));
	  
	List<UserChatSettings> listUsers = userChatSettingsDao.listAll();
	  
	  if (listUsers == null) {
	    return;
	  }

    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.INFO, "No openfire token set, skipping room sync");
      return;
    }

    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.INFO, "No openfire url set, skipping room sync");
      return;
    }

    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.INFO, "No openfire port set, skipping room sync");
      return;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.WARNING, "Invalid openfire port, skipping room sync");
      return;
    }

    AuthenticationToken token = new AuthenticationToken(openfireToken);
    RestApiClient client = new RestApiClient(openfireUrl, Integer.parseInt(openfirePort, 10), token);

    for (String enabledWorkspace : enabledWorkspaces) {
      try {
        MUCRoomEntity chatRoomEntity = client.getChatRoom(enabledWorkspace);
        if (chatRoomEntity == null) {
          logger.log(Level.INFO, "Syncing chat workspace " + enabledWorkspace);
          SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(enabledWorkspace);
          if (identifier == null) {
            logger.log(Level.WARNING, "Invalid workspace identifier " + enabledWorkspace + ", skipping...");
            continue;
          }
          WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByIdentifier(identifier);
          if (workspaceEntity == null) {
            logger.log(Level.WARNING, "No workspace entity found for identifier " + enabledWorkspace + ", skipping...");
            continue;
          }

          Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
          chatRoomEntity = new MUCRoomEntity(enabledWorkspace, workspace.getName(), workspace.getDescription());
          client.createChatRoom(chatRoomEntity);

          List<WorkspaceUser> workspaceUsers = workspaceController.listWorkspaceStudents(workspaceEntity);
          List<WorkspaceUser> workspaceStaffs = workspaceController.listWorkspaceStaffMembers(workspaceEntity);
          boolean found = false;
          for (WorkspaceUser workspaceStaff : workspaceStaffs) {

            SchoolDataIdentifier memberIdentifier = workspaceStaff.getUserIdentifier();
            
            for (UserChatSettings listUser : listUsers) {
              if (listUser.getUserIdentifier().equals(memberIdentifier.toId())) {
            	found = true;
            	client.addAdmin(enabledWorkspace, memberIdentifier.toId());
              }
            }
          }

          for (WorkspaceUser workspaceUser : workspaceUsers) {

            SchoolDataIdentifier memberIdentifier = workspaceUser.getUserIdentifier();
            
            for (UserChatSettings listUser : listUsers) {
              if (listUser.getUserIdentifier().equals(memberIdentifier.toId())) {
            	found = true;
                client.addMember(enabledWorkspace, memberIdentifier.toId());
              }
            }
          }
        }

      } catch (Exception e) {
        logger.log(Level.INFO, "Exception when syncing chat workspace " + enabledWorkspace, e);
      }
    }
  }
}
