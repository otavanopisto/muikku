package fi.otavanopisto.muikku.plugins.chat;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.EJBContext;
import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.igniterealtime.restclient.RestApiClient;
import org.igniterealtime.restclient.entity.AuthenticationToken;
import org.igniterealtime.restclient.entity.UserEntity;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserController;

@Stateless
public class ChatUserSyncScheduler {
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @Resource
  private EJBContext ejbContext;
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserController userController;

  @Schedule(second = "0", minute = "*/15", hour = "*")
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void updateChatUsers() {
    
    String enabledUsersCsv = pluginSettingsController.getPluginSetting("chat", "enabledUsers");
    if (enabledUsersCsv == null) {
      return;
    }
    List<String> enabledUsers = Arrays.asList(enabledUsersCsv.split(","));

    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.INFO, "No openfire token set, skipping user sync");
      return;
    }
      
    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.INFO, "No openfire url set, skipping user sync");
      return;
    }

    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.INFO, "No openfire port set, skipping user sync");
      return;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.WARNING, "Invalid openfire port, skipping user sync");
      return;
    }

    AuthenticationToken token = new AuthenticationToken(openfireToken);
    RestApiClient client = new RestApiClient(openfireUrl, Integer.parseInt(openfirePort, 10), token);
    for (String enabledUser : enabledUsers) {
      try {
        // Checking before creating is subject to a race condition, but in the worst case
        // the creation just fails, resulting in a log entry
        UserEntity userEntity = client.getUser(enabledUser);
        if (userEntity == null) {
          SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(enabledUser);
          if (identifier == null) {
            logger.log(Level.WARNING, "Invalid user identifier %s, skipping...", enabledUser);
            continue;
          }
          User user = userController.findUserByIdentifier(identifier);
          if (user == null) {
            logger.log(Level.WARNING, "No user found for identifier %s, skipping...", enabledUser);
            continue;
          }
          userEntity = new UserEntity(enabledUser, user.getDisplayName(), "", "");
          client.createUser(userEntity);
        }
      } catch (Exception e) {
        logger.log(Level.INFO, "Exception when syncing user " + enabledUser, e);
      }
    }
  }
}
