package fi.otavanopisto.muikku.plugins.chat;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class ChatController {
  
  @Inject
  private UserChatSettingsDAO userChatSettingsDAO;
  
  public UserChatSettings findUserChatSettings(SchoolDataIdentifier userIdentifier) {
    return userChatSettingsDAO.findByUser(userIdentifier);
  }

  public UserChatSettings createUserChatSettings(SchoolDataIdentifier userIdentifier, UserChatVisibility visibility) {
    return userChatSettingsDAO.create(userIdentifier.toId(), visibility);
  }
}
