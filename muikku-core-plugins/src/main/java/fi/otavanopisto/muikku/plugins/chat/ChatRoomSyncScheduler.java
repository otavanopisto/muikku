package fi.otavanopisto.muikku.plugins.chat;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.openfire.rest.client.RestApiClient;
import fi.otavanopisto.muikku.openfire.rest.client.entity.AuthenticationToken;
import fi.otavanopisto.muikku.openfire.rest.client.entity.MUCRoomEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;

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

  @Schedule(second = "*", minute = "*/15", hour = "*")
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void updateChatRooms() {
    
    String enabledWorkspacesCsv = pluginSettingsController.getPluginSetting("chat", "enabledWorkspaces");
    if (enabledWorkspacesCsv == null) {
      return;
    }
    List<String> enabledWorkspaces = Arrays.asList(enabledWorkspacesCsv.split(","));

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
        // Checking before creating is subject to a race condition, but in the worst case
        // the creation just fails, resulting in a log entry
        MUCRoomEntity chatRoomEntity = client.getChatRoom(enabledWorkspace);
        if (chatRoomEntity == null) {
          logger.log(Level.INFO, "Syncing chat workspace " + enabledWorkspace);
          SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(enabledWorkspace);
          if (identifier == null) {
            logger.log(Level.WARNING, "Invalid workspace identifier " + enabledWorkspace + ", skipping...");
            continue;
          }
          WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByUrlName(enabledWorkspace);
          if (workspaceEntity == null) {
            logger.log(Level.WARNING, "No workspace entity found for identifier " + enabledWorkspace + ", skipping...");
            continue;
          }

          Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
          chatRoomEntity = new MUCRoomEntity(
              enabledWorkspace,
              workspace.getName(),
              workspace.getDescription());
          client.createChatRoom(chatRoomEntity);
        }
      } catch (Exception e) {
        logger.log(Level.INFO, "Exception when syncing chat workspace " + enabledWorkspace, e);
      }
    }
  }
}
