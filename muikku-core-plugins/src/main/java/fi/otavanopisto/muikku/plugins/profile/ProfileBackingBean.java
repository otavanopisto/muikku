package fi.otavanopisto.muikku.plugins.profile;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.chat.ChatController;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/profile", to = "/jsf/profile/profile.jsf")
public class ProfileBackingBean {
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private ChatController chatController;

  @RequestAction
  @LoggedIn
  public String init() {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    User user = userController.findUserByDataSourceAndIdentifier(sessionController.getLoggedUserSchoolDataSource(), sessionController.getLoggedUserIdentifier());
    List<UserAddress> userAddresses = userController.listUserAddresses(user);
    List<UserPhoneNumber> userPhoneNumbers = userController.listUserPhoneNumbers(user);
    
    displayName = user.getNickName() == null ? user.getDisplayName() : String.format("%s %s (%s)", user.getNickName(), user.getLastName(), user.getStudyProgrammeName());
    
    studyStartDate = user.getStudyStartDate();
    studyTimeEnd = user.getStudyTimeEnd();
    studyTimeLeftStr = userEntityController.getStudyTimeEndAsString(studyTimeEnd);
    
    addresses = new ArrayList<>();
    for (UserAddress userAddress : userAddresses) {
      addresses.add(String.format("%s %s %s %s", userAddress.getStreet(), userAddress.getPostalCode(), userAddress.getCity(), userAddress.getCountry()));
    }
    
    phoneNumbers = new ArrayList<>();
    for (UserPhoneNumber userPhoneNumber : userPhoneNumbers) {
      phoneNumbers.add(userPhoneNumber.getNumber());
    }
    
    SchoolDataIdentifier identifier = userEntity.defaultSchoolDataIdentifier();
    emails = userEmailEntityController.getUserEmailAddresses(identifier);
    
    UserChatSettings userChatSettings = chatController.findUserChatSettings(userEntity);
    
    chatEnabled = false;
    if (userChatSettings != null) {
      UserChatVisibility visibility = userChatSettings.getVisibility();

      if (visibility == UserChatVisibility.VISIBLE_TO_ALL) {
        chatEnabled = true;
      }
    } 
    return null;
  }
  
  public String getDisplayName() {
    return displayName;
  }

  public List<String> getAddresses() {
    return addresses;
  }
  
  public List<String> getEmails() {
    return emails;
  }
  
  public List<String> getPhoneNumbers() {
    return phoneNumbers;
  }
  
  public Date getStudyStartDate() {
    return studyStartDate != null ? Date.from(studyStartDate.toInstant()) : null;
  }

  public Date getStudyTimeEnd() {
    return studyTimeEnd != null ? Date.from(studyTimeEnd.toInstant()) : null;
  }

  public String getStudyTimeLeftStr() {
    return studyTimeLeftStr;
  }
  
  public boolean isChatEnabled() {
	  return chatEnabled;
  }

  private String displayName;
  private List<String> emails;
  private List<String> addresses;
  private List<String> phoneNumbers;
  private OffsetDateTime studyStartDate;
  private OffsetDateTime studyTimeEnd;
  private String studyTimeLeftStr;
  private boolean chatEnabled;
}
