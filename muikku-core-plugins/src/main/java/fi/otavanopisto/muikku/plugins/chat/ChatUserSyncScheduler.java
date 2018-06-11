package fi.otavanopisto.muikku.plugins.chat;

import java.security.SecureRandom;
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

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.openfire.rest.client.RestApiClient;
import fi.otavanopisto.muikku.openfire.rest.client.entity.AuthenticationToken;
import fi.otavanopisto.muikku.openfire.rest.client.entity.UserEntity;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
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
  
  @Inject
  private UserChatSettingsDAO userChatSettingsDao;

  @Schedule(second = "0", minute = "*/15", hour = "*", persistent = false)
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void updateChatUsers() {

	List<UserChatSettings> listUsers = userChatSettingsDao.listAll();
	  
  
    if (CollectionUtils.isEmpty(listUsers)) {
      return;
    }

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
    
    SecureRandom random = new SecureRandom();
    
    for (UserChatSettings listUser : listUsers) {
      try {
        // Checking before creating is subject to a race condition, but in the worst case
        // the creation just fails, resulting in a log entry
        UserEntity userEntity = client.getUser(listUser.getUserIdentifier());
        if (userEntity == null) {
          logger.log(Level.INFO, "Syncing chat user " + listUser.getUserIdentifier());
          SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(listUser.getUserIdentifier());
          if (identifier == null) {
            logger.log(Level.WARNING, "Invalid user identifier " + listUser.getUserIdentifier() + ", skipping...");

          }
          User user = userController.findUserByIdentifier(identifier);
          if (user == null) {
            logger.log(Level.WARNING, "No user found for identifier " + listUser.getUserIdentifier() + ", skipping...");

          }
          
          // Can't leave the password empty, so next best thing is random passwords
          // The passwords are not actually used
          byte[] passwordBytes = new byte[20];
          random.nextBytes(passwordBytes);
          String password = Base64.encodeBase64String(passwordBytes);

          userEntity = new UserEntity(listUser.getUserIdentifier(), user.getDisplayName(), "", password);
          client.createUser(userEntity);
        }
      } catch (Exception e) {
        logger.log(Level.INFO, "Exception when syncing user " + listUser.getUserIdentifier(), e);
      }
    
  }
}}
