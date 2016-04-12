package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.users.UserEmailEntityDAO;
import fi.otavanopisto.muikku.model.users.UserEmailEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

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

  public UserEmailEntity addUserEmail(UserSchoolDataIdentifier userSchoolDataIdentifier, String address) {
    UserEmailEntity userEmail = userEmailEntityDAO.findByUserSchoolDataIdentifierAndAddress(userSchoolDataIdentifier, address);
    return userEmail != null ? userEmail : userEmailEntityDAO.create(userSchoolDataIdentifier, address);
  }

  public void removeUserEmail(UserSchoolDataIdentifier userSchoolDataIdentifier, String address) {
    UserEmailEntity userEmail = userEmailEntityDAO.findByUserSchoolDataIdentifierAndAddress(userSchoolDataIdentifier, address);
    if (userEmail != null) {
      userEmailEntityDAO.delete(userEmail);
    }
  }
  
  public String getUserDefaultEmailAddress(UserEntity userEntity, boolean obfuscate) {
    // TODO User default address support
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userEntity.getDefaultIdentifier(), userEntity.getDefaultSchoolDataSource().getIdentifier());
    return getUserDefaultEmailAddress(userIdentifier, obfuscate);
  }

  public String getUserDefaultEmailAddress(SchoolDataIdentifier schoolDataIdentifier, boolean obfuscate) {
    // TODO User default address support
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
    if (userSchoolDataIdentifier != null) {
      return getUserDefaultEmailAddress(userSchoolDataIdentifier, obfuscate);
    } else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for identifier %s", schoolDataIdentifier));
      return null;
    }
  }

  public String getUserDefaultEmailAddress(UserSchoolDataIdentifier userSchoolDataIdentifier, boolean obfuscate) {
    // TODO User default address support
    String emailAddress = null;
    List<UserEmailEntity> userEmailEntities = userEmailEntityDAO.listByUserSchoolDataIdentifier(userSchoolDataIdentifier); 
    if (userEmailEntities != null && userEmailEntities.size() > 0) {
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

  public List<String> getUserEmailAddresses(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    List<UserEmailEntity> userEmailEntities = userEmailEntityDAO.listByUserSchoolDataIdentifier(userSchoolDataIdentifier);
    List<String> emailAddresses = new ArrayList<>();
    for (UserEmailEntity userEmailEntity : userEmailEntities) {
      emailAddresses.add(userEmailEntity.getAddress());
    }
    return emailAddresses;
  }
  
  public List<String> getUserEmailAddresses(SchoolDataIdentifier schoolDataIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
    if (userSchoolDataIdentifier != null) {
      return getUserEmailAddresses(userSchoolDataIdentifier);
    } else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for identifier %s", schoolDataIdentifier));
      return null;
    }
  }

  public void setUserEmails(SchoolDataIdentifier schoolDataIdentifier, List<String> emails) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
    if (userSchoolDataIdentifier != null) {
      setUserEmails(userSchoolDataIdentifier, emails);
    } else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier for identifier %s", schoolDataIdentifier));
    }
  }
  
  public void setUserEmails(UserSchoolDataIdentifier userSchoolDataIdentifier, List<String> emails) {
    List<String> existingEmails = getUserEmailAddresses(userSchoolDataIdentifier);
    
    if (emails != null) {
      for (String email : emails) {
        if (!existingEmails.contains(email)) {
          logger.info(String.format("Adding email %s to identifier %s", email, userSchoolDataIdentifier.getIdentifier()));
          addUserEmail(userSchoolDataIdentifier, email);
        }
        
        existingEmails.remove(email);
      }
    } else {
      logger.severe(String.format("Passed null list to setUserEmails method for userSchoolDataIdentifier %s", userSchoolDataIdentifier.getId()));
    }
    
    for (String email : existingEmails) {
      logger.info(String.format("Removing email %s from identifier %s", email, userSchoolDataIdentifier.getIdentifier()));
      removeUserEmail(userSchoolDataIdentifier, email);
    }
    
  }
  
}