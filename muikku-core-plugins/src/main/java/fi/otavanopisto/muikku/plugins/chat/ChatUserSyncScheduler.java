package fi.otavanopisto.muikku.plugins.chat;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Resource;
import javax.ejb.EJBContext;
import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import org.igniterealtime.restclient.entity.AuthenticationToken;

import fi.otavanopisto.muikku.controller.PluginSettingsController;

@Stateless
public class ChatUserSyncScheduler {
  
  @Inject
  PluginSettingsController pluginSettingsController;

  @Resource
  EJBContext ejbContext;

  @Schedule(second = "0", minute = "0", hour = "*")
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void updateChatUsers() {
    
    String enabledUsersCsv = pluginSettingsController.getPluginSetting("chat", "enabledUsers");
    if (enabledUsersCsv == null) {
      enabledUsersCsv = "";
    }
    List<String> enabledUsers = Arrays.asList(enabledUsersCsv.split(","));

    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    AuthenticationToken token = new AuthenticationToken(openfireToken);
    for (String enabledUser : enabledUsers) {
      try {
      } catch (Exception e) {
      }
    }
  }
}
