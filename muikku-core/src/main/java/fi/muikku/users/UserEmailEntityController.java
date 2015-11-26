package fi.muikku.users;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserEmailEntityDAO;
import fi.muikku.dao.users.UserEmailSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.model.users.UserEmailSchoolDataIdentifier;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.entity.UserEmail;

public class UserEmailEntityController {
  
  @Inject
  private Logger logger;

  @Inject
  private UserEmailEntityDAO userEmailEntityDAO;
  
  @Inject
  private UserEmailSchoolDataIdentifierDAO userEmailSchoolDataIdentifierDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  public UserEmailEntity findUserEmailEntityById(Long id) {
    return userEmailEntityDAO.findById(id);
  }
  
  public UserEmailEntity findUserEmailEntityByAddress(String address) {
    return userEmailEntityDAO.findByAddress(address);
  }
  
  public UserEmailEntity findUserEmailEntityByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    UserEmailSchoolDataIdentifier schoolDataIdentifier = userEmailSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, identifier);
    if (schoolDataIdentifier != null) {
      return schoolDataIdentifier.getUserEmailEntity();
    }
    
    return null;
  }
  
  public UserEmailEntity findUserEmailEntityByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findUserEmailEntityByDataSourceAndIdentifier(schoolDataSource, identifier);
  }
  
  public UserEmailEntity findUserEmailEntityByUserEmail(UserEmail userEmail) {
    return findUserEmailEntityByDataSourceAndIdentifier(userEmail.getSchoolDataSource(), userEmail.getIdentifier());
  }
  
  /**
   * Returns a list of all email addresses belonging to the given user.
   * 
   * @param user The user whose email addresses are to be returned
   * 
   * @return A list of all email addresses belonging to the given user
   */
  public List<UserEmailEntity> listUserEmailEntitiesByUserEntity(UserEntity user) {
    return userEmailEntityDAO.listByUser(user);
  }

  public List<String> listAddressesByUserEntity(UserEntity user) {
    List<String> result = new ArrayList<>();
    
    List<UserEmailEntity> userEmailEntities = listUserEmailEntitiesByUserEntity(user);
    for (UserEmailEntity userEmailEntity : userEmailEntities) {
      result.add(userEmailEntity.getAddress());
    }
    
    return result;
  }

  /**
   * Modifies the email address of the given email address entity.
   * 
   * @param userEmail
   *          The user email entity to be modified
   * @param address
   *          The new email address for the entity
   * 
   * @return The updated user email entity
   */
  public UserEmailEntity updateUserEmailEntity(UserEmailEntity userEmail, String address) {
    // TODO is address a valid email?
    UserEmailEntity dbEmail = userEmailEntityDAO.findByAddress(address);
    if (dbEmail != null && !dbEmail.getId().equals(userEmail.getId())) {
      // TODO error handling; address is already in use
      return userEmail;
    }
    return userEmailEntityDAO.updateAddress(userEmail, address);
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

  /**
   * Adds a new email address to the given user.
   * 
   * @param user The user
   * @param address The email address
   * 
   * @return The created email address
   */
  public UserEmailEntity addUserEmail(UserEntity user, String address) {
    // TODO is address a valid email?
    UserEmailEntity userEmail = userEmailEntityDAO.findByAddress(address);
    if (userEmail != null) {
      if (userEmail.getUser().getId().equals(user.getId())) {
        return userEmail;
      }
      else {
        // TODO error handling, e.g. address is already in use
        return null;
      }
    }
    
    return userEmailEntityDAO.create(user, address);
  }

  /**
   * Removed email address from given user.
   * 
   * @param userEntity user
   * @param address The email address
   */
  public void removeUserEmail(UserEntity userEntity, String address) {
    UserEmailEntity userEmail = userEmailEntityDAO.findByAddress(address);
    if (userEmail != null) {
      if (userEmail.getUser().getId().equals(userEntity.getId())) {
        userEmailEntityDAO.delete(userEmail);
      } else {
        logger.severe(String.format("email address %s does not belong to user %d, skipping removal", address, userEntity.getId()));
      }
    }
  }

  public String getUserEmailAddress(UserEntity userEntity, boolean obfuscate) {
    String emailAddress = null;
    List<String> addressesByUserEntity = listAddressesByUserEntity(userEntity);
    if (addressesByUserEntity != null && addressesByUserEntity.size() > 0) {
      emailAddress = addressesByUserEntity.get(0);
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

  public void setUserEmails(UserEntity userEntity, List<String> emails) {
    List<String> existingEmails = listAddressesByUserEntity(userEntity);
    
    for (String email : emails) {
      if (!existingEmails.contains(email)) {
        addUserEmail(userEntity, email);
      }
      
      existingEmails.remove(email);
    }
    
    for (String email : existingEmails) {
      removeUserEmail(userEntity, email);
    }
    
  }
  
}
