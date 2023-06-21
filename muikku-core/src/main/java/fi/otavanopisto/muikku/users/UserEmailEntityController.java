package fi.otavanopisto.muikku.users;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.dao.users.UserEmailEntityDAO;
import fi.otavanopisto.muikku.model.users.UserEmailEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;

public class UserEmailEntityController {
  
  @Inject
  private Logger logger;

  @Inject
  private UserEmailEntityDAO userEmailEntityDAO;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  public UserEmailEntity findUserEmailEntityById(Long id) {
    return userEmailEntityDAO.findById(id);
  }
  
  public UserEmailEntity findUserEmailEntityByUserSchoolDataIdentifierAndAddress(UserSchoolDataIdentifier identifier, String address) {
    return userEmailEntityDAO.findByUserSchoolDataIdentifierAndAddress(identifier, address);
  }
  
  /**
   * Permanently removes the given user email from the database.
   * 
   * @param userEmail
   *          The user email to be removed
   */
  public void removeUserEmailEntity(UserEmailEntity userEmail) {
    userEmailEntityDAO.delete(userEmail);
  }

  public UserEmailEntity addUserEmail(UserSchoolDataIdentifier userSchoolDataIdentifier, UserEmail userEmail) {
    UserEmailEntity userEmailEntity = userEmailEntityDAO.findByUserSchoolDataIdentifierAndAddress(userSchoolDataIdentifier, userEmail.getAddress());
    return userEmailEntity != null ? userEmailEntity : userEmailEntityDAO.create(userSchoolDataIdentifier, userEmail.getAddress(), userEmail.getDefaultAddress());
  }

  public UserEmailEntity updateUserEmail(UserEmailEntity userEmailEntity, UserEmail userEmail) {
    return userEmailEntityDAO.update(userEmailEntity, userEmail.getAddress(), userEmail.getDefaultAddress());
  }

  public void removeUserEmail(UserEmailEntity userEmailEntity) {
    userEmailEntityDAO.delete(userEmailEntity);
  }
  
  public String getUserDefaultEmailAddress(UserEntity userEntity, boolean obfuscate) {
    SchoolDataIdentifier userIdentifier = userEntity.defaultSchoolDataIdentifier();
    return getUserDefaultEmailAddress(userIdentifier, obfuscate);
  }

  public String getUserDefaultEmailAddress(SchoolDataIdentifier schoolDataIdentifier, boolean obfuscate) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
    if (userSchoolDataIdentifier != null) {
      return getUserDefaultEmailAddress(userSchoolDataIdentifier, obfuscate);
    } else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for identifier %s", schoolDataIdentifier));
      return null;
    }
  }

  public String getUserDefaultEmailAddress(UserSchoolDataIdentifier userSchoolDataIdentifier, boolean obfuscate) {
    String emailAddress = null;
    List<UserEmailEntity> userEmailEntities = userEmailEntityDAO.listByUserSchoolDataIdentifier(userSchoolDataIdentifier); 
    if (userEmailEntities.size() > 0) {
      userEmailEntities.sort(Comparator.comparing(UserEmailEntity::getDefaultAddress).reversed()); // default address first
      emailAddress = userEmailEntities.get(0).getAddress();
    }
    if (obfuscate && emailAddress != null) {
      emailAddress = emailAddress.toLowerCase();
      int atIndex = emailAddress.indexOf('@');
      if (atIndex != -1) {
        String user = emailAddress.substring(0, atIndex);
        if (user.length() > 3) {
          String domain = emailAddress.substring(atIndex);
          emailAddress = user.substring(0, 2) + "..." + domain;
        }
        else {
          emailAddress = null;
        }
      }
      else {
        emailAddress = null;
      }
    }
    return emailAddress;
  }

  public List<UserEmailEntity> getUserEmailAddresses(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return userEmailEntityDAO.listByUserSchoolDataIdentifier(userSchoolDataIdentifier);
  }
  
  public List<UserEmailEntity> getUserEmailAddresses(SchoolDataIdentifier schoolDataIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
    if (userSchoolDataIdentifier != null) {
      return getUserEmailAddresses(userSchoolDataIdentifier);
    } else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for identifier %s", schoolDataIdentifier));
      return Collections.emptyList();
    }
  }

  public void setUserEmails(SchoolDataIdentifier schoolDataIdentifier, List<UserEmail> userEmails) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
    if (userSchoolDataIdentifier != null) {
      setUserEmails(userSchoolDataIdentifier, userEmails);
    } else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for identifier %s", schoolDataIdentifier));
    }
  }
  
  public void setUserEmails(UserSchoolDataIdentifier userSchoolDataIdentifier, List<UserEmail> userEmails) {
    List<UserEmailEntity> userEmailEntities = getUserEmailAddresses(userSchoolDataIdentifier);
    
    for (UserEmail userEmail : userEmails) {
      UserEmailEntity userEmailEntity = userEmailEntities.stream().filter(m -> StringUtils.equalsIgnoreCase(m.getAddress(), userEmail.getAddress())).findFirst().orElse(null);
      if (userEmailEntity == null) {
        addUserEmail(userSchoolDataIdentifier, userEmail);
      }
      else if (!userEmail.getDefaultAddress().equals(userEmailEntity.getDefaultAddress())) {
        updateUserEmail(userEmailEntity, userEmail);
      }
      if (userEmailEntity != null) {
        userEmailEntities.remove(userEmailEntity);
      }
    }
    
    for (UserEmailEntity userEmailEntity : userEmailEntities) {
      removeUserEmail(userEmailEntity);
    }
    
  }
  
}